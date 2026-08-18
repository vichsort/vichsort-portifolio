import MarkdownIt from 'markdown-it'
import frontMatter from 'front-matter'

export const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true
})

export function parseMarkdown(content) {
  if (!content) return { attributes: {}, body: '', html: '' }
  try {
    const parsed = frontMatter(content)
    return {
      attributes: parsed.attributes || {},
      body: parsed.body || '',
      html: md.render(parsed.body || '')
    }
  } catch {
    return {
      attributes: {},
      body: content,
      html: md.render(content)
    }
  }
}

export function renderMarkdown(rawText) {
  if (!rawText) return ''
  return md.render(rawText)
}
