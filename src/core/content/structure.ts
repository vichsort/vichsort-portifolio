import { LINK_FIELDS } from './schema.ts'
import type { ContentNode, Edge, GraphStructure } from './types.ts'

/**
 * Remonta o grafo a partir da estrutura serializada no build (virtual:content/structure).
 * Sem parser de YAML nem de Markdown: o site recebe os dados prontos.
 */

/** Nó como sai do build: sem os textos, que vêm por idioma. */
export type SerializedNode = Omit<ContentNode, 'texts'>

/** Só os nós: as arestas saem das ligações de cada um (edgesOf), sem ir no arquivo. */
export interface SerializedGraph {
  nodes: SerializedNode[]
}

/** Marca de um arquivo do vault no conteúdo gerado: o índice na lista de URLs da estrutura. */
const ASSET_MARK = /@@asset:(\d+)@@/g

/** Troca as marcas de arquivo pela URL final (com o hash do build). */
export const resolveAssets = (text: string, urls: string[]): string => text.replace(ASSET_MARK, (_, i) => urls[Number(i)] ?? '')

/** Arestas agrupadas pelo destino. */
export function backlinksOf(edges: Edge[]): Map<string, Edge[]> {
  const backlinks = new Map<string, Edge[]>()
  for (const edge of edges) {
    let list = backlinks.get(edge.to)
    if (!list) {
      list = []
      backlinks.set(edge.to, list)
    }
    list.push(edge)
  }
  return backlinks
}

/**
 * Arestas a partir das ligações já resolvidas dos nós, na ordem em que o graph.ts as cria:
 * campos na ordem de LINK_FIELDS (numa coleção, o grupo e depois os itens de cada grupo)
 * e, por último, as citações no corpo de cada idioma.
 */
export function edgesOf(nodes: SerializedNode[]): Edge[] {
  const edges: Edge[] = []
  for (const { id: from, links, groups, bodyLinks } of nodes) {
    for (const field of LINK_FIELDS) {
      if (field === 'items' && groups) {
        for (const { group, items } of groups) {
          if (group) edges.push({ from, to: group, field: 'group', lang: null })
          for (const to of items) edges.push({ from, to, field: 'items', lang: null })
        }
        continue
      }
      for (const to of [links[field] ?? []].flat()) edges.push({ from, to, field, lang: null })
    }
    for (const [lang, ids] of Object.entries(bodyLinks)) {
      for (const to of ids) edges.push({ from, to, field: 'body', lang })
    }
  }
  return edges
}

export function hydrateGraph({ nodes }: SerializedGraph, assetUrls: string[]): GraphStructure {
  const edges = edgesOf(nodes)
  const map = new Map<string, ContentNode>(
    nodes.map((n) => [
      n.id,
      {
        ...n,
        texts: {},
        assets: Object.fromEntries(Object.entries(n.assets).map(([file, mark]) => [file, resolveAssets(mark, assetUrls)]))
      }
    ])
  )

  // Mesma regra do build (graph.ts): id ou alias, sem diferenciar maiúsculas; num conflito,
  // que a validação já aponta, fica quem chegou primeiro (os ids, depois os aliases)
  const lookup = new Map<string, string>()
  for (const n of nodes) lookup.set(n.id.toLowerCase(), n.id)
  for (const n of nodes) {
    for (const alias of n.aliases) {
      const key = alias.toLowerCase()
      if (!lookup.has(key)) lookup.set(key, n.id)
    }
  }

  return {
    nodes: map,
    edges,
    backlinks: backlinksOf(edges),
    resolve: (target) => lookup.get(String(target).toLowerCase()) || null
  }
}
