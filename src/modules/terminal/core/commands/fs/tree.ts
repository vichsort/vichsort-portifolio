import type { Command } from '../../types.ts'

/** A árvore do VFS em ASCII. Profundidade com -L 2 ou --depth 2 (padrão 4). */
export const treeCommand: Command = {
  name: 'tree',
  valueFlags: ['depth', 'L'],
  async execute(args, flags, { vfs }) {
    const maxDepth = Number(flags.depth || flags.L || 4)
    return { type: 'text', payload: vfs.tree(args[0] || '.', maxDepth) }
  }
}
