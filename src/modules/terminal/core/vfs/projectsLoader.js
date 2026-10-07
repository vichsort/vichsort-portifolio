import { content } from '../../../../core/content/index.js'
import { replaceBodyLinks } from '../../../../core/content/links.js'

/**
 * Lista os ids dos projetos do grafo de conteúdo.
 *
 * @returns {string[]}
 */
export function getProjectSlugs() {
  return content.ofType('project').map((node) => node.id)
}

/**
 * Monta o Markdown do projeto para o terminal: título, resumo e corpo,
 * com wikilinks trocados pelo nome do nó.
 *
 * @param {string} slug - Identificador do projeto.
 * @param {string} [locale='pt'] - Idioma solicitado.
 * @returns {Promise<string|null>}
 */
export async function loadRawMarkdown(slug, locale = 'pt') {
  const project = await loadProjectContent(slug, locale)
  return project ? project.raw : null
}

/**
 * Carrega o projeto do grafo de conteúdo.
 *
 * @param {string} slug - Identificador do projeto.
 * @param {string} [locale='pt'] - Idioma.
 * @returns {Promise<{ id: string, attributes: Object, body: string, html: string, raw: string }|null>}
 */
export async function loadProjectContent(slug, locale = 'pt') {
  const node = content.node(slug)
  if (!node || node.type !== 'project') return null

  const text = content.text(slug, locale)
  const label = (target) => {
    const id = content.resolve(target)
    return id ? content.label(id, locale) : target
  }
  const body = replaceBodyLinks(text.body, (target, alias, embed) => (embed ? '' : alias || label(target)))

  const attributes = {
    title: text.title || slug,
    category: node.links.category ? content.label(node.links.category, locale) : '',
    techs: content.linked(slug, 'techs').map((id) => content.label(id, locale)),
    date: node.data.date || [],
    image: content.cover(slug),
    github: node.data.github || '',
    live: node.data.live || '',
    summary: text.summary || ''
  }

  return {
    id: slug,
    attributes,
    body,
    html: content.html(slug, locale),
    raw: [`# ${attributes.title}`, attributes.summary ? `> ${attributes.summary}` : '', body.trim()].filter(Boolean).join('\n\n')
  }
}

/**
 * Retorna os metadados do projeto formatados como string JSON estruturada (para info.json no VFS).
 *
 * @param {string} slug - Identificador do projeto.
 * @param {string} [locale='pt'] - Idioma.
 * @returns {Promise<string>}
 */
export async function getProjectMetadataJson(slug, locale = 'pt') {
  const project = await loadProjectContent(slug, locale)

  if (!project) {
    return JSON.stringify({ error: `Projeto '${slug}' não encontrado.` }, null, 2)
  }

  return JSON.stringify({ id: slug, ...project.attributes }, null, 2)
}

/**
 * Lista todos os projetos disponíveis com metadados carregados.
 *
 * @param {string} [locale='pt'] - Idioma.
 * @returns {Promise<Array<Object>>}
 */
export async function getAllProjects(locale = 'pt') {
  const projects = []

  for (const slug of getProjectSlugs()) {
    const data = await loadProjectContent(slug, locale)
    if (data) {
      projects.push({
        id: slug,
        ...data.attributes,
        body: data.body,
        raw: data.raw
      })
    }
  }

  return projects
}

export default {
  getProjectSlugs,
  loadRawMarkdown,
  loadProjectContent,
  getProjectMetadataJson,
  getAllProjects
}
