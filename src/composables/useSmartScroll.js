import { ref, onMounted, onUnmounted } from 'vue'

export function useSmartScroll() {
  const isVisible = ref(true)
  const isAtTop = ref(true)
  let lastScrollY = 0

  const handleScroll = () => {
    const currentScrollY = window.scrollY
    
    // Verifica se estamos no topo absoluto
    isAtTop.value = currentScrollY < 50

    // Se scrolou para baixo e já passou do topo -> Esconde
    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      isVisible.value = false
    } 
    // Se scrolou para cima -> Mostra
    else {
      isVisible.value = true
    }

    lastScrollY = currentScrollY
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return { isVisible, isAtTop }
}