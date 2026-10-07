import { ref } from 'vue'
import { content } from '@/core/content'

// 'AAAA-MM' → 'MM/AAAA'; 'AAAA' fica como está
const formatDate = (value) => {
  const text = String(value || '').trim()
  const match = text.match(/^(\d{4})-(\d{2})$/)
  return match ? `${match[2]}/${match[1]}` : text
}

export const formatDateRange = (dateVal) => {
  if (!dateVal) return ''
  if (Array.isArray(dateVal)) {
    const start = formatDate(dateVal[0])
    const end = formatDate(dateVal[1])
    if (start && end && start !== end) {
      return `${start} — ${end}`
    }
    return start || end
  }
  return formatDate(dateVal)
}

/**
 * Projeto no formato que as views consomem, montado a partir do nó do grafo.
 * Techs e categoria vêm como nomes de exibição; os ids ficam em techIds/categoryId.
 */
export function toProject(id, locale = 'pt') {
  const node = content.node(id)
  if (!node || node.type !== 'project') return null

  const text = content.text(id, locale)
  const techIds = content.linked(id, 'techs')
  const categoryId = node.links.category || ''

  return {
    id,
    title: text.title || id,
    fallback: content.fallback(id, locale),
    summary: text.summary || '',
    category: categoryId ? content.label(categoryId, locale) : '',
    categoryId,
    techs: techIds.map((t) => content.label(t, locale)),
    techIds,
    date: node.data.date || [],
    image: content.cover(id),
    github: node.data.github || '',
    live: node.data.live || '',
    body: text.body || '',
    html: content.html(id, locale)
  }
}

export function useProjects() {
  const isLoading = ref(false)
  const error = ref(null)

  // A API continua assíncrona para as views não dependerem de como o conteúdo é carregado
  const loadProject = async (id, locale = 'pt') => {
    const project = toProject(id, locale)
    error.value = project ? null : new Error(`Project not found: ${id}`)
    return project
  }

  const loadAllProjects = async (locale = 'pt') => {
    return content.ofType('project').map((node) => toProject(node.id, locale))
  }

  const getAdjacentProjects = async (currentId, locale = 'pt') => {
    const all = await loadAllProjects(locale)
    if (!all || all.length === 0) return { prev: null, next: null }

    const currentIndex = all.findIndex((p) => p.id === currentId)
    if (currentIndex === -1) return { prev: null, next: null }

    const prevIdx = (currentIndex - 1 + all.length) % all.length
    const nextIdx = (currentIndex + 1) % all.length

    return {
      prev: all[prevIdx],
      next: all[nextIdx]
    }
  }

  return {
    loadProject,
    loadAllProjects,
    getAdjacentProjects,
    formatDateRange,
    isLoading,
    error
  }
}
