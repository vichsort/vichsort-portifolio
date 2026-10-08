<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFullscreen, useMediaQuery } from '@vueuse/core'
import TerminalWindow from '../components/TerminalWindow.vue'
import TerminalMobileDemo from '../components/TerminalMobileDemo.vue'
import { useTerminal } from '../composables/useTerminal'
import { navigateWithTransition } from '@/shared/composables/useViewTransition'

/**
 * /terminal: só a janela, ocupando a tela (rota com meta.bare, sem navbar nem footer).
 * Vermelho encerra a sessão e volta à seção do terminal na home; amarelo volta
 * mantendo a sessão; verde alterna a tela cheia do navegador.
 * Tema e idioma mudam pelos comandos theme e lang.
 * No celular, o vídeo de demonstração e o caminho de volta ao site (t13).
 */
const { t } = useI18n()
const { reset } = useTerminal()
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()
const isMobile = useMediaQuery('(max-width: 768px)')

// A janela "encolhe" de volta para o lugar dela na home
const backToHome = () => navigateWithTransition({ path: '/', hash: '#terminal' }, { waitFor: 'terminal', center: true })

const endSession = () => {
  reset()
  backToHome()
}

const maximizeLabel = computed(() => t(isFullscreen.value ? 'terminal.window.exit_fullscreen' : 'terminal.window.fullscreen'))
</script>

<template>
  <main id="terminal-page" class="terminal-page" :class="{ 'is-mobile': isMobile }">
    <TerminalMobileDemo v-if="isMobile" show-back @back="backToHome" />
    <TerminalWindow
      v-else
      :close-label="t('terminal.window.end_session')"
      :minimize-label="t('terminal.window.minimize')"
      :maximize-label="maximizeLabel"
      @close="endSession"
      @minimize="backToHome"
      @maximize="toggleFullscreen"
    />
  </main>
</template>

<style scoped>
.terminal-page {
  position: fixed;
  inset: 0;
  display: flex;
  padding: clamp(0.5rem, 2vw, 1.5rem);
  background-color: var(--bg-canvas);
  box-sizing: border-box;
}

.terminal-page.is-mobile {
  position: static;
  min-height: 100vh;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-md);
}
</style>
