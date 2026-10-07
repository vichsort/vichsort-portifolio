import { computed, ref, watch } from 'vue'

// Menu aberto no site inteiro: abrir um fecha o outro
const activeMenu = ref(null)

/**
 * Estado de um menu de contexto: aberto ou não, qual submenu está aberto
 * e se ele foi travado por clique.
 *
 * Como no macOS: passar o mouse numa linha abre o submenu dela, e o clique
 * trava o submenu aberto (passar por outras linhas não troca mais).
 * Um nível de submenu só, que é o que o menu de nó usa.
 */
export function useMenuState() {
  const id = Symbol('menu')

  const isOpen = computed(() => activeMenu.value === id)
  const submenu = ref(null) // key do grupo com submenu aberto
  const locked = ref(false)

  const closeSubmenu = () => {
    submenu.value = null
    locked.value = false
  }

  const open = () => {
    activeMenu.value = id
  }

  const close = () => {
    if (isOpen.value) activeMenu.value = null
  }

  const toggle = () => (isOpen.value ? close() : open())

  /** Abre o submenu do grupo; com lock, ele fica até outro clique. */
  const openSubmenu = (key, { lock = false } = {}) => {
    submenu.value = key
    locked.value = lock
  }

  /** Clique num grupo: abre e trava; clicar de novo no grupo travado fecha. */
  const clickSubmenu = (key) => {
    if (submenu.value === key && locked.value) closeSubmenu()
    else openSubmenu(key, { lock: true })
  }

  watch(isOpen, (value) => {
    if (!value) closeSubmenu()
  })

  return { isOpen, submenu, locked, open, close, toggle, openSubmenu, closeSubmenu, clickSubmenu }
}
