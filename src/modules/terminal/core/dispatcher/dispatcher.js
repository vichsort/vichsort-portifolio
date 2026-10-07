import { parseCommand, splitLine } from '../parser/lexer.js'
import { TerminalError } from '../errors/codes.js'
import { formatError } from '../errors/formatter.js'
import { findClosestCommand } from './similarity.js'

/**
 * Resolve o objeto de comando no catálogo/registro fornecido.
 *
 * @param {string} name - Nome ou alias do comando.
 * @param {Object} registry - Catálogo de comandos.
 * @returns {Object|null} Definição do comando ou null.
 */
function resolveCommand(name, registry) {
  if (!registry) return null

  if (typeof registry.get === 'function') {
    return registry.get(name)
  }

  if (registry instanceof Map) {
    return registry.get(name) || null
  }

  if (typeof registry === 'object' && registry[name]) {
    return registry[name]
  }

  return null
}

/**
 * Obtém todos os nomes e aliases disponíveis para busca de similaridade e autocompletion.
 *
 * @param {Object} registry - Catálogo de comandos.
 * @returns {string[]} Lista de identificadores de comandos.
 */
function getAvailableNames(registry) {
  if (!registry) return []

  if (typeof registry.getAllNames === 'function') {
    return registry.getAllNames()
  }

  if (registry instanceof Map) {
    return Array.from(registry.keys())
  }

  if (typeof registry === 'object') {
    return Object.keys(registry)
  }

  return []
}

/**
 * Orquestrador central do interpretador de comandos (Command Dispatcher).
 *
 * @param {string|Object} input - Linha de comando bruta ou objeto parseado pelo lexer.
 * @param {Object} context - Instância de CommandContext.
 * @returns {Promise<{ type: string, payload: any }|null>} Resultado formatado da execução.
 */
export async function dispatch(input, context = {}) {
  const parsed = typeof input === 'string' ? parseCommand(input) : input

  if (!parsed || !parsed.command) {
    return null
  }

  const { command: cmdName, args = [], flags = {} } = parsed
  const cmd = resolveCommand(cmdName, context.registry)

  // Caso o comando não exista no catálogo
  if (!cmd) {
    const candidates = getAvailableNames(context.registry)
    const suggestion = findClosestCommand(cmdName, candidates, 2)
    const errorMsg = formatError(
      TerminalError.COMMAND_NOT_FOUND,
      { cmd: cmdName, suggestion },
      context.t
    )

    return {
      type: 'error',
      payload: errorMsg
    }
  }

  // Executa o comando encapsulado com tratamento de exceções
  try {
    const result = await cmd.execute(args, flags, context)

    if (result === null || result === undefined) {
      return null
    }

    if (typeof result === 'object' && typeof result.type === 'string') {
      return result
    }

    return {
      type: 'text',
      payload: String(result)
    }
  } catch (err) {
    const errorMsg = formatError(
      TerminalError.EXECUTION_FAILED,
      { cmd: cmdName, message: err.message || String(err) },
      context.t
    )

    return {
      type: 'error',
      payload: errorMsg
    }
  }
}

// Saída de um comando como texto, para virar a entrada do próximo no pipe
const toText = (result) => (result?.payload == null ? '' : String(result.payload))

/**
 * Executa um pipeline: a saída de cada comando vira o `context.stdin` do seguinte.
 * Um erro no meio interrompe o pipeline e é o que aparece.
 *
 * @param {string[]} commands - Comandos crus, na ordem do `|`.
 * @param {Object} context - Instância de CommandContext.
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
 * @param {Object} context - Instância de CommandContext.
 * @returns {Promise<Array<{ type: string, payload: any }>>} Saídas de cada pipeline, na ordem.
 */
export async function dispatchLine(input, context = {}) {
  const { chain, error } = splitLine(input)

  if (error) {
    return [{ type: 'error', payload: formatError(TerminalError.SYNTAX_ERROR, { token: error }, context.t) }]
  }

  const outputs = []
  for (const pipeline of chain) {
    const result = await runPipeline(pipeline, context)
    if (result) outputs.push(result)
    if (result?.type === 'error') break
  }
  return outputs
}

export default {
  dispatch,
  dispatchLine
}

