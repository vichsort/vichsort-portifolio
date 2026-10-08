import type { Command } from '../../types.ts'

/**
 * Comando 'resume'
 * Dispara o download do currículo em PDF do engenheiro.
 */
export const resumeCommand: Command = {
  name: 'resume',
  aliases: ['cv', 'download'],
  async execute(args, flags, context) {
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
      payload: context.t('terminal.output.resume.downloading')
    }
  }
}

