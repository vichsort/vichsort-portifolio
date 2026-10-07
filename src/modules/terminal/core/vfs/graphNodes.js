import { content } from '../../../../core/content/index.js'
import { replaceBodyLinks } from '../../../../core/content/links.js'
import { TYPES } from '../../../../core/content/schema.js'
import { translator } from './connectors.js'

// Tipos do grafo que viram pastas próprias no VFS, com um <id>.md por nó
export const GRAPH_DIR_TYPES = ['tech', 'topic', 'role', 'timeline']

/**
 * Caminho no VFS onde o nó aparece, ou null se ele não tem arquivo.
 *
 * @param {string} id
 * @returns {string|null}
 */
export function nodePath(id) {
  const node = content.node(id)
  if (!node) return null
  if (GRAPH_DIR_TYPES.includes(node.type)) return `/${TYPES[node.type].folder}/${id}.md`
  if (node.type === 'project') return `/projects/${id}/README.md`
  if (node.type === 'certification') return '/certifications/list.txt'
  if (node.type === 'research') return '/researches/list.txt'
  return null
}

/**
 * Corpo em texto: wikilinks viram o rótulo (ou o nome do nó) e embeds somem.
 *
 * @param {string} body
 * @param {string} locale
 * @returns {string}
 */
export function plainBody(body, locale) {
  const label = (target) => {
    const id = content.resolve(target)
    return id ? content.label(id, locale) : target
  }
  return replaceBodyLinks(body || '', (target, alias, embed) => (embed ? '' : alias || label(target)))
}

/**
 * Ligações do nó nos dois sentidos, como [rótulo do tipo, nomes] na ordem dos tipos do schema.
 *
 * @param {string} id
 * @param {string} locale
 * @returns {{ outgoing: Array<[string, string[]]>, incoming: Array<[string, string[]]> }}
 */
function linkGroups(id, locale) {
  const t = translator(locale)
  const toRows = (grouped) =>
    Object.keys(TYPES)
      .filter((type) => grouped[type]?.length)
      .map((type) => [t(`terminal.output.links.types.${type}`), grouped[type].map((n) => content.label(n.id, locale))])

  return {
    outgoing: toRows(content.outlinks(id, { lang: locale })),
    incoming: toRows(content.backlinks(id, { lang: locale }))
  }
}

/**
 * Arquivo Markdown de um nó do grafo: nome, resumo, corpo e as ligações.
 *
 * @param {string} id
 * @param {string} [locale='pt']
 * @returns {string}
 */
export function getNodeMarkdown(id, locale = 'pt') {
  const t = translator(locale)
  const node = content.node(id)
  const text = content.text(id, locale)
  const fallback = content.fallback(id, locale)
  const lead = text.definition || text.description || text.summary
  const meta = [[node.data.date].flat().filter(Boolean).join(' — '), text.organization].filter(Boolean).join(' · ')
  const { outgoing, incoming } = linkGroups(id, locale)

  const section = (title, rows) =>
    [`## ${title}`, ...(rows.length ? rows.map(([type, names]) => `- **${type}**: ${names.join(', ')}`) : [`_${t('terminal.output.links.none')}_`])].join('\n')

  return [
    `# ${content.label(id, locale)}`,
    fallback ? `_${t('common.untranslated', { lang: t(`languages.${fallback}`) })}_` : '',
    meta,
    lead ? `> ${lead}` : '',
    text.note || '',
    plainBody(text.body, locale).trim(),
    section(t('terminal.output.links.outgoing'), outgoing),
    section(t('terminal.output.links.incoming'), incoming)
  ]
    .filter(Boolean)
    .join('\n\n')
}

/**
 * Saída em texto do comando links: para onde o nó aponta e quem aponta para ele.
 *
 * @param {string} id
 * @param {string} [locale='pt']
 * @returns {string}
 */
export function getNodeLinksText(id, locale = 'pt') {
  const t = translator(locale)
  const { outgoing, incoming } = linkGroups(id, locale)
  const path = nodePath(id)
  const width = Math.max(0, ...[...outgoing, ...incoming].map(([type]) => type.length)) + 1

  const block = (arrow, title, rows) => [
    `${arrow} ${title}`,
    ...(rows.length
      ? rows.map(([type, names]) => `    ${`${type}:`.padEnd(width)} ${names.join(', ')}`)
      : [`    ${t('terminal.output.links.none')}`])
  ]

  return [
    `${content.label(id, locale)}${path ? `  (${path})` : ''}`,
    '',
    ...block('→', t('terminal.output.links.outgoing'), outgoing),
    '',
    ...block('←', t('terminal.output.links.incoming'), incoming)
  ].join('\n')
}
