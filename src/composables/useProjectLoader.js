import { ref } from 'vue'
import { parseMarkdown } from '@/utils/markdown'

const projectCache = new Map()

export function useProjectLoader() {
  const isLoading = ref(false)
  const error = ref(null)

  const modules = import.meta.glob('@/content/projects/*.md', { query: '?raw', import: 'default' })

  const loadProjectMarkdown = async (id, locale = 'pt') => {
    const cacheKey = `${id}.${locale}`
    if (projectCache.has(cacheKey)) {
      return projectCache.get(cacheKey)
    }

    isLoading.value = true
    error.value = null

    try {
      const path = `/src/content/projects/${id}.${locale}.md`
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
    loadProjectMarkdown,
    isLoading,
    error
  }
}