<script setup>
import { computed } from 'vue'
import { renderMarkdown } from '@/core/content/markdown'

/**
 * Markdown no terminal (cat *.md), no estilo do glow: renderizado e legível,
 * mas com cara de terminal. Sem card; títulos em caixa alta com separadores,
 * • nas listas, blocos de código com barra lateral.
 *
 * Links externos abrem em nova aba (marcados com ↗); os internos navegam no site.
 */
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

const EXTERNAL_LINK = /<a href="(https?:\/\/[^"]+)"/g

const renderedHtml = computed(() => {
  if (!props.content) return ''
  return renderMarkdown(props.content).replace(EXTERNAL_LINK, '<a href="$1" target="_blank" rel="noopener noreferrer"')
})
</script>

<template>
  <div class="output-markdown">
    <p v-if="filename" class="file-rule">
      <span class="rule" aria-hidden="true">───</span>
      <span class="filename">{{ filename }}</span>
      <span class="rule rule-fill" aria-hidden="true" />
    </p>

    <div class="markdown-body" v-html="renderedHtml"></div>
  </div>
</template>

<style scoped>
.output-markdown {
  margin: 0.25rem 0 0.5rem;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

.file-rule {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.75rem;
  color: var(--text-muted);
  font-size: var(--text-xs);
}

.filename {
  color: var(--text-secondary);
  font-weight: 600;
}

.rule-fill {
  flex: 1;
  border-top: 1px solid var(--border-medium);
}

.markdown-body {
  max-width: 88ch;
  padding-left: 0.5rem;
  line-height: 1.7;
  color: var(--text-secondary);
  word-break: break-word;
}

/* Títulos: caixa alta nos neons, com régua embaixo (═ no h1, ─ no h2) */
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4) {
  font-size: var(--text-sm);
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1.4;
  margin: 1.5rem 0 0.6rem;
}

.markdown-body :deep(h1:first-child),
.markdown-body :deep(h2:first-child),
.markdown-body :deep(h3:first-child) {
  margin-top: 0;
}

.markdown-body :deep(h1) {
  text-transform: uppercase;
  color: var(--neon-magenta);
  padding-bottom: 0.3rem;
  border-bottom: 3px double var(--neon-magenta);
}

.markdown-body :deep(h2) {
  text-transform: uppercase;
  color: var(--neon-cyan);
  padding-bottom: 0.25rem;
  border-bottom: 1px solid var(--border-medium);
}

.markdown-body :deep(h3),
.markdown-body :deep(h4) {
  color: var(--neon-pink);
}

.markdown-body :deep(h3)::before,
.markdown-body :deep(h4)::before {
  content: '▍';
  margin-right: 0.35rem;
}

.markdown-body :deep(p) {
  margin: 0 0 0.75rem;
}

/* Listas: • neon no lugar do marcador do navegador */
.markdown-body :deep(ul) {
  list-style: none;
  margin: 0 0 0.75rem;
  padding: 0;
}

.markdown-body :deep(ul > li) {
  position: relative;
  padding-left: 1.4rem;
  margin-bottom: 0.25rem;
}

.markdown-body :deep(ul > li)::before {
  content: '•';
  position: absolute;
  left: 0.4rem;
  color: var(--neon-yellow);
}

.markdown-body :deep(ol) {
  margin: 0 0 0.75rem 1.6rem;
  padding: 0;
}

.markdown-body :deep(ol > li)::marker {
  color: var(--neon-yellow);
}

.markdown-body :deep(strong) {
  color: var(--text-primary);
  font-weight: 700;
}

.markdown-body :deep(em) {
  color: var(--neon-magenta);
  font-style: italic;
}

.markdown-body :deep(code) {
  padding: 0.05rem 0.3rem;
  border-radius: 4px;
  background: var(--bg-surface-2);
  color: var(--neon-pink);
  font-size: 0.92em;
}

/* Bloco de código: barra lateral, como o glow */
.markdown-body :deep(pre) {
  margin: 0.75rem 0;
  padding: 0.6rem 0.9rem;
  border-left: 2px solid var(--neon-magenta);
  background: var(--bg-surface-1);
  overflow-x: auto;
}

.markdown-body :deep(pre code) {
  padding: 0;
  background: transparent;
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

.markdown-body :deep(a[target='_blank'])::after {
  content: ' ↗';
  text-decoration: none;
  display: inline-block;
}

.markdown-body :deep(blockquote) {
  margin: 0.75rem 0;
  padding-left: 0.9rem;
  border-left: 2px solid var(--border-medium);
  color: var(--text-muted);
  font-style: italic;
}

.markdown-body :deep(hr) {
  margin: 1.25rem 0;
  border: 0;
  border-top: 1px dashed var(--border-medium);
}

.markdown-body :deep(img) {
  max-width: 100%;
  border-radius: var(--radius-sm);
}

.markdown-body :deep(table) {
  border-collapse: collapse;
  margin: 0.75rem 0;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--border-subtle);
  text-align: left;
}

.markdown-body :deep(th) {
  color: var(--neon-cyan);
}
</style>
