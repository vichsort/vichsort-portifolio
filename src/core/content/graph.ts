import frontMatter from 'front-matter'
import { LANGS, TYPES, TYPE_BY_FOLDER, LINK_FIELDS } from './schema.ts'
import { parseLink, parseLinkList, extractBodyLinks } from './links.ts'
import type { CollectionGroup, ContentGraph, ContentNode, Edge, Issue, NodeText, NodeType, Report } from './types.ts'

interface ParsedFile {
  attributes: Record<string, unknown>
  body: string
}

interface FolderEntry {
  type: NodeType
  id: string
  structure: ParsedFile | null
  texts: Record<string, ParsedFile>
}

type Link = (node: ContentNode, field: string, target: string, expectedType: NodeType | '*' | undefined, lang?: string | null) => string | null

/**
 * Monta o grafo de conteúdo a partir dos arquivos do vault.
 *
 * Não depende do Vite: recebe os arquivos já lidos, para ser usado tanto
 * pelo site (import.meta.glob) quanto pelo script de validação (fs).
 *
 * @param files Markdown, com caminho relativo a src/content (ex.: 'techs/python/python.md').
 * @param assets Demais arquivos das pastas dos nós (ícones, capas, imagens).
 */
export function buildGraph(files: Array<{ path: string; raw: string }>, assets: Array<{ path: string; url: string }> = []): ContentGraph {
  const issues: Issue[] = []
  const report: Report = (level, code, where, message) => issues.push({ level, code, where, message })

  const nodes = new Map<string, ContentNode>()
  const folders = new Map<string, FolderEntry>() // 'techs/python' → { type, id, structure, texts }

  // 1. Agrupa os arquivos por pasta de nó
  for (const { path, raw } of files) {
    const parts = path.split('/')
    if (parts.length === 1) continue // index.md e outras notas na raiz do vault
    if (parts[0].startsWith('_')) continue // pastas de apoio, como _templates

    if (parts.length !== 3) {
      report('error', 'bad-path', path, 'arquivos devem ficar em <tipo>/<id>/<arquivo>.md')
      continue
    }

    const [folder, id, file] = parts
    const type = TYPE_BY_FOLDER[folder]
    if (!type) {
      report('error', 'unknown-type', path, `pasta de tipo desconhecida: ${folder}/`)
      continue
    }

    const key = `${folder}/${id}`
    let entry = folders.get(key)
    if (!entry) {
      entry = { type, id, structure: null, texts: {} }
      folders.set(key, entry)
    }

    const parsed = parseFrontMatter(raw, path, report)
    if (!parsed) continue

    if (file === `${id}.md`) {
      entry.structure = parsed
      continue
    }

    const lang = LANGS.find((l) => file === `${id}.${l}.md`)
    if (lang) {
      entry.texts[lang] = parsed
    } else {
      report('warning', 'stray-file', path, `arquivo ignorado: esperado ${id}.md ou ${id}.<idioma>.md`)
    }
  }

  // 2. Cria os nós
  for (const [key, entry] of folders) {
    if (!entry.structure) {
      report('error', 'missing-structure', key, `falta o arquivo principal ${key}/${entry.id}.md`)
      continue
    }

    const existing = nodes.get(entry.id)
    if (existing) {
      report('error', 'duplicate-id', key, `id "${entry.id}" já usado em ${existing.path}`)
      continue
    }

    const { aliases, ...data } = entry.structure.attributes
    const texts: Record<string, NodeText> = {}
    for (const [lang, { attributes, body }] of Object.entries(entry.texts)) {
      texts[lang] = { ...attributes, body }
    }

    nodes.set(entry.id, {
      id: entry.id,
      type: entry.type,
      path: key,
      data,
      aliases: parseAliases(aliases),
      texts,
      assets: {},
      links: {}, // campo → [ids resolvidos]
      bodyLinks: {}, // idioma → [ids resolvidos]
      groups: null // só em coleções
    })
  }

  // 3. Liga os arquivos extras aos nós
  for (const { path, url } of assets) {
    const parts = path.split('/')
    if (parts.length !== 3) continue
    const node = nodes.get(parts[1])
    if (node && node.path === `${parts[0]}/${parts[1]}`) node.assets[parts[2]] = url
  }

  // 4. Resolve as ligações
  const lookup = new Map<string, string>()
  for (const node of nodes.values()) {
    lookup.set(node.id.toLowerCase(), node.id)
  }
  for (const node of nodes.values()) {
    for (const alias of node.aliases) {
      const k = alias.toLowerCase()
      const taken = lookup.get(k)
      if (taken && taken !== node.id) {
        report('error', 'duplicate-alias', node.path, `alias "${alias}" já resolve para "${taken}"`)
        continue
      }
      lookup.set(k, node.id)
    }
  }

  const resolve = (target: unknown): string | null => lookup.get(String(target).toLowerCase()) || null
  const edges: Edge[] = []

  const link: Link = (node, field, target, expectedType, lang = null) => {
    const id = resolve(target)
    if (!id) {
      report('error', 'broken-link', where(node, lang), `[[${target}]] (${field}) não existe`)
      return null
    }
    const targetType = nodes.get(id)!.type
    if (expectedType && expectedType !== '*' && targetType !== expectedType) {
      report('error', 'wrong-link-type', where(node, lang), `[[${target}]] em "${field}" é ${targetType}, esperado ${expectedType}`)
      return null
    }
    edges.push({ from: node.id, to: id, field, lang })
    return id
  }

  for (const node of nodes.values()) {
    const def = TYPES[node.type]
    const multi = def.links || {}
    const single = def.single || {}

    for (const field of LINK_FIELDS) {
      if (!(field in node.data)) continue
      const value = node.data[field]
      delete node.data[field]

      if (field in multi) {
        node.links[field] = unique(parseLinkList(value).map((t) => link(node, field, t, multi[field])))
      } else if (field in single) {
        const target = parseLink(value)
        node.links[field] = target ? link(node, field, target, single[field]) : null
      } else if (field === 'items' && node.type === 'collection') {
        node.groups = resolveItems(node, value, link, report)
      } else {
        report('error', 'field-not-allowed', node.path, `o tipo ${node.type} não aceita o campo de ligação "${field}"`)
      }
    }

    for (const [lang, text] of Object.entries(node.texts)) {
      node.bodyLinks[lang] = unique(extractBodyLinks(text.body).map((t) => link(node, 'body', t, '*', lang)))
    }
  }

  // 5. Backlinks
  const backlinks = new Map<string, Edge[]>()
  for (const edge of edges) {
    let list = backlinks.get(edge.to)
    if (!list) {
      list = []
      backlinks.set(edge.to, list)
    }
    list.push(edge)
  }

  return { nodes, edges, backlinks, resolve, issues }
}

