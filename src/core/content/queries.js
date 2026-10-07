import { renderBody } from './markdown.js'
import { fallbackChain } from '../i18n/languages.js'

const startDate = (node) => String([node.data.date].flat()[0] ?? '')

/**
 * Consultas sobre o grafo, com o idioma passado explicitamente.
 * O composable useContent envolve estas funções com o idioma ativo.
 *
 * @param {ReturnType<import('./graph.js').buildGraph>} graph
 */
export function createQueries(graph) {
  const htmlCache = new Map()

  const node = (id) => graph.nodes.get(id) || null

  /** Idioma em que o texto do nó será mostrado: o pedido ou o primeiro da cadeia de fallback. */
  const textLang = (id, lang) => {
    const texts = node(id)?.texts || {}
    return fallbackChain(lang).find((l) => texts[l]) || null
  }

  const text = (id, lang) => node(id)?.texts[textLang(id, lang)] || {}

  /** Idioma substituto quando o nó não tem texto no idioma pedido; null se não precisou. */
  const fallback = (id, lang) => {
    const used = textLang(id, lang)
    return used && used !== lang ? used : null
  }

  /** Nome de exibição: nome próprio da estrutura, ou nome/título traduzido. */
  const label = (id, lang) => {
    const n = node(id)
    if (!n) return id
    const t = text(id, lang)
    return n.data.name || t.name || t.title || id
  }

  /**
   * Nós de um tipo, em ordem de id; com { recent: true }, do mais recente
   * para o mais antigo pelo campo date (início do período), depois por id.
   */
  const ofType = (type, { recent = false } = {}) => {
    const list = [...graph.nodes.values()].filter((n) => n.type === type)
    list.sort((a, b) => a.id.localeCompare(b.id))
    if (recent) list.sort((a, b) => startDate(b).localeCompare(startDate(a)))
    return list
  }

  /** Ids ligados por um campo (sempre lista, mesmo para ligação única). */
  const linked = (id, field) => {
    const value = node(id)?.links[field]
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  }

  /**
   * Quem aponta para o nó, agrupado por tipo.
   * Coleções ficam de fora por padrão: listar um nó num stack não é "usá-lo".
   *
   * @param {string} id
   * @param {{ lang?: string, includeCollections?: boolean }} [options]
   *   lang: considera wikilinks do corpo só do texto que será mostrado nesse idioma
   * @returns {Record<string, object[]>}
   */
  const backlinks = (id, { lang, includeCollections = false } = {}) => {
    const grouped = {}
    const seen = new Set()
    for (const edge of graph.backlinks.get(id) || []) {
      if (seen.has(edge.from)) continue
      if (edge.lang && lang && edge.lang !== textLang(edge.from, lang)) continue
      const source = node(edge.from)
      if (source.type === 'collection' && !includeCollections) continue
      seen.add(edge.from)
      ;(grouped[source.type] ||= []).push(source)
    }
    return grouped
  }

  /**
   * Para onde o nó aponta (estrutura e corpo), agrupado por tipo do destino.
   * O inverso de backlinks, com a mesma regra de idioma para o corpo.
   *
   * @param {string} id
   * @param {{ lang?: string }} [options]
   * @returns {Record<string, object[]>}
   */
  const outlinks = (id, { lang } = {}) => {
    const grouped = {}
    const seen = new Set()
    for (const edge of graph.edges) {
      if (edge.from !== id || seen.has(edge.to)) continue
      if (edge.lang && lang && edge.lang !== textLang(id, lang)) continue
      const target = node(edge.to)
      seen.add(edge.to)
      ;(grouped[target.type] ||= []).push(target)
    }
    return grouped
  }

  /** Nós que compartilham ligações de estrutura, do mais ao menos parecido. */
  const related = (id) => {
    const own = new Set(Object.values(node(id)?.links || {}).flat().filter(Boolean))
    const scores = new Map()
    for (const target of own) {
      for (const edge of graph.backlinks.get(target) || []) {
        if (edge.from === id || edge.lang || edge.field === 'items' || edge.field === 'group') continue
        scores.set(edge.from, (scores.get(edge.from) || 0) + 1)
      }
    }
    return [...scores.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([from, shared]) => ({ node: node(from), shared }))
  }

  /** Grupos de uma coleção, com os nós já resolvidos e na ordem declarada. */
  const collection = (id) =>
    (node(id)?.groups || []).map(({ group, items }) => ({
      group: group ? node(group) : null,
      items: items.map(node)
    }))

  const asset = (id, file) => node(id)?.assets[file] || ''
  const icon = (id) => asset(id, 'icon.svg')
  const cover = (id) => {
    const assets = node(id)?.assets || {}
    const file = Object.keys(assets).find((f) => f.startsWith('cover.'))
    return file ? assets[file] : ''
  }

  const html = (id, lang) => {
    const key = `${id}.${lang}`
    if (!htmlCache.has(key)) {
      const body = text(id, lang).body || ''
      htmlCache.set(key, renderBody(body, {
        assets: node(id)?.assets,
        label: (target) => {
          const resolved = graph.resolve(target)
          return resolved ? label(resolved, lang) : target
        }
      }))
    }
    return htmlCache.get(key)
  }

  // resolve: id de um alvo de wikilink (id ou alias, sem diferenciar maiúsculas), ou null
  return { resolve: graph.resolve, node, text, textLang, fallback, label, ofType, linked, backlinks, outlinks, related, collection, asset, icon, cover, html }
}
