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

export { LANGS, REQUIRED_LANGS }

const CONCEPT_LINKS = { techs: 'tech', topics: 'topic' }
const CONTENT_LINKS = { techs: 'tech', topics: 'topic', roles: 'role' }

export const TYPES = {
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
  collection: {
    folder: 'collections',
    required: ['items']
  }
}

export const TYPE_BY_FOLDER = Object.fromEntries(
  Object.entries(TYPES).map(([type, def]) => [def.folder, type])
)

// Todo campo que, em qualquer tipo, carrega ligações. Usado para acusar
// ligações em tipos que não as aceitam.
export const LINK_FIELDS = ['techs', 'topics', 'roles', 'category', 'link', 'items']
