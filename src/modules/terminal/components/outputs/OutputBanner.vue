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
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
  font-size: 0.78rem;
  line-height: 1.15;
  white-space: pre;
  background: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  font-weight: 700;
  user-select: none;
}
</style>

