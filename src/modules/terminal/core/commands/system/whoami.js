/**
 * Comando 'whoami'
 * Exibe o usuário ativo da sessão e perfil de engenharia.
 */
export const whoamiCommand = {
  name: 'whoami',
  aliases: [],
  descriptionKey: 'terminal.commands.whoami.description',
  usageKey: 'terminal.commands.whoami.usage',
  async execute(args, flags, context) {
    return {
      type: 'text',
      payload: 'vitor — Software Engineer & Computer Engineering Student'
    }
  }
}

export default whoamiCommand

