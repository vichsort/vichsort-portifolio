import { ref, onMounted, onUnmounted } from 'vue'

export function useDraggableScroll() {
  const containerRef = ref(null)
  const isDragging = ref(false)
  let startX = 0
  let scrollLeft = 0

  const startDrag = (e) => {
    if (!containerRef.value) return
    isDragging.value = true
    const pageX = e.pageX ?? (e.touches && e.touches[0] ? e.touches[0].pageX : 0)
    startX = pageX - containerRef.value.offsetLeft
    scrollLeft = containerRef.value.scrollLeft
  }

  const stopDrag = () => {
    isDragging.value = false
  }

  const moveDrag = (e) => {
    if (!isDragging.value || !containerRef.value) return
    const pageX = e.pageX ?? (e.touches && e.touches[0] ? e.touches[0].pageX : 0)
    const x = pageX - containerRef.value.offsetLeft
    const walk = (x - startX) * 1.5
    containerRef.value.scrollLeft = scrollLeft - walk
  }

  onMounted(() => {
    window.addEventListener('mouseup', stopDrag)
    window.addEventListener('touchend', stopDrag)
  })

  onUnmounted(() => {
    window.removeEventListener('mouseup', stopDrag)
    window.removeEventListener('touchend', stopDrag)
  })

  return {
    containerRef,
    isDragging,
    startDrag,
    stopDrag,
    moveDrag
  }
}
