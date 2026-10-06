/**
 * Converte um ASCII art em texto puro numa grade retangular de linhas.
 * Linhas mais curtas são completadas com espaços à direita.
 *
 * @param {string} text
 * @returns {{ cols: number, rows: number, lines: string[] }}
 */
export function parseArt(text) {
  const lines = (text || '').replace(/\r/g, '').replace(/\n+$/, '').split('\n')
  const cols = lines.reduce((max, line) => Math.max(max, line.length), 0)
  return { cols, rows: lines.length, lines: lines.map(line => line.padEnd(cols)) }
}

/**
 * Grade de células com duas máscaras:
 * - blocked: células proibidas (áreas de texto protegidas); nada é desenhado nelas.
 * - occupied: células já tomadas por algum glifo ou reservadas por uma camada.
 */
export class CellGrid {
  constructor(cols, rows) {
    this.cols = Math.max(0, cols)
    this.rows = Math.max(0, rows)
    this.size = this.cols * this.rows
    this.blocked = new Uint8Array(this.size)
    this.occupied = new Uint8Array(this.size)
  }

  index(x, y) {
    return y * this.cols + x
  }

  inBounds(x, y) {
    return x >= 0 && y >= 0 && x < this.cols && y < this.rows
  }

  isBlocked(x, y) {
    return this.blocked[this.index(x, y)] === 1
  }

  isFree(idx) {
    return !this.blocked[idx] && !this.occupied[idx]
  }

  blockRect(x, y, w, h) {
    this.#fillRect(this.blocked, x, y, w, h)
  }

  occupyRect(x, y, w, h) {
    this.#fillRect(this.occupied, x, y, w, h)
  }

  /**
   * Bloqueia as células cobertas por um elemento do DOM (com folga de `pad` células).
   */
  blockElement(el, hostRect, cw, ch, pad = 1) {
    const r = el.getBoundingClientRect()
    if (!r.width || !r.height) return
    const x0 = Math.floor((r.left - hostRect.left) / cw) - pad
    const y0 = Math.floor((r.top - hostRect.top) / ch) - pad
    const x1 = Math.ceil((r.right - hostRect.left) / cw) + pad
    const y1 = Math.ceil((r.bottom - hostRect.top) / ch) + pad
    this.blockRect(x0, y0, x1 - x0, y1 - y0)
  }

  /**
   * Sorteia uma célula livre e a marca como ocupada.
   * @returns {number} índice da célula, ou -1 se não encontrou.
   */
  claimRandom(tries = 40) {
    for (let t = 0; t < tries && this.size > 0; t++) {
      const idx = Math.floor(Math.random() * this.size)
      if (this.isFree(idx)) {
        this.occupied[idx] = 1
        return idx
      }
    }
    return -1
  }

  move(from, to) {
    this.occupied[from] = 0
    this.occupied[to] = 1
  }

  release(idx) {
    this.occupied[idx] = 0
  }

  #fillRect(mask, x, y, w, h) {
    const yEnd = Math.min(this.rows, y + h)
    const xEnd = Math.min(this.cols, x + w)
    for (let j = Math.max(0, y); j < yEnd; j++) {
      for (let i = Math.max(0, x); i < xEnd; i++) mask[j * this.cols + i] = 1
    }
  }
}
