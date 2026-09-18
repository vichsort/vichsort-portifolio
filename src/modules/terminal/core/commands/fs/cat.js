import { TerminalError } from '../../errors/codes.js'
import { formatError } from '../../errors/formatter.js'
import { VfsError } from '../../vfs/engine.js'
import { VfsMimeType } from '../../vfs/types.js'

/**
 * Comando 'cat'
 * Exibe o conteúdo de um arquivo com detecção de MIME (texto puro, Markdown, JSON).
 */
export const catCommand = {
  name: 'cat',
  aliases: ['type'],
  descriptionKey: 'terminal.commands.cat.description',
  usageKey: 'terminal.commands.cat.usage',
  async execute(args, flags, context) {
    const { vfs, t = (k) => k, globalState, i18n } = context

    if (!vfs) {
      return {
        type: 'error',
        payload: 'vsh: vfs não inicializado'
      }
    }

    if (!args || args.length === 0) {
      return {
        type: 'error',
        payload: formatError(TerminalError.MISSING_ARG, { cmd: 'cat', arg: '<arquivo>' }, t)
      }
    }

    const target = args[0]
    const locale = globalState?.locale?.value || i18n?.global?.locale?.value || 'pt'

    try {
      const file = await vfs.readFile(target, locale)

      // Se for Markdown, despacha tipo especializado
      if (file.mime === VfsMimeType.TEXT_MARKDOWN) {
        return {
          type: 'markdown',
          payload: file.content,
          filename: file.name
        }
      }

      // Se for JSON formatado
      if (file.mime === VfsMimeType.APPLICATION_JSON) {
        return {
          type: 'text',
          payload: file.content
        }
      }

      // Se for ação de download de PDF
      if (file.action === 'download_resume' || file.mime === VfsMimeType.APPLICATION_PDF) {
        return {
          type: 'text',
          payload: '[vsh]: arquivo binário PDF. Para baixar, use o comando: resume'
        }
      }

      return {
        type: 'text',
        payload: file.content
      }
    } catch (err) {
      if (err instanceof VfsError) {
        return {
          type: 'error',
          payload: formatError(err.code, { cmd: 'cat', path: target }, t)
        }
      }
      throw err
    }
  }
}

export default catCommand

