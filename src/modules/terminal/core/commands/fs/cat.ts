import { TerminalError, CommandError } from '../../errors/codes.ts'
import { VfsMimeType } from '../../vfs/types.ts'
import type { Command } from '../../types.ts'

/**
 * Comando 'cat'
 * Exibe o conteúdo de um arquivo: Markdown vai para o renderizador, PDF só avisa.
 */
export const catCommand: Command = {
  name: 'cat',
  aliases: ['type'],
  async execute(args, flags, { vfs, locale, t }) {
    if (!args.length) throw new CommandError(TerminalError.MISSING_ARG, { arg: '<arquivo>' })

    const file = await vfs.readFile(args[0], locale)

    if (file.mime === VfsMimeType.TEXT_MARKDOWN) {
      return { type: 'markdown', payload: file.content, filename: file.name }
    }
    if (file.mime === VfsMimeType.APPLICATION_PDF) {
      return { type: 'text', payload: t('terminal.output.cat.binary_pdf') }
    }
    return { type: 'text', payload: file.content }
  }
}
