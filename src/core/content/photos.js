import { content } from './index.js'
import { nodeRoute } from './routes.js'

/**
 * Foto da galeria no formato que as telas consomem, montada a partir do nó do grafo.
 *
 * @param {string} id
 * @param {string} [lang='pt']
 * @returns {Object|null}
 */
export function photoView(id, lang = 'pt') {
  const node = content.node(id)
  if (!node || node.type !== 'photo') return null

  const text = content.text(id, lang)
  const topics = content.linked(id, 'topics')
  const target = node.links.link ? content.node(node.links.link) : null
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
    // O primeiro tópico serve de categoria (como nas pesquisas)
    category: topics.length ? content.label(topics[0], lang) : '',
    tags: [...content.linked(id, 'techs'), ...topics].map((t) => content.label(t, lang)),
    related: route ? { title: content.label(target.id, lang), type: target.type, to: route } : null,
    html: content.html(id, lang)
  }
}

/** Todas as fotos, da mais recente para a mais antiga. */
export const allPhotos = (lang = 'pt') =>
  content.ofType('photo', { recent: true }).map((node) => photoView(node.id, lang))
