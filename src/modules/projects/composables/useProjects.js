import { ref } from 'vue'
import { projectView, allProjects, featuredProjects } from '@/core/content/projects'

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
      return `${start} /// ${end}`
    }
    return start || end
  }
  return formatDate(dateVal)
}

export function useProjects() {
  const isLoading = ref(false)
  const error = ref(null)

  // A API continua assíncrona para as views não dependerem de como o conteúdo é carregado
  const loadProject = async (id, locale = 'pt') => {
    const project = projectView(id, locale)
    error.value = project ? null : new Error(`Project not found: ${id}`)
    return project
  }

  const loadAllProjects = async (locale = 'pt') => {
    return allProjects(locale)
  }

  // Destaques da home; sem nenhum marcado, mostra todos
  const loadFeaturedProjects = async (locale = 'pt') => {
    const featured = featuredProjects(locale)
    return featured.length ? featured : allProjects(locale)
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
    loadFeaturedProjects,
    getAdjacentProjects,
    formatDateRange,
    isLoading,
    error
  }
}
