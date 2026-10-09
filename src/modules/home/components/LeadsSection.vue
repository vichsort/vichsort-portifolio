<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowUpRight } from 'lucide-vue-next'
import { useContent } from '@/core/content/useContent'
import { LANGS } from '@/core/i18n/languages'

const { t } = useI18n()
const { ofType, node } = useContent()

const projects = ofType('project')
const researches = ofType('research')

// Ano mais antigo entre projetos e pesquisas: date é 'AAAA', 'AAAA-MM' ou [início, fim]
const firstYear = Math.min(
  ...[...projects, ...researches].flatMap(({ data }) => [data.date].flat()).map((d) => parseInt(String(d), 10)).filter(Boolean)
)
const yearsCoding = Number.isFinite(firstYear) ? new Date().getFullYear() - firstYear : 0

// Prêmio fica no texto (award), em qualquer idioma
const awards = researches.filter(({ id }) => LANGS.some((lang) => node(id)?.texts[lang]?.award)).length

// Larguras na grade de 10 colunas, pelo número de cards visíveis
const LAYOUTS = { 4: ['span-7', 'span-3', 'span-5', 'span-5'], 3: ['span-4', 'span-3', 'span-3'], 2: ['span-5', 'span-5'], 1: ['span-10'] }

const STATS = [
  { id: 'projects', value: projects.length, unit: '', labelKey: 'leads.stats.projects', route: '/projects', glowClass: 'glow-primary' },
  { id: 'experience', value: yearsCoding, unit: '+', labelKey: 'leads.stats.experience', route: '/overview', glowClass: 'glow-accent' },
  { id: 'researches', value: awards, unit: '', labelKey: 'leads.stats.researches', route: '/researches', glowClass: 'glow-surface' },
  { id: 'certs', value: ofType('certification').length, unit: '', labelKey: 'leads.stats.certs', route: '/certifications', glowClass: 'glow-accent' }
]

// Card com zero fica de fora (sem certificações, por exemplo, não aparece "0 Certificações")
const statsCards = computed(() => {
  const visible = STATS.filter((card) => card.value > 0)
  return visible.map((card, i) => ({ ...card, gridClass: LAYOUTS[visible.length][i] }))
})
</script>

<template>
  <section class="leads-container">
    <div class="grid-wrapper">
      <router-link
        v-for="card in statsCards"
        :key="card.id"
        :to="card.route"
        class="stat-card surface-card interactive"
        :class="[card.gridClass, card.glowClass]"
      >
        <div class="card-inner">
          <div class="stat-header">
            <span class="stat-value">
              {{ card.value }}<span class="stat-unit" v-if="card.unit">{{ card.unit }}</span>
            </span>

            <span class="arrow-wrapper">
              <ArrowUpRight :size="24" class="arrow-icon" />
            </span>
          </div>

          <div class="stat-footer">
            <h3 class="stat-label">{{ t(card.labelKey) }}</h3>
            <span class="hover-label">{{ t('leads.action') }} &rarr;</span>
          </div>
        </div>

        <div class="pixel-deco" aria-hidden="true"></div>
      </router-link>
    </div>
  </section>
</template>

<style scoped>
.leads-container {
  padding: var(--spacing-2xl) var(--spacing-xl);
  width: 100%;
}

.grid-wrapper {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: var(--spacing-md);
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
}

.span-7 { grid-column: span 7; }
.span-4 { grid-column: span 4; }
.span-3 { grid-column: span 3; }
.span-5 { grid-column: span 5; }
.span-10 { grid-column: span 10; }

.stat-card {
  padding: var(--spacing-lg);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 240px;
  text-decoration: none;
}

.glow-primary {
  background: radial-gradient(circle at top right, var(--primary-subtle), var(--bg-surface-1) 70%);
}

.glow-accent {
  background: radial-gradient(circle at top right, var(--accent-subtle), var(--bg-surface-1) 70%);
}

.glow-surface {
  background: var(--bg-surface-1);
}

.card-inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.stat-value {
  font-family: var(--font-heading);
  font-size: clamp(3.5rem, 5.5vw, 5.5rem);
  line-height: 0.9;
  color: var(--text-primary);
}

.stat-unit {
  font-size: 0.5em;
  color: var(--primary);
  vertical-align: super;
}

.arrow-wrapper {
  color: var(--text-secondary);
  padding: 0.4rem;
  border-radius: var(--radius-full);
  background-color: var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.stat-card:hover .arrow-wrapper {
  background-color: var(--primary);
  color: var(--text-on-primary);
  transform: translate(2px, -2px);
}

.stat-footer {
  margin-top: auto;
}

.stat-label {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  color: var(--text-primary);
  letter-spacing: -0.5px;
  margin: 0;
  /* A fonte arcade é larga: com fonte ampliada no celular, "Publicados" não cabe inteira */
  overflow-wrap: anywhere;
  hyphens: auto;
}

.hover-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--primary);
  margin-top: 0.5rem;
  display: block;
  opacity: 0;
  transform: translateY(6px);
  transition: all var(--transition-fast);
}

.stat-card:hover .hover-label {
  opacity: 1;
  transform: translateY(0);
}

.pixel-deco {
  position: absolute;
  bottom: -20px;
  right: -20px;
  width: 120px;
  height: 120px;
  background-image: radial-gradient(circle, var(--border-medium) 1.5px, transparent 2px);
  background-size: 12px 12px;
  opacity: 0.4;
  pointer-events: none;
}

@media (max-width: 900px) {
  .leads-container {
    padding: var(--spacing-2xl) var(--spacing-md);
  }

  .grid-wrapper {
    display: flex;
    flex-direction: column;
  }

  .stat-card {
    min-height: 180px;
    width: 100%;
  }

  .stat-value {
    font-size: 3.5rem;
  }
}
</style>
