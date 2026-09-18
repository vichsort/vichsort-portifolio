/**
 * Comando 'resume'
 * Dispara o download do currículo em PDF do engenheiro.
 */
export const resumeCommand = {
  name: 'resume',
  aliases: ['cv', 'download'],
  descriptionKey: 'terminal.commands.resume.description',
  usageKey: 'terminal.commands.resume.usage',
  async execute(args, flags, context) {
    const { globalState, i18n } = context
    const locale = globalState?.locale?.value || i18n?.global?.locale?.value || 'pt'
    const isEn = locale === 'en'

    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      try {
        const link = document.createElement('a')
        link.href = '/resume.pdf'
        link.download = 'Vitor_Mignoni_Resume.pdf'
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch {
        // Fallback se bloqueado por popup
      }
    }

    return {
      type: 'text',
      payload: isEn
        ? '[vsh]: Initiating download of resume (resume.pdf)...'
        : '[vsh]: Disparando download do currículo (resume.pdf)...'
    }
  }
}

export default resumeCommand

