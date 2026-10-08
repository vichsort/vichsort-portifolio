import type { Command } from '../../types.ts'

/**
 * Comando 'sudo'
 * Easter egg clássico do Unix simulando falta de privilégios de superusuário.
 */
export const sudoCommand: Command = {
  name: 'sudo',
  aliases: ['su', 'admin'],
  async execute(args, flags, { user }) {
    return { type: 'error', payload: `${user} is not in the sudoers file. This incident will be reported.` }
  }
}
