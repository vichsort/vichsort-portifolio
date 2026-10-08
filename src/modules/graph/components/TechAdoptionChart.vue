<script setup>
import { computed, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useElementSize } from '@vueuse/core'
import { useContent } from '@/core/content/useContent'
import { useNodeMenuHost } from '@/shared/composables/useNodeMenuHost'
import { techUsage, topTechs, yearDomain } from '../core/graphData'
import { usePeriod } from '../composables/usePeriod'
import ChartTooltip from './ChartTooltip.vue'

/**
 * Adoção de techs no tempo: uma linha por tech, uma barra fina por projeto
 * que a usa, no período do projeto. Barras sobrepostas escurecem: mais
 * projetos ao mesmo tempo. Tom único (--viz-accent): a identidade de cada
 * linha é o nome à esquerda, não a cor.
 *
 * Linha focável: hover e foco mostram os projetos; clique ou Enter abre o menu do nó.
 */
const props = defineProps({
  // Mostra só as n techs mais usadas (null: todas)
  limit: { type: Number, default: null }
})

const { t } = useI18n()
const { ofType, linked, node, label } = useContent()
const { toggle } = useNodeMenuHost()
const { period } = usePeriod()

const container = useTemplateRef('container')
const { width } = useElementSize(container)

const ROW = 30
const BAR = 10
const AXIS = 28

const usage = computed(() => {
  const all = techUsage({ ofType, linked, node })
  return props.limit ? topTechs(all, props.limit) : all
})

const domain = computed(() => yearDomain(usage.value))
const labelWidth = computed(() => (width.value < 560 ? 104 : 148))
const plotWidth = computed(() => Math.max(width.value - labelWidth.value - 8, 80))
const height = computed(() => usage.value.length * ROW + AXIS)

const x = (month) =>
  labelWidth.value + ((month - domain.value.start) / (domain.value.end - domain.value.start)) * plotWidth.value

const years = computed(() => {
  const list = []
  for (let m = domain.value.start; m < domain.value.end; m += 12) list.push({ month: m, year: m / 12 })
  return list
})

const rows = computed(() =>
  usage.value.map((tech, i) => ({
    ...tech,
    y: i * ROW,
    name: label(tech.id),
    bars: tech.projects.map((p) => ({
      id: p.id,
      x: x(p.start),
      // Projeto de um mês só ainda aparece como uma marca legível
      width: Math.max(x(p.end + 1) - x(p.start), 6)
    }))
  }))
)

// Tooltip: linha ativa (hover ou foco) e posição no contêiner
const active = ref(null)
const tip = ref({ x: 0, y: 0, flip: false })

function show(row, event) {
  active.value = row
  const box = container.value.getBoundingClientRect()
  const px = event?.clientX ? event.clientX - box.left : x(row.last)
  tip.value = { x: px, y: row.y + ROW / 2, flip: px > box.width * 0.6 }
}

const hide = () => {
  active.value = null
}

const openMenu = (row, event) => toggle(row.id, event.currentTarget)
</script>