function parseFrontMatter(raw: string, path: string, report: Report): ParsedFile | null {
  try {
    const { attributes, body } = frontMatter<Record<string, unknown>>(raw || '')
    return { attributes: attributes || {}, body: body || '' }
  } catch (e) {
    report('error', 'bad-yaml', path, `frontmatter inválido: ${e instanceof Error ? e.message : String(e)}`)
    return null
  }
}

function parseAliases(value: unknown): string[] {
  if (!value) return []
  return (Array.isArray(value) ? value : [value]).map((a) => String(a).trim()).filter(Boolean)
}

const isGroupEntry = (entry: unknown): entry is { group?: unknown; items?: unknown } =>
  Boolean(entry) && typeof entry === 'object' && !Array.isArray(entry)

/**
 * Coleções aceitam uma lista de links ou uma lista de grupos
 * ({ group: "[[id]]", items: [...] }). Sempre devolve grupos;
 * uma lista simples vira um único grupo sem nó.
 */
function resolveItems(node: ContentNode, value: unknown, link: Link, report: Report): CollectionGroup[] {
  const list: unknown[] = Array.isArray(value) ? value : []
  const isGrouped = list.some(isGroupEntry)

  if (!isGrouped) {
    return [{ group: null, items: unique(parseLinkList(list).map((t) => link(node, 'items', t, '*'))) }]
  }

  return list.map((entry, i) => {
    if (!isGroupEntry(entry)) {
      report('error', 'bad-collection', node.path, `item ${i + 1}: misture de grupos e links soltos`)
      return { group: null, items: [] }
    }
    const groupTarget = parseLink(entry.group)
    return {
      group: groupTarget ? link(node, 'group', groupTarget, 'group') : null,
      items: unique(parseLinkList(entry.items).map((t) => link(node, 'items', t, '*')))
    }
  })
}

function where(node: ContentNode, lang: string | null | undefined): string {
  return lang ? `${node.path}/${node.id}.${lang}.md` : `${node.path}/${node.id}.md`
}

function unique(ids: Array<string | null>): string[] {
  return [...new Set(ids.filter((id): id is string => Boolean(id)))]
}
