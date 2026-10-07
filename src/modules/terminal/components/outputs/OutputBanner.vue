<script setup>
defineProps({
  content: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="output-banner">
    <pre class="ascii-gradient">{{ content }}</pre>
  </div>
</template>

<style scoped>
.output-banner {
  margin: 0.5rem 0;
  width: 100%;
  overflow-x: auto;
}

.ascii-gradient {
  margin: 0;
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  line-height: 1.15;
  white-space: pre;
  background: linear-gradient(135deg, var(--neon-cyan) 0%, var(--accent) 50%, var(--neon-magenta) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  font-weight: 700;
  user-select: none;
}
</style>

