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
    const isEn = locale === 'en'

    // Cenário 1: Consulta de projeto específico (ex: projects plante)
    if (args.length > 0) {
      const slug = args[0].toLowerCase()
      const project = await loadProjectContent(slug, locale)

      if (!project) {
        return {
          type: 'error',
          payload: isEn
            ? `vsh: projects: project '${slug}' not found.`
            : `vsh: projects: projeto '${slug}' não encontrado.`
        }
      }

      const { attributes } = project
      const techs = Array.isArray(attributes.techs) ? attributes.techs.join(', ') : ''
      const date = Array.isArray(attributes.date) ? attributes.date.join(' — ') : attributes.date || ''

      const lines = [
        '================================================================================',
        `${isEn ? 'PROJECT' : 'PROJETO'}: ${attributes.title || slug} (${attributes.category || 'App'})`,
        '================================================================================',
        `${isEn ? 'Timeline' : 'Período'}:     ${date}`,
        `${isEn ? 'Tech Stack' : 'Tecnologias'}: ${techs}`
      ]

      if (attributes.github) lines.push(`GitHub:       ${attributes.github}`)
      if (attributes.live) lines.push(`Live Demo:    ${attributes.live}`)

      lines.push('')
      lines.push(`${isEn ? 'SUMMARY' : 'RESUMO'}:`)
      lines.push(attributes.summary || '')
      lines.push('')
      lines.push(isEn ? 'TIP:' : 'DICA:')
      lines.push(isEn
        ? `  To read the full Markdown case study, run: cat projects/${slug}/README.md`
        : `  Para ler o artigo técnico completo em Markdown, execute: cat projects/${slug}/README.md`)
      lines.push('================================================================================')

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
        payload: isEn
          ? 'vsh: no projects match the specified filter.'
          : 'vsh: nenhum projeto corresponde ao filtro informado.'
      }
    }

    const lines = [
      '================================================================================',
      isEn ? 'FEATURED ENGINEERING PROJECTS' : 'PROJETOS DE ENGENHARIA EM DESTAQUE',
      '================================================================================'
    ]

    filtered.forEach((p, idx) => {
      const techs = Array.isArray(p.techs) ? p.techs.join(', ') : ''
      lines.push(`[${idx + 1}] ${p.title || p.id} (${p.category || 'App'})`)
      lines.push(`    ${isEn ? 'Techs' : 'Tecnologias'}: ${techs}`)
      if (p.summary) lines.push(`    ${isEn ? 'Summary' : 'Resumo'}:      ${p.summary}`)
      lines.push(`    ${isEn ? 'Command' : 'Comando'}:     projects ${p.id}  (ou: cat projects/${p.id}/README.md)`)
      lines.push('')
    })

    lines.push(isEn
      ? "Run 'projects <name>' for details, or 'cat projects/<name>/README.md' for the case study."
      : "Execute 'projects <nome>' para detalhes, ou 'cat projects/<nome>/README.md' para o artigo.")
    lines.push('================================================================================')

    return {
      type: 'text',
      payload: lines.join('\n')
    }
  }
}

export default projectsCommand

