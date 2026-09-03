/**
 * Comando 'echo'
 * Imprime texto fornecido como argumento na saída padrão.
 */
export const echoCommand = {
  name: 'echo',
  aliases: [],
  descriptionKey: 'terminal.commands.echo.description',
  usageKey: 'terminal.commands.echo.usage',
  async execute(args, flags, context) {
    return {
      type: 'text',
      payload: args.join(' ')
    }
  }
}

export default echoCommand

