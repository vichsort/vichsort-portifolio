import { content } from './index.ts'
import { nodeRoute } from './routes.ts'
import type { NodeType } from './types.ts'

/** Foto da galeria no formato que as telas consomem. */
export interface PhotoView {
  id: string
  title: string
  fallback: string | null
  caption: string
  location: string
  date: string
  format: string
  image: string
  /** O primeiro tópico serve de categoria (como nas pesquisas). */
  category: string
  tags: string[]
  related: { title: string; type: NodeType; to: string } | null
  html: string
}

/**
 * Foto da galeria no formato que as telas consomem, montada a partir do nó do grafo.
 */
export function photoView(id: string, lang = 'pt'): PhotoView | null {
  const node = content.node(id)
  if (!node || node.type !== 'photo') return null

  const text = content.text(id, lang)
  const topics = content.linked(id, 'topics')
  const [targetId] = content.linked(id, 'link')
  const target = content.node(targetId)
  const route = nodeRoute(target)

  return {
    id,
    title: text.title || id,
    fallback: content.fallback(id, lang),
    caption: text.caption || '',
    location: text.location || '',
    date: String(node.data.date || ''),
    format: node.data.format || 'square',
    image: content.cover(id),
    category: topics.length ? content.label(topics[0], lang) : '',
    tags: [...content.linked(id, 'techs'), ...topics].map((t) => content.label(t, lang)),
    related: target && route ? { title: content.label(target.id, lang), type: target.type, to: route } : null,
    html: content.html(id, lang)
  }
}

/** Todas as fotos, da mais recente para a mais antiga. */
export const allPhotos = (lang = 'pt'): PhotoView[] =>
  content.ofType('photo', { recent: true }).map((node) => photoView(node.id, lang)!)
