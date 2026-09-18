/**
 * Comando 'certifications'
 * Lista as certificações e credenciais técnicas cadastradas.
 */
export const certificationsCommand = {
  name: 'certifications',
  aliases: ['certs'],
  descriptionKey: 'terminal.commands.certifications.description',
  usageKey: 'terminal.commands.certifications.usage',
  async execute(args, flags, context) {
    const { vfs, globalState, i18n } = context
    const locale = globalState?.locale?.value || i18n?.global?.locale?.value || 'pt'

    if (!vfs) {
      return {
        type: 'error',
        payload: 'vsh: vfs não inicializado'
      }
    }

    const file = await vfs.readFile('/certifications/list.txt', locale)
    return {
      type: 'text',
      payload: file.content
    }
  }
}

export default certificationsCommand

