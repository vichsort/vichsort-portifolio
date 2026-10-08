import { content } from './index.js'

/**
 * Projeto no formato que as telas e o terminal consomem, montado a partir do nó do grafo.
 * Techs e categoria vêm como nomes de exibição; os ids ficam em techIds/categoryId.
 *
 * @param {string} id
 * @param {string} [lang='pt']
 * @returns {Object|null}
 */
export function projectView(id, lang = 'pt') {
  const node = content.node(id)
  if (!node || node.type !== 'project') return null

  const text = content.text(id, lang)
  const techIds = content.linked(id, 'techs')
  const categoryId = node.links.category || ''

  return {
    id,
    title: text.title || id,
    fallback: content.fallback(id, lang),
    summary: text.summary || '',
    category: categoryId ? content.label(categoryId, lang) : '',
    categoryId,
    techs: techIds.map((t) => content.label(t, lang)),
    techIds,
    date: node.data.date || [],
    image: content.cover(id),
    github: node.data.github || '',
    live: node.data.live || '',
    featured: node.data.featured === true,
    body: text.body || '',
    html: content.html(id, lang)
  }
}

/** Todos os projetos, em ordem de id. */
export const allProjects = (lang = 'pt') =>
  content.ofType('project').map((node) => projectView(node.id, lang))

/** Projetos em destaque (featured: true), do mais recente para o mais antigo. */
export const featuredProjects = (lang = 'pt') =>
  content
    .ofType('project', { recent: true })
    .filter((node) => node.data.featured === true)
    .map((node) => projectView(node.id, lang))
