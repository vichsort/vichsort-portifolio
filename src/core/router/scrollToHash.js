// Altura da navbar fixa, mais um respiro, para o card não ficar escondido atrás dela
const NAVBAR_OFFSET = 96

// Tempo máximo esperando o elemento: a troca de página (transição out-in) atrasa a montagem
const WAIT_MS = 2000

const FLASH_MS = 1600

/**
 * Espera um elemento com esse id aparecer no DOM, ou null se não aparecer a tempo.
 * Verifica por setTimeout, não requestAnimationFrame: dentro de uma View Transition
 * o navegador pausa a renderização (e com ela os frames).
 */
export function waitForElement(id) {
  return new Promise((resolve) => {
    const start = performance.now()
    const check = () => {
      const el = document.getElementById(id)
      if (el) return resolve(el)
      if (performance.now() - start > WAIT_MS) return resolve(null)
      setTimeout(check, 16)
    }
    check()
  })
}

/** Destaca o elemento por um instante (classe .is-flash em utilities.css). */
function flash(el) {
  el.classList.remove('is-flash')
  void el.offsetWidth // reinicia a transição se o mesmo card for destacado de novo
  el.classList.add('is-flash')
  setTimeout(() => el.classList.remove('is-flash'), FLASH_MS)
}

/**
 * Posição de rolagem para uma rota com âncora (/certifications#aws-cloud-practitioner):
 * o card com esse id, abaixo da navbar, destacado. Sem o card, o topo da página.
 * Usa getElementById porque ids de nós podem começar com dígito (2023-fullstack-developer),
 * o que não é um seletor CSS válido.
 *
 * @param {string} hash '#id'
 * @returns {Promise<object>} posição no formato do scrollBehavior do vue-router
 */
export async function scrollToHash(hash) {
  const el = await waitForElement(decodeURIComponent(hash.slice(1)))
  if (!el) return { top: 0, behavior: 'smooth' }

  flash(el)
  return { el, top: NAVBAR_OFFSET, behavior: 'smooth' }
}
