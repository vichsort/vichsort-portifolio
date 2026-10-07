import { ref, shallowRef, watch } from 'vue'

/**
 * Menu de nó único para gatilhos que não são componentes Vue: os wikilinks
 * de techs, tópicos e cargos dentro do HTML renderizado (n10).
 *
 * A diretiva v-content-links chama toggle(id, botão); o NodeMenuHost (montado
 * uma vez no App.vue) mostra o menu ancorado no botão.
 */
const nodeId = ref(null)
// Nó dono do texto em que o gatilho está: fica fora do menu
const sourceId = ref(null)
const anchor = shallowRef(null)
const isOpen = ref(false)
// Conta as aberturas: cada gatilho novo ganha um painel novo, mesmo para o mesmo nó
const session = ref(0)

// Os botões vêm de v-html, sem binding: o aria-expanded é mantido aqui
watch([anchor, isOpen], ([el, open], [previous]) => {
  if (previous && previous !== el) previous.setAttribute('aria-expanded', 'false')
  el?.setAttribute('aria-expanded', String(open))
})

/** Abre o menu do nó no botão; clicar de novo no mesmo botão aberto fecha. */
function toggle(id, el, source = null) {
  if (isOpen.value && anchor.value === el) {
    isOpen.value = false
    return
  }
  nodeId.value = id
  sourceId.value = source
  anchor.value = el
  session.value++
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

export function useNodeMenuHost() {
  return { nodeId, sourceId, anchor, isOpen, session, toggle, close }
}
