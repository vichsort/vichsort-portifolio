<script setup>
import { computed } from 'vue'
import { Search, X } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Buscar...'
  },
  clearable: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'clear'])

const hasValue = computed(() => Boolean(props.modelValue && props.modelValue.trim().length > 0))

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}

const clearInput = () => {
  emit('update:modelValue', '')
  emit('clear')
}

const handleKeydown = (event) => {
  if (event.key === 'Escape' && hasValue.value) {
    clearInput()
  }
}
</script>

<template>
  <div
    class="base-search-input surface-card"
    :class="{ 'has-value': hasValue, 'is-disabled': disabled }"
  >
    <Search :size="17" class="search-icon" aria-hidden="true" />

    <input
      :value="modelValue"
      @input="handleInput"
      @keydown="handleKeydown"
      :placeholder="placeholder"
      :disabled="disabled"
      type="text"
      class="input-field"
      aria-label="Campo de busca"
    />

    <button
      v-if="clearable && hasValue"
      @click="clearInput"
      type="button"
      class="clear-btn"
      aria-label="Limpar busca"
      title="Limpar"
    >
      <X :size="14" />
    </button>
  </div>
</template>

<style scoped>
.base-search-input {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.6rem 1rem;
  border-radius: var(--radius-full);
  background-color: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  transition: all var(--transition-fast);
  width: 100%;
}

.base-search-input:focus-within {
  border-color: var(--primary-border);
  box-shadow: 0 0 0 3px var(--primary-subtle);
  background-color: var(--bg-surface-1);
}

.search-icon {
  color: var(--text-muted);
  flex-shrink: 0;
  transition: color var(--transition-fast);
}

.base-search-input:focus-within .search-icon {
  color: var(--primary);
}

.input-field {
  background: none;
  border: none;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  width: 100%;
  outline: none;
  line-height: 1.4;
}

.input-field::placeholder {
  color: var(--text-muted);
}

.clear-btn {
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border-radius: var(--radius-full);
  background-color: var(--border-subtle);
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.clear-btn:hover {
  color: var(--text-primary);
  background-color: var(--primary-subtle);
}

.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
