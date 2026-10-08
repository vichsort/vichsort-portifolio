<script setup>
/**
 * O "user@host:cwd$" do prompt, igual na linha atual e nas linhas do histórico.
 */
defineProps({
  user: { type: String, required: true },
  host: { type: String, required: true },
  cwd: { type: String, required: true }
})
</script>

<template>
  <span class="prompt-prefix">
    <span class="prompt-user">{{ user }}@{{ host }}</span>
    <span class="prompt-separator">:</span>
    <span class="prompt-cwd">{{ cwd }}</span>
    <span class="prompt-symbol">$</span>
  </span>
</template>

<style scoped>
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
</style>
