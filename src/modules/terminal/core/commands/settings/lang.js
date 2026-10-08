import { LANGUAGES, isLang } from '@/core/i18n/languages'

/**
 * Comando 'lang' (ou 'language')
 * Lista os idiomas ou troca o idioma do site. A resposta já sai no idioma novo;
 * o que estava na tela continua no idioma em que rodou.
 * Uso: lang | lang en
 */
export const langCommand = {
  name: 'lang',
  aliases: ['language'],
  async execute(args, flags, context) {
    const { globalState, t, locale: current } = context
    const [value] = args

    if (!value) {
      const lines = LANGUAGES.map(({ code, label }) => `${code === current ? '*' : ' '} ${code}  ${label}`)
      return { type: 'text', payload: [t('terminal.output.lang.list'), ...lines].join('\n') }
    }

    const code = value.toLowerCase()
    if (!isLang(code)) {
      return {
        type: 'error',
        payload: t('terminal.output.lang.invalid', { value, codes: LANGUAGES.map((l) => l.code).join(', ') })
      }
    }

    globalState.setLocale(code)
    const label = LANGUAGES.find((l) => l.code === code).label
    return { type: 'text', payload: t('terminal.output.lang.changed', { lang: label }) }
  }
}
