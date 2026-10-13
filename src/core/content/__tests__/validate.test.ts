import { describe, expect, it } from 'vitest'
import { buildGraph } from '../graph.ts'
import { validateGraph } from '../validate.ts'
import { ICONS, md, vault } from './vault.ts'

const issues = (changes: Record<string, string | null> = {}, assets = ICONS) => validateGraph(buildGraph(vault(changes), assets))
const codes = (changes: Record<string, string | null> = {}, assets = ICONS) => issues(changes, assets).map((i) => `${i.level}:${i.code}`)

describe('validateGraph', () => {
  it('o vault de exemplo passa limpo', () => {
    expect(issues()).toEqual([])
  })

  it.each([
    ['error:missing-field', { 'projects/beta/beta.md': md('category: "[[app]]"') }],
    ['error:missing-field', { 'collections/stack/stack.md': md('items: []') }],
    ['error:bad-enum', { 'techs/vue/vue.md': md('name: Vue\nsource: rascunho') }],
    ['error:bad-date', { 'projects/beta/beta.md': md('category: "[[app]]"\ndate: 03/2024') }],
    ['error:missing-text', { 'projects/beta/beta.en.md': null }],
    ['error:missing-text', { 'projects/beta/beta.en.md': md('title: Beta') }],
    ['error:missing-text', { 'projects/beta/beta.es.md': md('summary: Resumen') }],
    ['warning:missing-translation', { 'projects/beta/beta.pt.md': md('title: Beta\nsummary: Resumo\naward: 1º lugar') }],
    ['warning:body-link-asymmetry', { 'projects/beta/beta.pt.md': md('title: Beta\nsummary: Resumo', 'Usa [[vue]].') }]
  ])('%s', (code, changes) => {
    expect(codes(changes)).toContain(code)
  })

  it('idioma opcional só é cobrado quando o arquivo existe', () => {
    expect(codes()).not.toContain('error:missing-text')
  })

  it('tech de uma stack sem ícone é erro; ícone fora de stack é aviso', () => {
    expect(codes({}, ICONS.filter((a) => !a.path.includes('/vue/')))).toEqual(['error:missing-icon'])
    expect(codes({}, [...ICONS, { path: 'techs/rust/icon.svg', url: '/icons/rust.svg' }])).toEqual([])
    const rust = { 'techs/rust/rust.md': md('name: Rust') }
    expect(codes(rust, [...ICONS, { path: 'techs/rust/icon.svg', url: '/icons/rust.svg' }])).toEqual(['warning:uncollected-tech'])
  })

  it('aponta o arquivo do idioma que falta', () => {
    const [issue] = issues({ 'projects/beta/beta.pt.md': md('title: Beta\nsummary: Resumo', 'Usa [[vue]].') })
    expect(issue.where).toBe('projects/beta/beta.en.md')
  })
})
