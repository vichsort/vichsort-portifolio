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
 * Obtém os dicionários mesclados do idioma solicitado.
 *
 * @param {string} [locale='pt'] - Idioma ativo ('pt' ou 'en').
 * @returns {Object|null} Objeto raiz de mensagens i18n.
 */
function getMessages(locale = 'pt') {
  if (!i18nInstance) return null
  const loc = locale === 'en' ? 'en' : 'pt'
  if (i18nInstance.global?.messages?.value) {
    return i18nInstance.global.messages.value[loc] || i18nInstance.global.messages.value.pt
  }
  if (i18nInstance.global?.messages) {
    return i18nInstance.global.messages[loc] || i18nInstance.global.messages.pt
  }
  return null
}

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
  const msgs = getMessages(locale)
  const isEn = locale === 'en'
  const about = msgs?.about_page

  const name = about?.s1_profile?.name || 'Vitor Mignoni'
  const role = about?.s1_profile?.role || (isEn ? 'Software Engineer — Fullstack & Systems' : 'Software Engineer — Fullstack & Sistemas')
  const location = about?.s1_profile?.location || (isEn ? 'Santa Maria, RS — Brazil' : 'Santa Maria, RS — Brasil')
  const education = about?.s1_profile?.education || (isEn ? 'Computer Science — UFSM' : 'Ciência da Computação — UFSM')
  const bio = about?.s1_profile?.bio_short || (isEn
    ? 'Software engineer focused on decoupled systems, reactive interfaces, and domain-driven architectures.'
    : 'Engenheiro de software focado em sistemas desacoplados, interfaces reativas e arquiteturas orientadas a domínio.')

  const specOs = about?.s3_readme?.spec_os || 'OS: Linux Mint (Cinnamon / Debian)'
  const specEditor = about?.s3_readme?.spec_editor || 'Editor: VS Code & CLI Tools'
  const specFocus = about?.s3_readme?.spec_focus || 'Focus: Modular Architecture & Web Systems'

  const p1 = about?.s3_readme?.readme_pillar_1 || 'Offline-First & Resilience'
  const p2 = about?.s3_readme?.readme_pillar_2 || 'Domain-Driven Architecture'
  const p3 = about?.s3_readme?.readme_pillar_3 || 'Performance & Accessibility'
  const p4 = about?.s3_readme?.readme_pillar_4 || 'Technical Pragmatism'

  return [
    '================================================================================',
    `${name.toUpperCase()} — ${role}`,
    '================================================================================',
    `${isEn ? 'Location' : 'Localização'}: ${location}`,
    `${isEn ? 'Education' : 'Formação'}:    ${education}`,
    '',
    `${isEn ? 'ABOUT' : 'SOBRE'}:`,
    bio,
    '',
    `${isEn ? 'WORKFLOW & ENVIRONMENT' : 'AMBIENTE & ESPECIFICAÇÕES'}:`,
    `• ${specOs}`,
    `• ${specEditor}`,
    `• ${specFocus}`,
    '',
    `${isEn ? 'ENGINEERING PHILOSOPHY' : 'FILOSOFIA DE ENGENHARIA'}:`,
    `• ${p1}`,
    `• ${p2}`,
    `• ${p3}`,
    `• ${p4}`,
    '================================================================================'
  ].join('\n')
}

/**
 * Conector: Matriz de Tecnologias e Ferramentas (about/stack.txt)
 * Lê a coleção about-stack do grafo de conteúdo.
 */
export function getAboutStack(locale = 'pt') {
  const isEn = locale === 'en'
  const lines = [
    '================================================================================',
    isEn ? 'CORE STACK & TECHNICAL ENVIRONMENT' : 'CORE STACK & AMBIENTE TÉCNICO',
    '================================================================================'
  ]

  content.collection('about-stack').forEach(({ group, items }, i) => {
    if (i > 0) lines.push('')
    if (group) lines.push(`[${content.label(group.id, locale)}]`)
    for (const tech of items) lines.push(`  • ${content.label(tech.id, locale)}`)
  })

  lines.push('================================================================================')
  return lines.join('\n')
}

/**
 * Conector: Linha do Tempo e Trajetória (about/timeline.txt)
 */
