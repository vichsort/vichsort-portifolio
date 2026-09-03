import { formatError } from '../../errors/formatter.js'
import { VfsError } from '../../vfs/engine.js'
import { VfsNodeType } from '../../vfs/types.js'

/**
 * Comando 'ls'
 * Lista arquivos e diretórios do VFS com suporte a flags -l e -a.
 */
export const lsCommand = {
  name: 'ls',
  aliases: ['dir'],
  descriptionKey: 'terminal.commands.ls.description',
  usageKey: 'terminal.commands.ls.usage',
  async execute(args, flags, context) {
    const { vfs, t = (k) => k } = context

    if (!vfs) {
      return {
        type: 'error',
        payload: 'vsh: vfs não inicializado'
      }
    }

    const target = args[0] || '.'
    const isLong = Boolean(flags.l)
    const isAll = Boolean(flags.a)

    try {
      const entries = vfs.list(target)

      // Se for listagem simples de um arquivo específico
      if (entries.length === 1 && entries[0].type === VfsNodeType.FILE && target !== '.') {
        return {
          type: 'text',
          payload: isLong
            ? `-rw-r--r--  vitor  ${entries[0].mime || 'text/plain'}  ${entries[0].name}`
            : entries[0].name
        }
      }

      // Ordenar: diretórios primeiro, depois arquivos alfabeticamente
      entries.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === VfsNodeType.DIR ? -1 : 1
        }
        return a.name.localeCompare(b.name)
      })

      const items = []

      if (isAll) {
        items.push({ name: '.', type: VfsNodeType.DIR, isHidden: true })
        items.push({ name: '..', type: VfsNodeType.DIR, isHidden: true })
      }

      items.push(...entries)

      if (isLong) {
        const lines = items.map((entry) => {
          const isDir = entry.type === VfsNodeType.DIR
          const perm = isDir ? 'drwxr-xr-x' : '-rw-r--r--'
          const info = isDir ? 'dir ' : (entry.mime || 'file')
          const displayName = isDir ? `${entry.name}/` : entry.name
          return `${perm}  vitor  ${info.padEnd(16)}  ${displayName}`
        })

        return {
          type: 'text',
          payload: lines.join('\n')
        }
      }

      // Listagem concisa em linha / grid
      const formattedNames = items.map((entry) => {
        return entry.type === VfsNodeType.DIR ? `${entry.name}/` : entry.name
      })

      return {
        type: 'text',
        payload: formattedNames.join('  ')
      }
    } catch (err) {
      if (err instanceof VfsError) {
        return {
          type: 'error',
          payload: formatError(err.code, { cmd: 'ls', path: target }, t)
        }
      }
      throw err
    }
  }
}

export default lsCommand

