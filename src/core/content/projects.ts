import { content } from './index.ts'
import { DEFAULT_COVER } from '../config/profile.js'
import type { DateValue } from './types.ts'

/** Projeto no formato que as telas e o terminal consomem. */
export interface ProjectView {
  id: string
  title: string
  /** Idioma do texto quando o pedido não existe (selo "não traduzido"), ou null. */
  fallback: string | null
  summary: string
  /** O resumo em HTML (renderizado no build, como Markdown). */
  summaryHtml: string
  /** Nome de exibição da categoria; o id fica em categoryId. */
  category: string
  categoryId: string
  /** Nomes de exibição das techs; os ids ficam em techIds. */
  techs: string[]
  techIds: string[]
  date: DateValue | DateValue[]
  image: string
  github: string
  live: string
  featured: boolean
  /** Corpo em HTML; vazio até os corpos do idioma chegarem (requireBodies). */
  html: string
}

/**
 * Projeto no formato que as telas e o terminal consomem, montado a partir do nó do grafo.
 * Techs e categoria vêm como nomes de exibição; os ids ficam em techIds/categoryId.
 */
export function projectView(id: string, lang = 'pt'): ProjectView | null {
  const node = content.node(id)
  if (!node || node.type !== 'project') return null

  const text = content.text(id, lang)
  const techIds = content.linked(id, 'techs')
  const [categoryId = ''] = content.linked(id, 'category')

  return {
    id,
    title: text.title || id,
    fallback: content.fallback(id, lang),
    summary: text.summary || '',
    summaryHtml: String(text.summaryHtml || ''),
    category: categoryId ? content.label(categoryId, lang) : '',
    categoryId,
    techs: techIds.map((t) => content.label(t, lang)),
    techIds,
    date: node.data.date || [],
    // Sem cover.jpg na pasta, o hero do site
    image: content.cover(id) || DEFAULT_COVER,
    github: node.data.github || '',
    live: node.data.live || '',
    featured: node.data.featured === true,
    html: content.html(id, lang)
  }
}

// Os ids vêm do próprio grafo, então o projeto sempre existe
const view = (lang: string) => (node: { id: string }) => projectView(node.id, lang)!

/** Todos os projetos, em ordem de id. */
export const allProjects = (lang = 'pt'): ProjectView[] => content.ofType('project').map(view(lang))

/** Projetos em destaque (featured: true), do mais recente para o mais antigo. */
export const featuredProjects = (lang = 'pt'): ProjectView[] =>
  content
    .ofType('project', { recent: true })
    .filter((node) => node.data.featured === true)
    .map(view(lang))
