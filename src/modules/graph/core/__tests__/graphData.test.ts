import { describe, expect, it } from 'vitest'
import { buildGraph } from '../../../../core/content/graph.ts'
import { createBuildQueries } from '../../../../core/content/render.ts'
import { md, vault } from '../../../../core/content/__tests__/vault.ts'
import { fromMonthIndex, graphStats, knowledgeGraph, monthIndex, projectSpans, techUsage, topTechs, yearDomain } from '../graphData.js'

// Três projetos em períodos diferentes, uma pesquisa real que cita o alpha e uma provisória
const q = createBuildQueries(
  buildGraph(
    vault({
      'projects/gamma/gamma.md': md('category: "[[app]]"\ndate: 2023\ntechs:\n  - "[[python]]"'),
      'projects/gamma/gamma.pt.md': md('title: Gama\nsummary: Resumo'),
      'projects/gamma/gamma.en.md': md('title: Gamma\nsummary: Summary'),
      'researches/r1/r1.md': md('date: 2025\ntechs:\n  - "[[python]]"'),
      'researches/r1/r1.pt.md': md('title: Pesquisa', 'Base do [[alpha]].'),
      'researches/r1/r1.en.md': md('title: Research', 'Basis for [[alpha]].'),
      'researches/r2/r2.md': md('source: placeholder\ndate: 2025\ntechs:\n  - "[[vue]]"'),
      'researches/r2/r2.pt.md': md('title: Exemplo'),
      'researches/r2/r2.en.md': md('title: Example')
    })
  )
)

const month = (year: number, m: number) => year * 12 + m - 1

describe('meses', () => {
  it('ano solto vale janeiro, ou dezembro no fim do período', () => {
    expect(monthIndex('2025-10')).toBe(month(2025, 10))
    expect(monthIndex(2023)).toBe(month(2023, 1))
    expect(monthIndex(2023, true)).toBe(month(2023, 12))
    expect(monthIndex('')).toBeNull()
    expect(fromMonthIndex(month(2025, 12))).toEqual({ year: 2025, month: 12 })
  })
})

describe('projectSpans e techUsage', () => {
  const spans = projectSpans(q)

  it('períodos do mais antigo ao mais recente', () => {
    expect(spans).toEqual([
      { id: 'gamma', start: month(2023, 1), end: month(2023, 12), techs: ['python'] },
      { id: 'beta', start: month(2024, 1), end: month(2024, 6), techs: ['vue'] },
      { id: 'alpha', start: month(2025, 3), end: month(2025, 3), techs: ['python', 'vue'] }
    ])
  })

  it('uso de cada tech: projetos, primeiro e último mês', () => {
    expect(techUsage(q).map(({ id, projects, first, last }) => [id, projects.map((p: { id: string }) => p.id), first, last])).toEqual([
      ['python', ['gamma', 'alpha'], month(2023, 1), month(2025, 3)],
      ['vue', ['beta', 'alpha'], month(2024, 1), month(2025, 3)]
    ])
  })

  it('topTechs: empate desfeito pelo primeiro uso, mantendo a ordem', () => {
    expect(topTechs(techUsage(q), 1).map((t: { id: string }) => t.id)).toEqual(['python'])
  })

  it('yearDomain arredonda para anos inteiros', () => {
    expect(yearDomain(spans)).toEqual({ start: month(2023, 1), end: month(2026, 1) })
  })
})

describe('knowledgeGraph e graphStats', () => {
  const graph = knowledgeGraph(q)

  it('projetos, pesquisas reais e as techs que usam; pesquisa → projeto citado', () => {
    const edges = graph.edges.map((e: { source: string; target: string }) => `${e.source}→${e.target}`)
    expect(edges.sort()).toEqual(['alpha→python', 'alpha→vue', 'beta→vue', 'gamma→python', 'r1→alpha', 'r1→python'])
  })

  it('grau de cada nó; a pesquisa provisória fica de fora', () => {
    const degrees = Object.fromEntries(graph.nodes.map((n: { id: string; degree: number }) => [n.id, n.degree]))
    expect(degrees).toEqual({ alpha: 3, beta: 1, gamma: 1, r1: 2, python: 3, vue: 2 })
  })

  it('contagens do cabeçalho', () => {
    expect(graphStats(q, graph)).toEqual({ projects: 3, techs: 2, researches: 1, links: 6 })
  })
})
