import { parseMarkdown } from '../../../../core/utils/markdown.js'

// Importação estática em lote via Vite com query ?raw
const mdModules =
  typeof import.meta.glob === 'function'
    ? import.meta.glob('/src/modules/projects/content/*.md', {
        query: '?raw',
        import: 'default'
      })
    : {}

// Leitor fallback para execução em ambiente Node puro
let nodeFileReader = null
if (typeof process !== 'undefined' && process?.versions?.node) {
  try {
    const fsMod = 'node:fs/promises'
    const pathMod = 'node:path'
    const fs = await import(/* @vite-ignore */ fsMod)
    const path = await import(/* @vite-ignore */ pathMod)
    nodeFileReader = async (slug, loc) => {
      try {
        const filePath = path.resolve(process.cwd(), `src/modules/projects/content/${slug}.${loc}.md`)
        return await fs.readFile(filePath, 'utf-8')
      } catch {
        const fallbackPath = path.resolve(process.cwd(), `src/modules/projects/content/${slug}.pt.md`)
        try {
          return await fs.readFile(fallbackPath, 'utf-8')
        } catch {
          return null
        }
      }
    }
  } catch {
    // Ambiente sem acesso a fs
  }
}

const projectCache = new Map()

/**
 * Carrega a string Markdown bruta de um projeto no idioma selecionado.
 *
 * @param {string} slug - Identificador do projeto (ex: plante, cemiterio, tera).
 * @param {string} [locale='pt'] - Idioma solicitado ('pt' ou 'en').
 * @returns {Promise<string|null>}
 */
export async function loadRawMarkdown(slug, locale = 'pt') {
  const loc = locale === 'en' ? 'en' : 'pt'
  const primaryKey = `/src/modules/projects/content/${slug}.${loc}.md`

  if (mdModules[primaryKey]) {
    return await mdModules[primaryKey]()
  }

  const fallbackKey = `/src/modules/projects/content/${slug}.pt.md`
  if (mdModules[fallbackKey]) {
    return await mdModules[fallbackKey]()
  }

  if (nodeFileReader) {
    return await nodeFileReader(slug, loc)
  }

  return null
}

/**
 * Carrega e faz o parse do projeto extraindo frontmatter e corpo em Markdown.
 *
 * @param {string} slug - Identificador do projeto.
 * @param {string} [locale='pt'] - Idioma.
 * @returns {Promise<{ id: string, attributes: Object, body: string, html: string, raw: string }|null>}
 */
export async function loadProjectContent(slug, locale = 'pt') {
  const loc = locale === 'en' ? 'en' : 'pt'
  const cacheKey = `${slug}:${loc}`

  if (projectCache.has(cacheKey)) {
    return projectCache.get(cacheKey)
  }

  const raw = await loadRawMarkdown(slug, loc)
  if (!raw) {
    return null
  }

  const parsed = parseMarkdown(raw)
  const result = {
    id: slug,
    attributes: parsed.attributes || {},
    body: parsed.body || '',
    html: parsed.html || '',
    raw
  }

  projectCache.set(cacheKey, result)
  return result
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

  const { attributes } = project
  const meta = {
    id: slug,
    title: attributes.title || slug,
    category: attributes.category || 'App',
    techs: Array.isArray(attributes.techs) ? attributes.techs : [],
    date: attributes.date || [],
    image: attributes.image || '',
    github: attributes.github || '',
    live: attributes.live || '',
    summary: attributes.summary || ''
  }

  return JSON.stringify(meta, null, 2)
}

/**
 * Lista todos os projetos disponíveis com metadados carregados.
 *
 * @param {string} [locale='pt'] - Idioma.
 * @returns {Promise<Array<Object>>}
 */
export async function getAllProjects(locale = 'pt') {
  const slugs = ['plante', 'cemiterio', 'tera']
  const projects = []

  for (const slug of slugs) {
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
  loadRawMarkdown,
  loadProjectContent,
  getProjectMetadataJson,
  getAllProjects
}
