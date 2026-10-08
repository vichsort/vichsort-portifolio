/**
 * Comando 'whoami'
 * Usuário da sessão e o cargo do perfil (o mesmo do Sobre).
 */
export const whoamiCommand = {
  name: 'whoami',
  async execute(args, flags, { user, t }) {
    return { type: 'text', payload: `${user} — ${t('about_page.s1_profile.role')}` }
  }
}
