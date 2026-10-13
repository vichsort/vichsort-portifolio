import { describe, expect, it } from 'vitest'
import { renderBody, renderMarkdown } from '../markdown.ts'

const options = {
  label: (target: string) => ({ vue: 'Vue', web: 'Web', plante: 'PlantE' })[target] ?? target,
  href: (target: string) => (target === 'plante' ? '/projects/plante' : null),
  menu: (target: string) => (target === 'web' || target === 'vue' ? target : null),
  source: 'alpha'
}

describe('renderBody', () => {
  it('nó com página vira link, com o nome do nó ou o rótulo', () => {
    expect(renderBody('Veja o [[plante]].', options)).toBe('<p>Veja o <a href="/projects/plante">PlantE</a>.</p>\n')
    expect(renderBody('Veja o [[plante|app]].', options)).toContain('<a href="/projects/plante">app</a>')
  })

  it('nó sem página e com menu vira o gatilho do menu', () => {
    expect(renderBody('Feito em [[vue]].', options)).toContain(
      '<button type="button" class="node-ref" data-node="vue" data-from="alpha" aria-haspopup="menu" aria-expanded="false">Vue</button>'
    )
  })

  it('nó sem página nem menu fica só o texto', () => {
    expect(renderBody('Sobre [[sql|bancos]].', options)).toBe('<p>Sobre bancos.</p>\n')
  })

  it('colchetes no nome do nó não quebram o link', () => {
    const label = () => '[beta] PlantE'
    expect(renderBody('[[plante]]', { ...options, label })).toContain('<a href="/projects/plante">[beta] PlantE</a>')
  })

  it('rótulo vai escapado no gatilho do menu', () => {
    expect(renderBody('[[web|<b>x</b>]]', options)).toContain('>&lt;b&gt;x&lt;/b&gt;</button>')
  })

  it('embeds e imagens relativas apontam para os arquivos da pasta do nó', () => {
    const assets = { 'shot.png': '/assets/shot-123.png', 'a b.png': '/assets/ab.png' }
    expect(renderBody('![[shot.png]]', { assets })).toContain('<img src="/assets/shot-123.png" alt="">')
    // Nome com espaço, como o Obsidian salva uma imagem colada
    expect(renderBody('![[a b.png]]', { assets })).toContain('src="/assets/ab.png"')
    expect(renderBody('![tela](shot.png)', { assets })).toContain('<img src="/assets/shot-123.png" alt="tela">')
    expect(renderBody('![x](https://x.dev/i.png)', { assets })).toContain('src="https://x.dev/i.png"')
  })

  it('quebras de linha e links soltos', () => {
    expect(renderBody('a\nb')).toBe('<p>a<br>\nb</p>\n')
    expect(renderBody('https://planteai.org')).toContain('<a href="https://planteai.org">')
  })
})

describe('renderMarkdown', () => {
  it('texto vazio não vira parágrafo', () => {
    expect(renderMarkdown('')).toBe('')
    expect(renderMarkdown('**oi**')).toBe('<p><strong>oi</strong></p>\n')
  })
})
