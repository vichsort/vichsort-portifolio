import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContent } from '@/core/content/useContent'

/**
 * Filtro ?ref=<id> das listagens: só os itens que apontam para esse nó.
 * É o destino do "Ver todos" do menu de nó (core/content/nodeMenu.js) e usa
 * os mesmos backlinks, então a listagem mostra exatamente o que o menu contou.
 *
 * Uso: useListingFilters(items, { ..., predicates: [refFilter.matches] })
 */
export function useRefFilter() {
  const route = useRoute()
  const router = useRouter()
  const { node, label, backlinks } = useContent()

  // Id de nó inexistente na URL é ignorado, como se não houvesse filtro
  const refId = computed(() => {
    const id = String(route.query.ref || '')
    return node(id) ? id : null
  })

  const refLabel = computed(() => (refId.value ? label(refId.value) : ''))

  const ids = computed(() => {
    if (!refId.value) return null
    return new Set(Object.values(backlinks(refId.value)).flat().map((n) => n.id))
  })

  /** @param {{ id: string }} item */
  const matches = (item) => !ids.value || ids.value.has(item.id)

  const clear = () => {
    const { ref, ...query } = route.query
    router.replace({ query })
  }

  return { refId, refLabel, matches, clear }
}
