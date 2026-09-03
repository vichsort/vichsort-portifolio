import { TerminalError } from '../../errors/codes.js'
import { formatError } from '../../errors/formatter.js'
import { findClosestCommand } from '../../dispatcher/similarity.js'

/**
 * Comando 'help' / 'man'
 * Exibe a listagem de comandos disponíveis ou a documentação de um comando específico.
 */
export const helpCommand = {
  name: 'help',
  aliases: ['man'],
  descriptionKey: 'terminal.commands.help.description',
  usageKey: 'terminal.commands.help.usage',
  async execute(args, flags, context) {
    const { registry, t = (k) => k } = context

    if (!registry) {
      return {
        type: 'text',
        payload: 'vsh: catálogo de comandos indisponível'
      }
    }

    // Se o usuário passou um comando específico (ex: help ls)
    if (args.length > 0) {
      const targetName = args[0].toLowerCase()
      const targetCmd = registry.get(targetName)

      if (!targetCmd) {
        const availableNames = registry.getAllNames ? registry.getAllNames() : []
        const suggestion = findClosestCommand(targetName, availableNames, 2)
        return {
          type: 'error',
          payload: formatError(
            TerminalError.COMMAND_NOT_FOUND,
            { cmd: targetName, suggestion },
            t
          )
        }
      }

      const description = t(targetCmd.descriptionKey) || 'Sem descrição.'
      const usage = t(targetCmd.usageKey) || targetCmd.name
      const aliases = targetCmd.aliases && targetCmd.aliases.length > 0
        ? targetCmd.aliases.join(', ')
        : 'nenhum'

      const lines = [
        `MANUAL: ${targetCmd.name}`,
        '',
        `SINTAXE:`,
        `  ${usage}`,
        '',
        `DESCRIÇÃO:`,
        `  ${description}`,
        '',
        `ALIASES:`,
        `  ${aliases}`
      ]

      return {
        type: 'text',
        payload: lines.join('\n')
      }
    }

    // Listagem geral de todos os comandos registrados
    const commands = typeof registry.getAll === 'function'
      ? registry.getAll()
      : Array.from(registry.values || [])

    // Ordenar alfabeticamente
    commands.sort((a, b) => a.name.localeCompare(b.name))

    const lines = [
      'VSH (Vitor Shell) — v1.0.0',
      'Comandos disponíveis:',
      ''
    ]

    // Formatação em duas colunas alinhadas
    const maxLen = commands.reduce((max, c) => Math.max(max, (t(c.usageKey) || c.name).length), 0)
    const colWidth = Math.max(maxLen + 4, 22)

    for (const cmd of commands) {
      const usage = t(cmd.usageKey) || cmd.name
      const desc = t(cmd.descriptionKey) || ''
      const padding = ' '.repeat(Math.max(colWidth - usage.length, 2))
      lines.push(`  ${usage}${padding}${desc}`)
    }

    lines.push('')
    lines.push("Digite 'help <comando>' para detalhes e opções de sintaxe.")

    return {
      type: 'text',
      payload: lines.join('\n')
    }
  }
}

export default helpCommand

