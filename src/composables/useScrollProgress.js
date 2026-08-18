import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollProgress(targetRef) {
  const progress = ref(0)
  let rafId = null

  const calculateProgress = () => {
    if (!targetRef.value) return

    const el = targetRef.value
    const rect = el.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const scrollableDistance = el.scrollHeight - windowHeight
    const scrolled = -rect.top

    if (scrolled <= 0) {
      progress.value = 0
    } else if (scrolled >= scrollableDistance) {
      progress.value = 1
    } else if (scrollableDistance > 0) {
      progress.value = scrolled / scrollableDistance
    }
  }

  const handleScroll = () => {
    if (rafId) return
    rafId = window.requestAnimationFrame(() => {
      calculateProgress()
      rafId = null
    })
  }

  onMounted(() => {
    calculateProgress()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleScroll)
    if (rafId) window.cancelAnimationFrame(rafId)
  })

  return { progress }
}