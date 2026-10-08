<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMediaQuery } from '@vueuse/core'
import TerminalWindow from './TerminalWindow.vue'
import TerminalMobileDemo from './TerminalMobileDemo.vue'
import { useTerminal } from '../composables/useTerminal'
import { navigateWithTransition } from '@/shared/composables/useViewTransition'

/**
 * Seção do terminal no fim da home (âncora #terminal): a mesma sessão da
 * página /terminal, numa janela de altura fixa.
 * Vermelho encerra a sessão, amarelo recolhe a janela até a barra de título,
 * verde abre a página do terminal com a janela crescendo até a tela cheia.
 * No celular, o vídeo de demonstração no lugar da janela (t13).
 */
const { t } = useI18n()
const { reset } = useTerminal()

const collapsed = ref(false)
const isMobile = useMediaQuery('(max-width: 768px)')

const open = () => navigateWithTransition('/terminal', { waitFor: 'terminal-page' })
</script>

<template>
  <section id="terminal" class="terminal-section">
    <div class="content-wrapper">
      <div class="section-introduction">
        <span class="small-label">{{ t('terminal.section.label') }}</span>
        <h2 class="main-title">VSH<span class="highlight">.</span></h2>
        <p v-if="!isMobile" class="section-hint">{{ t('terminal.section.hint') }}</p>
      </div>

      <TerminalMobileDemo v-if="isMobile" />

      <div v-else class="window-slot" :class="{ 'is-collapsed': collapsed }">
        <TerminalWindow
          :autofocus="false"
          :close-label="t('terminal.window.end_session')"
          :minimize-label="t(collapsed ? 'terminal.window.expand' : 'terminal.window.collapse')"
          :maximize-label="t('terminal.window.open')"
          @close="reset"
          @minimize="collapsed = !collapsed"
          @maximize="open"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.terminal-section {
  padding: var(--spacing-2xl) 0;
  background-color: var(--bg-canvas);
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
  display: flex;
  align-items: center;
  gap: var(--spacing-2xl);
}

.section-introduction {
  flex: 1;
  max-width: 35%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.small-label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: var(--spacing-xs);
}

.main-title {
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.highlight {
  color: var(--primary);
}

.section-hint {
  margin-top: var(--spacing-md);
  font-size: var(--text-base);
  line-height: 1.6;
  color: var(--text-secondary);
}

/* Altura fixa; recolhida, sobra só a barra de título */
.window-slot {
  flex: 1.5;
  min-width: 0;
  height: 440px;
  transition: height var(--transition-smooth);
}

.window-slot.is-collapsed {
  height: calc(1.7rem + 13px);
}

.window-slot :deep(.terminal-window) {
  height: 100%;
}

@media (max-width: 900px) {
  .content-wrapper {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-lg);
    padding: 0 var(--spacing-md);
  }

  .section-introduction {
    max-width: 100%;
    align-items: center;
    text-align: center;
  }

  .window-slot {
    flex: none;
    height: 420px;
  }
}
</style>
