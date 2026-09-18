import { VfsNodeType, VfsMimeType } from './types.js'
import {
  getAboutProfile,
  getAboutStack,
  getAboutTimeline,
  getCertificationsList,
  getResearchesList,
  getContact
} from './connectors.js'
import {
  loadProjectContent,
  getProjectMetadataJson
} from './projectsLoader.js'

// Importação segura e em lote dos arquivos Markdown com ?raw
const mdModules =
  typeof import.meta.glob === 'function'
    ? import.meta.glob('/src/modules/projects/content/*.md', {
        query: '?raw',
        import: 'default'
      })
    : {}

/**
 * Carregador assíncrono de Markdown de projetos.
 *
 * @param {string} slug - Identificador do projeto (ex: plante, cemiterio, tera).
 * @param {string} [locale='pt'] - Código do idioma.
 * @returns {Promise<string|null>} Conteúdo em texto Markdown bruto.
 */
export async function loadProjectMarkdown(slug, locale = 'pt') {
  const primaryKey = `/src/modules/projects/content/${slug}.${locale}.md`
  if (mdModules[primaryKey]) {
    return await mdModules[primaryKey]()
  }

  const fallbackKey = `/src/modules/projects/content/${slug}.pt.md`
  if (mdModules[fallbackKey]) {
    return await mdModules[fallbackKey]()
  }

  return null
}

/**
 * Cria a árvore declarativa do Virtual File System (VFS).
 *
 * @param {Object} [services={}] - Serviços opcionais injetados (i18n, projects, etc.).
 * @returns {Object} Árvore de nós a partir da raiz '/'.
 */
export function createVfsManifest(services = {}) {
  const { i18n = null, projects = null } = services

  return {
    type: VfsNodeType.DIR,
    name: '/',
    children: {
      about: {
        type: VfsNodeType.DIR,
        children: {
          'profile.txt': {
            type: VfsNodeType.FILE,
            mime: VfsMimeType.TEXT_PLAIN,
            getContent: (locale) => {
              if (typeof i18n?.getAboutProfile === 'function') return i18n.getAboutProfile(locale)
              return getAboutProfile(locale)
            }
          },
          'stack.txt': {
            type: VfsNodeType.FILE,
            mime: VfsMimeType.TEXT_PLAIN,
            getContent: (locale) => {
              if (typeof i18n?.getAboutStack === 'function') return i18n.getAboutStack(locale)
              return getAboutStack(locale)
            }
          },
          'timeline.txt': {
            type: VfsNodeType.FILE,
            mime: VfsMimeType.TEXT_PLAIN,
            getContent: (locale) => {
              if (typeof i18n?.getAboutTimeline === 'function') return i18n.getAboutTimeline(locale)
              return getAboutTimeline(locale)
            }
          }
        }
      },
      projects: {
        type: VfsNodeType.DIR,
        children: {
          plante: {
            type: VfsNodeType.DIR,
            children: {
              'README.md': {
                type: VfsNodeType.FILE,
                mime: VfsMimeType.TEXT_MARKDOWN,
                getContent: async (locale) => {
                  const proj = await loadProjectContent('plante', locale)
                  return proj?.raw || ''
                }
              },
              'info.json': {
                type: VfsNodeType.FILE,
                mime: VfsMimeType.APPLICATION_JSON,
                getContent: (locale) => getProjectMetadataJson('plante', locale)
              }
            }
          },
          cemiterio: {
            type: VfsNodeType.DIR,
            children: {
              'README.md': {
                type: VfsNodeType.FILE,
                mime: VfsMimeType.TEXT_MARKDOWN,
                getContent: async (locale) => {
                  const proj = await loadProjectContent('cemiterio', locale)
                  return proj?.raw || ''
                }
              },
              'info.json': {
                type: VfsNodeType.FILE,
                mime: VfsMimeType.APPLICATION_JSON,
                getContent: (locale) => getProjectMetadataJson('cemiterio', locale)
              }
            }
          },
          tera: {
            type: VfsNodeType.DIR,
            children: {
              'README.md': {
                type: VfsNodeType.FILE,
                mime: VfsMimeType.TEXT_MARKDOWN,
                getContent: async (locale) => {
                  const proj = await loadProjectContent('tera', locale)
                  return proj?.raw || ''
                }
              },
              'info.json': {
                type: VfsNodeType.FILE,
                mime: VfsMimeType.APPLICATION_JSON,
                getContent: (locale) => getProjectMetadataJson('tera', locale)
              }
            }
          }
        }
      },
      certifications: {
        type: VfsNodeType.DIR,
        children: {
          'list.txt': {
            type: VfsNodeType.FILE,
            mime: VfsMimeType.TEXT_PLAIN,
            getContent: (locale) => {
              if (typeof i18n?.getCertificationsList === 'function') return i18n.getCertificationsList(locale)
              return getCertificationsList(locale)
            }
          }
        }
      },
      researches: {
        type: VfsNodeType.DIR,
        children: {
          'list.txt': {
            type: VfsNodeType.FILE,
            mime: VfsMimeType.TEXT_PLAIN,
            getContent: (locale) => {
              if (typeof i18n?.getResearchesList === 'function') return i18n.getResearchesList(locale)
              return getResearchesList(locale)
            }
          }
        }
      },
      'contact.txt': {
        type: VfsNodeType.FILE,
        mime: VfsMimeType.TEXT_PLAIN,
        getContent: (locale) => {
          if (typeof i18n?.getContact === 'function') return i18n.getContact(locale)
          return getContact(locale)
        }
      },
      'resume.pdf': {
        type: VfsNodeType.FILE,
        mime: VfsMimeType.APPLICATION_PDF,
        action: 'download_resume'
      }
    }
  }
}

export default {
  createVfsManifest,
  loadProjectMarkdown
}
