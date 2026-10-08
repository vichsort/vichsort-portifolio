/**
 * Página do site de cada tipo de nó. Tipos sem página (techs, tópicos, cargos...)
 * ficam de fora: um wikilink para eles abre o menu de nó (ver markdown.js).
 *
 * Tipos listados numa tela só (certificações, pesquisas, timeline) levam ao card
 * pela âncora: o id do nó é o id do card na tela (ver core/router/scrollToHash.js).
 *
 * JavaScript puro, sem depender do grafo carregado: recebe o nó já resolvido.
 */
import type { NodeType } from './types.ts'

const ROUTES: Partial<Record<NodeType, (id: string) => string>> = {
  project: (id) => `/projects/${id}`,
  photo: (id) => `/gallery/${id}`,
  research: (id) => `/researches#${id}`,
  certification: (id) => `/certifications#${id}`,
  timeline: (id) => `/overview#${id}`
}

/** Listagens que aceitam o filtro ?ref=<id> (ver shared/composables/useRefFilter.js). */
const LISTINGS: Partial<Record<NodeType, string>> = {
  project: '/projects',
  research: '/researches',
  certification: '/certifications'
}

/**
 * Caminho da página do nó, ou null se o tipo não tem página.
 *
 */
export function nodeRoute(node: { id: string; type: NodeType } | null | undefined): string | null {
  const route = node ? ROUTES[node.type] : undefined
  return node && route ? route(node.id) : null
}

/**
 * Listagem de um tipo filtrada pelos nós que apontam para refId, ou null se o
 * tipo não tem listagem com esse filtro.
 *
 */
export function listingRoute(type: NodeType, refId: string): string | null {
  const path = LISTINGS[type]
  return path ? `${path}?ref=${encodeURIComponent(refId)}` : null
}
