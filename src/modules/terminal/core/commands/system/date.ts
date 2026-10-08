import type { Command } from '../../types.ts'

/**
 * Comando 'date'
 * Exibe a data, horário e fuso horário atuais.
 */
export const dateCommand: Command = {
  name: 'date',
  async execute() {
    return { type: 'text', payload: new Date().toString() }
  }
}
