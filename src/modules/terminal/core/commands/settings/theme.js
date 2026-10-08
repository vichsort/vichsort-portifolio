const THEMES = ['dark', 'light']

/**
 * Comando 'theme'
 * Mostra ou troca o tema do site (a página do terminal não tem navbar nem configurações).
 * Uso: theme | theme dark | theme light | theme toggle
 */
export const themeCommand = {
  name: 'theme',
  async execute(args, flags, context) {
    const { globalState, t } = context
    const current = globalState.theme.value
    const [value] = args

    if (!value) {
      return { type: 'text', payload: t('terminal.output.theme.current', { theme: current }) }
    }

    const next = value === 'toggle' ? (current === 'dark' ? 'light' : 'dark') : value.toLowerCase()
    if (!THEMES.includes(next)) {
      return { type: 'error', payload: t('terminal.output.theme.invalid', { value }) }
    }

    globalState.setTheme(next)
    return { type: 'text', payload: t('terminal.output.theme.changed', { theme: next }) }
  }
}
