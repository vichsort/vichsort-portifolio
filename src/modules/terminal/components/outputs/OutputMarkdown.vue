<script setup>
import { computed } from 'vue'
import { renderMarkdown } from '@/core/utils/markdown'
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
  border-radius: var(--radius-md, 6px);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  background: var(--bg-surface-raised, rgba(15, 23, 42, 0.4));
  overflow: hidden;
}

.markdown-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  background: var(--bg-surface-sunken, rgba(0, 0, 0, 0.25));
  border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: var(--text-xs, 0.75rem);
  color: var(--text-tertiary, #94a3b8);
}

.header-icon {
  color: var(--primary, #38bdf8);
}

.header-filename {
  font-weight: 600;
  color: var(--text-primary, #f8fafc);
}

.header-badge {
  margin-left: auto;
  font-size: 0.65rem;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  background: var(--primary-subtle, rgba(56, 189, 248, 0.15));
  color: var(--primary, #38bdf8);
  letter-spacing: 0.05em;
  font-weight: 700;
}

.markdown-body {
  padding: 1rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: var(--text-sm, 0.875rem);
  line-height: 1.7;
  color: var(--text-secondary, #cbd5e1);
  word-break: break-word;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4) {
  color: var(--text-primary, #f8fafc);
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
  font-size: 1.25rem;
  border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  padding-bottom: 0.25rem;
}

.markdown-body :deep(h2) {
  font-size: 1.1rem;
  color: var(--primary, #38bdf8);
}

.markdown-body :deep(h3) {
  font-size: 0.95rem;
  color: var(--text-primary, #f8fafc);
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
  color: var(--text-primary, #f8fafc);
  font-weight: 600;
}

.markdown-body :deep(em) {
  color: var(--primary-light, #7dd3fc);
  font-style: italic;
}

.markdown-body :deep(code) {
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f43f5e;
  font-size: 0.85em;
}

.markdown-body :deep(pre) {
  margin: 0.75rem 0;
  padding: 0.75rem;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow-x: auto;
}

.markdown-body :deep(pre code) {
  padding: 0;
  background: transparent;
  border: none;
  color: #e2e8f0;
}

.markdown-body :deep(a) {
  color: var(--primary, #38bdf8);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.markdown-body :deep(a:hover) {
  color: var(--primary-hover, #0284c7);
}

.markdown-body :deep(blockquote) {
  margin: 0.75rem 0;
  padding-left: 0.75rem;
  border-left: 3px solid var(--primary, #38bdf8);
  color: var(--text-tertiary, #94a3b8);
}

.markdown-body :deep(hr) {
  margin: 1rem 0;
  border: 0;
  border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
}
</style>

