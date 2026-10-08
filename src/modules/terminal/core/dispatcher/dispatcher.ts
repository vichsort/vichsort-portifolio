import { tokenize, parseArgs, splitLine } from '../parser/lexer.ts'
import { TerminalError, CommandError } from '../errors/codes.ts'
import { formatError } from '../errors/formatter.ts'
import { findClosestCommand } from './similarity.ts'
import type { CommandContext, CommandOutput, Translate } from '../types.ts'
import type { TerminalErrorCode } from '../errors/codes.ts'

const errorOutput = (code: TerminalErrorCode, params: Record<string, unknown>, t: Translate): CommandOutput => ({
  type: 'error',
  payload: formatError(code, params, t)
})

/**
 * Saída de "comando não encontrado", com a sugestão do comando mais parecido.
 *
 * @param name - O que foi digitado.
 * @param context - CommandContext (usa registry e t).
 */
export function commandNotFound(name: string, { registry, t }: Pick<CommandContext, 'registry' | 't'>): CommandOutput {
  const suggestion = findClosestCommand(name, registry.getAllNames(), 2)
  return errorOutput(TerminalError.COMMAND_NOT_FOUND, { cmd: name, suggestion }, t)
}

/**
 * Executa um comando cru (sem `|` nem `&&`).
 * Erros esperados (CommandError) viram a mensagem traduzida com o nome do comando;
 * qualquer outra exceção vira "falha na execução".
 *
 * @param input - Comando cru.
 * @param context - CommandContext.
 */
export async function dispatch(input: string, context: CommandContext): Promise<CommandOutput | null> {
  const [name, ...rest] = tokenize(input)
  if (!name) return null

  const cmd = context.registry.get(name)
  if (!cmd) return commandNotFound(name, context)

  const { args, flags } = parseArgs(rest, cmd.valueFlags)

  try {
    const result = await cmd.execute(args, flags, context)
    if (result == null) return null
    if (typeof result.type === 'string') return result
    return { type: 'text', payload: String(result) }
  } catch (err) {
    if (err instanceof CommandError) {
      return errorOutput(err.code, { ...err.params, cmd: cmd.name }, context.t)
    }
    const message = err instanceof Error ? err.message : String(err)
    return errorOutput(TerminalError.EXECUTION_FAILED, { cmd: cmd.name, message: message || String(err) }, context.t)
  }
}

// Saída de um comando como texto, para virar a entrada do próximo no pipe
const toText = (result: CommandOutput | null) => (result?.payload == null ? '' : String(result.payload))

/**
 * Executa um pipeline: a saída de cada comando vira o `context.stdin` do seguinte.
 * Um erro no meio interrompe o pipeline e é o que aparece.
 *
 * @param commands - Comandos crus, na ordem do `|`.
 * @param context - CommandContext.
 */
async function runPipeline(commands: string[], context: CommandContext): Promise<CommandOutput | null> {
  let stdin: string | null = null
  let result: CommandOutput | null = null

  for (const [i, command] of commands.entries()) {
    const isPiped = i < commands.length - 1
    result = await dispatch(command, { ...context, stdin, isPiped })
    if (result?.type === 'error') return result
    stdin = toText(result)
  }

  return result
}

/**
 * Executa uma linha completa, com `&&` e `|`.
 * Como no shell, o `&&` só segue se o pipeline anterior não terminou em erro.
 *
 * @param input - Linha de comando bruta.
 * @param context - CommandContext.
 * @returns Saídas de cada pipeline, na ordem.
 */
export async function dispatchLine(input: string, context: CommandContext): Promise<CommandOutput[]> {
  const { chain, error } = splitLine(input)

  if (error !== undefined) return [errorOutput(TerminalError.SYNTAX_ERROR, { token: error }, context.t)]

  const outputs: CommandOutput[] = []
  for (const pipeline of chain) {
    const result = await runPipeline(pipeline, context)
    if (result) outputs.push(result)
    if (result?.type === 'error') break
  }
  return outputs
}
