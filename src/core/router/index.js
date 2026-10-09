import { createRouter, createWebHistory } from 'vue-router'
import { useNavigation } from '@/shared/composables/useNavigation'
import i18n from '@/core/i18n'
import { scrollToHash } from './scrollToHash'
import { PAGES, pageTitle } from './pages'
import { requireBodies } from '@/core/content'
import { isViewTransitioning } from '@/shared/composables/useViewTransition'

// Componente de cada página da tabela (pages.js), por nome
const VIEWS = {
  home: () => import('@/modules/home/views/HomeView.vue'),
  overview: () => import('@/modules/about/views/OverviewView.vue'),
  projects: () => import('@/modules/projects/views/ProjectsListView.vue'),
  'project-detail': () => import('@/modules/projects/views/ProjectDetailView.vue'),
  researches: () => import('@/modules/researches/views/ResearchesView.vue'),
  certifications: () => import('@/modules/certifications/views/CertificationsView.vue'),
  gallery: () => import('@/modules/gallery/views/GalleryView.vue'),
  'gallery-detail': () => import('@/modules/gallery/views/GalleryDetailView.vue'),
  graph: () => import('@/modules/graph/views/GraphView.vue'),
  contact: () => import('@/modules/contact/views/ContactView.vue'),
  terminal: () => import('@/modules/terminal/views/TerminalView.vue'),
  'not-found': () => import('@/shared/views/NotFoundView.vue')
}

const routes = PAGES.map(({ name, path, titleKey, bare, props, bodies }) => ({
  path,
  name,
  component: VIEWS[name],
  props: Boolean(props),
  meta: { titleKey, bare: Boolean(bare), bodies: bodies || null }
}))

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // Na troca animada (View Transition) quem posiciona a página é a própria transição
    if (isViewTransitioning.value) return false
    // Troca de página vai direto à posição: 'instant', porque o scroll-behavior: smooth
    // do <html> tornaria suave o padrão ('auto'). O suave fica para as âncoras
    if (savedPosition) return { ...savedPosition, behavior: 'instant' }
    if (to.hash) return scrollToHash(to.hash)
    return { top: 0, behavior: 'instant' }
  },
  routes
})

// Páginas com o texto completo dos nós: o download dos corpos começa junto com o do chunk
// da página (beforeEach) e a navegação espera os dois (beforeResolve, a mesma busca)
router.beforeEach((to) => {
  if (to.meta.bodies) requireBodies(to.meta.bodies, i18n.global.locale.value).catch(() => {})
})
router.beforeResolve((to) => (to.meta.bodies ? requireBodies(to.meta.bodies, i18n.global.locale.value) : undefined))

router.afterEach((to) => {
  // Automatically close navigation sidebar
  const { closeNav } = useNavigation()
  closeNav()

  document.title = pageTitle(to.meta.titleKey && i18n.global.t(to.meta.titleKey), to.name)
})

export default router
