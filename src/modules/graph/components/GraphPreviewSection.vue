<script setup>
import { useI18n } from 'vue-i18n'
import TechAdoptionChart from './TechAdoptionChart.vue'
import { ArrowUpRight, Waypoints } from 'lucide-vue-next'

/**
 * Prévia dos gráficos no Sobre (logo depois do stack): as techs mais usadas
 * no tempo e o caminho para a página completa (/graph).
 */
const { t } = useI18n()
</script>

<template>
  <section class="graph-preview">
    <div class="section-header">
      <div>
        <h2 class="section-title">{{ t('graph.preview.title') }}</h2>
        <p class="section-subtitle">{{ t('graph.preview.subtitle') }}</p>
      </div>
      <router-link to="/graph" class="explore-link">
        <Waypoints :size="16" />
        <span>{{ t('graph.preview.cta') }}</span>
        <ArrowUpRight :size="14" />
      </router-link>
    </div>

    <div class="chart-card surface-card">
      <TechAdoptionChart :limit="10" />
    </div>
  </section>
</template>

<style scoped>
.graph-preview {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--spacing-md);
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

.explore-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: var(--radius-full);
  background-color: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.explore-link:hover {
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-2px);
}

.chart-card {
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
}

.chart-card:hover {
  transform: none;
  border-color: var(--border-subtle);
  box-shadow: var(--shadow-card);
}

@media (max-width: 768px) {
  .chart-card {
    padding: var(--spacing-md);
  }
}
</style>
