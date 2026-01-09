import { ref } from 'vue'
import i18n from '@/i18n'

const isSidebarOpen = ref(false)
const currentLang = ref('pt')
const areAnimationsEnabled = ref(true)
const fontSizeLevel = ref(0)

export function useSettings() {
    // -------------------------------------------------------
    // --- CONTROLES DE CONFIGURAÇÕES GLOBAIS DA APLICAÇÃO ---
    // -------------------------------------------------------

    // Sidebar
    const toggleSidebar = () => isSidebarOpen.value = !isSidebarOpen.value
    const closeSidebar = () => isSidebarOpen.value = false

    // Idioma
    const setLanguage = (lang) => {
        currentLang.value = lang
        i18n.global.locale.value = lang

        localStorage.setItem('user-lang', lang)
        document.querySelector('html').setAttribute('lang', lang)
    }

    // Animações
    const toggleAnimations = () => {
        areAnimationsEnabled.value = !areAnimationsEnabled.value
        updateAnimationClass()
    }

    const updateAnimationClass = () => {
        if (!areAnimationsEnabled.value) {
            document.body.classList.add('reduce-motion')
        } else {
            document.body.classList.remove('reduce-motion')
        }
    }

    // Fonte
    const BASE_FONT_SIZE = 24

    const changeFontSize = (direction) => {
        if (direction === 'up' && fontSizeLevel.value < 3) fontSizeLevel.value++
        if (direction === 'down' && fontSizeLevel.value > -1) fontSizeLevel.value--

        applyFontSize()
    }

    const applyFontSize = () => {
        const newSize = BASE_FONT_SIZE + (fontSizeLevel.value * 2)
        document.documentElement.style.fontSize = `${newSize}px`
    }

    const initSettings = () => {
        const savedLang = localStorage.getItem('user-lang')
        if (savedLang) currentLang.value = savedLang

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReduced) {
            areAnimationsEnabled.value = false
            updateAnimationClass()
        }
    }

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