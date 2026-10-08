/**
 * Dados dos gráficos (a4), derivados do grafo de conteúdo.
 *
 * JavaScript puro: recebe as consultas do grafo (content ou useContent) e
 * devolve estruturas prontas para desenhar. Só ligações de estrutura contam
 * (campo techs), para o resultado ser igual em todos os idiomas.
 */

/** "2025-10" → índice de mês (ano * 12 + mês - 1). Ano solto vale o mês de início ou de fim. */
export function monthIndex(value, end = false) {
  const [year, month] = String(value).split('-').map(Number)
  if (!year) return null
  return year * 12 + (month ? month - 1 : end ? 11 : 0)
}

/** Índice de mês → { year, month } (mês de 1 a 12). */
export const fromMonthIndex = (index) => ({ year: Math.floor(index / 12), month: (index % 12) + 1 })

/** Conteúdo provisório (exemplo) não entra nos gráficos. */
const isReal = (node) => node.data.source !== 'placeholder'

/**
 * Projetos com período em meses, do mais antigo para o mais recente.
 *
 * @returns {{ id: string, start: number, end: number, techs: string[] }[]}
 */
export function projectSpans(queries) {
  return queries
    .ofType('project')
    .map((project) => {
      const [first, last = first] = [project.data.date].flat()
      const start = monthIndex(first)
      const end = Math.max(start, monthIndex(last, true))
      return { id: project.id, start, end, techs: queries.linked(project.id, 'techs') }
    })
    .filter((project) => project.start !== null)
    .sort((a, b) => a.start - b.start || a.id.localeCompare(b.id))
}

/**
 * Uso de cada tech pelos projetos: em quais, desde quando e até quando.
 * Ordem: primeiro uso, depois quantidade de projetos.
 *
 * @returns {{ id: string, projects: object[], first: number, last: number }[]}
 */
export function techUsage(queries) {
  const usage = new Map()
  for (const project of projectSpans(queries)) {
    for (const tech of project.techs) {
      if (queries.node(tech)?.type !== 'tech') continue
      if (!usage.has(tech)) usage.set(tech, [])
      usage.get(tech).push(project)
    }
  }
  return [...usage.entries()]
    .map(([id, projects]) => ({
      id,
      projects,
      first: Math.min(...projects.map((p) => p.start)),
      last: Math.max(...projects.map((p) => p.end))
    }))
    .sort((a, b) => a.first - b.first || b.projects.length - a.projects.length || a.id.localeCompare(b.id))
}

/** As n techs mais usadas, mantendo a ordem de primeiro uso. */
export function topTechs(usage, n) {
  const keep = new Set(
    [...usage]
      .sort((a, b) => b.projects.length - a.projects.length || a.first - b.first)
      .slice(0, n)
      .map((tech) => tech.id)
  )
  return usage.filter((tech) => keep.has(tech.id))
}

/** Período coberto por uma lista de intervalos, arredondado para anos inteiros. */
export function yearDomain(spans) {
  const start = Math.min(...spans.map((s) => s.start ?? s.first))
  const end = Math.max(...spans.map((s) => s.end ?? s.last))
  return { start: Math.floor(start / 12) * 12, end: Math.floor(end / 12) * 12 + 12 }
}

/** Tipos de nó que entram no grafo, na ordem fixa da paleta (cor segue o tipo). */
export const GRAPH_TYPES = ['project', 'tech', 'research']

/**
 * Nós e arestas do grafo de conhecimento: projetos, pesquisas reais e as
 * techs que eles usam. Arestas: projeto/pesquisa → tech (campo techs) e
 * pesquisa → projeto (citação no corpo, em qualquer idioma).
 *
 * @returns {{ nodes: { id: string, type: string, degree: number }[], edges: { source: string, target: string }[] }}
 */
export function knowledgeGraph(queries) {
  const sources = [...queries.ofType('project'), ...queries.ofType('research').filter(isReal)]
  const ids = new Set(sources.map((n) => n.id))
  const edges = []
  const seen = new Set()

  const addEdge = (source, target) => {
    const key = `${source}→${target}`
    if (seen.has(key)) return
    seen.add(key)
    edges.push({ source, target })
  }

  for (const node of sources) {
    for (const tech of queries.linked(node.id, 'techs')) {
      if (queries.node(tech)?.type !== 'tech') continue
      ids.add(tech)
      addEdge(node.id, tech)
    }
    if (node.type === 'research') {
      for (const project of queries.outlinks(node.id).project || []) addEdge(node.id, project.id)
    }
  }

  const degree = new Map()
  for (const { source, target } of edges) {
    degree.set(source, (degree.get(source) || 0) + 1)
    degree.set(target, (degree.get(target) || 0) + 1)
  }

  // Nós sem nenhuma ligação (pesquisas que não citam tech nem projeto) ficam de fora do desenho
  const nodes = [...ids]
    .map((id) => ({ id, type: queries.node(id).type, degree: degree.get(id) || 0 }))
    .filter((n) => n.degree > 0)
  return { nodes, edges }
}

/** Contagens do cabeçalho da página /graph: todo o conteúdo real, inclusive o que não aparece no desenho. */
export function graphStats(queries, graph) {
  return {
    projects: queries.ofType('project').length,
    techs: graph.nodes.filter((n) => n.type === 'tech').length,
    researches: queries.ofType('research').filter(isReal).length,
    links: graph.edges.length
  }
}
