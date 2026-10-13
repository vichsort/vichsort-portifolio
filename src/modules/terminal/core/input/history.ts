/**
 * Histórico de linhas digitadas, navegado com ↑/↓ como no bash:
 * não repete o comando anterior (ignoredups) e guarda a linha em edição
 * para o ↓ devolver depois do último.
 */
export class CommandHistory {
  entries: string[] = []
  // Posição na navegação: null = editando uma linha nova (guardada em draft)
  index: number | null = null
  draft = ''

  /** Grava uma linha executada e sai da navegação. */
  push(line: string): void {
    if (this.entries.at(-1) !== line) this.entries.push(line)
    this.resetNavigation()
  }

  /** ↑: a linha anterior, ou null sem histórico. Na primeira ↑, o que está no prompt vira o rascunho. */
  prev(current: string): string | null {
    if (!this.entries.length) return null
    if (this.index === null) {
      this.draft = current
      this.index = this.entries.length - 1
    } else if (this.index > 0) {
      this.index--
    }
    return this.entries[this.index]
  }

  /** ↓: a linha seguinte; depois da última, o rascunho. null fora da navegação. */
  next(): string | null {
    if (this.index === null) return null
    if (this.index < this.entries.length - 1) return this.entries[++this.index]
    const draft = this.draft
    this.resetNavigation()
    return draft
  }

  resetNavigation(): void {
    this.index = null
    this.draft = ''
  }

  clear(): void {
    this.entries = []
    this.resetNavigation()
  }
}
