import { VfsNodeType } from '../../vfs/types.ts'
import type { VfsEntry } from '../../vfs/engine.ts'
import type { Command } from '../../types.ts'

// Uma linha do ls: as entradas . e .. não têm nó por trás
type LsEntry = Pick<VfsEntry, 'name' | 'type' | 'mime'>

const isDir = (entry: LsEntry) => entry.type === VfsNodeType.DIR
const displayName = (entry: LsEntry) => (isDir(entry) ? `${entry.name}/` : entry.name)

// Uma linha do ls -l
const longLine = (entry: LsEntry) => {
  const perm = isDir(entry) ? 'drwxr-xr-x' : '-rw-r--r--'
  const info = isDir(entry) ? 'dir ' : entry.mime || 'file'
  return `${perm}  vitor  ${info.padEnd(16)}  ${displayName(entry)}`
}

/**
 * Comando 'ls'
 * Lista arquivos e diretórios do VFS (pastas primeiro), com -l (detalhes) e -a (. e ..).
 */
export const lsCommand: Command = {
  name: 'ls',
  aliases: ['dir'],
  async execute(args, flags, { vfs, isPiped }) {
    const target = args[0] || '.'
    const entries: LsEntry[] = vfs.list(target)

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
