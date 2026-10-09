import type { Command } from '../../types.ts'
import { resumeFor } from '../../resume.ts'

/**
 * Comando 'resume'
 * Baixa o currículo em PDF no idioma ativo (ou no do fallback, se não houver).
 */
export const resumeCommand: Command = {
  name: 'resume',
  aliases: ['cv', 'download'],
  async execute(args, flags, context) {
    const resume = resumeFor(context.locale)
    if (!resume) return { type: 'text', payload: context.t('terminal.output.resume.unavailable') }

    if (typeof document !== 'undefined') {
      const link = document.createElement('a')
      link.href = resume.url
      link.download = `vitor-mignoni-resume-${resume.lang}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
    }

    return {
      type: 'text',
      payload: context.t('terminal.output.resume.downloading', { lang: resume.lang })
    }
  }
}
