import { commandNotFound } from '../../dispatcher/dispatcher.js'

// Textos de um comando, por convenção em terminal.commands.<nome>
const usageOf = (cmd, t) => t(`terminal.commands.${cmd.name}.usage`)
const descriptionOf = (cmd, t) => t(`terminal.commands.${cmd.name}.description`)

/**
 * Comando 'help' / 'man'
 * Sem argumento, lista os comandos; com um nome, mostra o manual dele.
 */
export const helpCommand = {
  name: 'help',
  aliases: ['man'],
  async execute(args, flags, context) {
    const { registry, t } = context
    const o = (key) => t(`terminal.output.help.${key}`)

    if (args.length) {
      const cmd = registry.get(args[0])
      if (!cmd) return commandNotFound(args[0].toLowerCase(), context)

      const lines = [
        `${o('manual')}: ${cmd.name}`,
        '',
        `${o('usage')}:`,
        `  ${usageOf(cmd, t)}`,
        '',
        `${o('description')}:`,
        `  ${descriptionOf(cmd, t)}`,
        '',
        `${o('aliases')}:`,
        `  ${cmd.aliases?.join(', ') || o('no_aliases')}`
      ]
      return { type: 'text', payload: lines.join('\n') }
    }

    // Duas colunas: uso alinhado e descrição
    const commands = registry.getAll().sort((a, b) => a.name.localeCompare(b.name))
    const usages = commands.map((cmd) => usageOf(cmd, t))
    const width = Math.max(22, ...usages.map((usage) => usage.length + 4))

    const lines = [
      t('terminal.welcome'),
      o('title'),
      '',
      ...commands.map((cmd, i) => `  ${usages[i].padEnd(width)}${descriptionOf(cmd, t)}`),
      '',
      o('footer')
    ]
    return { type: 'text', payload: lines.join('\n') }
  }
}
