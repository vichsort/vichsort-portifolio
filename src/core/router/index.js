import { createRouter, createWebHistory } from 'vue-router'
import { useNavigation } from '@/shared/composables/useNavigation'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/modules/home/views/HomeView.vue')
  },
  {
    path: '/overview',
    name: 'overview',
    component: () => import('@/modules/about/views/OverviewView.vue')
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/modules/projects/views/ProjectsListView.vue')
  },
  {
    path: '/projects/:slug',
    name: 'project-detail',
    component: () => import('@/modules/projects/views/ProjectDetailView.vue'),
    props: true
  },
  {
    path: '/researches',
    name: 'researches',
    component: () => import('@/modules/researches/views/ResearchesView.vue')
  },
  {
    path: '/certifications',
    name: 'certifications',
    component: () => import('@/modules/certifications/views/CertificationsView.vue')
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/modules/contact/views/ContactView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  },
  routes
})

router.afterEach(() => {
  const { closeNav } = useNavigation()
  closeNav()
})

export default router
