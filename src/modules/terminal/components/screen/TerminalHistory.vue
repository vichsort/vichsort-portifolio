<script setup>
import OutputText from '../outputs/OutputText.vue'
import OutputMarkdown from '../outputs/OutputMarkdown.vue'
import OutputBanner from '../outputs/OutputBanner.vue'
import OutputNeofetch from '../outputs/OutputNeofetch.vue'
import PromptPrefix from './PromptPrefix.vue'

defineProps({
  history: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <div class="terminal-history" aria-live="polite">
    <div
      v-for="entry in history"
      :key="entry.id"
      class="history-entry"
    >
      <div v-if="entry.command !== null" class="history-command-line">
        <PromptPrefix :user="entry.user" :host="entry.host" :cwd="entry.cwd" />
        <span class="history-command-text">{{ entry.command }}</span>
      </div>

      <div
        v-for="(output, index) in entry.outputs"
        :key="index"
        class="history-output"
      >
        <OutputBanner
          v-if="output.type === 'banner'"
          :content="output.payload"
        />
        <OutputNeofetch
          v-else-if="output.type === 'neofetch'"
          :content="output.payload"
        />
        <OutputMarkdown
          v-else-if="output.type === 'markdown'"
          :html="output.html"
          :filename="output.filename"
        />
        <OutputText
          v-else-if="output.payload !== undefined"
          :content="output.payload"
          :is-error="output.type === 'error'"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.terminal-history {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: 1.5;
}

.history-entry {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.history-command-line {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.history-command-text {
  color: var(--text-primary);
  word-break: break-word;
}

.history-output {
  color: var(--text-secondary);
  overflow-x: auto;
}
</style>

