import { ref, reactive, computed, unref } from 'vue'

// Valor de um filtro sem seleção ("Todas as categorias")
export const ALL = 'ALL'

// Minúsculas e sem acento: "Computação" e "computacao" se encontram na busca
const normalize = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()

/**
 * Anos (AAAA) de um valor de data: '2024-08', ['2023', '2024-02']... Um período vale
 * todos os anos entre o início e o fim: [2024-11, 2026-09] aparece também no filtro de 2025.
 */
export function yearsOf(date) {
  const years = (String([date].flat().join(' ')).match(/\b\d{4}\b/g) || []).map(Number)
  if (!years.length) return []
  const first = Math.min(...years)
  return Array.from({ length: Math.max(...years) - first + 1 }, (_, i) => String(first + i))
}

/**
 * Busca e filtros de uma listagem (projetos, pesquisas, certificações).
 *
 * @template T
 * @param {import('vue').MaybeRef<T[]>} itemsSource
 * @param {{
 *   search: (item: T) => Array<string|undefined>,
 *   filters: Record<string, { values: (item: T) => string[], order?: 'asc'|'desc' }>,
 *   predicates?: Array<(item: T) => boolean>
 * }} config
 *   search: textos de cada item em que a busca procura.
 *   filters: para cada filtro, os valores do item (um item pode ter vários, como techs);
 *   as opções do select são todos os valores encontrados, em ordem alfabética (ou decrescente, para anos).
 *   predicates: condições extras que o item precisa cumprir, fora da toolbar e do "limpar"
 *   (ex.: o filtro ?ref= do useRefFilter). Os selects mostram só as opções dos itens que passam nelas.
 */
export function useListingFilters(itemsSource, { search, filters, predicates = [] }) {
  const keys = Object.keys(filters)

  const searchQuery = ref('')
  const selected = reactive(Object.fromEntries(keys.map((key) => [key, ALL])))

  const items = computed(() => (unref(itemsSource) || []).filter((item) => predicates.every((p) => p(item))))

  const options = computed(() =>
    Object.fromEntries(
      keys.map((key) => {
        const { values, order = 'asc' } = filters[key]
        const found = [...new Set(items.value.flatMap((item) => values(item).filter(Boolean)))]
        found.sort((a, b) => (order === 'desc' ? b.localeCompare(a) : a.localeCompare(b)))
        return [key, found]
      })
    )
  )

  const hasActiveFilters = computed(
    () => searchQuery.value.trim() !== '' || keys.some((key) => selected[key] !== ALL)
  )

  const clearFilters = () => {
    searchQuery.value = ''
    keys.forEach((key) => (selected[key] = ALL))
  }

  const filtered = computed(() => {
    const query = normalize(searchQuery.value)

    return items.value.filter((item) => {
      const matchesSearch = !query || search(item).some((text) => normalize(text).includes(query))
      const matchesFilters = keys.every(
        (key) => selected[key] === ALL || filters[key].values(item).some((v) => normalize(v) === normalize(selected[key]))
      )
      return matchesSearch && matchesFilters
    })
  })

  return {
    searchQuery,
    selected,
    options,
    filtered,
    hasActiveFilters,
    clearFilters,
    resultsCount: computed(() => filtered.value.length),
    totalCount: computed(() => items.value.length)
  }
}
