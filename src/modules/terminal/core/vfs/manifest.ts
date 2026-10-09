import { VfsNodeType, VfsMimeType, type VfsDir, type VfsFile, type VfsMime, type VfsNode } from './types.ts'
import type { NodeType } from '../../../../core/content/types.ts'
import {
  getAboutProfile,
  getAboutStack,
  getAboutTimeline,
  getCertificationsList,
  getResearchesList,
  getContact
} from './connectors.ts'
import { getProjectSlugs, loadRawMarkdown, getProjectMetadataJson } from './projectsLoader.ts'
import { GRAPH_DIR_TYPES, getNodeMarkdown } from './graphNodes.ts'
import { content } from '../../../../core/content/index.ts'
import { TYPES } from '../../../../core/content/schema.ts'
import { hasResume } from '../resume.ts'

// Arquivo com conteúdo gerado no idioma pedido: getContent(locale) => string
type GetContent = (locale: string) => string

const file = (mime: VfsMime, getContent: GetContent): VfsFile => ({ type: VfsNodeType.FILE, mime, getContent })
const text = (getContent: GetContent) => file(VfsMimeType.TEXT_PLAIN, getContent)
const markdown = (getContent: GetContent) => file(VfsMimeType.TEXT_MARKDOWN, getContent)
const dir = (children: Record<string, VfsNode>): VfsDir => ({ type: VfsNodeType.DIR, children })

/**
 * Pasta de um tipo do grafo (techs/, topics/...): um <id>.md por nó, com texto e ligações.
 */
const graphDir = (type: NodeType) =>
  dir(Object.fromEntries(content.ofType(type).map(({ id }) => [`${id}.md`, markdown((locale) => getNodeMarkdown(id, locale))])))

/**
 * Pasta de um projeto no VFS: README.md (artigo) e info.json (metadados).
 */
const projectDir = (slug: string) =>
  dir({
    'README.md': markdown((locale) => loadRawMarkdown(slug, locale) || ''),
    'info.json': file(VfsMimeType.APPLICATION_JSON, (locale) => getProjectMetadataJson(slug, locale))
  })

/**
 * Cria a árvore declarativa do Virtual File System (VFS).
 *
 * @returns Árvore de nós a partir da raiz '/'.
 */
export function createVfsManifest(): VfsDir {
  return dir({
    about: dir({
      'profile.txt': text(getAboutProfile),
      'stack.txt': text(getAboutStack),
      'timeline.txt': text(getAboutTimeline)
    }),
    projects: dir(Object.fromEntries(getProjectSlugs().map((slug) => [slug, projectDir(slug)]))),
    certifications: dir({ 'list.txt': text(getCertificationsList) }),
    researches: dir({ 'list.txt': text(getResearchesList) }),
    ...Object.fromEntries(GRAPH_DIR_TYPES.map((type) => [TYPES[type].folder, graphDir(type)])),
    'contact.txt': text(getContact),
    // Sem conteúdo: o cat avisa que é binário e aponta para o comando resume. Só aparece com algum PDF
    ...(hasResume && { 'resume.pdf': { type: VfsNodeType.FILE, mime: VfsMimeType.APPLICATION_PDF } })
  })
}
