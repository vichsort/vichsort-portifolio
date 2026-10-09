/**
 * Satélites do hero: três camadas independentes com ritmos próprios.
 * As cores são chaves da paleta (resolvidas no desenho), então trocar o
 * tema não exige reiniciar o estado.
 */

const rnd = n => Math.floor(Math.random() * n)
const pick = list => list[rnd(list.length)]
const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

/* ---------- estrelas: fixas, piscam variando o glifo ---------- */

const STAR_LEVELS = ['.', '·', '+', '*', '✦']
const STAR_COLORS = ['yellow', 'cyan', 'text', 'text', 'pink']

export function createStarsLayer({ density = 1 / 160 } = {}) {
  let stars = []

  return {
    interval: 220,

    setup({ grid }) {
      stars = []
      const target = Math.round(grid.size * density)
      for (let n = 0; n < target; n++) {
        const idx = grid.claimRandom()
        if (idx < 0) break
        stars.push({ idx, level: rnd(STAR_LEVELS.length), color: pick(STAR_COLORS) })
      }
    },

    tick() {
      for (const star of stars) {
        if (Math.random() < 0.15) {
          star.level = clamp(star.level + (Math.random() < 0.5 ? -1 : 1), 0, STAR_LEVELS.length - 1)
        }
      }
    },

    draw(field) {
      const { cols } = field.grid
      for (const star of stars) {
        const alpha = 0.3 + (star.level / (STAR_LEVELS.length - 1)) * 0.6
        field.glyph(STAR_LEVELS[star.level], star.idx % cols, (star.idx / cols) | 0, field.palette[star.color], alpha)
      }
    }
  }
}

/* ---------- errantes: andam uma célula por vez, mutam glifo e cor ---------- */

const WANDER_CHARS = '@#%&*+=:o'
const WANDER_COLORS = ['pink', 'cyan', 'yellow', 'orange', 'magenta']

export function createWanderersLayer({ density = 1 / 110 } = {}) {
  let wanderers = []

  return {
    interval: 150,

    setup({ grid }) {
      wanderers = []
      const target = clamp(Math.round(grid.size * density), 12, 90)
      for (let n = 0; n < target; n++) {
        const idx = grid.claimRandom()
        if (idx < 0) break
        wanderers.push({ idx, char: pick(WANDER_CHARS), color: pick(WANDER_COLORS) })
      }
    },

    tick({ grid }) {
      const { cols, rows } = grid
      for (const w of wanderers) {
        const r = Math.random()

        if (r < 0.03) {
          // some e reaparece em outra célula
          const to = grid.claimRandom()
          if (to >= 0) {
            grid.release(w.idx)
            w.idx = to
          }
          continue
        }

        if (r < 0.38) {
          const x = w.idx % cols
          const y = (w.idx / cols) | 0
          const nx = x + rnd(3) - 1
          const ny = y + rnd(3) - 1
          if ((nx !== x || ny !== y) && nx >= 0 && ny >= 0 && nx < cols && ny < rows) {
            const to = ny * cols + nx
            if (grid.isFree(to)) {
              grid.move(w.idx, to)
              w.idx = to
            }
          }
        }

        if (Math.random() < 0.22) w.char = pick(WANDER_CHARS)
        if (Math.random() < 0.18) w.color = pick(WANDER_COLORS)
      }
    },

    draw(field) {
      const { cols } = field.grid
      for (const w of wanderers) {
        field.glyph(w.char, w.idx % cols, (w.idx / cols) | 0, field.palette[w.color], 0.7)
      }
    }
  }
}

/* ---------- cometas: cruzam o céu deixando rastro ---------- */

const COMET_TRAIL = ['@', '#', '*', '+', ':', '.']
const COMET_COLORS = ['cyan', 'pink', 'yellow']

/**
 * Cometas espontâneos entram pelas laterais e descem levemente.
 * `launch(px, py)` dispara um cometa sob demanda, subindo a partir de um ponto
 * (em px, relativo ao container do canvas) /// usado em interações.
 */
export function createCometsLayer({ max = 2, chance = 0.015, skyRatio = 0.6 } = {}) {
  let comets = []
  let field = null

  // Posição contínua (x, y) + velocidade por passo; o rastro guarda as células visitadas
  const add = comet => comets.push({ ...comet, color: comet.color ?? pick(COMET_COLORS), trail: [] })

  const spawn = ({ cols, rows }) => {
    const dir = Math.random() < 0.5 ? 1 : -1
    add({
      x: dir > 0 ? -1 : cols,
      y: rnd(Math.max(1, Math.floor(rows * skyRatio))),
      vx: dir,
      vy: 1 / (3 + rnd(4)) // desce uma linha a cada 3–6 passos
    })
  }

  return {
    interval: 45,

    setup(nextField) {
      field = nextField
      comets = []
    },

    launch(px, py) {
      if (!field) return
      const { cols, rows } = field.grid
      // o ponto pode estar fora do canvas (ex.: botão abaixo dele); nasce na borda mais próxima
      add({
        x: Math.min(cols - 1, Math.max(0, px / field.cw)),
        y: Math.min(rows - 1, Math.max(0, py / field.ch)),
        vx: (Math.random() < 0.5 ? -1 : 1) * 0.35,
        vy: -1,
        color: 'cyan',
        overText: true // é uma resposta a um clique: aparece mesmo sobre áreas protegidas
      })
    },

    tick({ grid }) {
      for (const comet of comets) {
        comet.x += comet.vx
        comet.y += comet.vy
        const cell = [Math.round(comet.x), Math.round(comet.y)]
        const [hx, hy] = comet.trail[0] ?? []
        if (cell[0] !== hx || cell[1] !== hy) comet.trail.unshift(cell)
        if (comet.trail.length > COMET_TRAIL.length) comet.trail.pop()
      }

      comets = comets.filter(c => c.trail.length === 0 || c.trail.some(([x, y]) => grid.inBounds(x, y)))
      if (comets.length < max && Math.random() < chance) spawn(grid)
    },

    draw(field) {
      const { grid } = field
      for (const comet of comets) {
        comet.trail.forEach(([x, y], i) => {
          if (!grid.inBounds(x, y)) return
          // cometas espontâneos passam "por trás" do texto e de áreas reservadas (ex.: o piso)
          if (!comet.overText && (grid.isBlocked(x, y) || grid.isOccupied(x, y))) return
          field.glyph(COMET_TRAIL[i], x, y, field.palette[comet.color], 1 - i / COMET_TRAIL.length)
        })
      }
    }
  }
}
