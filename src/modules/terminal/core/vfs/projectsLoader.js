import { content } from '../../../../core/content/index.js'
import { projectView } from '../../../../core/content/projects.js'
import { plainBody } from './graphNodes.js'

// Campos do projeto expostos no info.json do VFS
const INFO_FIELDS = ['title', 'category', 'techs', 'date', 'image', 'github', 'live', 'summary']

/**
 * Lista os ids dos projetos do grafo de conteúdo.
 *
 * @returns {string[]}
 */
export function getProjectSlugs() {
  return content.ofType('project').map((node) => node.id)
}

/**
 * Markdown do projeto para o terminal: título, resumo e corpo,
 * com wikilinks trocados pelo nome do nó e embeds removidos.
 *
 * @param {string} slug - Identificador do projeto.
 * @param {string} [locale='pt'] - Idioma.
 * @returns {string|null}
 */
export function loadRawMarkdown(slug, locale = 'pt') {
  const project = projectView(slug, locale)
  if (!project) return null

  return [`# ${project.title}`, project.summary ? `> ${project.summary}` : '', plainBody(project.body, locale).trim()]
    .filter(Boolean)
    .join('\n\n')
}

/**
 * Metadados do projeto como JSON (info.json no VFS).
 *
 * @param {string} slug - Identificador do projeto.
 * @param {string} [locale='pt'] - Idioma.
 * @returns {string}
 */
export function getProjectMetadataJson(slug, locale = 'pt') {
  const project = projectView(slug, locale)
  if (!project) {
    return JSON.stringify({ error: `Projeto '${slug}' não encontrado.` }, null, 2)
  }

  const info = { id: slug }
  for (const field of INFO_FIELDS) info[field] = project[field]
  return JSON.stringify(info, null, 2)
}
