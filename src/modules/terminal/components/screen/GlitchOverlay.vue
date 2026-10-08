<script setup>
import { useI18n } from 'vue-i18n'

/**
 * O que aparece durante o `rm -rf /`: linhas de remoção surgindo uma a uma
 * e o kernel panic no fim. Só visual; o tremor da tela fica no TerminalWindow.
 */
const { t } = useI18n()

const PATHS = [
  '/home/vitor/projects',
  '/home/vitor/researches',
  '/home/vitor/certifications',
  '/etc/stack',
  '/usr/bin/vsh',
  '/usr/lib/vue',
  '/var/log/commits',
  '/boot/vichos'
]
</script>

<template>
  <div class="glitch-overlay" aria-hidden="true">
    <p v-for="(path, i) in PATHS" :key="path" class="line" :style="{ animationDelay: `${i * 180}ms` }">
      removed '{{ path }}'
    </p>
    <p class="line panic" :style="{ animationDelay: `${PATHS.length * 180 + 200}ms` }">
      {{ t('terminal.output.rm.panic') }}
    </p>
  </div>
</template>

<style scoped>
.glitch-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.15rem;
  padding: 1.5rem;
  background: var(--bg-canvas);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  pointer-events: none;
}

.line {
  margin: 0;
  opacity: 0;
  animation: appear 0.01s forwards;
}

.panic {
  margin-top: 0.75rem;
  font-weight: 700;
  color: var(--danger);
}

@keyframes appear {
  to {
    opacity: 1;
  }
}
</style>
