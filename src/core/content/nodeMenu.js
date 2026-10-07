import { nodeRoute, listingRoute } from './routes.js'

/** Ordem padrão dos grupos do menu de nó. */
export const NODE_MENU_TYPES = ['project', 'research', 'certification', 'timeline', 'photo', 'tech']

const startDate = (node) => String([node.data.date].flat()[0] ?? '')

const byRecent = (a, b) => startDate(b).localeCompare(startDate(a)) || a.id.localeCompare(b.id)

/**
 * Grupos do menu de um nó (n4/n5): quem aponta para ele, por tipo.
 * Só o modelo: os títulos dos grupos e o visual ficam com quem desenha o menu.
 *
 * Cada grupo traz no máximo `limit` itens, do mais recente para o mais antigo.
 * Se passar disso e o tipo tiver listagem com filtro, `more` leva a ela;
 * sem listagem, o grupo mostra todos os itens.
 * Techs entram só pela relação do campo techs (relatedTechs) e não têm destino.
 *
 * Recebe as consultas do grafo em vez de importá-las: assim o próprio queries.js
 * usa esta regra para saber se um wikilink do corpo abre menu (sem import circular).
 *
 * @param {ReturnType<import('./queries.js').createQueries>} queries
 * @param {string} id
 * @param {{ lang?: string, types?: string[], limit?: number, exclude?: string[] }} [options]
 *   exclude: nós que não entram (ex.: o nó em cujo texto o wikilink está)
 * @returns {Array<{
 *   type: string,
 *   count: number,
 *   items: Array<{ id: string, label: string, meta: string, to: string|null }>,
 *   more: string|null
 * }>}
 */
export function buildNodeMenu(queries, id, { lang = 'pt', types = NODE_MENU_TYPES, limit = 6, exclude = [] } = {}) {
  if (!queries.node(id)) return []

  const backlinks = queries.backlinks(id, { lang })

  return types
    .map((type) => {
      const nodes = (type === 'tech' ? queries.relatedTechs(id) : backlinks[type] || [])
        .filter((node) => !exclude.includes(node.id))
        .sort(byRecent)
      const more = nodes.length > limit ? listingRoute(type, id) : null
      const shown = more ? nodes.slice(0, limit) : nodes

      return {
        type,
        count: nodes.length,
        items: shown.map((node) => ({
          id: node.id,
          label: queries.label(node.id, lang),
          meta: startDate(node).slice(0, 4),
          to: nodeRoute(node)
        })),
        more
      }
    })
    .filter((group) => group.count > 0)
}
