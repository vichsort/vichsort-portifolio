import type { Command } from '../../types.ts'

/** Nega sempre, com a mensagem do sudo de verdade. */
export const sudoCommand: Command = {
  name: 'sudo',
  aliases: ['su', 'admin'],
  async execute(args, flags, { user }) {
    return { type: 'error', payload: `${user} is not in the sudoers file. This incident will be reported.` }
  }
}
