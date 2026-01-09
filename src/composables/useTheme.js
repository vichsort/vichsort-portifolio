import { ref } from 'vue'

const theme = ref('dark')

export function useTheme() {

  const STORAGE_KEY = 'user-theme-preference'

  const applyTheme = (newTheme) => {
    theme.value = newTheme
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem(STORAGE_KEY, newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme.value === 'dark' ? 'light' : 'dark'
    applyTheme(newTheme)
  }

  const initTheme = () => {
    const savedTheme = localStorage.getItem(STORAGE_KEY)
    
    if (savedTheme) {
      applyTheme(savedTheme)
      return
    }

    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme(systemPrefersDark ? 'dark' : 'light')
  }

  const listenToSystemChanges = () => {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light')
      }
    })
  }

  return {
    theme,
    toggleTheme,
    initTheme,
    listenToSystemChanges
  }
}