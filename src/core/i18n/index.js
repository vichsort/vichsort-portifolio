import { createI18n } from 'vue-i18n'
import { LANGS, DEFAULT_LANG, isLang } from './languages.js'

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

// Dicionários globais e de cada módulo, mesclados por idioma (nome do arquivo: <idioma>.json)
const localeFiles = {
  ...import.meta.glob('./locales/*.json', { eager: true, import: 'default' }),
  ...import.meta.glob('@/modules/**/locales/*.json', { eager: true, import: 'default' })
}

const messages = Object.fromEntries(LANGS.map((lang) => [lang, {}]))

for (const [path, dictionary] of Object.entries(localeFiles)) {
  const lang = path.split('/').pop().replace('.json', '')
  if (isLang(lang)) deepMerge(messages[lang], dictionary)
  else if (import.meta.env?.DEV) console.warn(`[i18n] idioma desconhecido ignorado: ${path}`)
}

const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('user-lang') : null
const savedLang = isLang(stored) ? stored : DEFAULT_LANG

const i18n = createI18n({
  legacy: false,
  locale: savedLang,
  fallbackLocale: ['en', 'pt'],
  globalInjection: true,
  messages
})

export default i18n
