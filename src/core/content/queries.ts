import { renderBody } from './markdown.ts'
import { fallbackChain } from '../i18n/languages.js'
import { nodeRoute } from './routes.ts'
import { buildNodeMenu } from './nodeMenu.ts'
import type { ContentGraph, ContentNode, NodeText, NodeType } from './types.ts'

const startDate = (node: ContentNode) => String([node.data.date].flat()[0] ?? '')

/** Nós agrupados pelo tipo (resultado de backlinks e outlinks). */
export type NodesByType = Partial<Record<NodeType, ContentNode[]>>

/**
 * Consultas sobre o grafo, com o idioma passado explicitamente.
 * O composable useContent envolve estas funções com o idioma ativo.
 */
export function createQueries(graph: ContentGraph) {
  const htmlCache = new Map<string, string>()

  const node = (id: string | null | undefined): ContentNode | null => (id ? graph.nodes.get(id) || null : null)

  // Os ids que vêm de ligações já resolvidas sempre existem no grafo
  const existing = (id: string): ContentNode => graph.nodes.get(id)!

  /** Idioma em que o texto do nó será mostrado: o pedido ou o primeiro da cadeia de fallback. */
  const textLang = (id: string, lang: string): string | null => {
    const texts = node(id)?.texts || {}
    return fallbackChain(lang).find((l: string) => texts[l]) || null
  }

  const text = (id: string, lang: string): Partial<NodeText> => {
    const used = textLang(id, lang)
    return (used && node(id)?.texts[used]) || {}
  }

  /** Idioma substituto quando o nó não tem texto no idioma pedido; null se não precisou. */
  const fallback = (id: string, lang: string): string | null => {
    const used = textLang(id, lang)
    return used && used !== lang ? used : null
  }

  /** Nome de exibição: nome próprio da estrutura, ou nome/título traduzido. */
  const label = (id: string, lang: string): string => {
    const n = node(id)
    if (!n) return id
    const t = text(id, lang)
    return n.data.name || t.name || t.title || id
  }

  /**
   * Nós de um tipo, em ordem de id; com { recent: true }, do mais recente
   * para o mais antigo pelo campo date (início do período), depois por id.
   */
  const ofType = (type: NodeType, { recent = false }: { recent?: boolean } = {}): ContentNode[] => {
    const list = [...graph.nodes.values()].filter((n) => n.type === type)
    list.sort((a, b) => a.id.localeCompare(b.id))
    if (recent) list.sort((a, b) => startDate(b).localeCompare(startDate(a)))
    return list
  }

  /** Ids ligados por um campo (sempre lista, mesmo para ligação única). */
  const linked = (id: string, field: string): string[] => {
    const value = node(id)?.links[field]
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  }

  /**
   * Quem aponta para o nó, agrupado por tipo.
   * Coleções ficam de fora por padrão: listar um nó num stack não é "usá-lo".
   *
   * lang: considera wikilinks do corpo só do texto que será mostrado nesse idioma
   */
  const backlinks = (id: string, { lang, includeCollections = false }: { lang?: string; includeCollections?: boolean } = {}): NodesByType => {
    const grouped: NodesByType = {}
    const seen = new Set<string>()
    for (const edge of graph.backlinks.get(id) || []) {
      if (seen.has(edge.from)) continue
      if (edge.lang && lang && edge.lang !== textLang(edge.from, lang)) continue
      const source = existing(edge.from)
      if (source.type === 'collection' && !includeCollections) continue
      seen.add(edge.from)
      ;(grouped[source.type] ||= []).push(source)
    }
    return grouped
  }

  /**
   * Para onde o nó aponta (estrutura e corpo), agrupado por tipo do destino.
   * O inverso de backlinks, com a mesma regra de idioma para o corpo.
   */
  const outlinks = (id: string, { lang }: { lang?: string } = {}): NodesByType => {
    const grouped: NodesByType = {}
    const seen = new Set<string>()
    for (const edge of graph.edges) {
      if (edge.from !== id || seen.has(edge.to)) continue
      if (edge.lang && lang && edge.lang !== textLang(id, lang)) continue
      const target = existing(edge.to)
      seen.add(edge.to)
      ;(grouped[target.type] ||= []).push(target)
    }
    return grouped
  }

  /**
   * Techs relacionadas pelo campo techs, nos dois sentidos: o Vue lista o
   * JavaScript, e o JavaScript tem o Vue como relacionada. Citações no corpo não contam.
   */
  const relatedTechs = (id: string): ContentNode[] => {
    const ids = new Set(linked(id, 'techs'))
    for (const edge of graph.backlinks.get(id) || []) {
      if (edge.field === 'techs' && existing(edge.from).type === 'tech') ids.add(edge.from)
    }
    ids.delete(id)
    return [...ids].map(existing).filter((n) => n.type === 'tech')
  }

  /** Nós que compartilham ligações de estrutura, do mais ao menos parecido. */
  const related = (id: string): Array<{ node: ContentNode; shared: number }> => {
    const own = new Set(
      Object.values(node(id)?.links || {})
        .flat()
        .filter((target): target is string => Boolean(target))
    )
    const scores = new Map<string, number>()
    for (const target of own) {
      for (const edge of graph.backlinks.get(target) || []) {
        if (edge.from === id || edge.lang || edge.field === 'items' || edge.field === 'group') continue
        scores.set(edge.from, (scores.get(edge.from) || 0) + 1)
      }
    }
    return [...scores.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([from, shared]) => ({ node: existing(from), shared }))
  }

  /** Grupos de uma coleção, com os nós já resolvidos e na ordem declarada. */
  const collection = (id: string): Array<{ group: ContentNode | null; items: ContentNode[] }> =>
    (node(id)?.groups || []).map(({ group, items }) => ({
      group: group ? existing(group) : null,
      items: items.map(existing)
    }))

  const asset = (id: string, file: string): string => node(id)?.assets[file] || ''
  const icon = (id: string): string => asset(id, 'icon.svg')
  const cover = (id: string): string => {
    const assets = node(id)?.assets || {}
    const file = Object.keys(assets).find((f) => f.startsWith('cover.'))
    return file ? assets[file] : ''
  }

  const html = (id: string, lang: string): string => {
    const key = `${id}.${lang}`
    const cached = htmlCache.get(key)
    if (cached !== undefined) return cached

    const body = text(id, lang).body || ''
    const rendered = renderBody(body, {
      assets: node(id)?.assets,
      label: (target) => {
        const resolved = graph.resolve(target)
        return resolved ? label(resolved, lang) : target
      },
      // Um link para a própria página do nó não leva a lugar nenhum: fica como texto
      href: (target) => {
        const path = nodeRoute(node(graph.resolve(target)))
        return path && path !== nodeRoute(node(id)) ? path : null
      },
      // Sem página: abre o menu do nó, se houver o que mostrar além deste próprio nó
      menu: (target) => {
        const resolved = graph.resolve(target)
        if (!resolved || resolved === id) return null
        return buildNodeMenu(queries, resolved, { lang, exclude: [id] }).length ? resolved : null
      },
      source: id
    })
    htmlCache.set(key, rendered)
    return rendered
  }

  // resolve: id de um alvo de wikilink (id ou alias, sem diferenciar maiúsculas), ou null
  const queries = {
    resolve: graph.resolve,
    node,
    text,
    textLang,
    fallback,
    label,
    ofType,
    linked,
    backlinks,
    outlinks,
    relatedTechs,
    related,
    collection,
    asset,
    icon,
    cover,
    html
  }
  return queries
}

/** As consultas sobre o grafo (o objeto `content` e o que o useContent envolve). */
export type Queries = ReturnType<typeof createQueries>
