/**
 * Comando 'about'
 * Exibe o resumo biográfico, formação e filosofia de engenharia.
 */
export const aboutCommand = {
  name: 'about',
  aliases: ['bio'],
  descriptionKey: 'terminal.commands.about.description',
  usageKey: 'terminal.commands.about.usage',
  async execute(args, flags, context) {
    const { vfs, globalState, i18n } = context
    const locale = globalState?.locale?.value || i18n?.global?.locale?.value || 'pt'

    if (!vfs) {
      return {
        type: 'error',
        payload: 'vsh: vfs não inicializado'
      }
    }

    const file = await vfs.readFile('/about/profile.txt', locale)
    return {
      type: 'text',
      payload: file.content
    }
  }
}

export default aboutCommand

