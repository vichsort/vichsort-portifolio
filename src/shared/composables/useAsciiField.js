import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  useDebounceFn,
  useDocumentVisibility,
  useIntersectionObserver,
  useMutationObserver,
  useResizeObserver
} from '@vueuse/core'
import { AsciiField } from '@/shared/ascii/AsciiField'
import { readPalette } from '@/shared/ascii/palette'
import { useSettings } from '@/shared/composables/useSettings'

/**
 * Liga um AsciiField ao ciclo de vida do componente.
 *
 * - Refaz a grade quando o container muda de tamanho ou as fontes terminam de carregar.
 * - Relê a paleta quando o tema (`data-theme` no <html>) muda.
 * - Pausa o loop fora da tela ou com a aba oculta.
 * - Congela o desenho (estático) quando as animações estão desligadas no site
 *   ou o sistema pede movimento reduzido.
 *
 * @param {import('vue').Ref<HTMLCanvasElement|null>} canvasRef - canvas dentro do container animado
 * @param {{ createLayers: () => object[], tokens: object, options?: object }} config
 * @returns {{ active: import('vue').ComputedRef<boolean>, motion: import('vue').ComputedRef<boolean> }}
 */
export function useAsciiField(canvasRef, { createLayers, tokens, options = {} }) {
  let field = null

  const host = computed(() => canvasRef.value?.parentElement ?? null)
  const isVisible = ref(false)
  const documentVisibility = useDocumentVisibility()
  const { isMotionAllowed: motion } = useSettings()
  const active = computed(() => isVisible.value && documentVisibility.value === 'visible')

  const syncLoop = () => {
    if (!field) return
    motion.value && active.value ? field.start() : field.stop()
  }

  onMounted(() => {
    const canvas = canvasRef.value
    const fontFamily = getComputedStyle(canvas).getPropertyValue('--font-mono').trim() || 'monospace'

    field = new AsciiField(canvas, {
      layers: createLayers(),
      palette: readPalette(canvas, tokens),
      motion: motion.value,
      fontFamily,
      ...options
    })
    syncLoop()

    // As áreas protegidas mudam de tamanho quando as fontes web terminam de carregar
    document.fonts?.ready.then(() => field?.setup())
  })

  onBeforeUnmount(() => {
    field?.destroy()
    field = null
  })

  useResizeObserver(host, useDebounceFn(() => field?.setup(), 150))

  useIntersectionObserver(host, ([entry]) => {
    isVisible.value = entry?.isIntersecting ?? false
  })

  useMutationObserver(
    document.documentElement,
    () => field?.setPalette(readPalette(canvasRef.value, tokens)),
    { attributes: true, attributeFilter: ['data-theme'] }
  )

  watch(motion, value => {
    field?.setMotion(value)
    syncLoop()
  })
  watch(active, syncLoop)

  return { active, motion }
}
