import { computed, ref, watch } from 'vue'
import { useLocalStorage, usePreferredReducedMotion } from '@vueuse/core'
import i18n, { loadLocale } from '@/core/i18n'
import { trackLoading } from './useLoading'
import { DEFAULT_LANG, isLang } from '@/core/i18n/languages'

const isSidebarOpen = ref(false)
const currentLang = useLocalStorage('user-lang', DEFAULT_LANG)
// writeDefaults: false /// sem isso o valor padrão é gravado na hora e o initSettings
// nunca percebe que é a primeira visita (e não aplica a preferência do sistema)
const areAnimationsEnabled = useLocalStorage('user-animations-enabled', true, { writeDefaults: false })
const systemMotion = usePreferredReducedMotion()

// O sistema só decide na primeira visita (initSettings, e o script do index.html);
// depois vale o interruptor do site, inclusive para ligar as animações (n28)
const isMotionAllowed = computed(() => areAnimationsEnabled.value)
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

  // html.motion-off: a classe que o CSS inteiro consulta (utilities.css e componentes)
  const updateAnimationClass = () => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('motion-off', !isMotionAllowed.value)
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
