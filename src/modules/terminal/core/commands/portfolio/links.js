import { content } from '../../../../../core/content/index.js'
import { TerminalError } from '../../errors/codes.js'
import { formatError } from '../../errors/formatter.js'
import { getNodeLinksText } from '../../vfs/graphNodes.js'

// Aceita o id, um alias ou o caminho do arquivo no VFS (techs/vue.md, projects/plante/README.md)
const toNodeKey = (arg) =>
  arg.replace(/\/README\.md$/i, '').split('/').filter(Boolean).pop()?.replace(/\.md$/i, '') || ''

/**
 * Comando 'links'
 * Mostra para onde um nó do grafo aponta e quem aponta para ele.
 */
export const linksCommand = {
  name: 'links',
  aliases: ['backlinks'],
  descriptionKey: 'terminal.commands.links.description',
  usageKey: 'terminal.commands.links.usage',
  async execute(args, flags, context) {
    const { t, globalState, i18n } = context
    const locale = globalState?.locale?.value || i18n?.global?.locale?.value || 'pt'

    if (!args.length) {
      return {
        type: 'error',
        payload: formatError(TerminalError.MISSING_ARG, { cmd: 'links', arg: '<id>' }, t)
      }
    }

    const id = content.resolve(toNodeKey(args[0]))
    if (!id) {
      return {
        type: 'error',
        payload: t('terminal.output.links.not_found', { id: args[0] })
      }
    }

    return {
      type: 'text',
      payload: getNodeLinksText(id, locale)
    }
  }
}

export default linksCommand
