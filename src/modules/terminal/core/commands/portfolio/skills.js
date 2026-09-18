/**
 * Comando 'skills'
 * Exibe a matriz de tecnologias e stack técnica.
 */
export const skillsCommand = {
  name: 'skills',
  aliases: ['stack', 'techs'],
  descriptionKey: 'terminal.commands.skills.description',
  usageKey: 'terminal.commands.skills.usage',
  async execute(args, flags, context) {
    const { vfs, globalState, i18n } = context
    const locale = globalState?.locale?.value || i18n?.global?.locale?.value || 'pt'

    if (!vfs) {
      return {
        type: 'error',
        payload: 'vsh: vfs não inicializado'
      }
    }

    const file = await vfs.readFile('/about/stack.txt', locale)
    return {
      type: 'text',
      payload: file.content
    }
  }
}

export default skillsCommand

