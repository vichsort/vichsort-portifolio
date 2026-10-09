import type { Command } from '../../types.ts'

/**
 * Comando 'whoami'
 * Usuário da sessão e o cargo do perfil (o mesmo do Sobre).
 */
export const whoamiCommand: Command = {
  name: 'whoami',
  async execute(args, flags, { user, t }) {
    return { type: 'text', payload: `${user} /// ${t('about_page.s1_profile.role')}` }
  }
}
