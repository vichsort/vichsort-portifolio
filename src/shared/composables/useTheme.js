import { computed } from 'vue'
import { useColorMode } from '@vueuse/core'

const mode = useColorMode({
  attribute: 'data-theme',
  modes: {
    dark: 'dark',
    light: 'light'
  },
  storageKey: 'user-theme-preference'
})

const isDark = computed(() => mode.value === 'dark')

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
    // Nada a fazer: o useColorMode do VueUse já acompanha o tema do sistema
  }

  return {
    theme: mode,
    isDark,
    toggleTheme,
    initTheme,
    listenToSystemChanges
  }
}
