import { ref } from 'vue'

export function useProjectLoader() {
  const isLoading = ref(false)
  const error = ref(null)

  const modules = import.meta.glob('@/content/projects/*.md', { query: '?raw', import: 'default' })

  const loadProjectMarkdown = async (id, locale) => {
    isLoading.value = true
    error.value = null
    
    try {
      const path = `/src/content/projects/${id}.${locale}.md`

      const loader = modules[path]
      
      if (!loader) {
        throw new Error(`Markdown not found for: ${path}`)
      }

      const markdownContent = await loader()
      return markdownContent

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