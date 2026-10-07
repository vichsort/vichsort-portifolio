<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from '@/shared/composables/useTheme'
import { useSettings } from '@/shared/composables/useSettings'
import HeroSection from '@/modules/home/components/HeroSection.vue'

// Página única enquanto o portfólio completo é desenvolvido na branch develop.
// Para lançar: reverter o commit que trocou o App por este componente no main.js.

const MESSAGES = {
  pt: { title: 'Em construção', subtitle: 'O portfólio completo chega em breve.' },
  en: { title: 'Under construction', subtitle: 'The full portfolio is coming soon.' }
}

const { locale } = useI18n()
const { theme, initTheme } = useTheme()
const { initSettings } = useSettings()

const message = computed(() => MESSAGES[locale.value] || MESSAGES.pt)

onMounted(() => {
  initTheme()
  initSettings()
})
</script>

<template>
  <main class="under-construction">
    <HeroSection :current-theme="theme" />

    <div class="construction-badge surface-card" role="status">
      <span class="badge-title">{{ message.title }}<span class="cursor" aria-hidden="true">_</span></span>
      <span class="badge-subtitle">{{ message.subtitle }}</span>
    </div>
  </main>
</template>

<style scoped>
.under-construction {
  position: relative;
}

.construction-badge {
  position: absolute;
  top: var(--spacing-lg, 2rem);
  right: var(--spacing-lg, 2rem);
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-lg, 16px);
  max-width: 280px;
}

.badge-title {
  /* A fonte arcade não tem "Ã" */
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 1.05rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--primary);
}

.badge-subtitle {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.cursor {
  animation: blink 1s steps(1) infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cursor {
    animation: none;
  }
}

@media (max-width: 640px) {
  .construction-badge {
    top: auto;
    bottom: var(--spacing-md, 1.25rem);
    left: var(--spacing-md, 1.25rem);
    right: var(--spacing-md, 1.25rem);
    max-width: none;
  }
}
</style>
