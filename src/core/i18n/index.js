import { createI18n } from 'vue-i18n'
import { LANGS, DEFAULT_LANG, isLang } from './languages.js'
import { loadLanguage } from '../content/index.ts'

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

// Dicionários globais e de cada módulo (nome do arquivo: <idioma>.json), baixados por idioma:
// o build junta os de um idioma num arquivo só (manualChunks no vite.config.js)
const localeFiles = {
  ...import.meta.glob('./locales/*.json', { import: 'default' }),
  ...import.meta.glob('@/modules/**/locales/*.json', { import: 'default' })
}

const loadersByLang = Object.fromEntries(LANGS.map((lang) => [lang, []]))

for (const [path, loader] of Object.entries(localeFiles)) {
  const lang = path.split('/').pop().replace('.json', '')
  if (isLang(lang)) loadersByLang[lang].push(loader)
  else if (import.meta.env?.DEV) console.warn(`[i18n] idioma desconhecido ignorado: ${path}`)
}

const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('user-lang') : null
const savedLang = isLang(stored) ? stored : DEFAULT_LANG

const i18n = createI18n({
  legacy: false,
  locale: savedLang,
  fallbackLocale: ['en', 'pt'],
  globalInjection: true,
  messages: {}
})

const loadedMessages = new Map()

function loadMessages(lang) {
  if (!loadedMessages.has(lang)) {
    const promise = Promise.all(loadersByLang[lang].map((load) => load())).then((dictionaries) => {
      const merged = {}
      for (const dictionary of dictionaries) deepMerge(merged, dictionary)
      i18n.global.setLocaleMessage(lang, merged)
    })
    promise.catch(() => loadedMessages.delete(lang))
    loadedMessages.set(lang, promise)
  }
  return loadedMessages.get(lang)
}

/**
 * Baixa o que um idioma precisa para ser mostrado: o dicionário da interface e os
 * textos do conteúdo. Os dicionários estão completos nos quatro idiomas, então o
 * fallbackLocale fica só como rede de segurança e o inglês não é baixado junto.
 */
export function loadLocale(lang) {
  return Promise.all([loadMessages(lang), loadLanguage(lang)])
}

export default i18n
