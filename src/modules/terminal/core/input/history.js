/**
 * Histórico de linhas digitadas, navegado com ↑/↓ como no bash:
 * não repete o comando anterior (ignoredups) e guarda a linha em edição
 * para o ↓ devolver depois do último.
 */
export class CommandHistory {
  constructor() {
    this.entries = []
    // Posição na navegação: null = editando uma linha nova (guardada em draft)
    this.index = null
    this.draft = ''
  }

  /** Grava uma linha executada e sai da navegação. */
  push(line) {
    if (this.entries.at(-1) !== line) this.entries.push(line)
    this.resetNavigation()
  }

  /**
   * ↑: linha anterior.
   *
   * @param {string} current - O que está no prompt (vira o rascunho na primeira ↑).
   * @returns {string|null} Nova linha do prompt, ou null se não há histórico.
   */
  prev(current) {
    if (!this.entries.length) return null
    if (this.index === null) {
      this.draft = current
      this.index = this.entries.length - 1
    } else if (this.index > 0) {
      this.index--
    }
    return this.entries[this.index]
  }

  /**
   * ↓: linha seguinte; depois da última, o rascunho.
   *
   * @returns {string|null} Nova linha do prompt, ou null fora da navegação.
   */
  next() {
    if (this.index === null) return null
    if (this.index < this.entries.length - 1) return this.entries[++this.index]
    const draft = this.draft
    this.resetNavigation()
    return draft
  }

  resetNavigation() {
    this.index = null
    this.draft = ''
  }

  clear() {
    this.entries = []
    this.resetNavigation()
  }
}
