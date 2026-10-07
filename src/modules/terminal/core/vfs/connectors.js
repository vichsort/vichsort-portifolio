import { EMAIL, SOCIALS } from '../../../../core/config/profile.js'
import { content } from '../../../../core/content/index.js'

let i18nInstance = null

// Tentativa segura de carregar o singleton do i18n
try {
  const mod = await import('../../../../core/i18n/index.js')
  i18nInstance = mod.default
} catch {
  // Ambiente de teste Node puro sem polyfill do Vite
}

/**
 * Tradução num idioma explícito (o VFS recebe o idioma por parâmetro).
 * Sem i18n carregado, devolve a própria chave.
 *
 * @param {string} locale
 * @returns {(key: string, params?: Object) => string}
 */
function translator(locale) {
  return (key, params = {}) => (i18nInstance ? i18nInstance.global.t(key, params, { locale }) : key)
}

const RULE = '='.repeat(80)

// "Rótulo:" alinhado numa coluna fixa, seguido do valor
const row = (label, value, width = 14) => `${`${label}:`.padEnd(width)} ${value}`

// Nomes das techs e tópicos ligados a um nó, separados por vírgula
function linkedLabels(id, locale) {
  return [...content.linked(id, 'techs'), ...content.linked(id, 'topics')]
    .map((target) => content.label(target, locale))
    .join(', ')
}

/**
 * Conector: Perfil biográfico e especificações (about/profile.txt)
 */
export function getAboutProfile(locale = 'pt') {
  const t = translator(locale)
  const p = (key) => t(`about_page.s1_profile.${key}`)
  const r = (key) => t(`about_page.s3_readme.${key}`)
  const o = (key) => t(`terminal.output.about.${key}`)

  return [
    RULE,
    `${p('name').toUpperCase()} — ${p('role')}`,
    RULE,
    row(o('location'), p('location'), 12),
    row(o('education'), p('education'), 12),
    '',
    `${o('about')}:`,
    p('bio_short'),
    '',
    `${o('environment')}:`,
    `• ${r('spec_os')}`,
    `• ${r('spec_editor')}`,
    `• ${r('spec_focus')}`,
    '',
    `${o('philosophy')}:`,
    ...[1, 2, 3, 4].map((n) => `• ${r(`readme_pillar_${n}`)}`),
    RULE
  ].join('\n')
}

/**
 * Conector: Matriz de Tecnologias e Ferramentas (about/stack.txt)
 * Lê a coleção about-stack do grafo de conteúdo.
 */
export function getAboutStack(locale = 'pt') {
  const t = translator(locale)
  const lines = [RULE, t('terminal.output.stack.title'), RULE]

  content.collection('about-stack').forEach(({ group, items }, i) => {
    if (i > 0) lines.push('')
    if (group) lines.push(`[${content.label(group.id, locale)}]`)
    for (const tech of items) lines.push(`  • ${content.label(tech.id, locale)}`)
  })

  lines.push(RULE)
  return lines.join('\n')
}

/**
 * Conector: Linha do Tempo e Trajetória (about/timeline.txt)
 */
export function getAboutTimeline(locale = 'pt') {
  const t = translator(locale)
  const lines = [RULE, t('terminal.output.timeline.title'), RULE]

  for (const event of content.ofType('timeline')) {
    const text = content.text(event.id, locale)
    const tags = linkedLabels(event.id, locale)

    lines.push(`[${event.data.date}] ${text.title || event.id}`)
    if (text.organization) lines.push(`       ${text.organization}`)
    if (text.description) lines.push(`       ${text.description}`)
    if (tags) lines.push(`       Tags: ${tags}`)
    lines.push('')
  }

  lines.push(RULE)
  return lines.join('\n')
}

/**
 * Conector: Lista de Certificações (certifications/list.txt)
 */
export function getCertificationsList(locale = 'pt') {
  const t = translator(locale)
  const o = (key) => t(`terminal.output.certifications.${key}`)
  const lines = [RULE, o('title'), RULE]

  for (const cert of content.ofType('certification', { recent: true })) {
    const name = content.text(cert.id, locale).name || cert.id
    const skills = linkedLabels(cert.id, locale)
    const url = cert.data.credential_url || ''

    lines.push(`• ${name} (${cert.data.date})`)
    lines.push(`  ${row(o('issuer'), cert.data.issuer)}`)
    if (skills) lines.push(`  ${row(o('skills'), skills)}`)
    if (url) lines.push(`  ${row(o('credential'), url)}`)
    lines.push('')
  }

  lines.push(RULE)
  return lines.join('\n')
}

/**
 * Conector: Lista de Pesquisas e Artigos (researches/list.txt)
 */
export function getResearchesList(locale = 'pt') {
  const t = translator(locale)
  const o = (key) => t(`terminal.output.researches.${key}`)
  const lines = [RULE, o('title'), RULE]

  for (const r of content.ofType('research', { recent: true })) {
    const text = content.text(r.id, locale)
    const topics = content.linked(r.id, 'topics').map((id) => content.label(id, locale)).join(', ')
    const tags = linkedLabels(r.id, locale)

    lines.push(`[${r.data.date}] ${text.title || r.id}`)
    if (topics) lines.push(`  ${row(o('topics'), topics)}`)
    if (text.institution) lines.push(`  ${row(o('institution'), text.institution)}`)
    if (r.data.authors) lines.push(`  ${row(o('authors'), r.data.authors)}`)
    if (text.award) lines.push(`  🏆 ${row(o('award'), text.award, 11)}`)
    if (text.description) lines.push(`  ${row(o('summary'), text.description)}`)
    if (tags) lines.push(`  ${row('Tags', tags)}`)
    lines.push('')
  }

  lines.push(RULE)
  return lines.join('\n')
}

/**
 * Conector: Informações de Contato (contact.txt)
 */
export function getContact(locale = 'pt') {
  const t = translator(locale)

  return [
    RULE,
    t('terminal.output.contact.title'),
    RULE,
    row('E-mail', EMAIL, 9),
    ...SOCIALS.map((social) => row(social.label, social.id === 'telegram' ? social.handle : social.url, 9)),
    '',
    t('terminal.output.contact.closing'),
    RULE
  ].join('\n')
}

export default {
  getAboutProfile,
  getAboutStack,
  getAboutTimeline,
  getCertificationsList,
  getResearchesList,
  getContact
}

