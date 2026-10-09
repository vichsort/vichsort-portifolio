import { computed, nextTick } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { useSettings } from './useSettings'

const VIEWS = ['grid', 'list']

// Classe no <html> durante a troca: só então os cards ganham view-transition-name
// (core/styles/utilities.css), para não entrarem nas outras transições de página
const MORPH_CLASS = 'listing-morph'

// Uma preferência só para todas as listagens: escolher "lista" em projetos vale também nas outras
const stored = useLocalStorage('listing-view', 'grid')

/**
 * Modo de exibição das listagens: 'grid' (grade) ou 'list' (lista).
 * A troca anima cada card da posição antiga para a nova (View Transitions, n24);
 * sem suporte do navegador ou com animações desligadas, troca seca.
 */
export function useListingView() {
  const { isMotionAllowed } = useSettings()

  const view = computed({
    get: () => (VIEWS.includes(stored.value) ? stored.value : 'grid'),
    set: (value) => {
      if (value === view.value) return
      if (typeof document === 'undefined' || !document.startViewTransition || !isMotionAllowed.value) {
        stored.value = value
        return
      }
      const root = document.documentElement
      root.classList.add(MORPH_CLASS)
      const transition = document.startViewTransition(async () => {
        stored.value = value
        await nextTick()
      })
      transition.finished.finally(() => root.classList.remove(MORPH_CLASS))
    }
  })

  return { view }
}

/** Nome da transição de um card de listagem (prefixo: id que começa com dígito não é nome válido). */
export const listingItemStyle = (id) => ({ '--listing-vt': `listing-${id}` })
