import { describe, expect, it } from 'vitest'
import { dispatch, dispatchLine } from '../dispatcher/dispatcher.ts'
import { completeLine } from '../input/completion.ts'
import { shell } from './shell.ts'

const payloads = async (line: string) => (await dispatchLine(line, shell())).map((o) => [o.type, o.payload])
const spied = async (line: string) => JSON.parse(String((await dispatch(line, shell()))!.payload))

describe('dispatch', () => {
  it('nome e alias sem diferenciar maiúsculas, flags pelo contrato do comando', async () => {
    expect(await spied('SPY --stack vue -la "meu app"')).toEqual({
      args: ['meu app'],
      flags: { stack: 'vue', l: true, a: true },
      stdin: null,
      isPiped: false
    })
    expect((await spied('sp x')).args).toEqual(['x'])
  })

  it('linha vazia e comando sem saída', async () => {
    expect(await dispatch('   ', shell())).toBeNull()
    expect(await dispatch('quiet', shell())).toBeNull()
  })

  it('comando desconhecido sugere o mais parecido', async () => {
    const out = await dispatch('ehco hi', shell())
    expect(out).toEqual({
      type: 'error',
      payload: 'vsh: terminal.errors.command_not_found {"cmd":"ehco","suggestion":"echo"}\nterminal.errors.did_you_mean {"cmd":"ehco","suggestion":"echo"}'
    })
  })

  it('erro esperado leva o nome do comando; exceção vira falha na execução', async () => {
    expect((await dispatch('missing', shell()))!.payload).toBe('vsh: terminal.errors.missing_arg {"arg":"id","cmd":"missing"}')
    expect((await dispatch('broken', shell()))!.payload).toBe('vsh: terminal.errors.execution_failed {"cmd":"broken","message":"boom"}')
  })
})

describe('dispatchLine', () => {
  it('pipe: a saída de um vira a entrada do outro', async () => {
    expect(await payloads('echo oi | upper')).toEqual([['text', 'OI']])
    const [out] = await dispatchLine('echo a | spy', shell())
    expect(JSON.parse(String(out.payload))).toMatchObject({ stdin: 'a', isPiped: false })
    const [first] = await dispatchLine('spy | upper', shell())
    expect(String(first.payload)).toContain('"ISPIPED":TRUE')
  })

  it('&&: uma saída por pipeline, parando no primeiro erro', async () => {
    expect(await payloads('echo a && quiet && echo b')).toEqual([
      ['text', 'a'],
      ['text', 'b']
    ])
    const outs = await payloads('echo a && missing && echo b')
    expect(outs.map(([type]) => type)).toEqual(['text', 'error'])
  })

  it('erro no meio do pipe é o que aparece', async () => {
    expect((await payloads('missing | upper'))[0][0]).toBe('error')
  })

  it('operador sem comando é erro de sintaxe', async () => {
    expect(await payloads('echo a |')).toEqual([['error', 'vsh: terminal.errors.syntax_error {"token":"|"}']])
  })
})

describe('completeLine', () => {
  const complete = (line: string) => completeLine(line, shell())

  it('nome de comando no início e depois de | ou &&', () => {
    expect(complete('ech')).toEqual({ line: 'echo ' })
    expect(complete('echo a | up')).toEqual({ line: 'echo a | upper ' })
    expect(complete('quiet && mi')).toEqual({ line: 'quiet && missing ' })
  })

  it('vários candidatos: avança até o prefixo comum, senão lista', () => {
    expect(complete('s')).toEqual({ line: 'sp' })
    expect(complete('sp')).toEqual({ options: ['sp', 'spy'] })
    expect(complete('cat projects/pla')).toEqual({ line: 'cat projects/plante' })
  })

  it('caminhos do VFS: diretório fica aberto, arquivo ganha espaço', () => {
    expect(complete('cd proj')).toEqual({ line: 'cd projects/' })
    expect(complete('cat ab')).toEqual({ line: 'cat about.md ' })
    expect(complete('ls projects/plante')).toEqual({ options: ['plante-api/', 'plante/'] })
  })

  it('o complete do comando substitui o do VFS', () => {
    expect(complete('lang e')).toEqual({ options: ['en', 'es'] })
    expect(complete('lang p')).toEqual({ line: 'lang pt ' })
  })

  it('nada a completar', () => {
    expect(complete('cat zzz')).toBeNull()
  })
})
