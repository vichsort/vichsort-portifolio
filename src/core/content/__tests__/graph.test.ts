import { describe, expect, it } from 'vitest'
import { buildGraph } from '../graph.ts'
import { ICONS, md, vault } from './vault.ts'

const codes = (changes: Record<string, string | null> = {}) => buildGraph(vault(changes)).issues.map((i) => i.code)

describe('buildGraph', () => {
  const graph = buildGraph(vault(), ICONS)

  it('monta um nó por pasta, ignorando a raiz e as pastas de apoio', () => {
    expect(graph.issues).toEqual([])
    expect([...graph.nodes.keys()].sort()).toEqual(['alpha', 'app', 'beta', 'frontend', 'javascript', 'python', 'stack', 'vue', 'web'])
    expect(graph.nodes.get('alpha')).toMatchObject({ type: 'project', path: 'projects/alpha' })
  })

  it('tira as ligações dos dados e guarda os ids resolvidos', () => {
    const alpha = graph.nodes.get('alpha')!
    expect(alpha.data).toEqual({ date: '2025-03' })
    expect(alpha.links).toEqual({ techs: ['python', 'vue'], category: 'app' })
  })

  it('resolve id e alias sem diferenciar maiúsculas', () => {
    expect(graph.resolve('PYTHON')).toBe('python')
    expect(graph.resolve('py')).toBe('python')
    expect(graph.resolve('nada')).toBeNull()
  })

  it('separa os textos por idioma e as citações do corpo, sem os embeds', () => {
    const alpha = graph.nodes.get('alpha')!
    expect(Object.keys(alpha.texts)).toEqual(['pt', 'en'])
    expect(alpha.texts.pt).toMatchObject({ title: 'Alfa', summary: 'Resumo' })
    expect(alpha.bodyLinks).toEqual({ pt: ['web'], en: ['web'] })
  })

  it('cria uma aresta por ligação, com o campo e o idioma do corpo', () => {
    const fromAlpha = graph.edges.filter((e) => e.from === 'alpha')
    expect(fromAlpha).toEqual([
      { from: 'alpha', to: 'python', field: 'techs', lang: null },
      { from: 'alpha', to: 'vue', field: 'techs', lang: null },
      { from: 'alpha', to: 'app', field: 'category', lang: null },
      { from: 'alpha', to: 'web', field: 'body', lang: 'pt' },
      { from: 'alpha', to: 'web', field: 'body', lang: 'en' }
    ])
    expect(graph.backlinks.get('vue')!.map((e) => e.from)).toEqual(['alpha', 'beta', 'stack'])
  })

  it('coleção em grupos', () => {
    expect(graph.nodes.get('stack')!.groups).toEqual([
      { group: 'frontend', items: ['vue', 'javascript'] },
      { group: 'frontend', items: ['python'] }
    ])
  })

  it('coleção em lista simples vira um grupo sem nó', () => {
    const flat = buildGraph(vault({ 'collections/stack/stack.md': md('items:\n  - "[[vue]]"\n  - "[[vue]]"') }))
    expect(flat.nodes.get('stack')!.groups).toEqual([{ group: null, items: ['vue'] }])
  })

  it('liga os arquivos da pasta ao nó', () => {
    expect(graph.nodes.get('vue')!.assets).toEqual({ 'icon.svg': '/icons/vue.svg' })
  })
})

describe('buildGraph: erros de leitura e de ligação', () => {
  it.each([
    ['bad-path', { 'techs/rust.md': md('name: Rust') }],
    ['unknown-type', { 'tools/git/git.md': md('name: Git') }],
    ['missing-structure', { 'techs/vue/vue.md': null, 'techs/vue/vue.pt.md': md('name: Vue') }],
    ['duplicate-id', { 'topics/vue/vue.md': md(''), 'topics/vue/vue.pt.md': md('name: Vue'), 'topics/vue/vue.en.md': md('name: Vue') }],
    ['duplicate-alias', { 'techs/javascript/javascript.md': md('name: JavaScript\naliases: [py]') }],
    ['broken-link', { 'techs/vue/vue.md': md('name: Vue\ntechs:\n  - "[[typescript]]"') }],
    ['broken-link', { 'projects/beta/beta.en.md': md('title: Beta\nsummary: Summary', 'See [[nowhere]].') }],
    ['wrong-link-type', { 'techs/vue/vue.md': md('name: Vue\ntechs:\n  - "[[web]]"') }],
    ['field-not-allowed', { 'categories/app/app.md': md('techs:\n  - "[[vue]]"') }],
    ['bad-yaml', { 'techs/vue/vue.md': '---\nname: [Vue\n---\n' }],
    ['stray-file', { 'techs/vue/notes.md': md('') }],
    ['bad-collection', { 'collections/stack/stack.md': md('items:\n  - group: "[[frontend]]"\n    items: ["[[vue]]"]\n  - "[[python]]"') }]
  ])('%s', (code, changes) => {
    expect(codes(changes)).toContain(code)
  })

  it('uma ligação quebrada não vira aresta', () => {
    const graph = buildGraph(vault({ 'techs/vue/vue.md': md('name: Vue\ntechs:\n  - "[[typescript]]"\n  - "[[javascript]]"') }))
    expect(graph.nodes.get('vue')!.links.techs).toEqual(['javascript'])
    expect(graph.edges.some((e) => e.to === 'typescript')).toBe(false)
  })
})
