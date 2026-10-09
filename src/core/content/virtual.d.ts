// Módulos gerados pelo plugin de conteúdo (scripts/contentPlugin.mjs)

declare module 'virtual:content/structure' {
  const structure: import('@/core/content/structure.ts').SerializedGraph
  /** URL final de cada arquivo do vault; as marcas @@asset:<i>@@ apontam para esta lista. */
  export const assets: string[]
  export default structure
}

declare module 'virtual:content/loaders' {
  type NodeText = import('@/core/content/types.ts').NodeText
  type Loaders<T> = Record<string, () => Promise<{ default: T }>>
  export const texts: Loaders<{ text: Record<string, Partial<NodeText>>; used: Record<string, string> }>
  /** Id do nó → corpo. */
  export const html: Loaders<Record<string, string>>
  export const plain: Loaders<Record<string, string>>
}
