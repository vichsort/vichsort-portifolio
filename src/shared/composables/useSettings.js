import { ref, watch } from 'vue'
import { useLocalStorage, usePreferredReducedMotion } from '@vueuse/core'
import i18n from '@/core/i18n'

const isSidebarOpen = ref(false)
const currentLang = useLocalStorage('user-lang', 'pt')
const areAnimationsEnabled = useLocalStorage('user-animations-enabled', true)
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

    const prefersReduced = usePreferredReducedMotion()
    if (prefersReduced.value && localStorage.getItem('user-animations-enabled') === null) {
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
    toggleAnimations,
    changeFontSize,
    fontSizeLevel,
    initSettings
  }
}
