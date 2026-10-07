import { loadProjectContent, getAllProjects } from '../../vfs/projectsLoader.js'

/**
 * Comando 'projects'
 * Lista os projetos do portfólio com filtros ou exibe a ficha técnica de um projeto.
 */
export const projectsCommand = {
  name: 'projects',
  aliases: ['proj'],
  descriptionKey: 'terminal.commands.projects.description',
  usageKey: 'terminal.commands.projects.usage',
  async execute(args, flags, context) {
    const { globalState, i18n } = context
    const locale = globalState?.locale?.value || i18n?.global?.locale?.value || 'pt'
    const o = (key, params) => context.t(`terminal.output.projects.${key}`, params)
    const RULE = '='.repeat(80)
    const row = (label, value, width = 13) => `${`${label}:`.padEnd(width)} ${value}`

    // Cenário 1: Consulta de projeto específico (ex: projects plante)
    if (args.length > 0) {
      const slug = args[0].toLowerCase()
      const project = await loadProjectContent(slug, locale)

      if (!project) {
        return {
          type: 'error',
          payload: o('not_found', { slug })
        }
      }

      const { attributes } = project
      const techs = Array.isArray(attributes.techs) ? attributes.techs.join(', ') : ''
      const date = Array.isArray(attributes.date) ? attributes.date.join(' — ') : attributes.date || ''

      const lines = [
        RULE,
        `${o('project')}: ${attributes.title || slug} (${attributes.category || 'App'})`,
        RULE,
        row(o('period'), date),
        row(o('techs'), techs)
      ]

      if (attributes.github) lines.push(row('GitHub', attributes.github))
      if (attributes.live) lines.push(row('Live Demo', attributes.live))

      lines.push('')
      lines.push(`${o('summary').toUpperCase()}:`)
      lines.push(attributes.summary || '')
      lines.push('')
      lines.push(`${o('tip')}:`)
      lines.push(`  ${o('tip_text', { slug })}`)
      lines.push(RULE)

      return {
        type: 'text',
        payload: lines.join('\n')
      }
    }

    // Cenário 2: Listagem geral de projetos com filtros opcionais
    const all = await getAllProjects(locale)
    let filtered = all

    // Filtro por tecnologia (--stack=vue)
    if (flags.stack && typeof flags.stack === 'string') {
      const query = flags.stack.toLowerCase()
      filtered = filtered.filter((p) => {
        const techs = Array.isArray(p.techs) ? p.techs : []
        return techs.some((t) => t.toLowerCase().includes(query))
      })
    }

    if (filtered.length === 0) {
      return {
        type: 'text',
        payload: o('no_match')
      }
    }

    const lines = [RULE, o('list_title'), RULE]

    filtered.forEach((p, idx) => {
      const techs = Array.isArray(p.techs) ? p.techs.join(', ') : ''
      lines.push(`[${idx + 1}] ${p.title || p.id} (${p.category || 'App'})`)
      lines.push(`    ${row(o('techs'), techs)}`)
      if (p.summary) lines.push(`    ${row(o('summary'), p.summary)}`)
      lines.push(`    ${row(o('command'), o('command_text', { slug: p.id }))}`)
      lines.push('')
    })

    lines.push(o('footer'))
    lines.push(RULE)

    return {
      type: 'text',
      payload: lines.join('\n')
    }
  }
}

export default projectsCommand

