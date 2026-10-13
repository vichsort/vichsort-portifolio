import { describe, expect, it } from 'vitest'
import { parseArgs, splitLine, tokenize } from '../parser/lexer.ts'

describe('tokenize', () => {
  it('separa por espaço, ignorando espaços repetidos', () => {
    expect(tokenize('  ls   -la  projects ')).toEqual(['ls', '-la', 'projects'])
  })

  it('aspas juntam o argumento e somem do token', () => {
    expect(tokenize('echo "meu app" \'outro app\'')).toEqual(['echo', 'meu app', 'outro app'])
    expect(tokenize('cat "a"b')).toEqual(['cat', 'ab'])
  })

  it('aspas vazias são um argumento vazio', () => {
    expect(tokenize('echo ""')).toEqual(['echo', ''])
  })

  it('barra escapa fora de aspas simples', () => {
    expect(tokenize('echo meu\\ app "a\\"b"')).toEqual(['echo', 'meu app', 'a"b'])
    expect(tokenize("echo 'a\\b'")).toEqual(['echo', 'a\\b'])
  })

  it('entrada vazia ou inválida', () => {
    expect(tokenize('')).toEqual([])
    expect(tokenize(undefined as unknown as string)).toEqual([])
  })
})

describe('parseArgs', () => {
  it('o exemplo do contrato', () => {
    expect(parseArgs(['--stack', 'vue', '-la', 'meu app'], ['stack'])).toEqual({
      args: ['meu app'],
      flags: { stack: 'vue', l: true, a: true }
    })
  })

  it('flag longa com =, booleana, e o valor só no token seguinte se a flag recebe valor', () => {
    expect(parseArgs(['--stack=vue=3', '--featured', 'x'])).toEqual({ args: ['x'], flags: { stack: 'vue=3', featured: true } })
    expect(parseArgs(['--stack', '--featured'], ['stack'])).toEqual({ args: [], flags: { stack: true, featured: true } })
  })

  it('flag curta com valor', () => {
    expect(parseArgs(['-L=2'])).toEqual({ args: [], flags: { L: '2' } })
    expect(parseArgs(['-L', '2'], ['L'])).toEqual({ args: [], flags: { L: '2' } })
    expect(parseArgs(['-aL', '2'], ['L'])).toEqual({ args: ['2'], flags: { a: true, L: true } })
  })

  it('depois de --, tudo é posicional', () => {
    expect(parseArgs(['-a', '--', '-b', '--c'])).toEqual({ args: ['-b', '--c'], flags: { a: true } })
  })

  it('- sozinho é posicional', () => {
    expect(parseArgs(['-'])).toEqual({ args: ['-'], flags: {} })
  })
})

describe('splitLine', () => {
  it('o exemplo do contrato', () => {
    expect(splitLine('ls && cat a.md | grep vue')).toEqual({ chain: [['ls'], ['cat a.md', 'grep vue']] })
  })

  it('operadores entre aspas ou escapados são texto', () => {
    expect(splitLine('echo "a | b && c"')).toEqual({ chain: [['echo "a | b && c"']] })
    expect(splitLine('echo a \\| b')).toEqual({ chain: [['echo a \\| b']] })
  })

  it('linha vazia é válida', () => {
    expect(splitLine('   ')).toEqual({ chain: [] })
  })

  it('operador sem comando é erro', () => {
    expect(splitLine('ls |')).toEqual({ error: '|' })
    expect(splitLine('ls &&')).toEqual({ error: '&&' })
    expect(splitLine('| grep x')).toEqual({ error: '|' })
    expect(splitLine('ls && && pwd')).toEqual({ error: '&&' })
  })
})
