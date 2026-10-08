<script setup>
import { onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useElementSize } from '@vueuse/core'
import { useTheme } from '@/shared/composables/useTheme'

/**
 * Chuva de caracteres do comando matrix, cobrindo a tela do terminal.
 * Sai com Ctrl+C, Esc, q ou um toque/clique (emite exit).
 *
 * As cores vêm dos tokens do tema (--neon-cyan, --text-primary, --bg-canvas),
 * relidas quando o tema muda.
 */
const emit = defineEmits(['exit'])

const { t } = useI18n()
const { isDark } = useTheme()

const root = useTemplateRef('root')
const canvasRef = useTemplateRef('canvas')
const { width, height } = useElementSize(root)

const FONT_SIZE = 16
const FRAME_MS = 50
const GLYPHS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789vichsort<>()'

let drops = []
let colors = { trail: '', glyph: '', head: '' }
let frame = 0
let last = 0

/** Cor de um token como rgba com a opacidade pedida (aceita #rrggbb e rgb()/rgba()). */
function withAlpha(color, alpha) {
  const hex = color.match(/^#([0-9a-f]{6})$/i)
  if (hex) {
    const n = parseInt(hex[1], 16)
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
  }
  const rgb = color.match(/rgba?\(([^)]+)\)/)
  if (rgb) {
    const [r, g, b] = rgb[1].split(',').map((v) => v.trim())
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  return color
}

function readColors() {
  const style = getComputedStyle(document.documentElement)
  const token = (name) => style.getPropertyValue(name).trim()
  colors = {
    trail: withAlpha(token('--bg-canvas'), 0.12),
    glyph: token('--neon-cyan'),
    head: token('--text-primary')
  }
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas || !width.value || !height.value) return
  const ratio = window.devicePixelRatio || 1
  canvas.width = width.value * ratio
  canvas.height = height.value * ratio
  const ctx = canvas.getContext('2d')
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
  ctx.font = `${FONT_SIZE}px monospace`
  // Cada coluna começa numa altura diferente, acima da tela
  drops = Array.from({ length: Math.ceil(width.value / FONT_SIZE) }, () => -Math.random() * (height.value / FONT_SIZE))
}

function draw(now) {
  frame = requestAnimationFrame(draw)
  if (now - last < FRAME_MS) return
  last = now

  const ctx = canvasRef.value?.getContext('2d')
  if (!ctx) return

  // Uma camada translúcida do fundo apaga aos poucos: o rastro
  ctx.fillStyle = colors.trail
  ctx.fillRect(0, 0, width.value, height.value)

  drops.forEach((y, i) => {
    const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
    const x = i * FONT_SIZE
    ctx.fillStyle = colors.glyph
    ctx.fillText(glyph, x, (y - 1) * FONT_SIZE)
    ctx.fillStyle = colors.head
    ctx.fillText(glyph, x, y * FONT_SIZE)

    drops[i] = y * FONT_SIZE > height.value && Math.random() > 0.975 ? 0 : y + 1
  })
}

function onKeydown(event) {
  const key = event.key.toLowerCase()
  if ((key === 'c' && event.ctrlKey) || key === 'escape' || key === 'q') {
    event.preventDefault()
    emit('exit')
  }
}

watch([width, height], resize)
watch(isDark, () => {
  readColors()
  resize()
})

onMounted(() => {
  readColors()
  resize()
  frame = requestAnimationFrame(draw)
  window.addEventListener('keydown', onKeydown)
  root.value?.focus({ preventScroll: true })
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div ref="root" class="matrix-rain" tabindex="-1" role="img" :aria-label="t('terminal.commands.matrix.description')" @pointerdown="emit('exit')">
    <canvas ref="canvas" :style="{ width: `${width}px`, height: `${height}px` }" />
    <p class="hint">{{ t('terminal.output.matrix.exit_hint') }}</p>
  </div>
</template>

<style scoped>
.matrix-rain {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: var(--bg-canvas);
  cursor: pointer;
  outline: none;
  overflow: hidden;
}

canvas {
  display: block;
}

.hint {
  position: absolute;
  right: 1rem;
  bottom: 0.75rem;
  margin: 0;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-sm);
  background: var(--bg-surface-elevated);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-muted);
}
</style>
