import { navigateWithTransition } from '@/shared/composables/useViewTransition'

const onTerminalPage = (router) => router?.currentRoute.value.name === 'terminal'

// Mesmo caminho dos botões da janela: a janela "encolhe" de volta para a seção da home
const backToHome = () => navigateWithTransition({ path: '/', hash: '#terminal' }, { waitFor: 'terminal', center: true })

/**
 * Comando 'exit'
 * Encerra a sessão, como o botão vermelho: tela, histórico e diretório voltam
 * ao início. Na página /terminal, também volta para a home.
 */
export const exitCommand = {
  name: 'exit',
  aliases: ['logout'],
  async execute(args, flags, { restart, clear, router }) {
    restart()
    // A linha "exit" some junto com a sessão encerrada
    clear()
    if (onTerminalPage(router)) backToHome()
    return null
  }
}

/**
 * Comando 'gui'
 * Volta para a interface gráfica mantendo a sessão, como o botão amarelo.
 * Na home o terminal já está dentro da interface: só avisa.
 */
export const guiCommand = {
  name: 'gui',
  aliases: ['startx'],
  async execute(args, flags, { router, t }) {
    if (!onTerminalPage(router)) return { type: 'text', payload: t('terminal.output.gui.already') }
    backToHome()
    return null
  }
}
