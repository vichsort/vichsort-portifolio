import { describe, expect, it } from 'vitest'
import { extractBodyLinks, parseLink, parseLinkList, replaceBodyLinks } from '../links.ts'

describe('parseLink', () => {
  it('lê as formas de wikilink do Obsidian', () => {
    expect(parseLink('[[python]]')).toBe('python')
    expect(parseLink('[[python|Python 3]]')).toBe('python')
    expect(parseLink('[[python#history]]')).toBe('python')
    expect(parseLink('  [[ python ]]  ')).toBe('python')
  })

  it('aceita o id puro e a lista aninhada que o YAML cria sem aspas', () => {
    expect(parseLink('python')).toBe('python')
    expect(parseLink([['python']])).toBe('python')
  })

  it('devolve null para valor vazio ou que não é texto', () => {
    expect(parseLink('')).toBeNull()
    expect(parseLink('   ')).toBeNull()
    expect(parseLink(null)).toBeNull()
    expect(parseLink(42)).toBeNull()
    expect(parseLink(['a', 'b'])).toBeNull()
  })
})

describe('parseLinkList', () => {
  it('normaliza valor único, lista e vazio', () => {
    expect(parseLinkList('[[vue]]')).toEqual(['vue'])
    expect(parseLinkList(['[[vue]]', [['react']], '', null])).toEqual(['vue', 'react'])
    expect(parseLinkList(undefined)).toEqual([])
    expect(parseLinkList('')).toEqual([])
  })
})

describe('extractBodyLinks', () => {
  it('lista os alvos do corpo, sem os embeds', () => {
    const body = 'Usa [[vue|Vue 3]] e [[python#uso]]. ![[cover.jpg]] De novo: [[vue]].'
    expect(extractBodyLinks(body)).toEqual(['vue', 'python', 'vue'])
  })

  it('aceita corpo vazio', () => {
    expect(extractBodyLinks('')).toEqual([])
  })
})

describe('replaceBodyLinks', () => {
  it('passa alvo, rótulo e se é embed', () => {
    const calls: Array<[string, string | undefined, boolean]> = []
    const out = replaceBodyLinks('[[a]] [[b| B ]] ![[c.png]]', (target, label, embed) => {
      calls.push([target, label, embed])
      return `<${label ?? target}>`
    })
    expect(out).toBe('<a> <B> <c.png>')
    expect(calls).toEqual([
      ['a', undefined, false],
      ['b', 'B', false],
      ['c.png', undefined, true]
    ])
  })
})
