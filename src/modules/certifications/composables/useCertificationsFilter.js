import { ref, computed, unref } from 'vue'

export function useCertificationsFilter(certificationsSource, resolveFn = (v) => v) {
  const searchQuery = ref('')
  const selectedIssuer = ref('ALL')
  const selectedSkill = ref('ALL')
  const selectedYear = ref('ALL')

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

  const certifications = computed(() => {
    return unref(certificationsSource) || []
  })

  const availableIssuers = computed(() => {
    const issuers = new Set()
    certifications.value.forEach((c) => {
      const issuer = resolve(c?.issuer)
      if (issuer) issuers.add(issuer)
    })
    return Array.from(issuers).sort((a, b) => a.localeCompare(b))
  })

  const availableSkills = computed(() => {
    const skills = new Set()
    certifications.value.forEach((c) => {
      const raw = c?.skills
      if (Array.isArray(raw)) {
        raw.forEach((s) => {
          const val = resolve(s)
          if (val) skills.add(val)
        })
      } else if (typeof raw === 'string' && raw.trim().length > 0) {
        raw.split(',').map((s) => s.trim()).filter(Boolean).forEach((s) => skills.add(s))
      }
    })
    return Array.from(skills).sort((a, b) => a.localeCompare(b))
  })

  const availableYears = computed(() => {
    const years = new Set()
    certifications.value.forEach((c) => {
      const rawDate = resolve(c?.date)
      const matches = rawDate.match(/\b\d{4}\b/g)
      if (matches) {
        matches.forEach((y) => years.add(y))
      }
    })
    return Array.from(years).sort((a, b) => b.localeCompare(a))
  })

  const hasActiveFilters = computed(() => {
    return (
      searchQuery.value.trim().length > 0 ||
      (selectedIssuer.value && selectedIssuer.value !== 'ALL') ||
      (selectedSkill.value && selectedSkill.value !== 'ALL') ||
      (selectedYear.value && selectedYear.value !== 'ALL')
    )
  })

  const clearFilters = () => {
    searchQuery.value = ''
    selectedIssuer.value = 'ALL'
    selectedSkill.value = 'ALL'
    selectedYear.value = 'ALL'
  }

  const filteredCertifications = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()
    const issuerFilter = selectedIssuer.value.toLowerCase()
    const skillFilter = selectedSkill.value.toLowerCase()
    const yearFilter = selectedYear.value

    return certifications.value.filter((c) => {
      const name = resolve(c?.name).toLowerCase()
      const issuer = resolve(c?.issuer).toLowerCase()
      const date = resolve(c?.date)

      const skillsRaw = c?.skills
      const skillsList = Array.isArray(skillsRaw)
        ? skillsRaw.map((s) => resolve(s).toLowerCase())
        : (typeof skillsRaw === 'string' ? skillsRaw.split(',').map((s) => s.trim().toLowerCase()) : [])

      // 1. Search Query
      const nameMatch =
        !query ||
        name.includes(query) ||
        issuer.includes(query) ||
        skillsList.some((s) => s.includes(query))

      // 2. Issuer Dropdown
      const issuerMatch = selectedIssuer.value === 'ALL' || issuer === issuerFilter

      // 3. Skill Dropdown
      const skillMatch = selectedSkill.value === 'ALL' || skillsList.includes(skillFilter)

      // 4. Year Dropdown
      const yearMatch = yearFilter === 'ALL' || date.includes(yearFilter)

      return nameMatch && issuerMatch && skillMatch && yearMatch
    })
  })

  const resultsCount = computed(() => filteredCertifications.value.length)
  const totalCount = computed(() => certifications.value.length)

  return {
    searchQuery,
    selectedIssuer,
    selectedSkill,
    selectedYear,
    availableIssuers,
    availableSkills,
    availableYears,
    hasActiveFilters,
    filteredCertifications,
    resultsCount,
    totalCount,
    clearFilters
  }
}
