import { content, graph } from '@/core/content'
import { TerminalError, CommandError } from '../../errors/codes.ts'
import { getNodeLinksText } from '../../vfs/graphNodes.ts'
import type { Command } from '../../types.ts'

// Aceita o id, um alias ou o caminho do arquivo no VFS (techs/vue.md, projects/plante/README.md)
const toNodeKey = (arg: string) =>
  arg.replace(/\/README\.md$/i, '').split('/').filter(Boolean).pop()?.replace(/\.md$/i, '') || ''

/**
 * Comando 'links'
 * Mostra para onde um nó do grafo aponta e quem aponta para ele.
 */
export const linksCommand: Command = {
  name: 'links',
  aliases: ['backlinks'],
  // O Tab completa ids de nós, não caminhos
  complete: (word) => [...graph.nodes.keys()].filter((id) => id.startsWith(word)),
  async execute(args, flags, { t, locale }) {
    if (!args.length) throw new CommandError(TerminalError.MISSING_ARG, { arg: '<id>' })

    const id = content.resolve(toNodeKey(args[0]))
    if (!id) return { type: 'error', payload: t('terminal.output.links.not_found', { id: args[0] }) }

    return { type: 'text', payload: getNodeLinksText(id, locale) }
  }
}
