import { computed } from 'vue'
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/vue'

// Distância mínima das bordas da tela
const VIEWPORT_PADDING = 8

/**
 * Posição de um painel do menu ancorado num elemento, com @floating-ui.
 * Vira para o lado oposto se não couber (abaixo → acima, direita → esquerda),
 * encosta nas bordas da tela e acompanha scroll e resize enquanto aberto.
 *
 * Posiciona por top/left (transform: false) para o transform ficar livre
 * para a animação de entrada.
 *
 * @param {import('vue').Ref<HTMLElement|null>} reference
 * @param {import('vue').Ref<HTMLElement|null>} floating
 * @param {{ placement: string, offset?: number|object, open?: import('vue').Ref<boolean> }} options
 * @returns {{ floatingStyles: import('vue').Ref<object>, side: import('vue').ComputedRef<string> }}
 *   side: lado escolhido no fim ('top', 'bottom', 'left', 'right'), para a animação
 */
export function useMenuPosition(reference, floating, { placement, offset: distance = 8, open }) {
  const { floatingStyles, placement: finalPlacement } = useFloating(reference, floating, {
    placement,
    open,
    strategy: 'fixed',
    transform: false,
    middleware: [offset(distance), flip({ padding: VIEWPORT_PADDING }), shift({ padding: VIEWPORT_PADDING })],
    whileElementsMounted: autoUpdate
  })

  const side = computed(() => finalPlacement.value.split('-')[0])

  return { floatingStyles, side }
}
