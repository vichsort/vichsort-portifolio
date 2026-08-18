import { createRouter, createWebHistory } from 'vue-router'
import { useNavigation } from '@/composables/useNavigation'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  },

  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    // {
    //   path: '/overview',
    //   name: 'overview',
    //   // Vamos reutilizar a Home ou criar uma view específica de Sobre? 
    //   // Por enquanto, vou apontar para uma view nova
    //   component: () => import('@/views/OverviewView.vue') 
    // },
    // {
    //   path: '/projects',
    //   name: 'projects',
    //   component: () => import('@/views/ProjectsListView.vue')
    // },
    // {
    //   path: '/projects/:slug', // Rota Dinâmica (ex: /projects/plante)
    //   name: 'project-detail',
    //   component: () => import('@/views/ProjectDetailView.vue'),
    //   props: true // Passa o slug como prop para o componente
    // },
    // {
    //   path: '/researches',
    //   name: 'researches',
    //   component: () => import('@/views/ResearchesListView.vue')
    // },
    // {
    //   path: '/certifications',
    //   name: 'certifications',
    //   component: () => import('@/views/CertificationsView.vue')
    // },
    // {
    //   path: '/contact',
    //   name: 'contact',
    //   component: () => import('@/views/ContactView.vue')
    // }
  ]
})

router.afterEach(() => {
  // Automatically close navigation sidebar on route change
  const { closeNav } = useNavigation()
  closeNav()
})

export default router