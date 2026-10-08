<script setup>
import { computed, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useElementSize } from '@vueuse/core'
import { useContent } from '@/core/content/useContent'
import { nodeRoute } from '@/core/content/routes'
import { useNodeMenuHost } from '@/shared/composables/useNodeMenuHost'
import { GRAPH_TYPES } from '../core/graphData'
import { forceLayout } from '../core/forceLayout'
import ChartTooltip from './ChartTooltip.vue'

/**
 * Grafo de conhecimento: projetos, pesquisas e as techs que os ligam.
 *
 * Tipo de nó = cor (paleta categórica validada, --viz-*) + forma (círculo,
 * quadrado, losango), então a identidade não depende só da cor. Rótulos
 * seletivos: os projetos sempre; o resto aparece com o hover ou o foco, junto
 * com os vizinhos do nó. Clique leva à página (projeto, pesquisa) ou abre o
 * menu do nó (tech).
 */
const props = defineProps({
  graph: { type: Object, required: true }
})

const { t } = useI18n()
const router = useRouter()
const { node, label } = useContent()
const { toggle } = useNodeMenuHost()

const container = useTemplateRef('container')
const { width } = useElementSize(container)
const narrow = computed(() => width.value < 640)
const height = computed(() => (narrow.value ? 520 : 600))

const radius = (n) => {
  if (n.type === 'project') return 7
  if (n.type === 'research') return 6
  return Math.min(4 + Math.sqrt(n.degree) * 1.6, 11)
}

const nodes = computed(() => props.graph.nodes.map((n) => ({ ...n, radius: radius(n), name: label(n.id) })))

const positions = computed(() =>
  width.value ? forceLayout(nodes.value, props.graph.edges, { width: width.value, height: height.value, padding: 40 }) : new Map()
)

const neighbors = computed(() => {
  const map = new Map(nodes.value.map((n) => [n.id, new Set()]))
  for (const { source, target } of props.graph.edges) {
    map.get(source)?.add(target)
    map.get(target)?.add(source)
  }
  return map
})

const active = ref(null)
const isLit = (id) => !active.value || id === active.value.id || neighbors.value.get(active.value.id).has(id)
// Em tela estreita não cabem rótulos fixos: só os do nó ativo e dos vizinhos
const showLabel = (n) => (active.value ? isLit(n.id) : !narrow.value && n.type === 'project')

const placed = computed(() =>
  nodes.value
    .map((n) => ({ ...n, ...positions.value.get(n.id) }))
    .filter((n) => n.x !== undefined)
)

const lines = computed(() =>
  props.graph.edges.map((e) => {
    const a = positions.value.get(e.source)
    const b = positions.value.get(e.target)
    const lit = active.value && (e.source === active.value.id || e.target === active.value.id)
    return { key: `${e.source}→${e.target}`, x1: a?.x, y1: a?.y, x2: b?.x, y2: b?.y, lit }
  })
)

const tip = computed(() => {
  if (!active.value) return null
  const p = positions.value.get(active.value.id)
  return { x: p.x + active.value.radius, y: p.y, flip: p.x > width.value * 0.6 }
})

// No toque não há hover: o primeiro toque seleciona (mostra nome e ligações), o segundo abre
let pointerType = 'mouse'
let selectedByTouch = null

const setPointer = (event) => {
  pointerType = event.pointerType
}

const leave = () => {
  if (pointerType !== 'touch') active.value = null
}

function open(n, event) {
  if (pointerType === 'touch' && selectedByTouch !== n.id) {
    selectedByTouch = n.id
    active.value = n
    return
  }
  selectedByTouch = null
  const route = nodeRoute(node(n.id))
  if (route) router.push(route)
  else toggle(n.id, event.currentTarget)
}

/** Losango com o mesmo "raio" visual de um círculo. */
const diamond = (r) => `0,${-r * 1.25} ${r * 1.25},0 0,${r * 1.25} ${-r * 1.25},0`
</script>

