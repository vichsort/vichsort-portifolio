import { createI18n } from 'vue-i18n'

function deepMerge(target, source) {
  if (!source) return target
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {}
      }
      deepMerge(target[key], source[key])
    } else {
      target[key] = source[key]
    }
  }
  return target
}

// Automatically load core locales
const coreLocales = import.meta.glob('./locales/*.json', { eager: true, import: 'default' })

// Automatically load all domain module locales
const moduleLocales = import.meta.glob('@/modules/**/locales/*.json', { eager: true, import: 'default' })

const messages = { pt: {}, en: {} }

// Deep merge core locales
for (const path in coreLocales) {
  const lang = path.endsWith('pt.json') ? 'pt' : 'en'
  deepMerge(messages[lang], coreLocales[path])
}

// Deep merge module locales
for (const path in moduleLocales) {
  const lang = path.endsWith('pt.json') ? 'pt' : 'en'
  deepMerge(messages[lang], moduleLocales[path])
}

const savedLang = (typeof localStorage !== 'undefined' && localStorage.getItem('user-lang')) || 'pt'

const i18n = createI18n({
  legacy: false,
  locale: savedLang,
  fallbackLocale: 'en',
  globalInjection: true,
  messages
})

export default i18n
