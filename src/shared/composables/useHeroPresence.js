import { readonly, ref } from 'vue'

// Estado global: true enquanto o hero da home está atrás da navbar
const isHeroActive = ref(false)

/**
 * Compartilha entre componentes se a navbar está sobre a seção hero.
 * O hero informa (setHeroActive); a navbar reage (isHeroActive).
 */
export function useHeroPresence() {
  const setHeroActive = value => {
    isHeroActive.value = value
  }

  return {
    isHeroActive: readonly(isHeroActive),
    setHeroActive
  }
}
