import type { Command } from '../../types.ts'

/**
 * Comando 'echo'
 * Imprime texto fornecido como argumento na saída padrão.
 */
export const echoCommand: Command = {
  name: 'echo',
  async execute(args) {
    return { type: 'text', payload: args.join(' ') }
  }
}
