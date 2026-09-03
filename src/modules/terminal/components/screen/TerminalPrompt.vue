<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  user: {
    type: String,
    default: 'vitor'
  },
  host: {
    type: String,
    default: 'vichos'
  },
  cwd: {
    type: String,
    default: '~'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['submit', 'update:modelValue', 'keydown'])

const inputRef = ref(null)

const focus = () => {
  if (inputRef.value) {
    inputRef.value.focus()
  }
}

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}

const handleKeydown = (event) => {
  emit('keydown', event)
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    emit('submit', props.modelValue)
  }
}

onMounted(() => {
  focus()
})

defineExpose({
  focus,
  inputRef
})
</script>

<template>
  <div class="terminal-prompt-line">
    <span class="prompt-prefix">
      <span class="prompt-user">{{ user }}@{{ host }}</span>
      <span class="prompt-separator">:</span>
      <span class="prompt-cwd">{{ cwd }}</span>
      <span class="prompt-symbol">$</span>
    </span>

    <div class="prompt-input-wrapper">
      <input
        ref="inputRef"
        type="text"
        class="prompt-input"
        :value="modelValue"
        :disabled="disabled"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        aria-label="Terminal input prompt"
        @input="handleInput"
        @keydown="handleKeydown"
      />
    </div>
  </div>
</template>

<style scoped>
.terminal-prompt-line {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: var(--text-sm);
  line-height: 1.5;
  width: 100%;
}

.prompt-prefix {
  display: inline-flex;
  align-items: center;
  user-select: none;
  white-space: nowrap;
}

.prompt-user {
  color: #38bdf8;
  font-weight: 600;
}

.prompt-separator {
  color: var(--text-muted);
}

.prompt-cwd {
  color: #a855f7;
  font-weight: 600;
}

.prompt-symbol {
  color: var(--text-primary);
  margin-left: 0.25rem;
  font-weight: 700;
}

.prompt-input-wrapper {
  flex: 1;
  min-width: 120px;
  display: flex;
  align-items: center;
}

.prompt-input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  padding: 0;
  margin: 0;
  caret-color: #38bdf8;
}

.prompt-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

