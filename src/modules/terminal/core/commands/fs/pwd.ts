import type { Command } from '../../types.ts'

/**
 * Comando 'pwd'
 * Imprime o diretório de trabalho atual absoluto no VFS.
 */
export const pwdCommand: Command = {
  name: 'pwd',
  async execute(args, flags, { vfs }) {
    return { type: 'text', payload: vfs.pwd() }
  }
}
