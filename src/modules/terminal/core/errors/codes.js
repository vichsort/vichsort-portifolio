/**
 * Códigos de erro do Vitor Shell (vsh): cada um é uma chave em terminal.errors.*
 */
export const TerminalError = {
  COMMAND_NOT_FOUND: 'command_not_found',
  NO_SUCH_FILE: 'no_such_file',
  IS_A_DIRECTORY: 'is_a_directory',
  NOT_A_DIRECTORY: 'not_a_directory',
  MISSING_ARG: 'missing_arg',
  EXECUTION_FAILED: 'execution_failed',
  SYNTAX_ERROR: 'syntax_error'
}

/**
 * Erro esperado de um comando (arquivo inexistente, argumento faltando...).
 * O dispatcher o transforma na mensagem traduzida, com o nome do comando.
 */
export class CommandError extends Error {
  /**
   * @param {string} code - Um dos TerminalError.
   * @param {Record<string, any>} [params] - Parâmetros da mensagem ({ path }, { arg }...).
   */
  constructor(code, params = {}) {
    super(code)
    this.name = 'CommandError'
    this.code = code
    this.params = params
  }
}
