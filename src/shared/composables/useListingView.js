import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'

const VIEWS = ['grid', 'list']

// Uma preferência só para todas as listagens: escolher "lista" em projetos vale também nas outras
const stored = useLocalStorage('listing-view', 'grid')

/** Modo de exibição das listagens: 'grid' (grade) ou 'list' (lista). */
export function useListingView() {
  const view = computed({
    get: () => (VIEWS.includes(stored.value) ? stored.value : 'grid'),
    set: (value) => (stored.value = value)
  })

  return { view }
}
