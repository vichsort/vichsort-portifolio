import { ref } from 'vue'

const isNavOpen = ref(false)

export function useNavigation() {
  const openNav = () => {
    isNavOpen.value = true
  }

  const closeNav = () => {
    isNavOpen.value = false
  }

  const toggleNav = () => {
    isNavOpen.value = !isNavOpen.value
  }

  return {
    isNavOpen,
    openNav,
    closeNav,
    toggleNav
  }
}