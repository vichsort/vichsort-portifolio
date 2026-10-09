import { computed, ref } from 'vue'

/**
 * Estado global de carregamento: a tela de carregamento (LoadingScreen) aparece enquanto
 * houver algo pendente. Duas fontes:
 *
 * - a navegação em curso (o router marca no beforeEach e desmarca ao terminar), que
 *   espera o chunk da página e, nas páginas com bodies, os corpos do conteúdo;
 * - trabalhos avulsos passados a trackLoading (a troca de idioma, no useSettings).
 *
 * A própria tela só aparece se a espera passar de 0,3s, como a do index.html.
 */
const navigating = ref(false)
const pending = ref(0)

export const isLoading = computed(() => navigating.value || pending.value > 0)

export function setNavigating(value) {
  navigating.value = value
}

/** Mostra a tela de carregamento enquanto a promessa não termina e a devolve. */
export async function trackLoading(promise) {
  pending.value++
  try {
    return await promise
  } finally {
    pending.value--
  }
}
