import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const isNavOpen = ref(false)

export function useNavigation() {
  const route = useRoute()

  const openNav = () => isNavOpen.value = true
  const closeNav = () => isNavOpen.value = false
  const toggleNav = () => isNavOpen.value = !isNavOpen.value
  
  watch(route, () => {
    closeNav()
  })

  return {
    isNavOpen,
    openNav,
    closeNav,
    toggleNav
  }
}