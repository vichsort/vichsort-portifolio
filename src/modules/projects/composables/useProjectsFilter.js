import { ref, computed, unref } from 'vue'

export function useProjectsFilter(projectsSource) {
  const searchQuery = ref('')
  const selectedCategory = ref('ALL')
  const selectedTech = ref('ALL')
  const selectedYear = ref('ALL')

  const projects = computed(() => {
    return unref(projectsSource) || []
  })

  const extractYears = (dateVal) => {
    if (!dateVal) return []
    const text = Array.isArray(dateVal) ? dateVal.join(' ') : String(dateVal)
    const matches = text.match(/\b\d{4}\b/g)
    return matches ? Array.from(new Set(matches)) : []
  }

  const availableCategories = computed(() => {
    const categories = new Set()
    projects.value.forEach((p) => {
      const cat = p?.category ? String(p.category).trim() : ''
      if (cat) categories.add(cat)
    })
    return Array.from(categories).sort((a, b) => a.localeCompare(b))
  })

  const availableTechs = computed(() => {
    const techs = new Set()
    projects.value.forEach((p) => {
      const raw = p?.techs
      if (Array.isArray(raw)) {
        raw.forEach((t) => {
          const val = String(t).trim()
          if (val) techs.add(val)
        })
      } else if (typeof raw === 'string' && raw.trim().length > 0) {
        raw.split(',').map((t) => t.trim()).filter(Boolean).forEach((t) => techs.add(t))
      }
    })
    return Array.from(techs).sort((a, b) => a.localeCompare(b))
  })

  const availableYears = computed(() => {
    const years = new Set()
    projects.value.forEach((p) => {
      const pYears = extractYears(p?.date)
      pYears.forEach((y) => years.add(y))
    })
    return Array.from(years).sort((a, b) => b.localeCompare(a)) // Mais recentes primeiro
  })

  const hasActiveFilters = computed(() => {
    return (
      searchQuery.value.trim().length > 0 ||
      (selectedCategory.value && selectedCategory.value !== 'ALL') ||
      (selectedTech.value && selectedTech.value !== 'ALL') ||
      (selectedYear.value && selectedYear.value !== 'ALL')
    )
  })

  const clearFilters = () => {
    searchQuery.value = ''
    selectedCategory.value = 'ALL'
    selectedTech.value = 'ALL'
    selectedYear.value = 'ALL'
  }

  const filteredProjects = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()
    const categoryFilter = selectedCategory.value.toLowerCase()
    const techFilter = selectedTech.value.toLowerCase()
    const yearFilter = selectedYear.value

    return projects.value.filter((p) => {
      const title = String(p?.title || p?.name || '').toLowerCase()
      const summary = String(p?.summary || p?.short_description || '').toLowerCase()
      const category = String(p?.category || '').toLowerCase()

      const techsRaw = p?.techs
      const techsList = Array.isArray(techsRaw)
        ? techsRaw.map((t) => String(t).toLowerCase())
        : (typeof techsRaw === 'string' ? techsRaw.split(',').map((t) => t.trim().toLowerCase()) : [])

      const projectYears = extractYears(p?.date)

      // 1. Text Search Query
      const nameMatch =
        !query ||
        title.includes(query) ||
        summary.includes(query) ||
        category.includes(query) ||
        techsList.some((t) => t.includes(query))

      // 2. Category Dropdown
      const categoryMatch = selectedCategory.value === 'ALL' || category === categoryFilter

      // 3. Tech Dropdown
      const techMatch = selectedTech.value === 'ALL' || techsList.includes(techFilter)

      // 4. Year / Date Dropdown
      const yearMatch = yearFilter === 'ALL' || projectYears.includes(yearFilter)

      return nameMatch && categoryMatch && techMatch && yearMatch
    })
  })

  const resultsCount = computed(() => filteredProjects.value.length)
  const totalCount = computed(() => projects.value.length)

  return {
    searchQuery,
    selectedCategory,
    selectedTech,
    selectedYear,
    availableCategories,
    availableTechs,
    availableYears,
    hasActiveFilters,
    filteredProjects,
    resultsCount,
    totalCount,
    clearFilters
  }
}
