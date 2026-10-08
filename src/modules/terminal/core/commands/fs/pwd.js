/**
 * Comando 'pwd'
 * Imprime o diretório de trabalho atual absoluto no VFS.
 */
export const pwdCommand = {
  name: 'pwd',
  async execute(args, flags, { vfs }) {
    return { type: 'text', payload: vfs.pwd() }
  }
}
