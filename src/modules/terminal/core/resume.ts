import { fallbackChain } from '../../../core/i18n/languages.js'

// Currículos em src/assets/resume/resume.<idioma>.pdf (resume.pt.pdf, resume.en.pdf...).
// O glob roda no build: sem nenhum PDF, o comando resume avisa e o VFS não lista o arquivo
const resumeModules = import.meta.glob<string>('@/assets/resume/resume.*.pdf', {
  query: '?url',
  import: 'default',
  eager: true
})

const RESUMES: Record<string, string> = Object.fromEntries(
  Object.entries(resumeModules).map(([path, url]) => [path.match(/resume\.(\w+)\.pdf$/)?.[1] ?? '', url])
)

export const hasResume = Object.keys(RESUMES).length > 0

/** Currículo do idioma pedido; sem ele, segue a ordem de fallback do site (en, depois pt). */
export function resumeFor(locale: string): { lang: string; url: string } | null {
  const lang = fallbackChain(locale).find((code) => RESUMES[code])
  return lang ? { lang, url: RESUMES[lang] } : null
}
