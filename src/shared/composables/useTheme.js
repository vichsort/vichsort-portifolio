import { useColorMode } from '@vueuse/core'

const mode = useColorMode({
  attribute: 'data-theme',
  modes: {
    dark: 'dark',
    light: 'light'
  },
  storageKey: 'user-theme-preference'
})

export function useTheme() {
  const toggleTheme = () => {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
  }

  const initTheme = () => {
    if (!mode.value) {
      mode.value = 'dark'
    }
  }

  const listenToSystemChanges = () => {
    // Automatically handled by VueUse useColorMode
  }

  return {
    theme: mode,
    toggleTheme,
    initTheme,
    listenToSystemChanges
  }
}
