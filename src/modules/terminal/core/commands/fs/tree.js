import { formatError } from '../../errors/formatter.js'
import { VfsError } from '../../vfs/engine.js'

/**
 * Comando 'tree'
 * Renderiza a árvore visual hierárquica do VFS em formato ASCII.
 */
export const treeCommand = {
  name: 'tree',
  aliases: [],
  descriptionKey: 'terminal.commands.tree.description',
  usageKey: 'terminal.commands.tree.usage',
  async execute(args, flags, context) {
    const { vfs, t = (k) => k } = context

    if (!vfs) {
      return {
        type: 'error',
        payload: 'vsh: vfs não inicializado'
      }
    }

    const target = args[0] || '.'
    const maxDepth = Number(flags.depth || flags.L || 4)

    try {
      const output = vfs.tree(target, maxDepth)
      return {
        type: 'text',
        payload: output
      }
    } catch (err) {
      if (err instanceof VfsError) {
        return {
          type: 'error',
          payload: formatError(err.code, { cmd: 'tree', path: target }, t)
        }
      }
      throw err
    }
  }
}

export default treeCommand

