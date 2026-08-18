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
    // VueUse's useColorMode handles system media query listeners automatically
  }

  return {
    theme: mode,
    toggleTheme,
    initTheme,
    listenToSystemChanges
  }
}