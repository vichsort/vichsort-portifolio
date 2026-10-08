<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useContent } from '@/core/content/useContent'
import { knowledgeGraph, graphStats } from '../core/graphData'
import KnowledgeGraph from '../components/KnowledgeGraph.vue'
import TechAdoptionChart from '../components/TechAdoptionChart.vue'
import TechMatrix from '../components/TechMatrix.vue'
import { ArrowLeft } from 'lucide-vue-next'

const { t } = useI18n()
const { ofType, linked, node, outlinks } = useContent()

const graph = computed(() => knowledgeGraph({ ofType, linked, node, outlinks }))
const stats = computed(() => graphStats({ ofType }, graph.value))

const tiles = computed(() => [
  { key: 'projects', value: stats.value.projects },
  { key: 'techs', value: stats.value.techs },
  { key: 'researches', value: stats.value.researches },
  { key: 'links', value: stats.value.links }
])
</script>

<template>
  <main class="graph-page">
    <div class="page-container">
      <router-link to="/overview" class="back-link">
        <ArrowLeft :size="18" />
        <span>{{ t('graph.back') }}</span>
      </router-link>

      <header class="page-header">
        <h1 class="page-title">{{ t('graph.title') }}</h1>
        <p class="page-subtitle">{{ t('graph.subtitle') }}</p>
      </header>

      <ul class="stat-row">
        <li v-for="tile in tiles" :key="tile.key" class="stat-tile surface-card">
          <span class="stat-label">{{ t(`graph.stats.${tile.key}`) }}</span>
          <span class="stat-value">{{ tile.value }}</span>
        </li>
      </ul>

      <section class="graph-section surface-card">
        <div class="section-header">
          <h2 class="section-title">{{ t('graph.network.title') }}</h2>
          <p class="section-subtitle">{{ t('graph.network.subtitle') }}</p>
        </div>
        <KnowledgeGraph :graph="graph" />
      </section>

      <section class="graph-section surface-card">
        <div class="section-header">
          <h2 class="section-title">{{ t('graph.adoption.title') }}</h2>
          <p class="section-subtitle">{{ t('graph.adoption.subtitle') }}</p>
        </div>
        <TechAdoptionChart />
      </section>

      <section class="graph-section surface-card">
        <div class="section-header">
          <h2 class="section-title">{{ t('graph.matrix.title') }}</h2>
          <p class="section-subtitle">{{ t('graph.matrix.subtitle') }}</p>
        </div>
        <TechMatrix />
      </section>
    </div>
  </main>
</template>

<style scoped>
.graph-page {
  min-height: 100vh;
  padding: 6rem var(--spacing-xl) var(--spacing-2xl) var(--spacing-xl);
}

.page-container {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--text-sm);
  color: var(--text-muted);
  transition: color var(--transition-fast);
  width: fit-content;
}

.back-link:hover {
  color: var(--primary);
}

.page-title {
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  line-height: 1;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.page-subtitle {
  font-size: var(--text-base);
  color: var(--text-secondary);
}

.stat-row {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
}

.stat-tile {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.stat-value {
  font-size: var(--text-4xl);
  font-weight: 700;
  line-height: 1.1;
  color: var(--text-primary);
}

.graph-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
}

/* Cards de gráfico e de número não sobem no hover: o ponteiro está lendo, não escolhendo */
.graph-section:hover,
.stat-tile:hover {
  transform: none;
  border-color: var(--border-subtle);
  box-shadow: var(--shadow-card);
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.section-title {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.section-subtitle {
  font-size: var(--text-base);
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .graph-page {
    padding: 5rem var(--spacing-md) var(--spacing-xl) var(--spacing-md);
  }

  .stat-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .graph-section {
    padding: var(--spacing-md);
  }
}
</style>
