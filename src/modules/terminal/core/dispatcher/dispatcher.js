import { parseCommand } from '../parser/lexer.js'
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

export default {
  dispatch
}

