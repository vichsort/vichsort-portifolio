import { content } from '../../../../core/content/index.js'
import { replaceBodyLinks } from '../../../../core/content/links.js'
import { projectView } from '../../../../core/content/projects.js'

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

  const label = (target) => {
    const id = content.resolve(target)
    return id ? content.label(id, locale) : target
  }
  const body = replaceBodyLinks(project.body, (target, alias, embed) => (embed ? '' : alias || label(target)))

  return [`# ${project.title}`, project.summary ? `> ${project.summary}` : '', body.trim()]
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
