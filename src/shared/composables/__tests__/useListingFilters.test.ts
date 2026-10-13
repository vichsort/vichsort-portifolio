import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { ALL, useListingFilters, yearsOf } from '../useListingFilters.js'

describe('yearsOf', () => {
  it('um período vale todos os anos entre o início e o fim', () => {
    expect(yearsOf('2024-08')).toEqual(['2024'])
    expect(yearsOf(2023)).toEqual(['2023'])
    expect(yearsOf(['2024-11', '2026-09'])).toEqual(['2024', '2025', '2026'])
    expect(yearsOf('2024-01,2025-02')).toEqual(['2024', '2025'])
    expect(yearsOf([])).toEqual([])
    expect(yearsOf(undefined)).toEqual([])
  })
})

interface Item {
  title: string
  techs: string[]
  date: string | string[]
}

const ITEMS: Item[] = [
  { title: 'Computação Gráfica', techs: ['Vue', 'Python'], date: ['2024-11', '2026-09'] },
  { title: 'Hotel', techs: ['React'], date: '2026-08' },
  { title: 'Iarte', techs: ['Python'], date: ['2023-12', '2024-09'] }
]

const setup = (items = ref(ITEMS), predicates: Array<(item: Item) => boolean> = []) =>
  useListingFilters(items, {
    search: (item: Item) => [item.title, ...item.techs],
    filters: {
      tech: { values: (item: Item) => item.techs },
      year: { values: (item: Item) => yearsOf(item.date), order: 'desc' }
    },
    predicates
  })

const titles = (list: Item[]) => list.map((item) => item.title)

describe('useListingFilters', () => {
  it('opções: todos os valores encontrados, em ordem; anos do mais recente', () => {
    const { options } = setup()
    expect(options.value.tech).toEqual(['Python', 'React', 'Vue'])
    expect(options.value.year).toEqual(['2026', '2025', '2024', '2023'])
  })

  it('busca sem acento nem maiúsculas, também nas techs', () => {
    const { searchQuery, filtered } = setup()
    searchQuery.value = 'computacao'
    expect(titles(filtered.value)).toEqual(['Computação Gráfica'])
    searchQuery.value = ' PYTHON '
    expect(titles(filtered.value)).toEqual(['Computação Gráfica', 'Iarte'])
  })

  it('filtros combinados; o ano do meio de um período encontra o item', () => {
    const { selected, filtered, resultsCount, hasActiveFilters } = setup()
    selected.year = '2025'
    expect(titles(filtered.value)).toEqual(['Computação Gráfica'])
    selected.year = '2024'
    selected.tech = 'Python'
    expect(titles(filtered.value)).toEqual(['Computação Gráfica', 'Iarte'])
    expect(resultsCount.value).toBe(2)
    expect(hasActiveFilters.value).toBe(true)
  })

  it('limpar volta tudo para ALL', () => {
    const { selected, searchQuery, clearFilters, filtered, hasActiveFilters } = setup()
    selected.tech = 'React'
    searchQuery.value = 'x'
    clearFilters()
    expect(selected.tech).toBe(ALL)
    expect(hasActiveFilters.value).toBe(false)
    expect(filtered.value).toHaveLength(3)
  })

  it('predicates ficam fora do limpar e restringem as opções', () => {
    const { options, totalCount, clearFilters, filtered } = setup(ref(ITEMS), [(item) => item.techs.includes('Python')])
    expect(options.value.tech).toEqual(['Python', 'Vue'])
    clearFilters()
    expect(totalCount.value).toBe(2)
    expect(titles(filtered.value)).toEqual(['Computação Gráfica', 'Iarte'])
  })

  it('a lista é reativa', () => {
    const items = ref(ITEMS.slice(0, 1))
    const { filtered } = setup(items)
    items.value = ITEMS
    expect(filtered.value).toHaveLength(3)
  })
})
