import frontMatter from 'front-matter'
import { LANGS, TYPES, TYPE_BY_FOLDER, LINK_FIELDS } from './schema.js'
import { parseLink, parseLinkList, extractBodyLinks } from './links.js'

/**
 * Monta o grafo de conteúdo a partir dos arquivos do vault.
 *
 * Não depende do Vite: recebe os arquivos já lidos, para ser usado tanto
 * pelo site (import.meta.glob) quanto pelo script de validação (fs).
 *
 * @param {Array<{ path: string, raw: string }>} files
 *   Markdown, com caminho relativo a src/content (ex.: 'techs/python/python.md').
 * @param {Array<{ path: string, url: string }>} [assets]
 *   Demais arquivos das pastas dos nós (ícones, capas, imagens).
 */
export function buildGraph(files, assets = []) {
  const issues = []
  const report = (level, code, where, message) => issues.push({ level, code, where, message })

  const nodes = new Map()
  const folders = new Map() // 'techs/python' → { type, id, structure, texts }

  // 1. Agrupa os arquivos por pasta de nó
  for (const { path, raw } of files) {
    const parts = path.split('/')
    if (parts.length === 1) continue // index.md e outras notas na raiz do vault

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
    if (!folders.has(key)) folders.set(key, { type, id, structure: null, texts: {} })
    const entry = folders.get(key)

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
    const texts = {}
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
  const lookup = new Map()
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

  const resolve = (target) => lookup.get(String(target).toLowerCase()) || null
  const edges = []

  const link = (node, field, target, expectedType, lang = null) => {
    const id = resolve(target)
    if (!id) {
      report('error', 'broken-link', where(node, lang), `[[${target}]] (${field}) não existe`)
      return null
    }
    const targetType = nodes.get(id).type
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
  const backlinks = new Map()
  for (const edge of edges) {
    if (!backlinks.has(edge.to)) backlinks.set(edge.to, [])
    backlinks.get(edge.to).push(edge)
  }

  return { nodes, edges, backlinks, resolve, issues }
}

function parseFrontMatter(raw, path, report) {
  try {
    const { attributes, body } = frontMatter(raw || '')
    return { attributes: attributes || {}, body: body || '' }
  } catch (e) {
    report('error', 'bad-yaml', path, `frontmatter inválido: ${e.message}`)
    return null
  }
}

function parseAliases(value) {
  if (!value) return []
  return (Array.isArray(value) ? value : [value]).map((a) => String(a).trim()).filter(Boolean)
}

/**
 * Coleções aceitam uma lista de links ou uma lista de grupos
 * ({ group: "[[id]]", items: [...] }). Sempre devolve grupos;
 * uma lista simples vira um único grupo sem nó.
 */
function resolveItems(node, value, link, report) {
  const list = Array.isArray(value) ? value : []
  const isGrouped = list.some((entry) => entry && typeof entry === 'object' && !Array.isArray(entry))

  if (!isGrouped) {
    return [{ group: null, items: unique(parseLinkList(list).map((t) => link(node, 'items', t, '*'))) }]
  }

  return list.map((entry, i) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
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

function where(node, lang) {
  return lang ? `${node.path}/${node.id}.${lang}.md` : `${node.path}/${node.id}.md`
}

function unique(ids) {
  return [...new Set(ids.filter(Boolean))]
}
