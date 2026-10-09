/**
 * Idiomas do site. Fonte única para o i18n da interface, o grafo de conteúdo
 * e o script do vault (por isso é JavaScript puro, sem Vite nem Vue).
 */

export const LANGUAGES = [
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' }
]

export const LANGS = LANGUAGES.map((l) => l.code)

export const DEFAULT_LANG = 'pt'

// Todo conteúdo precisa existir nestes; os demais idiomas são opcionais
export const REQUIRED_LANGS = ['pt', 'en']

export const isLang = (value) => LANGS.includes(value)

/** Idioma com conteúdo opcional (es, it): parte do site aparece em inglês (aviso no App.vue). */
export const isPartialLang = (value) => isLang(value) && !REQUIRED_LANGS.includes(value)

/** Ordem de busca de um texto: o idioma pedido, depois inglês, depois português. */
export const fallbackChain = (lang) => [...new Set([lang, 'en', 'pt'])]
