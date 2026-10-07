<script setup>
import { RotateCcw } from 'lucide-vue-next'

// Listagem sem resultados: a mensagem e, se houver filtro ativo, o atalho para limpar
defineProps({
  text: { type: String, required: true },
  clearLabel: { type: String, default: '' },
  canClear: { type: Boolean, default: false }
})

const emit = defineEmits(['clear'])
</script>

<template>
  <div class="listing-empty surface-card">
    <p class="empty-text">{{ text }}</p>
    <button v-if="canClear" type="button" class="empty-action" @click="emit('clear')">
      <RotateCcw :size="14" aria-hidden="true" />
      <span>{{ clearLabel }}</span>
    </button>
  </div>
</template>

<style scoped>
.listing-empty {
  padding: var(--spacing-2xl);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  text-align: center;
}

.empty-text {
  color: var(--text-secondary);
}

.empty-action {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.9rem;
  border-radius: var(--radius-full);
  background-color: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-size: var(--text-xs);
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
}

.empty-action:hover {
  color: var(--text-on-primary);
  background-color: var(--primary);
  border-color: var(--primary);
}
</style>
