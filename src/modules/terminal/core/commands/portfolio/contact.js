/**
 * Comando 'contact'
 * Exibe os canais diretos de contato, e-mail e redes sociais.
 */
export const contactCommand = {
  name: 'contact',
  aliases: ['email', 'social'],
  descriptionKey: 'terminal.commands.contact.description',
  usageKey: 'terminal.commands.contact.usage',
  async execute(args, flags, context) {
    const { vfs, globalState, i18n } = context
    const locale = globalState?.locale?.value || i18n?.global?.locale?.value || 'pt'

    if (!vfs) {
      return {
        type: 'error',
        payload: 'vsh: vfs não inicializado'
      }
    }

    const file = await vfs.readFile('/contact.txt', locale)
    return {
      type: 'text',
      payload: file.content
    }
  }
}

export default contactCommand

