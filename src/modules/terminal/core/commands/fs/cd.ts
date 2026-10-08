import type { Command } from '../../types.ts'

/**
 * Comando 'cd'
 * Altera o diretório de trabalho atual no VFS. Silencioso quando dá certo.
 */
export const cdCommand: Command = {
  name: 'cd',
  aliases: ['chdir'],
  async execute(args, flags, { vfs }) {
    vfs.cd(args[0] || '~')
    return null
  }
}