export function getAboutTimeline(locale = 'pt') {
  const isEn = locale === 'en'
  const lines = [
    '================================================================================',
    isEn ? 'TIMELINE & PROFESSIONAL JOURNEY' : 'LINHA DO TEMPO & TRAJETÓRIA CONSOLIDADA',
    '================================================================================'
  ]

  for (const event of content.ofType('timeline')) {
    const text = content.text(event.id, locale)
    const tags = linkedLabels(event.id, locale)

    lines.push(`[${event.data.date}] ${text.title || event.id}`)
    if (text.organization) lines.push(`       ${text.organization}`)
    if (text.description) lines.push(`       ${text.description}`)
    if (tags) lines.push(`       Tags: ${tags}`)
    lines.push('')
  }

  lines.push('================================================================================')
  return lines.join('\n')
}

/**
 * Conector: Lista de Certificações (certifications/list.txt)
 */
export function getCertificationsList(locale = 'pt') {
  const isEn = locale === 'en'
  const lines = [
    '================================================================================',
    isEn ? 'CERTIFICATIONS & CREDENTIALS' : 'CERTIFICAÇÕES & CREDENCIAIS TÉCNICAS',
    '================================================================================'
  ]

  for (const cert of content.ofType('certification', { recent: true })) {
    const name = content.text(cert.id, locale).name || cert.id
    const skills = linkedLabels(cert.id, locale)
    const url = cert.data.credential_url || ''

    lines.push(`• ${name} (${cert.data.date})`)
    lines.push(`  ${isEn ? 'Issuer' : 'Emissor'}:     ${cert.data.issuer}`)
    if (skills) lines.push(`  ${isEn ? 'Skills' : 'Habilidades'}: ${skills}`)
    if (url) lines.push(`  ${isEn ? 'Credential' : 'Credencial'}: ${url}`)
    lines.push('')
  }

  lines.push('================================================================================')
  return lines.join('\n')
}

/**
 * Conector: Lista de Pesquisas e Artigos (researches/list.txt)
 */
export function getResearchesList(locale = 'pt') {
  const isEn = locale === 'en'
  const lines = [
    '================================================================================',
    isEn ? 'RESEARCH PAPERS & SCIENTIFIC AWARDS' : 'PESQUISAS ACADÊMICAS & PREMIAÇÕES',
    '================================================================================'
  ]

  for (const r of content.ofType('research', { recent: true })) {
    const text = content.text(r.id, locale)
    const topics = content.linked(r.id, 'topics').map((id) => content.label(id, locale)).join(', ')
    const tags = linkedLabels(r.id, locale)

    lines.push(`[${r.data.date}] ${text.title || r.id}`)
    if (topics) lines.push(`  ${isEn ? 'Topics' : 'Tópicos'}:      ${topics}`)
    if (text.institution) lines.push(`  ${isEn ? 'Institution' : 'Instituição'}:  ${text.institution}`)
    if (r.data.authors) lines.push(`  ${isEn ? 'Authors' : 'Autores'}:      ${r.data.authors}`)
    if (text.award) lines.push(`  🏆 ${isEn ? 'Award' : 'Premiação'}:    ${text.award}`)
    if (text.description) lines.push(`  ${isEn ? 'Summary' : 'Resumo'}:       ${text.description}`)
    if (tags) lines.push(`  Tags:         ${tags}`)
    lines.push('')
  }

  lines.push('================================================================================')
  return lines.join('\n')
}

/**
 * Conector: Informações de Contato (contact.txt)
 */
export function getContact(locale = 'pt') {
  const isEn = locale === 'en'

  return [
    '================================================================================',
    isEn ? 'DIRECT CONTACT & PROFESSIONAL NETWORKS' : 'CANAIS DE CONTATO & REDES PROFISSIONAIS',
    '================================================================================',
    `E-mail:   ${EMAIL}`,
    ...SOCIALS.map(social => `${`${social.label}:`.padEnd(10)}${social.id === 'telegram' ? social.handle : social.url}`),
    '',
    isEn
      ? 'Always open to new projects, technical collaborations, and engineering challenges.'
      : 'Aberto a novas oportunidades, colaborações técnicas e desafios de engenharia.',
    '================================================================================'
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