<template>
  <div ref="container" class="adoption-chart">
    <svg
      v-if="width"
      :width="width"
      :height="height"
      :viewBox="`0 0 ${width} ${height}`"
      role="img"
      :aria-label="t('graph.adoption.aria')"
    >
      <!-- Grade: um fio por ano -->
      <g class="grid" aria-hidden="true">
        <line
          v-for="year in years"
          :key="year.year"
          :x1="x(year.month)"
          :x2="x(year.month)"
          y1="0"
          :y2="height - AXIS"
        />
        <line :x1="x(domain.end)" :x2="x(domain.end)" y1="0" :y2="height - AXIS" />
      </g>

      <g
        v-for="row in rows"
        :key="row.id"
        class="row"
        :class="{ 'is-active': active?.id === row.id }"
        :transform="`translate(0, ${row.y})`"
        tabindex="0"
        role="button"
        :aria-label="`${row.name}: ${t('graph.projects_count', row.projects.length)}`"
        @pointermove="show(row, $event)"
        @pointerleave="hide"
        @focus="show(row)"
        @blur="hide"
        @click="openMenu(row, $event)"
        @keydown.enter.prevent="openMenu(row, $event)"
      >
        <rect class="row-hit" x="0" y="0" :width="width" :height="ROW" />
        <text class="row-label" :x="labelWidth - 12" :y="ROW / 2" dominant-baseline="central" text-anchor="end">
          {{ row.name }}
        </text>
        <rect
          v-for="bar in row.bars"
          :key="bar.id"
          class="bar"
          :x="bar.x"
          :y="(ROW - BAR) / 2"
          :width="bar.width"
          :height="BAR"
          rx="4"
        />
      </g>

      <g class="axis" aria-hidden="true" :transform="`translate(0, ${height - AXIS})`">
        <text
          v-for="year in years"
          :key="year.year"
          :x="(x(year.month) + x(year.month + 12)) / 2"
          y="18"
          text-anchor="middle"
        >
          {{ year.year }}
        </text>
      </g>
    </svg>

    <ChartTooltip v-if="active" :x="tip.x" :y="tip.y" :flip="tip.flip">
      <p class="tip-value">{{ t('graph.projects_count', active.projects.length) }}</p>
      <p class="tip-label">{{ active.name }} · {{ period(active.first, active.last) }}</p>
      <ul class="tip-list">
        <li v-for="p in active.projects" :key="p.id">
          <span class="tip-key" aria-hidden="true" />
          {{ label(p.id) }}
        </li>
      </ul>
    </ChartTooltip>

    <!-- Tabela: o mesmo conteúdo sem depender de hover nem de cor -->
    <details class="table-view">
      <summary>{{ t('graph.table_view') }}</summary>
      <table>
        <thead>
          <tr>
            <th scope="col">{{ t('graph.adoption.col_tech') }}</th>
            <th scope="col">{{ t('graph.adoption.col_period') }}</th>
            <th scope="col">{{ t('graph.adoption.col_projects') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <th scope="row">{{ row.name }}</th>
            <td class="num">{{ period(row.first, row.last) }}</td>
            <td>{{ row.projects.map((p) => label(p.id)).join(', ') }}</td>
          </tr>
        </tbody>
      </table>
    </details>
  </div>
</template>

<style scoped>
.adoption-chart {
  position: relative;
  width: 100%;
}

svg {
  display: block;
  overflow: visible;
}

.grid line {
  stroke: var(--border-subtle);
  stroke-width: 1;
}

.row {
  cursor: pointer;
  outline: none;
}

.row-hit {
  fill: transparent;
}

.row.is-active .row-hit,
.row:focus-visible .row-hit {
  fill: var(--bg-surface-2);
}

.row:focus-visible .row-label {
  text-decoration: underline;
}

.row-label {
  fill: var(--text-secondary);
  font-size: var(--text-xs);
  font-weight: 600;
}

.row.is-active .row-label {
  fill: var(--text-primary);
}

.bar {
  fill: var(--viz-accent);
  opacity: 0.45;
  transition: opacity var(--transition-fast);
}

.row.is-active .bar {
  opacity: 0.75;
}

.axis text {
  fill: var(--text-muted);
  font-size: var(--text-xs);
  font-variant-numeric: tabular-nums;
}

.tip-value {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--text-primary);
}

.tip-label {
  margin-bottom: 0.35rem;
}

.tip-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.tip-list li {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.tip-key {
  width: 10px;
  height: 2px;
  border-radius: 1px;
  background: var(--viz-accent);
  flex-shrink: 0;
}

.table-view {
  margin-top: var(--spacing-sm);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.table-view summary {
  cursor: pointer;
  width: fit-content;
  color: var(--text-muted);
  font-size: var(--text-xs);
}

.table-view summary:hover {
  color: var(--text-primary);
}

.table-view table {
  width: 100%;
  margin-top: var(--spacing-sm);
  border-collapse: collapse;
}

.table-view th,
.table-view td {
  text-align: left;
  padding: 0.4rem 0.5rem;
  border-bottom: 1px solid var(--border-subtle);
  vertical-align: top;
}

.table-view thead th {
  color: var(--text-muted);
  font-weight: 600;
  font-size: var(--text-xs);
}

.table-view tbody th {
  color: var(--text-primary);
  font-weight: 600;
  white-space: nowrap;
}

.num {
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
</style>
