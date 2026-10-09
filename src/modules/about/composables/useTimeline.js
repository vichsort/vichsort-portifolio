import { ref, computed, toValue } from 'vue'

/**
 * Filtro e agrupamento da linha do tempo do Sobre.
 *
 * @param {import('vue').MaybeRefOrGetter<Array<{ id: string, date: string, type: string }>>} events
 *   marcos já no formato do card (TimelineItemCard); date é 'AAAA' ou 'AAAA-MM'
 */
export function useTimeline(events) {
  const sortOrder = ref('desc') // 'desc' = presente -> passado
  const selectedCategory = ref('ALL')

  const all = computed(() => toValue(events) || [])

  // Só as categorias que existem nos dados, na ordem dos filtros
  const CATEGORY_ORDER = ['project', 'research', 'work', 'education']
  const availableCategories = computed(() => CATEGORY_ORDER.filter((type) => all.value.some((e) => e.type === type)))

  const filtered = computed(() => {
    const list = selectedCategory.value === 'ALL' ? [...all.value] : all.value.filter((e) => e.type === selectedCategory.value)
    const direction = sortOrder.value === 'desc' ? -1 : 1
    return list.sort((a, b) => direction * String(a.date).localeCompare(String(b.date)))
  })

  // Grupos por ano, na ordem da lista
  const eventsByYear = computed(() => {
    const groups = []
    for (const event of filtered.value) {
      const year = String(event.date).slice(0, 4)
      if (groups.at(-1)?.year !== year) groups.push({ year, events: [] })
      groups.at(-1).events.push(event)
    }
    return groups
  })

  const toggleSortOrder = () => {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  }

  const setCategory = (category) => {
    selectedCategory.value = category
  }

  return {
    sortOrder,
    selectedCategory,
    availableCategories,
    eventsByYear,
    totalCount: computed(() => all.value.length),
    toggleSortOrder,
    setCategory
  }
}
