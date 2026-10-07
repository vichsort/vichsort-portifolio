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
  },
  autofocus: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['submit', 'update:modelValue', 'history-prev', 'history-next', 'complete', 'interrupt', 'clear-screen'])

const inputRef = ref(null)

// preventScroll: focar não pode arrastar a página até o terminal
const focus = () => {
  inputRef.value?.focus({ preventScroll: true })
}

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}

const handlePaste = (event) => {
  event.preventDefault()
  const clipboardData = event.clipboardData || window.clipboardData
  const text = clipboardData ? clipboardData.getData('text') : ''
  if (!text) return

  // Converte quebras de linha em espaços simples
  const sanitized = text.replace(/[\r\n]+/g, ' ')
  const input = inputRef.value
  if (!input) {
    emit('update:modelValue', sanitized)
    return
  }

  const start = input.selectionStart ?? 0
  const end = input.selectionEnd ?? 0
  const current = props.modelValue || ''
  const updated = current.slice(0, start) + sanitized + current.slice(end)

  emit('update:modelValue', updated)

  const nextPos = start + sanitized.length
  requestAnimationFrame(() => {
    if (inputRef.value) {
      inputRef.value.setSelectionRange(nextPos, nextPos)
    }
  })
}

// Texto selecionado no campo ou, se não houver, na tela
const selectedText = () => {
  const input = inputRef.value
  if (input && input.selectionStart !== input.selectionEnd) {
    return input.value.slice(input.selectionStart, input.selectionEnd)
  }
  return window.getSelection()?.toString() || ''
}

const handleKeydown = (event) => {
  const key = event.key.toLowerCase()
  const plain = !event.ctrlKey && !event.metaKey && !event.altKey

  if (key === 'enter' && plain && !event.shiftKey) {
    event.preventDefault()
    emit('submit', props.modelValue)
  } else if (key === 'arrowup' && plain) {
    event.preventDefault()
    emit('history-prev')
  } else if (key === 'arrowdown' && plain) {
    event.preventDefault()
    emit('history-next')
  } else if (key === 'tab' && plain && !event.shiftKey) {
    event.preventDefault()
    emit('complete')
  } else if (key === 'l' && event.ctrlKey && !event.altKey) {
    event.preventDefault()
    emit('clear-screen')
  } else if (key === 'c' && event.ctrlKey && !event.altKey) {
    // Como num terminal Linux: Ctrl+C interrompe; copiar é Ctrl+Shift+C
    event.preventDefault()
    if (!event.shiftKey) {
      emit('interrupt')
      return
    }
    const text = selectedText()
    if (text) navigator.clipboard?.writeText(text).catch(() => {})
  } else if (key === 'v' && event.ctrlKey && !event.shiftKey && !event.altKey) {
    // Colar é Ctrl+Shift+V (o navegador cola sozinho e cai no handlePaste)
    event.preventDefault()
  }
}

onMounted(() => {
  if (props.autofocus) focus()
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
        @paste="handlePaste"
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
  font-family: var(--font-mono);
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
  color: var(--neon-cyan);
  font-weight: 600;
}

.prompt-separator {
  color: var(--text-muted);
}

.prompt-cwd {
  color: var(--neon-magenta);
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
  caret-color: var(--neon-cyan);
}

.prompt-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

