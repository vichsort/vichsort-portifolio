/**
 * Comando 'researches'
 * Lista os artigos acadêmicos, premiações e projetos de pesquisa.
 */
export const researchesCommand = {
  name: 'researches',
  aliases: ['papers', 'awards'],
  descriptionKey: 'terminal.commands.researches.description',
  usageKey: 'terminal.commands.researches.usage',
  async execute(args, flags, context) {
    const { vfs, globalState, i18n } = context
    const locale = globalState?.locale?.value || i18n?.global?.locale?.value || 'pt'

    if (!vfs) {
      return {
        type: 'error',
        payload: 'vsh: vfs não inicializado'
      }
    }

    const file = await vfs.readFile('/researches/list.txt', locale)
    return {
      type: 'text',
      payload: file.content
    }
  }
}

export default researchesCommand

