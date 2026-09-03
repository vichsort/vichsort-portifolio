import { VfsNodeType, VfsMimeType } from './types.js'

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
              if (i18n?.getAboutProfile) return i18n.getAboutProfile(locale)
              return 'Vitor — Software Engineer\nGraduando em Engenharia de Computação.\nFocado em arquitetura modular, Vue 3 e sistemas web escaláveis.'
            }
          },
          'stack.txt': {
            type: VfsNodeType.FILE,
            mime: VfsMimeType.TEXT_PLAIN,
            getContent: (locale) => {
              if (i18n?.getAboutStack) return i18n.getAboutStack(locale)
              return 'Frontend: Vue 3, Vite, TypeScript, JavaScript, CSS Tokens\nBackend: Node.js, Python, PostgreSQL, REST APIs\nTools: Docker, Git, Linux, Vimbo'
            }
          },
          'timeline.txt': {
            type: VfsNodeType.FILE,
            mime: VfsMimeType.TEXT_PLAIN,
            getContent: (locale) => {
              if (i18n?.getAboutTimeline) return i18n.getAboutTimeline(locale)
              return 'Trajetória profissional e acadêmica:\n• Desenvolvimento web & interfaces interativas\n• Pesquisa em visão computacional & automação'
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
                loader: (locale) => loadProjectMarkdown('plante', locale)
              },
              'info.json': {
                type: VfsNodeType.FILE,
                mime: VfsMimeType.APPLICATION_JSON,
                getContent: (locale) => {
                  if (projects?.getProjectMeta) return projects.getProjectMeta('plante', locale)
                  return JSON.stringify(
                    {
                      id: 'plante',
                      name: 'PlantE',
                      tags: ['Vue 3', 'Vite', 'Gemini AI', 'IoT'],
                      date: '2024'
                    },
                    null,
                    2
                  )
                }
              }
            }
          },
          cemiterio: {
            type: VfsNodeType.DIR,
            children: {
              'README.md': {
                type: VfsNodeType.FILE,
                mime: VfsMimeType.TEXT_MARKDOWN,
                loader: (locale) => loadProjectMarkdown('cemiterio', locale)
              }
            }
          },
          tera: {
            type: VfsNodeType.DIR,
            children: {
              'README.md': {
                type: VfsNodeType.FILE,
                mime: VfsMimeType.TEXT_MARKDOWN,
                loader: (locale) => loadProjectMarkdown('tera', locale)
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
              if (i18n?.getCertificationsList) return i18n.getCertificationsList(locale)
              return 'Certificações e credenciais técnicas ativas.'
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
              if (i18n?.getResearchesList) return i18n.getResearchesList(locale)
              return 'Artigos científicos e pesquisas acadêmicas publicadas.'
            }
          }
        }
      },
      'contact.txt': {
        type: VfsNodeType.FILE,
        mime: VfsMimeType.TEXT_PLAIN,
        getContent: (locale) => {
          if (i18n?.getContact) return i18n.getContact(locale)
          return 'E-mail: vitor@example.com\nGitHub: https://github.com\nLinkedIn: https://linkedin.com'
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
