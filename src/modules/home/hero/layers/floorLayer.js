/**
 * Piso em perspectiva no estilo "outrun" ocupando a base do hero.
 *
 * - Raios convergem para um ponto de fuga no centro do horizonte.
 * - Linhas horizontais se aproximam do observador (espaçamento quadrático).
 * - Cruzamentos viram '+'.
 *
 * O piso reserva sua área na grade para que estrelas e errantes não a invadam.
 */
export function createFloorLayer({ ratio = 0.22, lines = 6, rays = 17, maxRun = 3 } = {}) {
  let phase = 0
  let horizon = 0
  let depth = 0
  let rayCellsByRow = new Map()

  /**
   * Células de cada raio, linha a linha. Raios inclinados avançam várias colunas
   * por linha; o trecho entre uma linha e outra é preenchido (até `maxRun` células)
   * para o raio parecer contínuo e não pontilhado.
   * @returns {Map<number, { cells: Map<number, string>, anchors: Set<number> }>}
   *   por linha: células do raio (x -> caractere) e a posição exata de cada raio
   */
  const traceRays = (cols, rows) => {
    const cx = (cols - 1) / 2
    const cells = new Map()

    for (let r = 0; r < rays; r++) {
      const spread = (r / (rays - 1) - 0.5) * cols * 2.2
      const dir = Math.sign(spread)
      const char = dir === 0 ? '|' : dir < 0 ? '/' : '\\'
      let prevX = Math.round(cx)

      for (let y = horizon + 1; y < rows; y++) {
        const x = Math.round(cx + spread * ((y - horizon) / depth))
        if (!cells.has(y)) cells.set(y, { cells: new Map(), anchors: new Set() })
        const row = cells.get(y)
        const run = Math.min(Math.abs(x - prevX), maxRun)
        for (let k = 0; k < Math.max(1, run); k++) row.cells.set(x - dir * k, char)
        row.anchors.add(x)
        prevX = x
      }
    }

    return cells
  }

  return {
    interval: 90,

    setup({ grid }) {
      depth = Math.max(4, Math.round(grid.rows * ratio))
      horizon = grid.rows - depth
      grid.occupyRect(0, horizon, grid.cols, depth)
      rayCellsByRow = traceRays(grid.cols, grid.rows)
    },

    tick() {
      phase = (phase + 0.04) % 1
    },

    draw(field) {
      const { grid, palette } = field

      // horizonte
      for (let x = 0; x < grid.cols; x++) {
        if (!grid.isBlocked(x, horizon)) field.glyph('_', x, horizon, palette.orange, 0.45)
      }

      // linhas horizontais: t² concentra as linhas perto do horizonte
      const rowsWithLine = new Map()
      for (let i = 0; i < lines; i++) {
        const t = ((i + phase) / lines) ** 2
        rowsWithLine.set(horizon + 1 + Math.round(t * (depth - 2)), t)
      }

      for (let y = horizon + 1; y < grid.rows; y++) {
        const t = (y - horizon) / depth
        const lineT = rowsWithLine.get(y)
        const rayRow = rayCellsByRow.get(y)

        if (lineT !== undefined) {
          const char = lineT < 0.15 ? '.' : lineT < 0.5 ? '-' : '='
          for (let x = 0; x < grid.cols; x++) {
            if (grid.isBlocked(x, y)) continue
            const crossing = rayRow?.anchors.has(x)
            field.glyph(
              crossing ? '+' : char,
              x, y,
              crossing ? palette.cyan : palette.pink,
              0.12 + 0.6 * t
            )
          }
          continue
        }

        for (const [x, char] of rayRow?.cells ?? []) {
          if (!grid.inBounds(x, y) || grid.isBlocked(x, y)) continue
          field.glyph(char, x, y, palette.magenta, 0.15 + 0.55 * t)
        }
      }
    }
  }
}
