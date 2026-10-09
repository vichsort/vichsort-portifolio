<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalStorage } from '@vueuse/core'
import { Languages, X } from 'lucide-vue-next'
import { isPartialLang } from '@/core/i18n/languages'

/**
 * Aviso de tradução parcial (n26): em es e it, parte do conteúdo cai para o inglês
 * (o selo "não traduzido" marca cada trecho). Dispensado uma vez por idioma,
 * guardado no navegador.
 */
const { t, locale } = useI18n()

const dismissed = useLocalStorage('partial-translation-dismissed', [])

const visible = computed(() => isPartialLang(locale.value) && !dismissed.value.includes(locale.value))

const dismiss = () => {
  dismissed.value = [...dismissed.value, locale.value]
}
</script>

<template>
  <transition name="notice">
    <aside v-if="visible" class="partial-notice glass-panel" role="status">
      <Languages :size="16" class="notice-icon" aria-hidden="true" />
      <p class="notice-text">{{ t('partial_translation.message') }}</p>
      <div class="notice-actions">
        <button type="button" class="notice-ok" @click="dismiss">{{ t('partial_translation.dismiss') }}</button>
        <button type="button" class="notice-close" :aria-label="t('partial_translation.close')" :title="t('partial_translation.close')" @click="dismiss">
          <X :size="14" aria-hidden="true" />
        </button>
      </div>
    </aside>
  </transition>
</template>

<style scoped>
.partial-notice {
  position: fixed;
  left: var(--spacing-lg);
  bottom: var(--spacing-lg);
  z-index: 900; /* abaixo da navbar (1000) e das configurações */
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  max-width: min(420px, calc(100vw - 2 * var(--spacing-md)));
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.notice-icon {
  flex-shrink: 0;
  margin-top: 0.15rem;
  color: var(--primary);
}

.notice-text {
  font-size: var(--text-sm);
  line-height: 1.5;
  color: var(--text-secondary);
}

.notice-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  flex-shrink: 0;
}

.notice-ok {
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-full);
  background-color: var(--primary);
  color: var(--text-on-primary);
  font-size: var(--text-xs);
  font-weight: 700;
  transition: background-color var(--transition-fast);
}

.notice-ok:hover {
  background-color: var(--primary-hover);
}

.notice-close {
  display: inline-grid;
  place-items: center;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: var(--radius-full);
  color: var(--text-muted);
  transition: color var(--transition-fast), background-color var(--transition-fast);
}

.notice-close:hover {
  color: var(--text-primary);
  background-color: var(--bg-surface-2);
}

.notice-enter-active,
.notice-leave-active {
  transition: opacity var(--transition-base), transform var(--transition-base);
}

.notice-enter-from,
.notice-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 768px) {
  .partial-notice {
    left: var(--spacing-md);
    right: var(--spacing-md);
    bottom: var(--spacing-md);
    max-width: none;
  }
}
</style>
