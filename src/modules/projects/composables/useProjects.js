import { ref } from 'vue'
import { parseMarkdown } from '@/core/utils/markdown'

const projectCache = new Map()

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
      projectCache.set(cacheKey, parsed)
      return parsed
    } catch (e) {
      console.error(e)
      error.value = e
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    loadProject,
    isLoading,
    error
  }
}
