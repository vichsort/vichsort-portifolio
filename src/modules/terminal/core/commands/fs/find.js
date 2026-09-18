import { TerminalError } from '../../errors/codes.js'
import { formatError } from '../../errors/formatter.js'
import { VfsError } from '../../vfs/engine.js'

/**
 * Coleta recursivamente todos os nós a partir do caminho raiz informado.
 *
 * @param {Object} vfs - Instância do motor VfsEngine.
 * @param {string} rootPath - Caminho de partida.
 * @returns {Array<{ path: string, name: string, type: string }>}
 */
function collectAllNodes(vfs, rootPath) {
  const resolved = vfs.resolveNode(rootPath)
  if (!resolved.exists) {
    throw new VfsError(TerminalError.NO_SUCH_FILE, rootPath)
  }

  if (resolved.isFile) {
    const fileName = resolved.path.split('/').pop()
    return [{ path: resolved.path, name: fileName, type: 'file' }]
  }

  const results = []

  function traverse(dirPath) {
    const entries = vfs.list(dirPath)
    for (const entry of entries) {
      const fullPath = dirPath === '/' ? `/${entry.name}` : `${dirPath}/${entry.name}`
      results.push({
        path: fullPath,
        name: entry.name,
        type: entry.type
      })
      if (entry.type === 'dir') {
        traverse(fullPath)
      }
    }
  }

  traverse(resolved.path)
  return results
}

/**
 * Comando 'find'
 * Localiza arquivos e diretórios recursivamente pelo nome no VFS.
 */
export const findCommand = {
  name: 'find',
  aliases: ['search'],
  descriptionKey: 'terminal.commands.find.description',
  usageKey: 'terminal.commands.find.usage',
  async execute(args, flags, context) {
    const { vfs, t = (k) => k } = context

    if (!vfs) {
      return {
        type: 'error',
        payload: 'vsh: vfs não inicializado'
      }
    }

    if (!args || args.length === 0) {
      return {
        type: 'error',
        payload: formatError(TerminalError.MISSING_ARG, { cmd: 'find', arg: '<termo>' }, t)
      }
    }

    const query = args[0].toLowerCase()
    const startPath = args[1] || '.'

    try {
      const allNodes = collectAllNodes(vfs, startPath)
      const matches = allNodes.filter((node) => node.name.toLowerCase().includes(query))

      if (matches.length === 0) {
        return {
          type: 'text',
          payload: `vsh: find: '${args[0]}': nenhum arquivo ou diretório encontrado.`
        }
      }

      const formatted = matches.map((m) => {
        return m.type === 'dir' ? `${m.path}/` : m.path
      })

      return {
        type: 'text',
        payload: formatted.join('\n')
      }
    } catch (err) {
      if (err instanceof VfsError) {
        return {
          type: 'error',
          payload: formatError(err.code, { cmd: 'find', path: startPath }, t)
        }
      }
      throw err
    }
  }
}

export default findCommand

