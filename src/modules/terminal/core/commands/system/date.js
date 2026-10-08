/**
 * Comando 'date'
 * Exibe a data, horário e fuso horário atuais.
 */
export const dateCommand = {
  name: 'date',
  async execute() {
    return { type: 'text', payload: new Date().toString() }
  }
}
