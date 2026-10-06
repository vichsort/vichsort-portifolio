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
  getProjectSlugs,
  loadRawMarkdown,
  getProjectMetadataJson
} from './projectsLoader.js'

/**
 * Carregador assíncrono de Markdown de projetos.
 *
 * @param {string} slug - Identificador do projeto (ex: plante, cemiterio, tera).
 * @param {string} [locale='pt'] - Código do idioma.
 * @returns {Promise<string|null>} Conteúdo em texto Markdown.
 */
export const loadProjectMarkdown = loadRawMarkdown

/**
 * Pasta de um projeto no VFS: README.md (artigo) e info.json (metadados).
 */
function projectDir(slug) {
  return {
    type: VfsNodeType.DIR,
    children: {
      'README.md': {
        type: VfsNodeType.FILE,
        mime: VfsMimeType.TEXT_MARKDOWN,
        getContent: async (locale) => (await loadRawMarkdown(slug, locale)) || ''
      },
      'info.json': {
        type: VfsNodeType.FILE,
        mime: VfsMimeType.APPLICATION_JSON,
        getContent: (locale) => getProjectMetadataJson(slug, locale)
      }
    }
  }
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
        children: Object.fromEntries(getProjectSlugs().map((slug) => [slug, projectDir(slug)]))
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
