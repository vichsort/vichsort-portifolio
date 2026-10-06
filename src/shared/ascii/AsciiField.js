import { CellGrid } from './grid'
import { createGlyphCache } from './glyphCache'

/**
 * Motor de grade de caracteres sobre um único canvas.
 *
 * Não sabe nada sobre o que é desenhado: apenas mantém a grade, o loop e as
 * ferramentas de desenho, e delega o comportamento a uma lista de camadas.
 *
 * Contrato de camada (todos os métodos opcionais):
 *   interval: number            - intervalo entre ticks, em ms
 *   setup(field)                - (re)inicia o estado após montagem/resize
 *   tick(field)                 - avança um passo da animação
 *   draw(field)                 - desenha o estado atual
 *
 * Camadas são desenhadas na ordem da lista (a primeira fica ao fundo).
 */

const DEFAULTS = {
  fontSize: 16,
  mobileFontSize: 12,
  mobileBreakpoint: 520,
  lineHeight: 1.4,
  fontFamily: 'monospace',
  safeSelector: '[data-ascii-safe]',
  safePadding: 1
}

export class AsciiField {
  constructor(canvas, { layers = [], palette = {}, motion = true, ...options } = {}) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.host = canvas.parentElement
    this.layers = layers
    this.palette = palette
    this.motion = motion
    this.options = { ...DEFAULTS, ...options }
    this.running = false
    this.accumulators = new Map()
    this.glyphs = createGlyphCache()
    this.setup()
  }

  /* ---------- montagem da grade ---------- */

  setup() {
    const { canvas, ctx, options } = this
    const rect = this.host.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    canvas.width = Math.round(rect.width * dpr)
    canvas.height = Math.round(rect.height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const fontSize = rect.width < options.mobileBreakpoint ? options.mobileFontSize : options.fontSize
    this.font = `${fontSize}px ${options.fontFamily}`
    ctx.font = this.font
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'left'

    this.cw = ctx.measureText('M').width
    this.ch = Math.round(fontSize * options.lineHeight)
    this.width = rect.width
    this.height = rect.height
    this.grid = new CellGrid(Math.floor(rect.width / this.cw), Math.floor(rect.height / this.ch))

    this.host.querySelectorAll(options.safeSelector).forEach(el => {
      this.grid.blockElement(el, rect, this.cw, this.ch, options.safePadding)
    })

    this.glyphs.reset({ font: this.font, cw: this.cw, ch: this.ch, dpr })
    this.layers.forEach(layer => layer.setup?.(this))
    this.draw()
  }

  setPalette(palette) {
    this.palette = palette
    this.glyphs.clear()
    this.draw()
  }

  setMotion(motion) {
    this.motion = motion
    if (!motion) this.stop()
    this.setup()
  }

  /* ---------- desenho ---------- */

  /**
   * Desenha um caractere na célula (x, y), com brilho quando a paleta define `glow`.
   */
  glyph(char, x, y, color, alpha = 1) {
    const { ctx, cw, ch } = this
    const px = x * cw
    const py = y * ch
    const glow = this.palette.glow || 0

    ctx.globalAlpha = alpha
    if (glow > 0) {
      this.glyphs.draw(ctx, char, color, glow, px, py)
    } else {
      ctx.fillStyle = color
      ctx.fillText(char, px, py + ch / 2)
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.layers.forEach(layer => layer.draw?.(this))
    this.ctx.globalAlpha = 1
  }

  /* ---------- loop ---------- */

  start() {
    if (!this.motion || this.running) return
    this.running = true
    this.last = performance.now()

    const loop = now => {
      if (!this.running) return
      const dt = Math.min(now - this.last, 250)
      this.last = now

      let dirty = false
      for (const layer of this.layers) {
        if (!layer.tick) continue
        const acc = (this.accumulators.get(layer) || 0) + dt
        if (acc >= layer.interval) {
          this.accumulators.set(layer, acc % layer.interval)
          layer.tick(this)
          dirty = true
        } else {
          this.accumulators.set(layer, acc)
        }
      }

      if (dirty) this.draw()
      this.raf = requestAnimationFrame(loop)
    }

    this.raf = requestAnimationFrame(loop)
  }

  stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
  }

  destroy() {
    this.stop()
    this.glyphs.clear()
  }
}
