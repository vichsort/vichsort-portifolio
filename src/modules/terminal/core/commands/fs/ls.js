import { VfsNodeType } from '../../vfs/types.js'

const isDir = (entry) => entry.type === VfsNodeType.DIR
const displayName = (entry) => (isDir(entry) ? `${entry.name}/` : entry.name)

// Uma linha do ls -l
const longLine = (entry) => {
  const perm = isDir(entry) ? 'drwxr-xr-x' : '-rw-r--r--'
  const info = isDir(entry) ? 'dir ' : entry.mime || 'file'
  return `${perm}  vitor  ${info.padEnd(16)}  ${displayName(entry)}`
}

/**
 * Comando 'ls'
 * Lista arquivos e diretórios do VFS (pastas primeiro), com -l (detalhes) e -a (. e ..).
 */
export const lsCommand = {
  name: 'ls',
  aliases: ['dir'],
  async execute(args, flags, { vfs, isPiped }) {
    const target = args[0] || '.'
    const entries = vfs.list(target)

    // Num arquivo, o ls mostra só ele, sem . e ..
    if (!vfs.resolveNode(target).isFile) {
      entries.sort((a, b) => (a.type !== b.type ? (isDir(a) ? -1 : 1) : a.name.localeCompare(b.name)))
      if (flags.a) entries.unshift({ name: '.', type: VfsNodeType.DIR }, { name: '..', type: VfsNodeType.DIR })
    }

    if (flags.l) return { type: 'text', payload: entries.map(longLine).join('\n') }

    // Dentro de um pipe, um nome por linha (como o ls fora de um terminal), para o grep filtrar
    return { type: 'text', payload: entries.map(displayName).join(isPiped ? '\n' : '  ') }
  }
}
