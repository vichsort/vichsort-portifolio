/**
 * Página do site de cada tipo de nó. Tipos sem página (techs, tópicos, cargos...)
 * ficam de fora: um wikilink para eles vira texto.
 *
 * Tipos listados numa tela só (certificações, pesquisas, timeline) levam ao card
 * pela âncora: o id do nó é o id do card na tela (ver core/router/scrollToHash.js).
 *
 * JavaScript puro, sem depender do grafo carregado: recebe o nó já resolvido.
 */
const ROUTES = {
  project: (id) => `/projects/${id}`,
  photo: (id) => `/gallery/${id}`,
  research: (id) => `/researches#${id}`,
  certification: (id) => `/certifications#${id}`,
  timeline: (id) => `/overview#${id}`
}

/** Listagens que aceitam o filtro ?ref=<id> (ver shared/composables/useRefFilter.js). */
const LISTINGS = {
  project: '/projects',
  research: '/researches',
  certification: '/certifications'
}

/**
 * Caminho da página do nó, ou null se o tipo não tem página.
 *
 * @param {{ id: string, type: string }|null} node
 * @returns {string|null}
 */
export function nodeRoute(node) {
  const route = node && ROUTES[node.type]
  return route ? route(node.id) : null
}

/**
 * Listagem de um tipo filtrada pelos nós que apontam para refId, ou null se o
 * tipo não tem listagem com esse filtro.
 *
 * @param {string} type
 * @param {string} refId
 * @returns {string|null}
 */
export function listingRoute(type, refId) {
  const path = LISTINGS[type]
  return path ? `${path}?ref=${encodeURIComponent(refId)}` : null
}
