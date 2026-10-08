import { TerminalError, CommandError } from '../../errors/codes.ts'
import { VfsNodeType } from '../../vfs/types.ts'
import type { Command } from '../../types.ts'

/**
 * Comando 'grep'
 * Busca um termo nas linhas dos arquivos do VFS, ou na entrada de um pipe.
 * Como o grep de verdade, diferencia maiúsculas; -i ignora.
 */
export const grepCommand: Command = {
  name: 'grep',
  async execute(args, flags, { vfs, locale, t, stdin }) {
    if (!args.length) throw new CommandError(TerminalError.MISSING_ARG, { arg: '<termo>' })

    const [term, targetPath] = args
    const fold = flags.i ? (text: string) => text.toLowerCase() : (text: string) => text
    const query = fold(term)
    const matchesTerm = (line: string) => fold(line).includes(query)

    let matches: string[]
    if (stdin != null && !targetPath) {
      // Num pipe sem caminho (ex.: cat a.md | grep vue), filtra as linhas da entrada
      matches = stdin.split('\n').filter(matchesTerm)
    } else {
      matches = []
      const files = vfs.walk(targetPath || '.').filter(({ type }) => type === VfsNodeType.FILE)
      for (const { path } of files) {
        const { content } = await vfs.readFile(path, locale)
        content.split('\n').forEach((line, i) => {
          if (matchesTerm(line)) matches.push(`${path}:${i + 1}: ${line.trim()}`)
        })
      }
    }

    if (!matches.length) return { type: 'text', payload: t('terminal.output.grep.no_match', { term }) }
    return { type: 'text', payload: matches.join('\n') }
  }
}
