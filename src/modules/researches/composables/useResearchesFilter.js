import { ref, computed, unref } from 'vue'

export function useResearchesFilter(researchesSource, resolveFn = (v) => v) {
  const searchQuery = ref('')
  const selectedCategory = ref('ALL')
  const selectedYear = ref('ALL')
  const selectedAward = ref('ALL')
  const selectedTag = ref('ALL')

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

  const researches = computed(() => {
    return unref(researchesSource) || []
  })

  const availableCategories = computed(() => {
    const categories = new Set()
    researches.value.forEach((r) => {
      const cat = resolve(r?.category)
      if (cat) categories.add(cat)
    })
    return Array.from(categories).sort((a, b) => a.localeCompare(b))
  })

  const availableYears = computed(() => {
    const years = new Set()
    researches.value.forEach((r) => {
      const rawDate = resolve(r?.year || r?.date)
      const matches = rawDate.match(/\b\d{4}\b/g)
      if (matches) {
        matches.forEach((y) => years.add(y))
      }
    })
    return Array.from(years).sort((a, b) => b.localeCompare(a))
  })

  const availableAwards = computed(() => {
    const awards = new Set()
    researches.value.forEach((r) => {
      const award = resolve(r?.award)
      if (award) awards.add(award)
    })
    return Array.from(awards).sort((a, b) => a.localeCompare(b))
  })

  const availableTags = computed(() => {
    const tags = new Set()
    researches.value.forEach((r) => {
      const raw = r?.tags
      if (Array.isArray(raw)) {
        raw.forEach((t) => {
          const val = resolve(t)
          if (val) tags.add(val)
        })
      } else if (typeof raw === 'string' && raw.trim().length > 0) {
        raw.split(',').map((t) => t.trim()).filter(Boolean).forEach((t) => tags.add(t))
      }
    })
    return Array.from(tags).sort((a, b) => a.localeCompare(b))
  })

  const hasActiveFilters = computed(() => {
    return (
      searchQuery.value.trim().length > 0 ||
      (selectedCategory.value && selectedCategory.value !== 'ALL') ||
      (selectedYear.value && selectedYear.value !== 'ALL') ||
      (selectedAward.value && selectedAward.value !== 'ALL') ||
      (selectedTag.value && selectedTag.value !== 'ALL')
    )
  })

  const clearFilters = () => {
    searchQuery.value = ''
    selectedCategory.value = 'ALL'
    selectedYear.value = 'ALL'
    selectedAward.value = 'ALL'
    selectedTag.value = 'ALL'
  }

  const filteredResearches = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()
    const categoryFilter = selectedCategory.value.toLowerCase()
    const yearFilter = selectedYear.value
    const awardFilter = selectedAward.value
    const tagFilter = selectedTag.value.toLowerCase()

    return researches.value.filter((r) => {
      const title = resolve(r?.title).toLowerCase()
      const desc = resolve(r?.description || r?.abstract).toLowerCase()
      const category = resolve(r?.category).toLowerCase()
      const award = resolve(r?.award)
      const date = resolve(r?.year || r?.date)
      const institution = resolve(r?.institution).toLowerCase()
      const authors = resolve(r?.authors).toLowerCase()

      const tagsRaw = r?.tags
      const tagsList = Array.isArray(tagsRaw)
        ? tagsRaw.map((t) => resolve(t).toLowerCase())
        : (typeof tagsRaw === 'string' ? tagsRaw.split(',').map((t) => t.trim().toLowerCase()) : [])

      // 1. Busca textual ampla
      const queryMatch =
        !query ||
        title.includes(query) ||
        desc.includes(query) ||
        category.includes(query) ||
        award.toLowerCase().includes(query) ||
        institution.includes(query) ||
        authors.includes(query) ||
        tagsList.some((t) => t.includes(query))

      // 2. Filtro por Categoria
      const categoryMatch = selectedCategory.value === 'ALL' || category === categoryFilter

      // 3. Filtro por Ano
      const yearMatch = yearFilter === 'ALL' || date.includes(yearFilter)

      // 4. Filtro por Premiação
      let awardMatch = true
      if (awardFilter === 'ALL') {
        awardMatch = true
      } else if (awardFilter === 'AWARDED_ONLY') {
        awardMatch = Boolean(award && award.trim().length > 0)
      } else {
        awardMatch = award.toLowerCase() === awardFilter.toLowerCase()
      }

      // 5. Filtro por Tag / Tecnologia
      const tagMatch = selectedTag.value === 'ALL' || tagsList.includes(tagFilter)

      return queryMatch && categoryMatch && yearMatch && awardMatch && tagMatch
    })
  })

  const resultsCount = computed(() => filteredResearches.value.length)
  const totalCount = computed(() => researches.value.length)

  return {
    searchQuery,
    selectedCategory,
    selectedYear,
    selectedAward,
    selectedTag,
    availableCategories,
    availableYears,
    availableAwards,
    availableTags,
    hasActiveFilters,
    filteredResearches,
    resultsCount,
    totalCount,
    clearFilters
  }
}
