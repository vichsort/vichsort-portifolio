<script setup>
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { parseArt } from '@/shared/ascii/grid'

/**
 * Título em ASCII art renderizado em DOM (entra no fluxo do layout e escala via CSS).
 * Um scanner varre as colunas: na primeira passada revela a arte, nas seguintes
 * faz uma passada de "glitch" sobre a arte já visível.
 *
 * O estado de cada célula é aplicado direto no DOM (data-state / textContent) para
 * não disparar re-render do Vue a cada passo.
 */
const props = defineProps({
  art: { type: String, required: true },
  // Arte anexada à direita, alinhada pela base e pintada com destaque (ex.: o ponto final)
  accent: { type: String, default: '' },
  gap: { type: Number, default: 2 },
  active: { type: Boolean, default: false },
  motion: { type: Boolean, default: true },
  stepMs: { type: Number, default: 16 },
  restMs: { type: Number, default: 6000 }
})

const SCRAMBLE_CHARS = '#%&$?/\\<>+=*@'
const TRAIL = 3

const layout = computed(() => {
  const main = parseArt(props.art)
  const accent = props.accent ? parseArt(props.accent) : null
  const rows = Math.max(main.rows, accent?.rows ?? 0)
  const accentStart = main.cols + props.gap
  const cols = accent ? accentStart + accent.cols : main.cols

  const cells = []
  for (let y = 0; y < rows; y++) {
    const row = []
    for (let x = 0; x < cols; x++) {
      let char = ' '
      let isAccent = false
      if (x < main.cols) {
        char = main.lines[y]?.[x] ?? ' '
      } else if (accent && x >= accentStart) {
        char = accent.lines[y - (rows - accent.rows)]?.[x - accentStart] ?? ' '
        isAccent = true
      }
      row.push({ i: y * cols + x, x, char, isAccent })
    }
    cells.push(row)
  }

  return { cols, cells }
})

const spans = []
let timer = null
let pos = -1
let firstPass = true

function cellState(x) {
  if (pos < 0) return firstPass ? 'hidden' : 'idle'
  if (x === pos) return 'head'
  if (x < pos && x >= pos - TRAIL) return 'scramble'
  if (x > pos && firstPass) return 'hidden'
  return 'idle'
}

function paint() {
  for (const row of layout.value.cells) {
    for (const cell of row) {
      const el = spans[cell.i]
      if (!el) continue
      const state = cellState(cell.x)
      let text = cell.char
      if (state === 'hidden') text = ' '
      else if (state === 'scramble' && cell.char !== ' ') {
        text = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      }
      if (el.textContent !== text) el.textContent = text
      if (el.dataset.state !== state) el.dataset.state = state
    }
  }
}

function step() {
  timer = null
  pos++
  if (pos > layout.value.cols + TRAIL) {
    pos = -1
    firstPass = false
    paint()
    schedule(props.restMs)
    return
  }
  paint()
  schedule(props.stepMs)
}

function schedule(ms) {
  clearTimeout(timer)
  timer = setTimeout(step, ms)
}

function stop() {
  clearTimeout(timer)
  timer = null
}

function sync() {
  if (!props.motion) {
    stop()
    pos = -1
    firstPass = false
    paint()
    return
  }
  if (props.active) {
    if (!timer) schedule(props.stepMs)
  } else {
    stop()
  }
}

onMounted(() => {
  paint()
  sync()
})
onBeforeUnmount(stop)

watch(() => [props.active, props.motion], sync)
watch(layout, paint, { flush: 'post' })
</script>

<template>
  <span class="ascii-title" aria-hidden="true">
    <span
      v-for="(row, y) in layout.cells"
      :key="y"
      class="ascii-line"
    >
      <span
        v-for="cell in row"
        :key="cell.x"
        :ref="el => (spans[cell.i] = el)"
        class="ascii-cell"
        :class="{ 'is-accent': cell.isAccent }"
      >{{ cell.char }}</span>
    </span>
  </span>
</template>

<style scoped>
.ascii-title {
  display: block;
  font-family: var(--font-mono);
  font-weight: 700;
  /* 41 colunas × ~0.6em por caractere: cabe em 343px no mobile e ~1000px no desktop */
  font-size: clamp(0.7rem, 3.4vw, 2.6rem);
  line-height: 1;
  letter-spacing: 0;
  white-space: pre;
  color: var(--text-primary);
  text-shadow: var(--hero-title-shadow);
}

.ascii-line {
  display: block;
}

.ascii-cell.is-accent {
  color: var(--primary);
}

.ascii-cell[data-state='scramble'] {
  color: var(--accent-hover);
}

.ascii-cell[data-state='head'] {
  background: var(--primary);
  color: var(--text-on-primary);
  text-shadow: none;
}
</style>
