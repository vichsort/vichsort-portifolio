import { describe, expect, it } from 'vitest'
import { CommandError } from '../errors/codes.ts'
import { VfsEngine, formatDisplayPath, normalizePath } from '../vfs/engine.ts'
import { tree } from './shell.ts'

describe('normalizePath', () => {
  it.each([
    ['projects', '/', '/projects'],
    ['../about.md', '/projects', '/about.md'],
    ['./plante//README.md', '/projects', '/projects/plante/README.md'],
    ['~', '/projects', '/'],
    ['~/projects', '/', '/projects'],
    ['/../..', '/projects', '/'],
    ['', '/projects', '/projects']
  ])('%s em %s → %s', (path, cwd, expected) => {
    expect(normalizePath(path, cwd)).toBe(expected)
  })

  it('caminho no prompt', () => {
    expect(formatDisplayPath('/')).toBe('~')
    expect(formatDisplayPath('/projects')).toBe('~/projects')
  })
})

describe('VfsEngine', () => {
  const engine = () => new VfsEngine(tree())

  it('raiz precisa ser diretório', () => {
    expect(() => new VfsEngine({ type: 'file', mime: 'text/plain' })).toThrow()
  })

  it('cd, cd - e cd sem destino', () => {
    const vfs = engine()
    const changes: string[] = []
    vfs.onChange = (path) => changes.push(path)
    expect(vfs.cd('projects/plante')).toBe('/projects/plante')
    expect(vfs.cd('..')).toBe('/projects')
    expect(vfs.cd('-')).toBe('/projects/plante')
    expect(vfs.cd()).toBe('/')
    expect(changes).toEqual(['/projects/plante', '/projects', '/projects/plante', '/'])
  })

  it('cd para arquivo ou caminho inexistente é erro esperado', () => {
    const vfs = engine()
    expect(() => vfs.cd('about.md')).toThrow(expect.objectContaining({ code: 'not_a_directory' }))
    expect(() => vfs.cd('nada')).toThrow(CommandError)
    expect(vfs.pwd()).toBe('/')
  })

  it('list: entradas do diretório; num arquivo, só ele', () => {
    const vfs = engine()
    expect(vfs.list().map((e) => [e.name, e.type])).toEqual([
      ['about.md', 'file'],
      ['projects', 'dir'],
      ['resume.pdf', 'file']
    ])
    expect(vfs.list('about.md').map((e) => e.name)).toEqual(['about.md'])
  })

  it('walk em pré-ordem, sem o ponto de partida', () => {
    expect(engine().walk('projects').map((e) => e.path)).toEqual([
      '/projects/plante',
      '/projects/plante/README.md',
      '/projects/plante-api',
      '/projects/pixel'
    ])
  })

  it('readFile no idioma pedido; arquivo binário vem vazio', async () => {
    const vfs = engine()
    expect(await vfs.readFile('projects/plante/README.md', 'en')).toEqual({ content: 'plante (en)', mime: 'text/markdown', name: 'README.md' })
    expect((await vfs.readFile('resume.pdf', 'pt')).content).toBe('')
    await expect(vfs.readFile('projects', 'pt')).rejects.toMatchObject({ code: 'is_a_directory' })
  })

  it('tree com limite de profundidade', () => {
    const vfs = engine()
    expect(vfs.tree('projects')).toBe(['projects', '├── plante', '│   └── README.md', '├── plante-api', '└── pixel'].join('\n'))
    expect(vfs.tree('/', 1)).toBe(['.', '├── about.md', '├── projects', '└── resume.pdf'].join('\n'))
  })

  it('completions relativas e absolutas', () => {
    const vfs = engine()
    expect(vfs.getCompletions('pro')).toEqual(['projects/'])
    expect(vfs.getCompletions('/projects/p')).toEqual(['/projects/plante/', '/projects/plante-api/', '/projects/pixel/'])
    expect(vfs.getCompletions('nada/x')).toEqual([])
  })
})
