import { tokenize, parseArgs, splitLine } from '../parser/lexer.js'
import { TerminalError, CommandError } from '../errors/codes.js'
import { formatError } from '../errors/formatter.js'
import { findClosestCommand } from './similarity.js'

const errorOutput = (code, params, t) => ({ type: 'error', payload: formatError(code, params, t) })

/**
 * Saída de "comando não encontrado", com a sugestão do comando mais parecido.
 *
 * @param {string} name - O que foi digitado.
 * @param {Object} context - CommandContext (usa registry e t).
 * @returns {{ type: 'error', payload: string }}
 */
export function commandNotFound(name, { registry, t }) {
  const suggestion = findClosestCommand(name, registry.getAllNames(), 2)
  return errorOutput(TerminalError.COMMAND_NOT_FOUND, { cmd: name, suggestion }, t)
}

/**
 * Executa um comando cru (sem `|` nem `&&`).
 * Erros esperados (CommandError) viram a mensagem traduzida com o nome do comando;
 * qualquer outra exceção vira "falha na execução".
 *
 * @param {string} input - Comando cru.
 * @param {Object} context - CommandContext.
 * @returns {Promise<{ type: string, payload: any }|null>}
 */
export async function dispatch(input, context) {
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
    return errorOutput(TerminalError.EXECUTION_FAILED, { cmd: cmd.name, message: err.message || String(err) }, context.t)
  }
}

// Saída de um comando como texto, para virar a entrada do próximo no pipe
const toText = (result) => (result?.payload == null ? '' : String(result.payload))

/**
 * Executa um pipeline: a saída de cada comando vira o `context.stdin` do seguinte.
 * Um erro no meio interrompe o pipeline e é o que aparece.
 *
 * @param {string[]} commands - Comandos crus, na ordem do `|`.
 * @param {Object} context - CommandContext.
 * @returns {Promise<{ type: string, payload: any }|null>}
 */
async function runPipeline(commands, context) {
  let stdin = null
  let result = null

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
 * @param {string} input - Linha de comando bruta.
 * @param {Object} context - CommandContext.
 * @returns {Promise<Array<{ type: string, payload: any }>>} Saídas de cada pipeline, na ordem.
 */
export async function dispatchLine(input, context) {
  const { chain, error } = splitLine(input)

  if (error) return [errorOutput(TerminalError.SYNTAX_ERROR, { token: error }, context.t)]

  const outputs = []
  for (const pipeline of chain) {
    const result = await runPipeline(pipeline, context)
    if (result) outputs.push(result)
    if (result?.type === 'error') break
  }
  return outputs
}
