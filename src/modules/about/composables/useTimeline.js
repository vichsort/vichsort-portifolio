import { ref, computed, unref } from 'vue'

export function useTimeline(eventsSource, resolveFn = (v) => v) {
  const sortOrder = ref('asc') // 'asc' = passado -> presente, 'desc' = presente -> passado
  const selectedCategory = ref('ALL')

  const resolve = (val) => {
    if (val === undefined || val === null) return ''
    if (typeof resolveFn === 'function') {
      try {
        const res = resolveFn(val)
        return res !== undefined && res !== null ? String(res).trim() : ''
      } catch {
        return String(val).trim()
      }
    }
    return String(val).trim()
  }

  const rawEvents = computed(() => {
    return unref(eventsSource) || []
  })

  // Normaliza os eventos resolvendo valores do i18n
  const normalizedEvents = computed(() => {
    return rawEvents.value.map((e) => {
      const rawTags = e?.tags
      const tags = Array.isArray(rawTags)
        ? rawTags.map((t) => resolve(t)).filter(Boolean)
        : typeof rawTags === 'string'
        ? rawTags.split(',').map((t) => t.trim()).filter(Boolean)
        : []

      return {
        id: resolve(e?.id),
        year: resolve(e?.year || e?.date),
        date: resolve(e?.date || e?.year),
        type: resolve(e?.type) || 'education',
        title: resolve(e?.title),
        organization: resolve(e?.organization),
        description: resolve(e?.description),
        link_type: resolve(e?.link_type),
        link_url: resolve(e?.link_url),
        fallback: e?.fallback || null,
        tags
      }
    })
  })

  // Anos únicos ordenados cronologicamente (crescente: 2021 -> 2026)
  const chronologicalYears = computed(() => {
    const years = new Set()
    normalizedEvents.value.forEach((e) => {
      if (e.year) years.add(e.year)
    })
    return Array.from(years).sort((a, b) => a.localeCompare(b))
  })

  // Agrupamento por ano para a Timeline interativa (s4)
  const eventsByYear = computed(() => {
    const map = new Map()
    chronologicalYears.value.forEach((y) => {
      map.set(y, [])
    })

    normalizedEvents.value.forEach((e) => {
      if (map.has(e.year)) {
        map.get(e.year).push(e)
      }
    })

    return chronologicalYears.value.map((year) => ({
      year,
      events: map.get(year) || []
    }))
  })

  // Categorias disponíveis para filtro
  const availableCategories = computed(() => {
    const types = new Set()
    normalizedEvents.value.forEach((e) => {
      if (e.type) types.add(e.type)
    })
    return Array.from(types).sort()
  })

  // Lista filtrada e ordenada para a Timeline consolidada (s5)
  const consolidatedEvents = computed(() => {
    let list = [...normalizedEvents.value]

    // 1. Filtro por categoria
    if (selectedCategory.value && selectedCategory.value !== 'ALL') {
      list = list.filter((e) => e.type === selectedCategory.value)
    }

    // 2. Ordenação cronológica
    list.sort((a, b) => {
      const yearA = a.year || '0'
      const yearB = b.year || '0'
      if (sortOrder.value === 'desc') {
        return yearB.localeCompare(yearA)
      }
      return yearA.localeCompare(yearB)
    })

    return list
  })

  const toggleSortOrder = () => {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  }

  const setCategory = (cat) => {
    selectedCategory.value = cat
  }

  const totalCount = computed(() => normalizedEvents.value.length)
  const filteredCount = computed(() => consolidatedEvents.value.length)

  return {
    sortOrder,
    selectedCategory,
    chronologicalYears,
    eventsByYear,
    availableCategories,
    consolidatedEvents,
    totalCount,
    filteredCount,
    toggleSortOrder,
    setCategory
  }
}
