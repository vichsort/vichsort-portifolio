import { ref } from 'vue'
import { parseMarkdown } from '@/core/utils/markdown'

const projectCache = new Map()
const catalogCache = new Map()

export const formatDateRange = (dateVal) => {
  if (!dateVal) return ''
  if (Array.isArray(dateVal)) {
    const start = String(dateVal[0] || '').trim()
    const end = String(dateVal[1] || '').trim()
    if (start && end && start !== end) {
      return `${start} — ${end}`
    }
    return start || end
  }
  return String(dateVal).trim()
}

export function useProjects() {
  const isLoading = ref(false)
  const error = ref(null)

  const modules = import.meta.glob('@/modules/projects/content/*.md', { query: '?raw', import: 'default' })

  const loadProject = async (id, locale = 'pt') => {
    const cacheKey = `${id}.${locale}`
    if (projectCache.has(cacheKey)) {
      return projectCache.get(cacheKey)
    }

    isLoading.value = true
    error.value = null

    try {
      const path = `/src/modules/projects/content/${id}.${locale}.md`
      const loader = modules[path]

      if (!loader) {
        throw new Error(`Markdown not found for: ${path}`)
      }

      const rawContent = await loader()
      const parsed = parseMarkdown(rawContent)

      const project = {
        id,
        ...parsed.attributes,
        body: parsed.body,
        html: parsed.html
      }

      projectCache.set(cacheKey, project)
      return project
    } catch (e) {
      console.error(e)
      error.value = e
      return null
    } finally {
      isLoading.value = false
    }
  }

  const loadAllProjects = async (locale = 'pt') => {
    if (catalogCache.has(locale)) {
      return catalogCache.get(locale)
    }

    isLoading.value = true
    error.value = null

    try {
      const projectsList = []
      const suffix = `.${locale}.md`

      for (const [path, loader] of Object.entries(modules)) {
        if (path.endsWith(suffix)) {
          const rawContent = await loader()
          const parsed = parseMarkdown(rawContent)
          const fileName = path.split('/').pop().replace(suffix, '')
          const id = parsed.attributes.id || fileName

          projectsList.push({
            id,
            title: parsed.attributes.title || id,
            summary: parsed.attributes.summary || '',
            category: parsed.attributes.category || 'App',
            techs: Array.isArray(parsed.attributes.techs) ? parsed.attributes.techs : [],
            date: parsed.attributes.date || [],
            image: parsed.attributes.image || '',
            github: parsed.attributes.github || '',
            live: parsed.attributes.live || '',
            body: parsed.body,
            html: parsed.html
          })
        }
      }

      catalogCache.set(locale, projectsList)
      return projectsList
    } catch (e) {
      console.error(e)
      error.value = e
      return []
    } finally {
      isLoading.value = false
    }
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