<template>
  <div class="knowledge-graph">
    <ul class="legend">
      <li v-for="type in GRAPH_TYPES" :key="type">
        <svg width="14" height="14" viewBox="-7 -7 14 14" aria-hidden="true">
          <circle v-if="type === 'project'" r="5.5" :class="`fill-${type}`" />
          <rect v-else-if="type === 'tech'" x="-5" y="-5" width="10" height="10" rx="2" :class="`fill-${type}`" />
          <polygon v-else :points="diamond(4.8)" :class="`fill-${type}`" />
        </svg>
        {{ t(`graph.network.legend.${type}`) }}
      </li>
      <li class="legend-hint">{{ t('graph.network.hint') }}</li>
    </ul>

    <div ref="container" class="canvas" :style="{ height: `${height}px` }">
      <svg
        v-if="width"
        :width="width"
        :height="height"
        :viewBox="`0 0 ${width} ${height}`"
        role="group"
        :aria-label="t('graph.network.aria')"
        @pointerleave="leave"
      >
        <g class="edges" aria-hidden="true">
          <line
            v-for="line in lines"
            :key="line.key"
            :x1="line.x1"
            :y1="line.y1"
            :x2="line.x2"
            :y2="line.y2"
            :class="{ 'is-lit': line.lit, 'is-dim': active && !line.lit }"
          />
        </g>

        <g
          v-for="n in placed"
          :key="n.id"
          class="node"
          :class="{ 'is-dim': !isLit(n.id), 'is-active': active?.id === n.id }"
          :transform="`translate(${n.x}, ${n.y})`"
          tabindex="0"
          role="button"
          :aria-label="`${n.name} (${t(`graph.network.legend.${n.type}`)})`"
          @pointerdown="setPointer"
          @pointerenter="active = n"
          @focus="active = n"
          @blur="active = null"
          @click="open(n, $event)"
          @keydown.enter.prevent="open(n, $event)"
        >
          <circle class="hit" :r="Math.max(12, n.radius + 6)" />
          <circle v-if="n.type === 'project'" :r="n.radius" :class="`mark fill-${n.type}`" />
          <rect
            v-else-if="n.type === 'tech'"
            :x="-n.radius"
            :y="-n.radius"
            :width="n.radius * 2"
            :height="n.radius * 2"
            rx="2"
            :class="`mark fill-${n.type}`"
          />
          <polygon v-else :points="diamond(n.radius)" :class="`mark fill-${n.type}`" />
          <text
            v-if="showLabel(n)"
            class="node-label"
            :x="n.x > width - 140 ? -(n.radius + 5) : n.radius + 5"
            :text-anchor="n.x > width - 140 ? 'end' : 'start'"
            dominant-baseline="central"
          >
            {{ n.name }}
          </text>
        </g>
      </svg>

      <ChartTooltip v-if="tip" :x="tip.x" :y="tip.y" :flip="tip.flip">
        <p class="tip-value">{{ t('graph.network.links', neighbors.get(active.id).size) }}</p>
        <p>{{ active.name }} · {{ t(`graph.network.legend.${active.type}`) }}</p>
      </ChartTooltip>
    </div>
  </div>
</template>

<style scoped>
.knowledge-graph {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.legend {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1.25rem;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-secondary);
}

.legend li {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.legend-hint {
  font-weight: 400;
  color: var(--text-muted);
}

.canvas {
  position: relative;
  width: 100%;
}

svg {
  display: block;
}

.fill-project {
  fill: var(--viz-project);
}

.fill-tech {
  fill: var(--viz-tech);
}

.fill-research {
  fill: var(--viz-research);
}

.edges line {
  stroke: var(--border-medium);
  stroke-width: 1;
  transition: opacity var(--transition-fast);
}

.edges line.is-lit {
  stroke: var(--text-secondary);
}

.edges line.is-dim {
  opacity: 0.25;
}

.node {
  cursor: pointer;
  outline: none;
  transition: opacity var(--transition-fast);
}

.node.is-dim {
  opacity: 0.2;
}

.hit {
  fill: transparent;
}

/* Anel na cor da superfície: o nó continua legível sobre as arestas */
.mark {
  stroke: var(--bg-surface-1);
  stroke-width: 2;
}

.node.is-active .mark,
.node:focus-visible .mark {
  stroke: var(--text-primary);
}

.node-label {
  font-size: var(--text-xs);
  font-weight: 600;
  fill: var(--text-secondary);
  stroke: var(--bg-surface-1);
  stroke-width: 3px;
  paint-order: stroke;
  pointer-events: none;
}

.node.is-active .node-label {
  fill: var(--text-primary);
}

.tip-value {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--text-primary);
}

@media (prefers-reduced-motion: reduce) {
  .edges line,
  .node {
    transition: none;
  }
}
</style>
