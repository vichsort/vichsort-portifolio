/**
 * Comando 'date'
 * Exibe a data, horário e fuso horário atuais.
 */
export const dateCommand = {
  name: 'date',
  aliases: [],
  descriptionKey: 'terminal.commands.date.description',
  usageKey: 'terminal.commands.date.usage',
  async execute(args, flags, context) {
    const now = new Date()
    return {
      type: 'text',
      payload: now.toString()
    }
  }
}

export default dateCommand

