/**
 * Fonte única dos dados de perfil e navegação.
 * Consumida pela navbar, pelo footer, pela página de contato e pelo terminal.
 *
 * TODO: substituir os placeholders pelos dados reais.
 */

export const EMAIL = 'vitor@example.com'

/**
 * Redes sociais. Os ícones ficam a cargo de cada componente (mapeados por `id`),
 * para este arquivo continuar sendo dado puro e importável fora do Vue.
 */
export const SOCIALS = [
  { id: 'github', label: 'GitHub', handle: 'github.com/vitor', url: 'https://github.com/vitor' },
  { id: 'linkedin', label: 'LinkedIn', handle: 'linkedin.com/in/vitor', url: 'https://linkedin.com/in/vitor' },
  { id: 'telegram', label: 'Telegram', handle: '@vitor', url: 'https://t.me/vitor' }
]

export const NAV_ITEMS = [
  { labelKey: 'nav.home', path: '/' },
  { labelKey: 'nav.about', path: '/overview' },
  { labelKey: 'nav.projects', path: '/projects' },
  { labelKey: 'nav.researches', path: '/researches' },
  { labelKey: 'nav.certifications', path: '/certifications' },
  { labelKey: 'nav.contact', path: '/contact' }
]

export const getSocial = id => SOCIALS.find(social => social.id === id)
