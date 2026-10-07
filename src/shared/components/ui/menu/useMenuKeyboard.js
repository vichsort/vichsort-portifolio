const itemsOf = (list) => [...list.querySelectorAll('[role="menuitem"]')]

/** Foca a linha no índice (negativo conta do fim; passa do fim e volta ao começo). */
function focusAt(list, index) {
  const items = itemsOf(list)
  if (!items.length) return
  items[((index % items.length) + items.length) % items.length].focus({ preventScroll: true })
}

/** Foca a primeira linha de um painel do menu. */
export const focusFirst = (list) => list && focusAt(list, 0)

/**
 * Teclado de um painel do menu (padrão ARIA de menu):
 * ↑↓ Home End entre as linhas, → entra no submenu, ← volta, Esc fecha, Tab sai.
 * Enter e Espaço são o clique nativo dos botões e links.
 *
 * @param {{
 *   onRight?: (el: HTMLElement) => boolean,
 *   onLeft?: () => boolean,
 *   onEscape: () => void,
 *   onTab: () => void
 * }} handlers
 *   onRight e onLeft devolvem false quando não há o que fazer, e a tecla segue normal.
 * @returns {(event: KeyboardEvent) => void} para o @keydown do painel
 */
export function useMenuKeyboard({ onRight = () => false, onLeft = () => false, onEscape, onTab }) {
  return (event) => {
    const list = event.currentTarget
    const current = itemsOf(list).indexOf(document.activeElement)

    switch (event.key) {
      case 'ArrowDown':
        focusAt(list, current + 1)
        break
      case 'ArrowUp':
        focusAt(list, current < 0 ? -1 : current - 1)
        break
      case 'Home':
        focusAt(list, 0)
        break
      case 'End':
        focusAt(list, -1)
        break
      case 'ArrowRight':
        if (!onRight(document.activeElement)) return
        break
      case 'ArrowLeft':
        if (!onLeft()) return
        break
      case 'Escape':
        onEscape()
        break
      case 'Tab':
        onTab()
        return
      default:
        return
    }

    event.preventDefault()
    event.stopPropagation()
  }
}
