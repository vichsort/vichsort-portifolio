import { describe, expect, it } from 'vitest'
import { checkPage } from './dist.mjs'

const SITE = 'https://vichsort.com'

const head = (tags = {}) => {
  const t = {
    title: 'Plante | Vitor',
    description: 'Resumo',
    'og:title': 'Plante | Vitor',
    'og:description': 'Resumo',
    'og:url': `${SITE}/projects/plante`,
    canonical: `${SITE}/projects/plante`,
    'og:image': `${SITE}/og/projects/plante.jpg`,
    ...tags
  }
  return [
    t.title !== null && `<title>${t.title}</title>`,
    `<meta name="description" content="${t.description}" />`,
    `<meta property="og:title" content="${t['og:title']}" />`,
    `<meta property="og:description" content="${t['og:description']}" />`,
    `<meta property="og:url" content="${t['og:url']}" />`,
    `<link rel="canonical" href="${t.canonical}" />`,
    `<meta property="og:image" content="${t['og:image']}" />`
  ]
    .filter(Boolean)
    .join('\n')
}

const check = (html, files = ['/og/projects/plante.jpg']) => checkPage(html, '/projects/plante', { site: SITE, exists: (p) => files.includes(p) })

describe('checkPage', () => {
  it('prévia completa passa', () => {
    expect(check(head())).toEqual([])
  })

  it.each([
    ['título vazio', { title: '' }, 'title: ""'],
    ['undefined no título', { 'og:title': 'undefined | Vitor' }, 'og:title: "undefined | Vitor"'],
    ['sem título', { title: null }, 'title: 0 tags, esperado 1'],
    ['imagem relativa', { 'og:image': '/og/projects/plante.jpg' }, 'og:image relativa: "/og/projects/plante.jpg"'],
    ['imagem de outro site', { 'og:image': 'https://cdn.x/plante.jpg' }, 'og:image fora do site: "https://cdn.x/plante.jpg"'],
    ['url de outra rota', { 'og:url': `${SITE}/projects` }, `og:url diferente de ${SITE}/projects/plante`]
  ])('%s', (_, tags, problem) => {
    expect(check(head(tags))).toContain(problem)
  })

  it('imagem sem o arquivo no dist', () => {
    expect(check(head(), [])).toEqual(['og:image sem o arquivo no dist: /og/projects/plante.jpg'])
  })

  it('título repetido', () => {
    expect(check(`<title>Outro</title>\n${head()}`)).toContain('title: 2 tags, esperado 1')
  })
})
