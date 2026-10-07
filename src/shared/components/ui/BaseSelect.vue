<script setup>
import { ref, computed } from 'vue'
import { onClickOutside, onKeyStroke } from '@vueuse/core'
import { ChevronDown, Check } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Selecione...'
  },
  label: {
    type: String,
    default: ''
  },
  allLabel: {
    type: String,
    default: 'Todos'
  },
  showAllOption: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const selectRef = ref(null)

onClickOutside(selectRef, () => {
  isOpen.value = false
})

onKeyStroke('Escape', () => {
  if (isOpen.value) {
    isOpen.value = false
  }
})

const normalizedOptions = computed(() => {
  return props.options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return {
        value: opt.value !== undefined ? opt.value : opt.label,
        label: opt.label || String(opt.value)
      }
    }
    return {
      value: opt,
      label: String(opt)
    }
  })
})

const selectedOption = computed(() => {
  if (!props.modelValue || props.modelValue === 'ALL' || props.modelValue === '') {
    return null
  }
  return normalizedOptions.value.find((opt) => String(opt.value).toLowerCase() === String(props.modelValue).toLowerCase())
})

const displayLabel = computed(() => {
  if (selectedOption.value) {
    return selectedOption.value.label
  }
  return props.showAllOption ? props.allLabel : props.placeholder
})

const isSelected = (value) => {
  if (!props.modelValue || props.modelValue === 'ALL') {
    return value === '' || value === 'ALL'
  }
  return String(props.modelValue).toLowerCase() === String(value).toLowerCase()
}

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

const selectOption = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
  isOpen.value = false
}
</script>

<template>
  <div
    class="base-select-wrapper"
    ref="selectRef"
    :class="{ 'is-open': isOpen, 'is-disabled': disabled, 'has-selection': selectedOption !== null }"
  >
    <label v-if="label" class="select-label">{{ label }}</label>

    <button
      type="button"
      @click="toggleDropdown"
      class="select-trigger surface-card"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
    >
      <span class="trigger-text" :class="{ 'is-placeholder': !selectedOption }">
        {{ displayLabel }}
      </span>

      <ChevronDown :size="16" class="chevron-icon" :class="{ 'rotate': isOpen }" />
    </button>

    <transition name="dropdown-fade">
      <div v-if="isOpen" class="dropdown-panel surface-card" role="listbox">
        <ul class="options-list">
          <li
            v-if="showAllOption"
            @click="selectOption('ALL')"
            class="option-item"
            :class="{ active: isSelected('ALL') }"
            role="option"
            :aria-selected="isSelected('ALL')"
          >
            <span class="option-text">{{ allLabel }}</span>
            <Check v-if="isSelected('ALL')" :size="15" class="check-icon" />
          </li>

          <li
            v-for="opt in normalizedOptions"
            :key="opt.value"
            @click="selectOption(opt.value)"
            class="option-item"
            :class="{ active: isSelected(opt.value) }"
            role="option"
            :aria-selected="isSelected(opt.value)"
          >
            <span class="option-text">{{ opt.label }}</span>
            <Check v-if="isSelected(opt.value)" :size="15" class="check-icon" />
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.base-select-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 180px;
}

.select-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.6rem 1rem;
  border-radius: var(--radius-full);
  background-color: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  width: 100%;
}

.select-trigger:hover {
  border-color: var(--primary-border);
  background-color: var(--bg-surface-1);
}

.is-open .select-trigger {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-subtle);
  background-color: var(--bg-surface-1);
}

.has-selection .select-trigger {
  color: var(--primary);
  font-weight: 600;
}

.trigger-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.trigger-text.is-placeholder {
  color: var(--text-secondary);
}

.chevron-icon {
  color: var(--text-muted);
  flex-shrink: 0;
  transition: transform var(--transition-base), color var(--transition-fast);
}

.chevron-icon.rotate {
  transform: rotate(180deg);
  color: var(--primary);
}

/* Dropdown Panel */
.dropdown-panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 100%;
  min-width: 200px;
  max-height: 260px;
  overflow-y: auto;
  border-radius: var(--radius-md);
  background-color: var(--bg-surface-1);
  border: 1px solid var(--border-medium);
  box-shadow: var(--shadow-card);
  z-index: 100;
  padding: 0.4rem;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.55rem 0.85rem;
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.option-item:hover {
  color: var(--text-primary);
  background-color: var(--primary-subtle);
}

.option-item.active {
  color: var(--text-on-primary);
  background-color: var(--primary);
  font-weight: 600;
}

.check-icon {
  color: inherit;
  flex-shrink: 0;
}

/* Transitions */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
