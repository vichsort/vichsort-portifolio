<script setup>
import { computed } from 'vue'
import { renderMarkdown } from '@/core/content/markdown'
import { FileText } from 'lucide-vue-next'

const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  filename: {
    type: String,
    default: ''
  }
})

const renderedHtml = computed(() => {
  if (!props.content) return ''
  return renderMarkdown(props.content)
})
</script>

<template>
  <div class="output-markdown">
    <div v-if="filename" class="markdown-header">
      <FileText :size="14" class="header-icon" />
      <span class="header-filename">{{ filename }}</span>
      <span class="header-badge">MARKDOWN</span>
    </div>

    <div class="markdown-body" v-html="renderedHtml"></div>
  </div>
</template>

<style scoped>
.output-markdown {
  margin: 0.5rem 0;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface-1);
  overflow: hidden;
}

.markdown-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  background: var(--bg-surface-2);
  border-bottom: 1px solid var(--border-subtle);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.header-icon {
  color: var(--neon-cyan);
}

.header-filename {
  font-weight: 600;
  color: var(--text-primary);
}

.header-badge {
  margin-left: auto;
  font-size: var(--text-xs);
  padding: 0.1rem 0.4rem;
  border-radius: var(--radius-sm);
  background: var(--primary-subtle);
  color: var(--neon-cyan);
  letter-spacing: 0.05em;
  font-weight: 700;
}

.markdown-body {
  padding: 1rem;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: 1.7;
  color: var(--text-secondary);
  word-break: break-word;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4) {
  color: var(--text-primary);
  font-weight: 700;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.markdown-body :deep(h1:first-child),
.markdown-body :deep(h2:first-child),
.markdown-body :deep(h3:first-child) {
  margin-top: 0;
}

.markdown-body :deep(h1) {
  font-size: var(--text-xl);
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: 0.25rem;
}

.markdown-body :deep(h2) {
  font-size: var(--text-lg);
  color: var(--neon-cyan);
}

.markdown-body :deep(h3) {
  font-size: var(--text-base);
  color: var(--text-primary);
}

.markdown-body :deep(p) {
  margin-bottom: 0.75rem;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 0.5rem 0 0.75rem 1.5rem;
  padding: 0;
}

.markdown-body :deep(li) {
  margin-bottom: 0.25rem;
}

.markdown-body :deep(strong) {
  color: var(--text-primary);
  font-weight: 600;
}

.markdown-body :deep(em) {
  color: var(--neon-magenta);
  font-style: italic;
}

.markdown-body :deep(code) {
  padding: 0.15rem 0.35rem;
  border-radius: var(--radius-sm);
  background: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  color: var(--neon-pink);
  font-size: 0.85em;
}

.markdown-body :deep(pre) {
  margin: 0.75rem 0;
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  background: var(--bg-canvas);
  border: 1px solid var(--border-subtle);
  overflow-x: auto;
}

.markdown-body :deep(pre code) {
  padding: 0;
  background: transparent;
  border: none;
  color: var(--text-primary);
}

.markdown-body :deep(a) {
  color: var(--neon-cyan);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.markdown-body :deep(a:hover) {
  color: var(--neon-magenta);
}

.markdown-body :deep(blockquote) {
  margin: 0.75rem 0;
  padding-left: 0.75rem;
  border-left: 3px solid var(--neon-cyan);
  color: var(--text-muted);
}

.markdown-body :deep(hr) {
  margin: 1rem 0;
  border: 0;
  border-top: 1px solid var(--border-subtle);
}
</style>

