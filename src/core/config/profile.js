/**
 * Fonte única dos dados de perfil.
 * Consumida pela navbar, pelo footer, pela página de contato e pelo terminal.
 * As páginas e os itens de navegação ficam em core/router/pages.js.
 *
 * TODO: substituir os placeholders pelos dados reais.
 */

export const EMAIL = 'vitor@example.com'

/**
 * Endereço público do site, sem barra no fim (ex.: https://vitor.dev).
 * As prévias de link (scripts/meta.mjs) precisam dele para a URL absoluta da
 * imagem; no build, a variável de ambiente SITE_URL tem precedência.
 */
export const SITE_URL = 'https://vichsort.com'

/** Hero do site (1200×630): capa de projeto sem cover.jpg e imagem padrão das prévias de link. */
export const DEFAULT_COVER = '/images/og-default.jpg'

/**
 * Redes sociais. Os ícones ficam a cargo de cada componente (mapeados por `id`),
 * para este arquivo continuar sendo dado puro e importável fora do Vue.
 */
export const SOCIALS = [
  { id: 'github', label: 'GitHub', handle: 'github.com/vitor', url: 'https://github.com/vitor' },
  { id: 'linkedin', label: 'LinkedIn', handle: 'linkedin.com/in/vitor', url: 'https://linkedin.com/in/vitor' },
  { id: 'telegram', label: 'Telegram', handle: '@vitor', url: 'https://t.me/vitor' }
]

export const getSocial = id => SOCIALS.find(social => social.id === id)
