import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollProgress(targetRef) {
  const progress = ref(0)

  const handleScroll = () => {
    if (!targetRef.value) return

    const el = targetRef.value
    const rect = el.getBoundingClientRect()
    const windowHeight = window.innerHeight

    // Calcula quanto do elemento já passou pelo topo
    // Quando rect.top é 0, estamos no início.
    // O scroll total disponível é (altura do elemento - altura da janela)
    const scrollableDistance = el.scrollHeight - windowHeight
    const scrolled = -rect.top // Inverte porque rect.top fica negativo ao descer

    if (scrolled < 0) {
      progress.value = 0
    } else if (scrolled > scrollableDistance) {
      progress.value = 1
    } else {
      progress.value = scrolled / scrollableDistance
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return { progress }
}