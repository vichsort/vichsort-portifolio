/**
 * Esquema do grafo de conteúdo (ver GRAPH.md, seção 4).
 *
 * Cada tipo declara:
 * - folder: pasta em src/content/
 * - required: campos obrigatórios na estrutura (<id>.md)
 * - requiredText: campos obrigatórios em cada idioma (<id>.<lang>.md)
 * - links: campos de ligação múltipla aceitos → tipo de destino
 * - single: campos de ligação única aceitos → tipo de destino ('*' = qualquer)
 * - enums: valores aceitos por campo
 */

import { LANGS, REQUIRED_LANGS } from '../i18n/languages.js'
import type { NodeType, TypeDef } from './types.ts'

export { LANGS, REQUIRED_LANGS }

const CONCEPT_LINKS: Record<string, NodeType> = { techs: 'tech', topics: 'topic' }
const CONTENT_LINKS: Record<string, NodeType> = { techs: 'tech', topics: 'topic', roles: 'role' }

export const TYPES: Record<NodeType, TypeDef> = {
  tech: {
    folder: 'techs',
    required: ['name'],
    links: CONCEPT_LINKS
  },
  topic: {
    folder: 'topics',
    requiredText: ['name'],
    links: CONCEPT_LINKS
  },
  role: {
    folder: 'roles',
    requiredText: ['name'],
    links: CONCEPT_LINKS
  },
  category: {
    folder: 'categories',
    requiredText: ['name']
  },
  group: {
    folder: 'groups',
    requiredText: ['name']
  },
  project: {
    folder: 'projects',
    required: ['category', 'date'],
    requiredText: ['title', 'summary'],
    links: CONTENT_LINKS,
    single: { category: 'category' }
  },
  certification: {
    folder: 'certifications',
    required: ['issuer', 'date'],
    requiredText: ['name'],
    links: CONTENT_LINKS
  },
  research: {
    folder: 'researches',
    required: ['date'],
    requiredText: ['title'],
    links: CONTENT_LINKS
  },
  timeline: {
    folder: 'timeline',
    required: ['date', 'kind'],
    requiredText: ['title'],
    links: CONTENT_LINKS,
    single: { link: '*' },
    enums: { kind: ['education', 'work', 'research', 'project'] }
  },
  photo: {
    folder: 'gallery',
    required: ['date'],
    requiredText: ['title'],
    links: CONTENT_LINKS,
    single: { link: '*' },
    // Formato na grade do Sobre (bento); a página da galeria usa o tamanho escolhido
    enums: { format: ['portrait', 'landscape', 'square'] }
  },
  collection: {
    folder: 'collections',
    required: ['items']
  }
}

// Origem do conteúdo de um nó (campo `source`, opcional em qualquer tipo).
// placeholder: texto provisório; auto-generated: gerado por IA a partir do GitHub.
export const SOURCES: string[] = ['placeholder', 'auto-generated']

export const TYPE_BY_FOLDER: Record<string, NodeType> = Object.fromEntries(
  Object.entries(TYPES).map(([type, def]) => [def.folder, type as NodeType])
)

// Todo campo que, em qualquer tipo, carrega ligações. Usado para acusar
// ligações em tipos que não as aceitam.
export const LINK_FIELDS: string[] = ['techs', 'topics', 'roles', 'category', 'link', 'items']
