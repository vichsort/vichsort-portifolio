<script setup>
import { ref, watch, nextTick } from 'vue'
import TerminalHistory from './TerminalHistory.vue'
import TerminalPrompt from './TerminalPrompt.vue'

const props = defineProps({
  history: {
    type: Array,
    default: () => []
  },
  cwd: {
    type: String,
    default: '~'
  },
  user: {
    type: String,
    default: 'vitor'
  },
  host: {
    type: String,
    default: 'vichos'
  },
  modelValue: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  welcomeMessage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['submit', 'update:modelValue', 'keydown'])

const screenRef = ref(null)
const promptRef = ref(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (screenRef.value) {
      screenRef.value.scrollTop = screenRef.value.scrollHeight
    }
  })
}

const handleScreenClick = (event) => {
  // If user is selecting text, do not force focus back to input
  const selection = window.getSelection()
  if (selection && selection.toString().length > 0) {
    return
  }
  // Focus prompt
  if (promptRef.value) {
    promptRef.value.focus()
  }
}

watch(
  () => props.history.length,
  () => {
    scrollToBottom()
  }
)

defineExpose({
  focus: () => promptRef.value?.focus(),
  scrollToBottom
})
</script>

<template>
  <div
    ref="screenRef"
    class="terminal-screen"
    tabindex="-1"
    @click="handleScreenClick"
  >
    <div v-if="welcomeMessage" class="terminal-welcome">
      <pre class="welcome-text">{{ welcomeMessage }}</pre>
    </div>

    <TerminalHistory :history="history" />

    <TerminalPrompt
      ref="promptRef"
      :cwd="cwd"
      :user="user"
      :host="host"
      :model-value="modelValue"
      :disabled="disabled"
      @update:model-value="(val) => emit('update:modelValue', val)"
      @keydown="(e) => emit('keydown', e)"
      @submit="(cmd) => emit('submit', cmd)"
    />
  </div>
</template>

<style scoped>
.terminal-screen {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 1.5rem;
  background-color: var(--bg-canvas);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-sizing: border-box;
  scroll-behavior: smooth;
}

.terminal-welcome {
  margin-bottom: 0.5rem;
}

.welcome-text {
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: var(--text-sm);
  color: var(--text-muted);
  white-space: pre-wrap;
  line-height: 1.6;
}
</style>

