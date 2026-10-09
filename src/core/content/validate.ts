import { LANGS, REQUIRED_LANGS, SOURCES, TYPES } from './schema.ts'
import type { ContentGraph, ContentNode, Issue, Report } from './types.ts'

const DATE = /^\d{4}(-\d{2})?$/

/**
 * Regras de conteúdo do GRAPH.md (seção 6) que dependem do grafo já montado.
 * Os erros de leitura e de ligação vêm do próprio buildGraph.
 *
 */
export function validateGraph(graph: ContentGraph): Issue[] {
  const issues: Issue[] = []
  const report: Report = (level, code, where, message) => issues.push({ level, code, where, message })

  const collected = new Set<string>()
  for (const node of graph.nodes.values()) {
    if (node.type !== 'collection') continue
    for (const { items } of node.groups || []) items.forEach((id) => collected.add(id))
  }

  for (const node of graph.nodes.values()) {
    const def = TYPES[node.type]
    const file = `${node.path}/${node.id}.md`

    for (const field of def.required || []) {
      const value = field in node.links ? node.links[field] : node.data[field]
      if (isEmpty(value) && !(field === 'items' && node.groups?.length)) {
        report('error', 'missing-field', file, `campo obrigatório ausente: ${field}`)
      }
    }

    for (const [field, allowed] of Object.entries(def.enums || {})) {
      const value = node.data[field]
      if (!isEmpty(value) && !allowed.includes(String(value))) {
        report('error', 'bad-enum', file, `${field}: "${value}" não é um de ${allowed.join(', ')}`)
      }
    }

    const { source } = node.data
    if (!isEmpty(source) && !SOURCES.includes(String(source))) {
      report('error', 'bad-enum', file, `source: "${source}" não é um de ${SOURCES.join(', ')}`)
    }

    if ('date' in node.data) {
      const dates = Array.isArray(node.data.date) ? node.data.date : [node.data.date]
      for (const d of dates) {
        if (!DATE.test(String(d))) report('error', 'bad-date', file, `data "${d}" fora do formato AAAA ou AAAA-MM`)
      }
    }

    // Idiomas opcionais só são cobrados quando o arquivo existe
    for (const lang of LANGS) {
      const text = node.texts[lang]
      if (!text && !REQUIRED_LANGS.includes(lang)) continue
      for (const field of def.requiredText || []) {
        if (isEmpty(text?.[field])) {
          report('error', 'missing-text', `${node.path}/${node.id}.${lang}.md`, `campo obrigatório ausente: ${field}`)
        }
      }
    }

    checkAsymmetry(node, def.requiredText || [], report)

    if (node.type === 'tech' && node.assets['icon.svg'] && !collected.has(node.id)) {
      report('warning', 'uncollected-tech', file, 'tech com ícone fora de qualquer coleção')
    }

    // As stacks (home e Sobre) mostram só o ícone: sem ele, aparece uma imagem quebrada
    if (node.type === 'tech' && !node.assets['icon.svg'] && collected.has(node.id)) {
      report('error', 'missing-icon', file, 'tech numa coleção (stack) sem icon.svg na pasta')
    }
  }

  return issues
}

// Campos opcionais e wikilinks do corpo presentes num idioma e não em outro.
// Compara o idioma base com cada um dos outros (os opcionais, só se existirem).
function checkAsymmetry(node: ContentNode, required: string[], report: Report) {
  const [base] = REQUIRED_LANGS
  const others = LANGS.filter((l) => l !== base && (node.texts[l] || REQUIRED_LANGS.includes(l)))
  for (const other of others) compareTexts(node, base, other, required, report)
}

function compareTexts(node: ContentNode, a: string, b: string, required: string[], report: Report) {
  const ta: Record<string, unknown> = node.texts[a] || {}
  const tb: Record<string, unknown> = node.texts[b] || {}
  const fields = new Set([...Object.keys(ta), ...Object.keys(tb)])

  for (const field of fields) {
    if (required.includes(field)) continue // já acusado como erro
    const inA = !isEmpty(ta[field])
    const inB = !isEmpty(tb[field])
    if (inA !== inB) {
      const [has, lacks] = inA ? [a, b] : [b, a]
      report('warning', 'missing-translation', `${node.path}/${node.id}.${lacks}.md`, `"${field}" existe em ${has} e não em ${lacks}`)
    }
  }

  const la = new Set(node.bodyLinks[a] || [])
  const lb = new Set(node.bodyLinks[b] || [])
  for (const id of la) {
    if (!lb.has(id)) report('warning', 'body-link-asymmetry', `${node.path}/${node.id}.${b}.md`, `[[${id}]] é citado em ${a} e não em ${b}`)
  }
  for (const id of lb) {
    if (!la.has(id)) report('warning', 'body-link-asymmetry', `${node.path}/${node.id}.${a}.md`, `[[${id}]] é citado em ${b} e não em ${a}`)
  }
}

function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  return false
}
