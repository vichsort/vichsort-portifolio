<script setup>
defineProps({
  content: {
    type: [String, Number],
    default: ''
  },
  isError: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <pre class="output-text" :class="{ 'is-error': isError }">{{ content }}</pre>
</template>

<style scoped>
.output-text {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: 1.6;
  color: var(--text-secondary);
  white-space: pre-wrap;
  word-break: break-word;
}

.output-text.is-error {
  color: var(--danger);
}
</style>

