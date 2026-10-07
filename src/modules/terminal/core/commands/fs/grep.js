import { TerminalError } from '../../errors/codes.js'
import { formatError } from '../../errors/formatter.js'
import { VfsError } from '../../vfs/engine.js'

/**
 * Coleta recursivamente os caminhos de todos os arquivos sob o diretório informado.
 *
 * @param {Object} vfs - Instância do motor VfsEngine.
 * @param {string} rootPath - Caminho de partida.
 * @returns {string[]} Lista de caminhos absolutos no VFS.
 */
function collectAllFiles(vfs, rootPath) {
  const resolved = vfs.resolveNode(rootPath)
  if (!resolved.exists) {
    throw new VfsError(TerminalError.NO_SUCH_FILE, rootPath)
  }

  if (resolved.isFile) {
    return [resolved.path]
  }

  const files = []

  function traverse(dirPath) {
    const entries = vfs.list(dirPath)
    for (const entry of entries) {
      const fullPath = dirPath === '/' ? `/${entry.name}` : `${dirPath}/${entry.name}`
      if (entry.type === 'file') {
        files.push(fullPath)
      } else if (entry.type === 'dir') {
        traverse(fullPath)
      }
    }
  }

  traverse(resolved.path)
  return files
}

/**
 * Comando 'grep'
 * Busca recursiva de padrões de texto no conteúdo dos arquivos do VFS.
 */
export const grepCommand = {
  name: 'grep',
  aliases: [],
  descriptionKey: 'terminal.commands.grep.description',
  usageKey: 'terminal.commands.grep.usage',
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
        payload: formatError(TerminalError.MISSING_ARG, { cmd: 'grep', arg: '<termo>' }, t)
      }
    }

    const term = args[0]
    const targetPath = args[1] || '.'
    const locale = globalState?.locale?.value || i18n?.global?.locale?.value || 'pt'
    const caseInsensitive = flags.i !== false
    const matchesTerm = (line) =>
      caseInsensitive ? line.toLowerCase().includes(term.toLowerCase()) : line.includes(term)
    const noMatch = () => ({ type: 'text', payload: t('terminal.output.grep.no_match', { term }) })

    // Num pipe sem caminho (ex.: cat a.md | grep vue), filtra as linhas da entrada
    if (context.stdin != null && !args[1]) {
      const lines = context.stdin.split('\n').filter(matchesTerm)
      return lines.length ? { type: 'text', payload: lines.join('\n') } : noMatch()
    }

    try {
      const filePaths = collectAllFiles(vfs, targetPath)
      const matches = []

      for (const filePath of filePaths) {
        try {
          const file = await vfs.readFile(filePath, locale)
          const content = String(file.content || '')
          const lines = content.split('\n')

          lines.forEach((line, i) => {
            if (matchesTerm(line)) matches.push(`${filePath}:${i + 1}: ${line.trim()}`)
          })
        } catch {
          // Ignora arquivos binários ou que não podem ser lidos como texto
        }
      }

      if (matches.length === 0) return noMatch()

      return {
        type: 'text',
        payload: matches.join('\n')
      }
    } catch (err) {
      if (err instanceof VfsError) {
        return {
          type: 'error',
          payload: formatError(err.code, { cmd: 'grep', path: targetPath }, t)
        }
      }
      throw err
    }
  }
}

export default grepCommand

