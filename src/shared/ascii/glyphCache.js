/**
 * Cache de glifos com brilho pré-renderizados.
 *
 * `shadowBlur` é caro para aplicar glifo a glifo a cada quadro; aqui cada
 * combinação caractere + cor + brilho é desenhada uma única vez num canvas
 * auxiliar e depois só copiada com drawImage.
 */
export function createGlyphCache() {
  const sprites = new Map()
  let metrics = null

  function render(char, color, glow) {
    const { font, cw, ch, dpr } = metrics
    const pad = Math.ceil(glow * 2)
    const w = cw + pad * 2
    const h = ch + pad * 2

    const canvas = document.createElement('canvas')
    canvas.width = Math.ceil(w * dpr)
    canvas.height = Math.ceil(h * dpr)

    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
    ctx.font = font
    ctx.textBaseline = 'middle'
    ctx.fillStyle = color
    ctx.shadowColor = color
    ctx.shadowBlur = glow * dpr // shadowBlur ignora a transformação, então é escalado à mão
    ctx.fillText(char, pad, pad + ch / 2)
    ctx.shadowBlur = 0
    ctx.fillText(char, pad, pad + ch / 2) // núcleo nítido por cima do brilho

    return { canvas, pad, w: canvas.width / dpr, h: canvas.height / dpr }
  }

  return {
    /** Redefine as métricas da fonte (após resize) e descarta os sprites antigos. */
    reset(nextMetrics) {
      metrics = nextMetrics
      sprites.clear()
    },

    clear() {
      sprites.clear()
    },

    draw(ctx, char, color, glow, px, py) {
      const key = `${char}|${color}|${glow}`
      let sprite = sprites.get(key)
      if (!sprite) {
        sprite = render(char, color, glow)
        sprites.set(key, sprite)
      }
      ctx.drawImage(sprite.canvas, px - sprite.pad, py - sprite.pad, sprite.w, sprite.h)
    }
  }
}
