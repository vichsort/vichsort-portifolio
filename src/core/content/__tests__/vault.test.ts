import { describe, expect, it } from 'vitest'
import { load } from '../../../../scripts/vault.mjs'
import { validateGraph } from '../validate.ts'
import { hydrateGraph, resolveAssets, type SerializedNode } from '../structure.ts'
import { buildGraph } from '../graph.ts'
import { ICONS, vault } from './vault.ts'

/** O que o plugin de conteúdo manda para o site: os nós sem os textos, em JSON. */
const serialize = (nodes: Iterable<SerializedNode & { texts?: unknown }>): SerializedNode[] =>
  JSON.parse(JSON.stringify([...nodes].map(({ texts: _texts, ...node }) => node)))

describe('estrutura no site (hydrateGraph)', () => {
  it('remonta as mesmas arestas, na mesma ordem do build', () => {
    const graph = buildGraph(vault(), ICONS)
    const site = hydrateGraph({ nodes: serialize(graph.nodes.values()) }, [])
    expect(site.edges).toEqual(graph.edges)
    expect(site.resolve('Py')).toBe('python')
  })

  it('troca as marcas de arquivo pela URL do build', () => {
    expect(resolveAssets('<img src="@@asset:1@@">', ['/a.svg', '/b.jpg'])).toBe('<img src="/b.jpg">')
  })
})

describe('vault real (src/content)', async () => {
  const graph = await load()

  it('não tem erros', () => {
    const errors = [...graph.issues, ...validateGraph(graph)].filter((i) => i.level === 'error')
    expect(errors).toEqual([])
  })

  it('a estrutura serializada remonta as mesmas arestas', () => {
    const site = hydrateGraph({ nodes: serialize(graph.nodes.values()) }, [])
    expect(site.edges).toEqual(graph.edges)
  })
})
