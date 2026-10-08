import { content } from '../../../../core/content/index.ts'
import { projectView, type ProjectView } from '../../../../core/content/projects.ts'
import { plainBody } from './graphNodes.ts'

// Campos do projeto expostos no info.json do VFS
const INFO_FIELDS: Array<keyof ProjectView> = ['title', 'category', 'techs', 'date', 'image', 'github', 'live', 'summary']

/**
 * Lista os ids dos projetos do grafo de conteúdo.
 */
export function getProjectSlugs(): string[] {
  return content.ofType('project').map((node) => node.id)
}

/**
 * Markdown do projeto para o terminal: título, resumo e corpo,
 * com wikilinks trocados pelo nome do nó e embeds removidos.
 *
 * @param slug - Identificador do projeto.
 * @param locale - Idioma.
 */
export function loadRawMarkdown(slug: string, locale = 'pt'): string | null {
  const project = projectView(slug, locale)
  if (!project) return null

  return [`# ${project.title}`, project.summary ? `> ${project.summary}` : '', plainBody(project.body, locale).trim()]
    .filter(Boolean)
    .join('\n\n')
}

/**
 * Metadados do projeto como JSON (info.json no VFS).
 *
 * @param slug - Identificador do projeto.
 * @param locale - Idioma.
 */
export function getProjectMetadataJson(slug: string, locale = 'pt'): string {
  const project = projectView(slug, locale)
  if (!project) {
    return JSON.stringify({ error: `Projeto '${slug}' não encontrado.` }, null, 2)
  }

  const info: Record<string, unknown> = { id: slug }
  for (const field of INFO_FIELDS) info[field] = project[field]
  return JSON.stringify(info, null, 2)
}
