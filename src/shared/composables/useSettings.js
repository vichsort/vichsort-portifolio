import { computed, ref, watch } from 'vue'
import { useLocalStorage, usePreferredReducedMotion } from '@vueuse/core'
import i18n from '@/core/i18n'

const isSidebarOpen = ref(false)
const currentLang = useLocalStorage('user-lang', 'pt')
// writeDefaults: false — sem isso o valor padrão é gravado na hora e o initSettings
// nunca percebe que é a primeira visita (e não aplica a preferência do sistema)
const areAnimationsEnabled = useLocalStorage('user-animations-enabled', true, { writeDefaults: false })
const systemMotion = usePreferredReducedMotion()

// Mesma regra do CSS (utilities.css): sem movimento se o usuário desligou as
// animações no site ou se o sistema operacional pede movimento reduzido
const isMotionAllowed = computed(() => areAnimationsEnabled.value && systemMotion.value !== 'reduce')
const fontSizeLevel = useLocalStorage('user-font-size-level', 0)

export function useSettings() {
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  const closeSidebar = () => {
    isSidebarOpen.value = false
  }

  const setLanguage = (lang) => {
    currentLang.value = lang
    i18n.global.locale.value = lang

    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', lang)
    }
  }

  const toggleAnimations = () => {
    areAnimationsEnabled.value = !areAnimationsEnabled.value
    updateAnimationClass()
  }

  const updateAnimationClass = () => {
    if (typeof document !== 'undefined') {
      if (!areAnimationsEnabled.value) {
        document.body.classList.add('reduce-motion')
      } else {
        document.body.classList.remove('reduce-motion')
      }
    }
  }

  const BASE_FONT_SIZE = 16

  const changeFontSize = (direction) => {
    if (direction === 'up' && fontSizeLevel.value < 3) fontSizeLevel.value++
    if (direction === 'down' && fontSizeLevel.value > -1) fontSizeLevel.value--
    applyFontSize()
  }

  const applyFontSize = () => {
    if (typeof document !== 'undefined') {
      const newSize = BASE_FONT_SIZE + (fontSizeLevel.value * 2)
      document.documentElement.style.fontSize = `${newSize}px`
    }
  }

  const initSettings = () => {
    setLanguage(currentLang.value)

    if (systemMotion.value === 'reduce' && localStorage.getItem('user-animations-enabled') === null) {
      areAnimationsEnabled.value = false
    }

    updateAnimationClass()
    applyFontSize()
  }

  watch(areAnimationsEnabled, () => {
    updateAnimationClass()
  })

  return {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    currentLang,
    setLanguage,
    areAnimationsEnabled,
    isMotionAllowed,
    toggleAnimations,
    changeFontSize,
    fontSizeLevel,
    initSettings
  }
}
