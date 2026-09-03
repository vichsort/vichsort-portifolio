/**
 * Comando 'clear'
 * Limpa o histórico de comandos da tela do terminal.
 */
export const clearCommand = {
  name: 'clear',
  aliases: ['cls'],
  descriptionKey: 'terminal.commands.clear.description',
  usageKey: 'terminal.commands.clear.usage',
  async execute(args, flags, context) {
    if (typeof context.clear === 'function') {
      context.clear()
    }
    return null
  }
}

export default clearCommand

