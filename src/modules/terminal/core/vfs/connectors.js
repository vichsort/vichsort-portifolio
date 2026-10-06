import { EMAIL, SOCIALS } from '../../../../core/config/profile.js'

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
 */
export function getAboutStack(locale = 'pt') {
  const isEn = locale === 'en'

  return [
    '================================================================================',
    isEn ? 'CORE STACK & TECHNICAL ENVIRONMENT' : 'CORE STACK & AMBIENTE TÉCNICO',
    '================================================================================',
    `[${isEn ? 'Frontend Core' : 'Frontend Core'}]`,
    '  • Vue.js (Vue 3, Composition API, Pinia, Vue Router)',
    '  • TypeScript & JavaScript (ESNext)',
    '  • Vite & Module Federation',
    '  • Tailwind CSS & CSS Custom Properties (Tokens-First)',
    '',
    `[${isEn ? 'Backend & Data' : 'Backend & Dados'}]`,
    '  • Python (FastAPI, PyTorch, Edge AI)',
    '  • Node.js (Express, NestJS, REST APIs)',
    '  • PostgreSQL & PostGIS (Database Modeling & Spatial Analysis)',
    '  • Docker & Containerization',
    '  • Redis (Caching & Sessions)',
    '',
    `[${isEn ? 'Workflow & Environment' : 'Ambiente & Workflow'}]`,
    '  • Linux Mint / Debian (Bash, CLI Tools)',
    '  • VS Code & Neovim',
    '  • Git & GitHub Actions (CI/CD Pipelines)',
    '  • Nginx & Reverse Proxies',
    '  • Railway & Cloud Deployment',
    '================================================================================'
  ].join('\n')
}

/**
 * Conector: Linha do Tempo e Trajetória (about/timeline.txt)
 */
