/**
 * Comando 'pwd'
 * Imprime o diretório de trabalho atual absoluto no VFS.
 */
export const pwdCommand = {
  name: 'pwd',
  aliases: [],
  descriptionKey: 'terminal.commands.pwd.description',
  usageKey: 'terminal.commands.pwd.usage',
  async execute(args, flags, context) {
    const { vfs } = context
    if (!vfs) {
      return {
        type: 'error',
        payload: 'vsh: vfs não inicializado'
      }
    }

    return {
      type: 'text',
      payload: vfs.pwd()
    }
  }
}

export default pwdCommand

