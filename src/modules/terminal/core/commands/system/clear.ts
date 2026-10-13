import type { Command } from '../../types.ts'

/** O mesmo que Ctrl+L. */
export const clearCommand: Command = {
  name: 'clear',
  aliases: ['cls'],
  async execute(args, flags, { clear }) {
    clear()
    return null
  }
}
