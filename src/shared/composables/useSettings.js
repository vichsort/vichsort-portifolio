import { computed, ref, watch } from 'vue'
import { useLocalStorage, usePreferredReducedMotion } from '@vueuse/core'
import i18n, { loadLocale } from '@/core/i18n'
import { trackLoading } from './useLoading'
import { DEFAULT_LANG, isLang } from '@/core/i18n/languages'

const isSidebarOpen = ref(false)
const currentLang = useLocalStorage('user-lang', DEFAULT_LANG)
// writeDefaults: false — sem isso o valor padrão é gravado na hora e o initSettings
// nunca percebe que é a primeira visita (e não aplica a preferência do sistema)
const areAnimationsEnabled = useLocalStorage('user-animations-enabled', true, { writeDefaults: false })
const systemMotion = usePreferredReducedMotion()

// Mesma regra do CSS (utilities.css): sem movimento se o usuário desligou as
// animações no site ou se o sistema operacional pede movimento reduzido
const isMotionAllowed = computed(() => areAnimationsEnabled.value && systemMotion.value !== 'reduce')
const fontSizeLevel = useLocalStorage('user-font-size-level', 0)
// Trocas seguidas de idioma: vale a última, mesmo que a anterior termine de baixar depois
let languageRequest = 0

export function useSettings() {
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  const closeSidebar = () => {
    isSidebarOpen.value = false
  }

  // O idioma só muda quando o dicionário e os textos dele chegaram (a13)
  const setLanguage = async (value) => {
    const lang = isLang(value) ? value : DEFAULT_LANG
    const request = ++languageRequest
    currentLang.value = lang
    await trackLoading(loadLocale(lang))
    if (request !== languageRequest) return
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

  const changeFontSize = (direction) => {
    if (direction === 'up' && fontSizeLevel.value < 3) fontSizeLevel.value++
    if (direction === 'down' && fontSizeLevel.value > -1) fontSizeLevel.value--
    applyFontSize()
  }

  const applyFontSize = () => {
    if (typeof document !== 'undefined') {
      // Em % do tamanho do navegador, não em px: quem já usa fonte maior no sistema
      // continua com ela, e cada nível soma 12,5% (2px sobre a base de 16px)
      document.documentElement.style.fontSize = `${100 + fontSizeLevel.value * 12.5}%`
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
