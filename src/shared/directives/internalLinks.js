import router from '@/core/router'

/**
 * Faz os links internos de um HTML gerado (v-html) navegarem pelo router,
 * sem recarregar a página, como um router-link.
 * Clique com Ctrl/Cmd/Shift ou botão do meio continua abrindo em outra aba.
 *
 * Uso: <section v-internal-links v-html="html" />
 */
function handleClick(event) {
  if (event.defaultPrevented || event.button !== 0) return
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

  const link = event.target.closest('a[href]')
  const href = link?.getAttribute('href') || ''
  // Interno: caminho do próprio site ("/projects/x"), não "//outro-dominio"
  if (!href.startsWith('/') || href.startsWith('//') || link.target === '_blank') return

  event.preventDefault()
  router.push(href)
}

export const vInternalLinks = {
  mounted: (el) => el.addEventListener('click', handleClick),
  unmounted: (el) => el.removeEventListener('click', handleClick)
}
