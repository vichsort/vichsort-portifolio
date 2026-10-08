import { projectView, allProjects, featuredProjects } from '@/core/content/projects.ts'
import { RULE, row } from '../../format.js'

const WIDTH = 13

/**
 * Comando 'projects'
 * Lista os projetos (só os destaques com --featured, filtrando por tecnologia com --stack) ou mostra a ficha de um projeto.
 */
export const projectsCommand = {
  name: 'projects',
  aliases: ['proj'],
  valueFlags: ['stack'],
  async execute(args, flags, { t, locale }) {
    const o = (key, params) => t(`terminal.output.projects.${key}`, params)

    // Ficha de um projeto (ex: projects plante)
    if (args.length) {
      const slug = args[0].toLowerCase()
      const project = projectView(slug, locale)
      if (!project) return { type: 'error', payload: o('not_found', { slug }) }

      const lines = [
        RULE,
        `${o('project')}: ${project.title} (${project.category || 'App'})`,
        RULE,
        row(o('period'), [project.date].flat().join(' — '), WIDTH),
        row(o('techs'), project.techs.join(', '), WIDTH)
      ]
      if (project.github) lines.push(row('GitHub', project.github, WIDTH))
      if (project.live) lines.push(row('Live Demo', project.live, WIDTH))
      lines.push('', `${o('summary').toUpperCase()}:`, project.summary || '', '', `${o('tip')}:`, `  ${o('tip_text', { slug })}`, RULE)

      return { type: 'text', payload: lines.join('\n') }
    }

    // Listagem: só os destaques com --featured, e filtro opcional por tecnologia (--stack=vue)
    const stack = typeof flags.stack === 'string' ? flags.stack.toLowerCase() : null
    const base = flags.featured ? featuredProjects(locale) : allProjects(locale)
    const projects = base.filter((p) => !stack || p.techs.some((tech) => tech.toLowerCase().includes(stack)))

    if (!projects.length) return { type: 'text', payload: o('no_match') }

    const lines = [RULE, o('list_title'), RULE]
    projects.forEach((p, idx) => {
      lines.push(`[${idx + 1}] ${p.title} (${p.category || 'App'})`)
      lines.push(`    ${row(o('techs'), p.techs.join(', '), WIDTH)}`)
      if (p.summary) lines.push(`    ${row(o('summary'), p.summary, WIDTH)}`)
      lines.push(`    ${row(o('command'), o('command_text', { slug: p.id }), WIDTH)}`, '')
    })
    lines.push(o('footer'), RULE)

    return { type: 'text', payload: lines.join('\n') }
  }
}
