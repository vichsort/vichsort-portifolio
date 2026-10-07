import { createRouter, createWebHistory } from 'vue-router'
import { useNavigation } from '@/shared/composables/useNavigation'
import i18n from '@/core/i18n'
import { scrollToHash } from './scrollToHash'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/modules/home/views/HomeView.vue'),
    meta: { titleKey: 'nav.home' }
  },
  {
    path: '/overview',
    name: 'overview',
    component: () => import('@/modules/about/views/OverviewView.vue'),
    meta: { titleKey: 'nav.about' }
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/modules/projects/views/ProjectsListView.vue'),
    meta: { titleKey: 'nav.projects' }
  },
  {
    path: '/projects/:slug',
    name: 'project-detail',
    component: () => import('@/modules/projects/views/ProjectDetailView.vue'),
    props: true,
    meta: { titleKey: 'nav.projects' }
  },
  {
    path: '/researches',
    name: 'researches',
    component: () => import('@/modules/researches/views/ResearchesView.vue'),
    meta: { titleKey: 'nav.researches' }
  },
  {
    path: '/certifications',
    name: 'certifications',
    component: () => import('@/modules/certifications/views/CertificationsView.vue'),
    meta: { titleKey: 'nav.certifications' }
  },
  {
    path: '/gallery',
    name: 'gallery',
    component: () => import('@/modules/gallery/views/GalleryView.vue'),
    meta: { titleKey: 'gallery_page.title' }
  },
  {
    path: '/gallery/:id',
    name: 'gallery-detail',
    component: () => import('@/modules/gallery/views/GalleryDetailView.vue'),
    props: true,
    meta: { titleKey: 'gallery_page.title' }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/modules/contact/views/ContactView.vue'),
    meta: { titleKey: 'nav.contact' }
  },
  {
    path: '/terminal',
    name: 'terminal',
    component: () => import('@/modules/terminal/views/TerminalView.vue'),
    meta: { titleKey: 'terminal.title' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/shared/views/NotFoundView.vue'),
    meta: { titleKey: 'not_found.subtitle' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return scrollToHash(to.hash)
    return { top: 0, behavior: 'smooth' }
  },
  routes
})

router.afterEach((to) => {
  // Automatically close navigation sidebar
  const { closeNav } = useNavigation()
  closeNav()

  // Update browser tab title dynamically
  const appBaseTitle = 'Vitor — Software Engineering'
  if (to.meta && to.meta.titleKey) {
    const pageTitle = i18n.global.t(to.meta.titleKey)
    document.title = to.name === 'home' ? appBaseTitle : `${pageTitle} | ${appBaseTitle}`
  } else {
    document.title = appBaseTitle
  }
})

export default router
