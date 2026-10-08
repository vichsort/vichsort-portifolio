<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useContent } from '@/core/content/useContent'
import { nodeRoute } from '@/core/content/routes'
import { useNodeMenuHost } from '@/shared/composables/useNodeMenuHost'
import { projectSpans, techUsage } from '../core/graphData'

/**
 * Matriz tech × projeto: linhas são techs (da mais à menos usada), colunas
 * são projetos (do mais antigo ao mais recente). Uma <table> de verdade, então
 * já é a própria versão acessível. Hover e foco destacam linha e coluna, e a
 * leitura aparece acima da matriz.
 */
const { t } = useI18n()
const { ofType, linked, node, label } = useContent()
const { toggle } = useNodeMenuHost()

const queries = { ofType, linked, node }

const projects = computed(() =>
  projectSpans(queries).map((p) => ({ id: p.id, name: label(p.id), to: nodeRoute(node(p.id)), techs: new Set(p.techs) }))
)

const techs = computed(() =>
  [...techUsage(queries)]
    .sort((a, b) => b.projects.length - a.projects.length || a.id.localeCompare(b.id))
    .map((tech) => ({ id: tech.id, name: label(tech.id), count: tech.projects.length }))
)

const hover = ref(null)

const readout = computed(() => {
  if (!hover.value) return t('graph.matrix.hint')
  const { tech, project } = hover.value
  return t(project.techs.has(tech.id) ? 'graph.matrix.uses' : 'graph.matrix.not_uses', { project: project.name, tech: tech.name })
})
</script>

<template>
  <div class="tech-matrix">
    <p class="readout" aria-live="polite">{{ readout }}</p>

    <div class="matrix-scroll">
      <table @pointerleave="hover = null">
        <thead>
          <tr>
            <th scope="col" class="corner">
              <span class="sr-only">{{ t('graph.adoption.col_tech') }}</span>
            </th>
            <th
              v-for="project in projects"
              :key="project.id"
              scope="col"
              class="col-head"
              :class="{ 'is-active': hover?.project.id === project.id }"
            >
              <router-link :to="project.to" class="col-link">{{ project.name }}</router-link>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tech in techs" :key="tech.id" :class="{ 'is-active': hover?.tech.id === tech.id }">
            <th scope="row" class="row-head">
              <button type="button" class="row-button" @click="toggle(tech.id, $event.currentTarget)">
                <span class="row-name">{{ tech.name }}</span>
                <span class="row-count">{{ tech.count }}</span>
              </button>
            </th>
            <td
              v-for="project in projects"
              :key="project.id"
              class="cell"
              :class="{ 'is-col-active': hover?.project.id === project.id }"
              @pointerenter="hover = { tech, project }"
            >
              <span v-if="project.techs.has(tech.id)" class="mark" />
              <span class="sr-only">
                {{ project.techs.has(tech.id) ? t('graph.matrix.yes') : t('graph.matrix.no') }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.tech-matrix {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.readout {
  min-height: 1.5em;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

/* Só a matriz rola na horizontal; a página nunca */
.matrix-scroll {
  overflow-x: auto;
  max-width: 100%;
}

table {
  border-collapse: separate;
  border-spacing: 2px;
}

.corner,
.row-head {
  position: sticky;
  left: 0;
  z-index: 1;
  background: var(--bg-surface-1);
}

.col-head {
  height: 150px;
  vertical-align: bottom;
  padding: 0 0 0.4rem;
}

.col-link {
  display: inline-block;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-secondary);
  text-decoration: none;
  white-space: nowrap;
}

.col-head.is-active .col-link,
.col-link:hover,
.col-link:focus-visible {
  color: var(--text-primary);
}

.row-head {
  padding-right: 0.5rem;
  text-align: right;
}

.row-button {
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  gap: 0.4rem;
  width: 100%;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font: inherit;
  white-space: nowrap;
}

.row-name {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-secondary);
}

.row-count {
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
  min-width: 1.2em;
}

tr.is-active .row-name,
.row-button:hover .row-name,
.row-button:focus-visible .row-name {
  color: var(--text-primary);
}

.cell {
  width: 22px;
  height: 22px;
  padding: 0;
  text-align: center;
  vertical-align: middle;
  border-radius: 4px;
}

tr.is-active .cell,
.cell.is-col-active {
  background: var(--bg-surface-2);
}

.mark {
  display: block;
  width: 14px;
  height: 14px;
  margin: auto;
  border-radius: 4px;
  background: var(--viz-accent);
}
</style>
