<script setup>
import OutputText from '../outputs/OutputText.vue'
import OutputMarkdown from '../outputs/OutputMarkdown.vue'
import OutputBanner from '../outputs/OutputBanner.vue'

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
      <div v-if="entry.command !== undefined && entry.command !== null" class="history-command-line">
        <span class="prompt-prefix">
          <span class="prompt-user">{{ entry.user || 'vitor' }}@{{ entry.host || 'vichos' }}</span>
          <span class="prompt-separator">:</span>
          <span class="prompt-cwd">{{ entry.cwd || '~' }}</span>
          <span class="prompt-symbol">$</span>
        </span>
        <span class="history-command-text">{{ entry.command }}</span>
      </div>

      <div
        v-if="entry.output"
        class="history-output"
      >
        <OutputText
          v-if="typeof entry.output === 'string'"
          :content="entry.output"
          :is-error="entry.isError"
        />
        <OutputBanner
          v-else-if="entry.output.type === 'banner'"
          :content="entry.output.payload"
        />
        <OutputMarkdown
          v-else-if="entry.output.type === 'markdown'"
          :content="entry.output.payload"
          :filename="entry.output.filename"
        />
        <OutputText
          v-else-if="entry.output.payload !== undefined"
          :content="entry.output.payload"
          :is-error="entry.isError || entry.output.type === 'error'"
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

.history-command-text {
  color: var(--text-primary);
  word-break: break-word;
}

.history-output {
  color: var(--text-secondary);
  overflow-x: auto;
}

.history-output.is-error {
  color: var(--danger);
}

.output-raw {
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>

