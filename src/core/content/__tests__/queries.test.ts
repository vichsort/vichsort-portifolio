import { describe, expect, it } from 'vitest'
import { buildGraph } from '../graph.ts'
import { createBuildQueries } from '../render.ts'
import { buildNodeMenu } from '../nodeMenu.ts'
import { ICONS, md, vault } from './vault.ts'

// O alpha ganha texto em espanhol, sem a citação do [[web]]; o beta passa a ser o mais recente
const graph = buildGraph(
  vault({
    'projects/alpha/alpha.es.md': md('title: Alfa\nsummary: Resumen', 'Sin enlaces.'),
    'projects/beta/beta.md': md('category: "[[app]]"\ndate: [2026-01, 2026-06]\ntechs:\n  - "[[vue]]"\ntopics:\n  - "[[web]]"')
  }),
  [...ICONS, { path: 'projects/alpha/cover.jpg', url: '/covers/alpha.jpg' }]
)
const q = createBuildQueries(graph)
const ids = (nodes: Array<{ id: string }> = []) => nodes.map((n) => n.id).sort()

describe('idioma e fallback', () => {
  it('usa o idioma pedido, depois inglês, depois português', () => {
    expect(q.textLang('alpha', 'es')).toBe('es')
    expect(q.textLang('beta', 'es')).toBe('en')
    expect(q.textLang('vue', 'pt')).toBeNull()
  })

  it('fallback só aparece quando o idioma foi trocado', () => {
    expect(q.fallback('alpha', 'es')).toBeNull()
    expect(q.fallback('beta', 'it')).toBe('en')
    expect(q.fallback('vue', 'pt')).toBeNull()
  })

  it('label: nome da estrutura, senão nome ou título traduzido, senão o id', () => {
    expect(q.label('vue', 'pt')).toBe('Vue')
    expect(q.label('app', 'pt')).toBe('Aplicativo')
    expect(q.label('app', 'it')).toBe('App')
    expect(q.label('alpha', 'en')).toBe('Alpha')
    expect(q.label('nada', 'pt')).toBe('nada')
  })

  it('text não leva o corpo', () => {
    expect(q.text('alpha', 'pt')).toEqual({ title: 'Alfa', summary: 'Resumo' })
  })
})

describe('consultas', () => {
  it('ofType ordena por id ou pelo início do período', () => {
    expect(q.ofType('project').map((n) => n.id)).toEqual(['alpha', 'beta'])
    expect(q.ofType('project', { recent: true }).map((n) => n.id)).toEqual(['beta', 'alpha'])
  })

  it('linked devolve lista mesmo para ligação única', () => {
    expect(q.linked('alpha', 'category')).toEqual(['app'])
    expect(q.linked('alpha', 'topics')).toEqual([])
  })

  it('backlinks deixa as coleções de fora, a não ser que peça', () => {
    expect(ids(q.backlinks('vue').project)).toEqual(['alpha', 'beta'])
    expect(q.backlinks('vue').collection).toBeUndefined()
    expect(ids(q.backlinks('vue', { includeCollections: true }).collection)).toEqual(['stack'])
  })

  it('backlinks e outlinks contam o corpo só do texto que será mostrado', () => {
    expect(ids(q.backlinks('web', { lang: 'pt' }).project)).toEqual(['alpha', 'beta'])
    expect(ids(q.backlinks('web', { lang: 'es' }).project)).toEqual(['beta'])
    expect(ids(q.outlinks('alpha', { lang: 'pt' }).topic)).toEqual(['web'])
    expect(q.outlinks('alpha', { lang: 'es' }).topic).toBeUndefined()
  })

  it('relatedTechs vale nos dois sentidos do campo techs', () => {
    expect(ids(q.relatedTechs('vue'))).toEqual(['javascript'])
    expect(ids(q.relatedTechs('javascript'))).toEqual(['vue'])
  })

  it('related conta as ligações de estrutura em comum', () => {
    expect(q.related('alpha').map(({ node, shared }) => [node.id, shared])).toEqual([['beta', 2]])
  })

  it('collection resolve os grupos na ordem declarada', () => {
    const groups = q.collection('stack').map(({ group, items }) => [group?.id, items.map((n) => n.id)])
    expect(groups).toEqual([
      ['frontend', ['vue', 'javascript']],
      ['frontend', ['python']]
    ])
  })

  it('arquivos do nó', () => {
    expect(q.icon('vue')).toBe('/icons/vue.svg')
    expect(q.cover('alpha')).toBe('/covers/alpha.jpg')
    expect(q.cover('beta')).toBe('')
  })
})

describe('corpos', () => {
  it('plain troca os wikilinks pelo rótulo ou nome e tira os embeds', () => {
    expect(q.plain('alpha', 'pt').trim()).toBe('Feito para a internet.')
    expect(q.plain('alpha', 'en').trim()).toBe('Built for the Web.')
  })

  it('html: nó sem página vira gatilho do menu, se houver o que mostrar', () => {
    expect(q.html('alpha', 'pt')).toContain('data-node="web"')
  })
})

describe('buildNodeMenu', () => {
  it('agrupa quem aponta para o nó, do mais recente ao mais antigo', () => {
    expect(buildNodeMenu(q, 'vue', { lang: 'pt' })).toEqual([
      {
        type: 'project',
        count: 2,
        items: [
          { id: 'beta', label: 'Beta', meta: '2026', to: '/projects/beta' },
          { id: 'alpha', label: 'Alfa', meta: '2025', to: '/projects/alpha' }
        ],
        more: null
      },
      { type: 'tech', count: 1, items: [{ id: 'javascript', label: 'JavaScript', meta: '', to: null }], more: null }
    ])
  })

  it('passando do limite, leva à listagem filtrada', () => {
    const [projects] = buildNodeMenu(q, 'vue', { limit: 1 })
    expect(projects.items.map((i) => i.id)).toEqual(['beta'])
    expect(projects.more).toBe('/projects?ref=vue')
  })

  it('exclude e nó inexistente', () => {
    expect(buildNodeMenu(q, 'vue', { exclude: ['beta'], types: ['project'] })[0].items.map((i) => i.id)).toEqual(['alpha'])
    expect(buildNodeMenu(q, 'nada')).toEqual([])
  })
})
