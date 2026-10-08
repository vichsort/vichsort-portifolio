import router from '@/core/router'
import { useNodeMenuHost } from '@/shared/composables/useNodeMenuHost'

/**
 * Cliques no HTML gerado do corpo dos nós (v-html):
 * - links internos navegam pelo router, sem recarregar a página, como um router-link
 *   (Ctrl/Cmd/Shift ou botão do meio continuam abrindo em outra aba);
 * - wikilinks de nós sem página (<button data-node>, ver core/content/markdown.ts)
 *   abrem o menu de nó (NodeMenuHost); ↓ também abre.
 *
 * Uso: <section v-content-links v-html="html" />
 */
const { toggle } = useNodeMenuHost()

function handleClick(event) {
  if (event.defaultPrevented || event.button !== 0) return

  const trigger = event.target.closest('[data-node]')
  if (trigger) {
    event.preventDefault()
    toggle(trigger.dataset.node, trigger, trigger.dataset.from)
    return
  }

  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

  const link = event.target.closest('a[href]')
  const href = link?.getAttribute('href') || ''
  // Interno: caminho do próprio site ("/projects/x"), não "//outro-dominio"
  if (!href.startsWith('/') || href.startsWith('//') || link.target === '_blank') return

  event.preventDefault()
  router.push(href)
}

function handleKeydown(event) {
  const trigger = event.key === 'ArrowDown' && event.target.closest('[data-node]')
  if (!trigger || trigger.getAttribute('aria-expanded') === 'true') return
  event.preventDefault()
  toggle(trigger.dataset.node, trigger, trigger.dataset.from)
}

export const vContentLinks = {
  mounted(el) {
    el.addEventListener('click', handleClick)
    el.addEventListener('keydown', handleKeydown)
  },
  unmounted(el) {
    el.removeEventListener('click', handleClick)
    el.removeEventListener('keydown', handleKeydown)
  }
}
