/**
 * Página do site de cada tipo de nó. Tipos sem página (techs, tópicos, cargos...)
 * ficam de fora: um link para eles vira texto até existir o painel de nó (n4/n5).
 *
 * JavaScript puro, sem depender do grafo carregado: recebe o nó já resolvido.
 */
const ROUTES = {
  project: (id) => `/projects/${id}`,
  photo: (id) => `/gallery/${id}`,
  research: () => '/researches',
  certification: () => '/certifications',
  timeline: () => '/overview'
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
