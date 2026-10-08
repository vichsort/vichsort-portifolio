import type { Command } from '../../types.ts'

/**
 * Comando 'clear'
 * Limpa a tela do terminal (o mesmo que Ctrl+L).
 */
export const clearCommand: Command = {
  name: 'clear',
  aliases: ['cls'],
  async execute(args, flags, { clear }) {
    clear()
    return null
  }
}
