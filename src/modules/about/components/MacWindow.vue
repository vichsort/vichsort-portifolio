<script setup>
defineProps({
  title: {
    type: String,
    default: 'profile.md'
  }
})
</script>

<template>
  <div class="mac-window surface-card">
    <div class="mac-titlebar">
      <div class="window-controls" aria-hidden="true">
        <span class="control-dot close-dot"></span>
        <span class="control-dot minimize-dot"></span>
        <span class="control-dot maximize-dot"></span>
      </div>

      <div class="window-title">
        <span class="file-name">{{ title }}</span>
      </div>

      <div class="window-actions-spacer" aria-hidden="true"></div>
    </div>

    <div class="mac-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.mac-window {
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-subtle);
  background-color: var(--bg-surface-1);
  width: 100%;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.mac-window:hover {
  border-color: var(--primary-border);
  box-shadow: var(--shadow-card-hover);
}

.mac-titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  background-color: var(--bg-surface-2);
  border-bottom: 1px solid var(--border-subtle);
  user-select: none;
}

.window-controls {
  display: flex;
  align-items: center;
  gap: 7px;
  width: 54px;
}

.control-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  display: inline-block;
}

.close-dot {
  background-color: #ff5f56;
  box-shadow: 0 0 4px rgba(255, 95, 86, 0.4);
}

.minimize-dot {
  background-color: #ffbd2e;
  box-shadow: 0 0 4px rgba(255, 189, 46, 0.4);
}

.maximize-dot {
  background-color: #27c93f;
  box-shadow: 0 0 4px rgba(39, 201, 63, 0.4);
}

.window-title {
  font-family: var(--font-heading);
  font-size: var(--text-xs);
  color: var(--text-muted);
  letter-spacing: 0.5px;
  text-align: center;
  flex: 1;
}

.file-name {
  color: var(--text-secondary);
}

.window-actions-spacer {
  width: 54px;
}

.mac-content {
  padding: var(--spacing-xl);
  max-height: 440px;
  overflow-y: auto;
}

.mac-content::-webkit-scrollbar {
  width: 6px;
}

.mac-content::-webkit-scrollbar-track {
  background: transparent;
}

.mac-content::-webkit-scrollbar-thumb {
  background: var(--border-medium);
  border-radius: var(--radius-full);
}

@media (max-width: 768px) {
  .mac-content {
    padding: var(--spacing-md);
    max-height: 400px;
  }
}
</style>
