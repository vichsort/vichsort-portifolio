import { projectView, allProjects } from '../../../../../core/content/projects.js'

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
      const project = projectView(slug, locale)

      if (!project) {
        return {
          type: 'error',
          payload: o('not_found', { slug })
        }
      }

      const techs = project.techs.join(', ')
      const date = [project.date].flat().join(' — ')

      const lines = [
        RULE,
        `${o('project')}: ${project.title} (${project.category || 'App'})`,
        RULE,
        row(o('period'), date),
        row(o('techs'), techs)
      ]

      if (project.github) lines.push(row('GitHub', project.github))
      if (project.live) lines.push(row('Live Demo', project.live))

      lines.push('')
      lines.push(`${o('summary').toUpperCase()}:`)
      lines.push(project.summary || '')
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
    const all = allProjects(locale)
    let filtered = all

    // Filtro por tecnologia (--stack=vue)
    if (flags.stack && typeof flags.stack === 'string') {
      const query = flags.stack.toLowerCase()
      filtered = filtered.filter((p) => p.techs.some((t) => t.toLowerCase().includes(query)))
    }

    if (filtered.length === 0) {
      return {
        type: 'text',
        payload: o('no_match')
      }
    }

    const lines = [RULE, o('list_title'), RULE]

    filtered.forEach((p, idx) => {
      lines.push(`[${idx + 1}] ${p.title} (${p.category || 'App'})`)
      lines.push(`    ${row(o('techs'), p.techs.join(', '))}`)
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

