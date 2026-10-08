import type { Command } from '../../types.ts'

/**
 * Comando 'history'
 * Linhas executadas na sessão, numeradas como no bash. `history -c` limpa.
 */
export const historyCommand: Command = {
  name: 'history',
  async execute(args, flags, { shellHistory }) {
    if (flags.c) {
      shellHistory.clear()
      return null
    }

    const lines = shellHistory.list()
    const width = String(lines.length).length
    return { type: 'text', payload: lines.map((line, i) => `  ${String(i + 1).padStart(width)}  ${line}`).join('\n') }
  }
}
