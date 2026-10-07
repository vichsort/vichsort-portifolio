import { ref } from 'vue'
import router from '@/core/router'
import { waitForElement } from '@/core/router/scrollToHash'
import { useSettings } from './useSettings'

/**
 * true durante uma troca de página animada pela View Transitions API.
 * O App.vue desliga o fade entre páginas e o router não rola a página:
 * quem anima e posiciona é a própria transição.
 */
export const isViewTransitioning = ref(false)

/**
 * Navega animando entre as duas páginas: elementos com o mesmo
 * view-transition-name nas duas (ex.: a janela do terminal) se transformam
 * um no outro. Sem suporte do navegador, ou com animações desligadas,
 * é uma navegação comum.
 *
 * @param {import('vue-router').RouteLocationRaw} to
 * @param {{ waitFor?: string, center?: boolean }} [options]
 *   waitFor: id do elemento que precisa estar na tela nova antes da captura
 *   center: centraliza esse elemento na tela (ao voltar para o meio de uma página)
 */
export async function navigateWithTransition(to, { waitFor, center = false } = {}) {
  const { isMotionAllowed } = useSettings()

  const settle = async () => {
    if (!waitFor) return
    const el = await waitForElement(waitFor)
    if (el && center) el.scrollIntoView({ block: 'center', behavior: 'instant' })
  }

  if (typeof document === 'undefined' || !document.startViewTransition || !isMotionAllowed.value) {
    await router.push(to)
    await settle()
    return
  }

  isViewTransitioning.value = true
  try {
    const transition = document.startViewTransition(async () => {
      await router.push(to)
      await settle()
    })
    await transition.finished
  } finally {
    isViewTransitioning.value = false
  }
}
