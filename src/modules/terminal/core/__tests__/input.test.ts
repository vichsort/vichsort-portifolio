import { describe, expect, it } from 'vitest'
import { CommandHistory } from '../input/history.ts'
import { findClosestCommand, levenshteinDistance } from '../dispatcher/similarity.ts'

describe('CommandHistory', () => {
  it('↑ volta, ↓ avança e devolve o rascunho depois da última', () => {
    const h = new CommandHistory()
    h.push('ls')
    h.push('pwd')
    expect(h.prev('cat')).toBe('pwd')
    expect(h.prev('ignorado')).toBe('ls')
    expect(h.prev('')).toBe('ls')
    expect(h.next()).toBe('pwd')
    expect(h.next()).toBe('cat')
    expect(h.next()).toBeNull()
  })

  it('não repete o comando anterior', () => {
    const h = new CommandHistory()
    h.push('ls')
    h.push('ls')
    h.push('pwd')
    h.push('ls')
    expect(h.entries).toEqual(['ls', 'pwd', 'ls'])
  })

  it('sem histórico, ↑ não faz nada; push sai da navegação', () => {
    const h = new CommandHistory()
    expect(h.prev('x')).toBeNull()
    h.push('ls')
    h.prev('')
    h.push('pwd')
    expect(h.index).toBeNull()
    expect(h.next()).toBeNull()
  })
})

describe('sugestão de comando', () => {
  it('distância de edição, sem diferenciar maiúsculas', () => {
    expect(levenshteinDistance('kitten', 'sitting')).toBe(3)
    expect(levenshteinDistance('LS', 'ls')).toBe(0)
    expect(levenshteinDistance('', 'abc')).toBe(3)
  })

  it('o mais próximo dentro do limite, ou nada', () => {
    const names = ['ls', 'cat', 'clear', 'help', 'history']
    expect(findClosestCommand('cler', names)).toBe('clear')
    expect(findClosestCommand('hlep', names)).toBe('help')
    expect(findClosestCommand('xyzzy', names)).toBeNull()
    expect(findClosestCommand('  ', names)).toBeNull()
  })
})
