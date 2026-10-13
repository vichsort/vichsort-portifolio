import { TerminalError, CommandError } from '../../errors/codes.ts'
import { VfsNodeType } from '../../vfs/types.ts'
import type { Command } from '../../types.ts'

/** Arquivos e pastas do VFS cujo nome contém o termo, em toda a árvore abaixo do caminho. */
export const findCommand: Command = {
  name: 'find',
  aliases: ['search'],
  async execute(args, flags, { vfs, t }) {
    if (!args.length) throw new CommandError(TerminalError.MISSING_ARG, { arg: '<termo>' })

    const [term, startPath = '.'] = args
    const query = term.toLowerCase()
    const matches = vfs
      .walk(startPath)
      .filter(({ name }) => name.toLowerCase().includes(query))
      .map(({ path, type }) => (type === VfsNodeType.DIR ? `${path}/` : path))

    if (!matches.length) return { type: 'text', payload: t('terminal.output.find.no_match', { term }) }
    return { type: 'text', payload: matches.join('\n') }
  }
}
