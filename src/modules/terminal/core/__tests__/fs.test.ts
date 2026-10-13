import { describe, expect, it } from 'vitest'
import { dispatchLine } from '../dispatcher/dispatcher.ts'
import { catCommand } from '../commands/fs/cat.ts'
import { cdCommand } from '../commands/fs/cd.ts'
import { findCommand } from '../commands/fs/find.ts'
import { grepCommand } from '../commands/fs/grep.ts'
import { lsCommand } from '../commands/fs/ls.ts'
import { pwdCommand } from '../commands/fs/pwd.ts'
import { treeCommand } from '../commands/fs/tree.ts'
import { shell } from './shell.ts'

const FS = [catCommand, cdCommand, findCommand, grepCommand, lsCommand, pwdCommand, treeCommand]

/** Saída da linha, como a tela recebe. */
const run = async (line: string) => (await dispatchLine(line, shell(FS))).map(({ type, payload, filename }) => ({ type, payload, ...(filename && { filename }) }))
const text = async (line: string) => (await run(line)).map((o) => o.payload).join('\n---\n')

describe('cd e pwd', () => {
  it('navegam juntos numa linha', async () => {
    expect(await text('cd projects/plante && pwd && cd .. && pwd')).toBe('/projects/plante\n---\n/projects')
  })

  it('cd para arquivo é erro do cd', async () => {
    expect(await text('cd about.md')).toBe('vsh: terminal.errors.not_a_directory {"path":"about.md","cmd":"cd"}')
  })
})

describe('ls', () => {
  it('pastas primeiro, depois arquivos', async () => {
    expect(await text('ls')).toBe('projects/  about.md  resume.pdf')
  })

  it('-la: . e .., detalhes por linha', async () => {
    expect(await text('ls -la projects')).toBe(
      [
        'drwxr-xr-x  vitor  dir               ./',
        'drwxr-xr-x  vitor  dir               ../',
        'drwxr-xr-x  vitor  dir               pixel/',
        'drwxr-xr-x  vitor  dir               plante/',
        'drwxr-xr-x  vitor  dir               plante-api/'
      ].join('\n')
    )
  })

  it('num arquivo, só ele; num pipe, um nome por linha', async () => {
    expect(await text('ls -a about.md')).toBe('about.md')
    expect(await text('ls projects | grep plante')).toBe('plante/\nplante-api/')
  })
})

describe('cat', () => {
  it('Markdown no idioma ativo, com o nome do arquivo', async () => {
    expect(await run('cat projects/plante/README.md')).toEqual([{ type: 'markdown', payload: 'plante (pt)', filename: 'README.md' }])
  })

  it('PDF só avisa; diretório e argumento faltando são erros', async () => {
    expect(await text('cat resume.pdf')).toBe('terminal.output.cat.binary_pdf')
    expect(await text('cat projects')).toBe('vsh: terminal.errors.is_a_directory {"path":"projects","cmd":"cat"}')
    expect(await text('cat')).toBe('vsh: terminal.errors.missing_arg {"arg":"<arquivo>","cmd":"cat"}')
  })
})

describe('grep e find', () => {
  it('grep nos arquivos: caminho, linha e texto; -i ignora maiúsculas', async () => {
    expect(await text('grep plante')).toBe('/projects/plante/README.md:1: plante (pt)')
    expect(await text('grep -i SOBRE')).toBe('/about.md:1: sobre (pt)')
    expect(await text('grep SOBRE')).toBe('terminal.output.grep.no_match {"term":"SOBRE"}')
  })

  it('grep na entrada do pipe', async () => {
    expect(await text('cat about.md | grep sobre')).toBe('sobre (pt)')
  })

  it('find pelo nome, pastas com barra', async () => {
    expect(await text('find plante')).toBe('/projects/plante/\n/projects/plante-api/')
    expect(await text('find readme projects')).toBe('/projects/plante/README.md')
    expect(await text('find zzz')).toBe('terminal.output.find.no_match {"term":"zzz"}')
  })
})

describe('tree', () => {
  it('-L e --depth limitam a profundidade', async () => {
    const one = '.\n├── about.md\n├── projects\n└── resume.pdf'
    expect(await text('tree -L 1')).toBe(one)
    expect(await text('tree --depth 1')).toBe(one)
    expect(await text('tree projects')).toBe('projects\n├── plante\n│   └── README.md\n├── plante-api\n└── pixel')
  })
})
