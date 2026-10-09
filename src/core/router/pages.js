/**
 * Fonte única das páginas do site (a14). JavaScript puro, sem Vite nem Vue:
 * o router, a navbar, o footer e o scripts/meta.mjs (no Node) leem daqui.
 *
 * - name / path: a rota; o componente fica no router (core/router/index.js), por nome
 * - titleKey: título da aba e da prévia de link
 * - descriptionKey: descrição da prévia de link (sem ela, a descrição do site)
 * - preview: o meta.mjs grava um index.html com prévia própria para a página
 *   (as de detalhe saem do grafo, uma por nó)
 * - nav: 'main' (pílula da navbar e footer) ou 'more' (segunda página da pílula,
 *   atrás da seta, e fim do menu mobile); navKey é o rótulo no menu
 * - bare: só o conteúdo da página, sem navbar nem footer
 * - bodies: a página mostra o texto completo dos nós, em 'html' (detalhe) ou 'plain'
 *   (terminal); o router espera esses corpos chegarem antes de abri-la (core/content/index.ts)
 * - props: os parâmetros da rota viram props do componente
 */

/** Título do site: aba do navegador e prévias de link. */
export const SITE_TITLE = 'Vitor /// Software Engineering'

export const PAGES = [
  { name: 'home', path: '/', titleKey: 'nav.home', preview: true, nav: 'main', navKey: 'nav.home' },
  { name: 'overview', path: '/overview', titleKey: 'nav.about', descriptionKey: 'about_page.subtitle', preview: true, nav: 'main', navKey: 'nav.about' },
  { name: 'projects', path: '/projects', titleKey: 'nav.projects', descriptionKey: 'projects_page.subtitle', preview: true, nav: 'main', navKey: 'nav.projects' },
  { name: 'project-detail', path: '/projects/:slug', titleKey: 'nav.projects', props: true, bodies: 'html' },
  { name: 'researches', path: '/researches', titleKey: 'nav.researches', descriptionKey: 'researches_page.subtitle', preview: true, nav: 'main', navKey: 'nav.researches' },
  { name: 'certifications', path: '/certifications', titleKey: 'nav.certifications', descriptionKey: 'certifications_page.subtitle', preview: true, nav: 'main', navKey: 'nav.certifications' },
  { name: 'gallery', path: '/gallery', titleKey: 'gallery_page.title', descriptionKey: 'gallery_page.subtitle', preview: true, nav: 'more', navKey: 'nav.gallery' },
  { name: 'gallery-detail', path: '/gallery/:id', titleKey: 'gallery_page.title', props: true, bodies: 'html' },
  { name: 'graph', path: '/graph', titleKey: 'graph.title', descriptionKey: 'graph.subtitle', preview: true, nav: 'more', navKey: 'nav.graph' },
  { name: 'contact', path: '/contact', titleKey: 'nav.contact', descriptionKey: 'contact_page.subtitle', preview: true, nav: 'main', navKey: 'nav.contact' },
  { name: 'terminal', path: '/terminal', titleKey: 'terminal.title', preview: true, nav: 'more', navKey: 'nav.terminal', bare: true, bodies: 'plain' },
  { name: 'not-found', path: '/:pathMatch(.*)*', titleKey: 'not_found.subtitle' }
]

const navItems = (group) => PAGES.filter((page) => page.nav === group).map(({ navKey, path }) => ({ labelKey: navKey, path }))

/** Abas da pílula da navbar (e colunas do footer), na ordem da tabela. */
export const NAV_ITEMS = navItems('main')

/** Páginas fora da pílula principal: aparecem pela seta (desktop) e no fim do menu mobile. */
export const NAV_MORE_ITEMS = navItems('more')

/** Título da aba: o da página seguido do do site; na home (ou sem título), só o do site. */
export const pageTitle = (title, name) => (title && name !== 'home' ? `${title} | ${SITE_TITLE}` : SITE_TITLE)
