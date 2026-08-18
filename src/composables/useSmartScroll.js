import { ref, onMounted, onUnmounted } from 'vue'

export function useSmartScroll() {
  const isVisible = ref(true)
  const isAtTop = ref(true)
  let lastScrollY = 0
  let ticking = false

  const updateScrollState = () => {
    const currentScrollY = window.scrollY || window.pageYOffset || 0
    isAtTop.value = currentScrollY < 50

    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      isVisible.value = false
    } else {
      isVisible.value = true
    }

    lastScrollY = currentScrollY
    ticking = false
  }

  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollState)
      ticking = true
    }
  }

  onMounted(() => {
    lastScrollY = window.scrollY || window.pageYOffset || 0
    isAtTop.value = lastScrollY < 50
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return { isVisible, isAtTop }
}