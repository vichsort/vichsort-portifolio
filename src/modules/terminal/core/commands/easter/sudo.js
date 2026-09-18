/**
 * Comando 'sudo'
 * Easter egg clássico do Unix simulando falta de privilégios de superusuário.
 */
export const sudoCommand = {
  name: 'sudo',
  aliases: ['su', 'admin'],
  descriptionKey: 'terminal.commands.sudo.description',
  usageKey: 'terminal.commands.sudo.usage',
  async execute(args, flags, context) {
    const user = context.user?.value || 'vitor'
    return {
      type: 'error',
      payload: `${user} is not in the sudoers file. This incident will be reported.`
    }
  }
}

export default sudoCommand