export function getAboutTimeline(locale = 'pt') {
  const msgs = getMessages(locale)
  const isEn = locale === 'en'
  const events = msgs?.about_page?.s5_timeline?.events || [
    {
      year: '2021',
      title: isEn ? 'Enrolled in Computer Science — UFSM' : 'Ingresso na Ciência da Computação — UFSM',
      organization: 'Universidade Federal de Santa Maria',
      tags: ['C', 'Algoritmos', 'Linux']
    },
    {
      year: '2022',
      title: isEn ? 'Research Fellow in GIS & Spatial Data' : 'Bolsista de Pesquisa em GIS & Dados Espaciais',
      organization: 'Laboratório de Computação Aplicada — UFSM',
      tags: ['PostGIS', 'Python', 'QGIS']
    },
    {
      year: '2023',
      title: isEn ? 'Fullstack Software Developer' : 'Desenvolvedor de Software Fullstack',
      organization: 'Projetos Comerciais & Soluções Web',
      tags: ['Vue.js', 'Python', 'PostgreSQL', 'Docker']
    },
    {
      year: '2024',
      title: isEn ? '1st Place Technical Award & Edge AI Research' : '1º Lugar Técnico & Pesquisa em Edge AI',
      organization: 'Simpósio Técnico / UFSM',
      tags: ['Edge AI', 'PyTorch', 'IoT']
    }
  ]

  const lines = [
    '================================================================================',
    isEn ? 'TIMELINE & PROFESSIONAL JOURNEY' : 'LINHA DO TEMPO & TRAJETÓRIA CONSOLIDADA',
    '================================================================================'
  ]

  for (const ev of events) {
    const year = ev.year || ev.date || ''
    const title = ev.title || ''
    const org = ev.organization || ''
    const desc = ev.description || ''
    const tags = Array.isArray(ev.tags) ? ev.tags.join(', ') : ''

    lines.push(`[${year}] ${title}`)
    if (org) lines.push(`       ${org}`)
    if (desc) lines.push(`       ${desc}`)
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
  const msgs = getMessages(locale)
  const isEn = locale === 'en'
  const certs = msgs?.certifications_page?.list || [
    {
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date: '2024',
      skills: ['AWS', 'Cloud Computing', 'IAM', 'Serverless'],
      credential_url: 'https://aws.amazon.com'
    },
    {
      name: 'Vue.js & Modern Frontend Architecture',
      issuer: 'Vue Mastery / Certification',
      date: '2024',
      skills: ['Vue.js', 'Vite', 'Pinia', 'Frontend Architecture'],
      credential_url: ''
    },
    {
      name: 'PostgreSQL High Performance & Modeling',
      issuer: 'Database Institute',
      date: '2023',
      skills: ['PostgreSQL', 'Query Optimization', 'Database Modeling'],
      credential_url: ''
    }
  ]

  const lines = [
    '================================================================================',
    isEn ? 'CERTIFICATIONS & CREDENTIALS' : 'CERTIFICAÇÕES & CREDENCIAIS TÉCNICAS',
    '================================================================================'
  ]

  for (const cert of certs) {
    const name = cert.name || ''
    const issuer = cert.issuer || ''
    const date = cert.date || ''
    const skills = Array.isArray(cert.skills) ? cert.skills.join(', ') : ''
    const url = cert.credential_url || ''

    lines.push(`• ${name} (${date})`)
    lines.push(`  ${isEn ? 'Issuer' : 'Emissor'}:     ${issuer}`)
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
  const msgs = getMessages(locale)
  const isEn = locale === 'en'
  const researches = msgs?.researches_page?.list || [
    {
      year: '2024',
      title: 'Mapeamento Digital e Salvaguarda do Patrimônio Arqueológico',
      category: 'Iniciação Científica & GIS',
      institution: 'UFSM — Universidade Federal de Santa Maria',
      authors: 'Vitor Mignoni, et al.',
      award: '1º Lugar — Apresentação Técnica',
      description: 'Desenvolvimento de plataforma interativa para catalogação espacial de sítios históricos e patrimônio cultural.',
      tags: ['GIS', 'PostGIS', 'Spatial Analysis', 'Vue.js']
    },
    {
      year: '2024',
      title: 'Otimização de Redes Neurais para Diagnóstico Foliar em Dispositivos Edge',
      category: 'Inteligência Artificial & Agritech',
      institution: 'UFSM — Núcleo de Computação Aplicada',
      authors: 'Vitor Mignoni, et al.',
      award: 'Menção Honrosa',
      description: 'Quantização e compressão de modelos computacionais para inferência de pragas em plantações diretamente no smartphone.',
      tags: ['Edge Computing', 'PyTorch', 'Computer Vision', 'Agritech']
    },
    {
      year: '2023',
      title: 'Análise de Desempenho e Eficiência Energética em Microserviços Distribuídos',
      category: 'Sistemas Distribuídos',
      institution: 'UFSM — Depto. de Ciência da Computação',
      authors: 'Vitor Mignoni, et al.',
      description: 'Estudo comparativo de consumo de recursos e latência em arquiteturas conteinerizadas utilizando Docker e Prometheus.',
      tags: ['Docker', 'Prometheus', 'Microservices', 'Go']
    }
  ]

  const lines = [
    '================================================================================',
    isEn ? 'RESEARCH PAPERS & SCIENTIFIC AWARDS' : 'PESQUISAS ACADÊMICAS & PREMIAÇÕES',
    '================================================================================'
  ]

  for (const r of researches) {
    const year = r.year || ''
    const title = r.title || ''
    const category = r.category || ''
    const inst = r.institution || ''
    const authors = r.authors || ''
    const award = r.award || ''
    const desc = r.description || ''
    const tags = Array.isArray(r.tags) ? r.tags.join(', ') : ''

    lines.push(`[${year}] ${title}`)
    lines.push(`  ${isEn ? 'Category' : 'Categoria'}:    ${category}`)
    lines.push(`  ${isEn ? 'Institution' : 'Instituição'}:  ${inst}`)
    lines.push(`  ${isEn ? 'Authors' : 'Autores'}:      ${authors}`)
    if (award) lines.push(`  🏆 ${isEn ? 'Award' : 'Premiação'}:    ${award}`)
    if (desc) lines.push(`  ${isEn ? 'Summary' : 'Resumo'}:       ${desc}`)
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

