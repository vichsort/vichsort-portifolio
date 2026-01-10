import { ref } from 'vue'

export function useDraggableScroll() {
  const containerRef = ref(null)
  const isDown = ref(false)
  const startX = ref(0)
  const scrollLeft = ref(0)

  const startDrag = (e) => {
    isDown.value = true
    const slider = containerRef.value
    slider.classList.add('active')

    startX.value = e.pageX - slider.offsetLeft
    scrollLeft.value = slider.scrollLeft
  }

  const stopDrag = () => {
    isDown.value = false
    if (containerRef.value) {
      containerRef.value.classList.remove('active')
    }
  }

  const moveDrag = (e) => {
    if (!isDown.value) return
    
    e.preventDefault()
    const slider = containerRef.value
    const x = e.pageX - slider.offsetLeft

    const walk = (x - startX.value) * 1.5 
    slider.scrollLeft = scrollLeft.value - walk
  }

  return {
    containerRef,
    startDrag,
    stopDrag,
    moveDrag
  }
}