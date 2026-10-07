import { onBeforeUnmount, unref } from 'vue'

// Espera antes de trocar o submenu ao passar o mouse numa linha
const HOVER_DELAY = 60
// Espera quando o mouse parece estar indo para o submenu aberto
const AIM_DELAY = 280
// Folga vertical do triângulo além das bordas do submenu
const AIM_SLACK = 12

const sign = (p, a, b) => (p.x - b.x) * (a.y - b.y) - (a.x - b.x) * (p.y - b.y)

function inTriangle(p, a, b, c) {
  const d1 = sign(p, a, b)
  const d2 = sign(p, b, c)
  const d3 = sign(p, c, a)
  const negative = d1 < 0 || d2 < 0 || d3 < 0
  const positive = d1 > 0 || d2 > 0 || d3 > 0
  return !(negative && positive)
}

/**
 * Tolerância diagonal do submenu: o mouse pode cruzar outras linhas a caminho
 * do submenu aberto sem que ele troque.
 *
 * Guarda as duas últimas posições do mouse. Se a atual está no triângulo entre
 * a anterior e a borda do submenu mais próxima, o mouse está indo para ele:
 * a troca espera mais. Se o mouse parar numa linha, a troca acontece mesmo assim.
 *
 * @param {import('vue').Ref<HTMLElement|null>} submenuEl
 */
export function useSubmenuAim(submenuEl) {
  let previous = null
  let last = null
  let timer = null

  const track = (event) => {
    previous = last
    last = { x: event.clientX, y: event.clientY }
  }

  const aiming = () => {
    const el = unref(submenuEl)
    if (!el || !previous || !last) return false
    const rect = el.getBoundingClientRect()
    // Submenu à direita ou à esquerda do menu (o posicionamento pode virar)
    const edge = rect.left >= last.x ? rect.left : rect.right
    return inTriangle(last, previous, { x: edge, y: rect.top - AIM_SLACK }, { x: edge, y: rect.bottom + AIM_SLACK })
  }

  const cancel = () => {
    clearTimeout(timer)
    timer = null
  }

  /** Agenda a troca de submenu, esperando mais se o mouse estiver indo para ele. */
  const defer = (fn) => {
    cancel()
    timer = setTimeout(fn, aiming() ? AIM_DELAY : HOVER_DELAY)
  }

  onBeforeUnmount(cancel)

  return { track, defer, cancel }
}
