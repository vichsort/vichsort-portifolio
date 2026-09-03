<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, Terminal as TerminalIcon } from 'lucide-vue-next'
import TerminalScreen from '../components/screen/TerminalScreen.vue'
import { useTerminal } from '../composables/useTerminal'

const { t } = useI18n()

const {
  user,
  host,
  input,
  history,
  displayPath,
  isExecuting,
  execute
} = useTerminal()

const welcomeText = computed(() => {
  return `${t('terminal.welcome')}\n${t('terminal.help_hint')}`
})
</script>

<template>
  <main class="terminal-view">
    <header class="terminal-nav-header">
      <router-link to="/" class="back-link">
        <ArrowLeft :size="18" />
        <span>{{ t('common.back_to_home') }}</span>
      </router-link>

      <div class="terminal-title-tag">
        <TerminalIcon :size="16" />
        <span>{{ t('terminal.title') }}</span>
      </div>
    </header>

    <div class="terminal-container surface-card">
      <TerminalScreen
        v-model="input"
        :history="history"
        :cwd="displayPath"
        :user="user"
        :host="host"
        :disabled="isExecuting"
        :welcome-message="welcomeText"
        @submit="execute"
      />
    </div>
  </main>
</template>

<style scoped>
.terminal-view {
  min-height: calc(100vh - 5rem);
  display: flex;
  flex-direction: column;
  padding: 1.5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
}

.terminal-nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  text-decoration: none;
  font-size: var(--text-sm);
  transition: color var(--transition-fast);
}

.back-link:hover {
  color: var(--text-primary);
}

.terminal-title-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-family: var(--font-heading);
}

.terminal-container {
  flex: 1;
  min-height: 550px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  background-color: var(--bg-canvas);
  box-shadow: var(--shadow-card);
}

@media (max-width: 768px) {
  .terminal-view {
    padding: 1rem;
  }
}
</style>

