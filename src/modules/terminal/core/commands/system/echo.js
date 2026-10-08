/**
 * Comando 'echo'
 * Imprime texto fornecido como argumento na saída padrão.
 */
export const echoCommand = {
  name: 'echo',
  async execute(args) {
    return { type: 'text', payload: args.join(' ') }
  }
}
