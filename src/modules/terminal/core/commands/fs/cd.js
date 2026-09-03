import { formatError } from '../../errors/formatter.js'
import { VfsError } from '../../vfs/engine.js'

/**
 * Comando 'cd'
 * Altera o diretório de trabalho atual no VFS.
 */
export const cdCommand = {
  name: 'cd',
  aliases: ['chdir'],
  descriptionKey: 'terminal.commands.cd.description',
  usageKey: 'terminal.commands.cd.usage',
  async execute(args, flags, context) {
    const { vfs, t = (k) => k } = context

    if (!vfs) {
      return {
        type: 'error',
        payload: 'vsh: vfs não inicializado'
      }
    }

    const target = args[0] || '~'

    try {
      vfs.cd(target)
      // Comando silencioso em caso de sucesso
      return null
    } catch (err) {
      if (err instanceof VfsError) {
        return {
          type: 'error',
          payload: formatError(err.code, { cmd: 'cd', path: target }, t)
        }
      }
      throw err
    }
  }
}

export default cdCommand

