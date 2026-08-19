<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScrollProgress } from '@/shared/composables/useScrollProgress'
import TimelineItemCard from './TimelineItemCard.vue'
import { Sparkles, Calendar, ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  eventsByYear: {
    type: Array,
    required: true
  }
})

const { t } = useI18n()

const containerRef = ref(null)
const { progress } = useScrollProgress(containerRef)

const totalSteps = computed(() => props.eventsByYear.length || 1)

const activeIndex = computed(() => {
  if (totalSteps.value <= 1) return 0
  const index = Math.floor(progress.value * totalSteps.value)
  return Math.min(Math.max(0, index), totalSteps.value - 1)
})

const activeYearGroup = computed(() => {
  return props.eventsByYear[activeIndex.value] || { year: '', events: [] }
})

const barHeight = computed(() => {
  return Math.max(8, Math.min(progress.value * 100, 100)) + '%'
})
</script>

<template>
  <section ref="containerRef" class="timeline-scroll-container">
    <div class="sticky-viewport">
      <div class="scroll-content-grid">
        <!-- Coluna Esquerda: Indicador de Ano e Progresso Temporal -->
        <div class="timeline-nav-left">
          <div class="nav-header">
            <span class="timeline-tag">
              <Sparkles :size="13" />
              <span>{{ t('about_page.s4_timeline.title') }}</span>
            </span>
            <h2 class="timeline-main-title">{{ activeYearGroup.year }}</h2>
            <p class="scroll-hint">
              <span>{{ t('about_page.s4_timeline.interactive_hint') }}</span>
              <ChevronDown :size="15" class="hint-icon" />
            </p>
          </div>

          <!-- Barra de Progresso Vertical com Anos Marcados -->
          <div class="progress-track-wrapper">
            <div class="progress-track" aria-hidden="true">
              <div class="progress-fill" :style="{ height: barHeight }"></div>
            </div>

            <div class="years-list">
              <div
                v-for="(group, idx) in eventsByYear"
                :key="group.year"
                class="year-step-node"
                :class="{ 'is-active': idx === activeIndex, 'is-passed': idx < activeIndex }"
              >
                <span class="node-dot"></span>
                <span class="node-year">{{ group.year }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Coluna Direita: Cards do Ano Ativo -->
        <div class="timeline-cards-right">
          <transition name="timeline-step" mode="out-in">
            <div :key="activeYearGroup.year" class="year-events-panel">
              <div class="year-watermark" aria-hidden="true">
                {{ activeYearGroup.year }}
              </div>

              <div class="cards-stack">
                <TimelineItemCard
                  v-for="event in activeYearGroup.events"
                  :key="event.id"
                  :event="event"
                />
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.timeline-scroll-container {
  height: 320vh;
  position: relative;
  margin: var(--spacing-2xl) 0;
}

.sticky-viewport {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  background-color: var(--bg-canvas);
  padding: 0 var(--spacing-xl);
}

.scroll-content-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: var(--spacing-2xl);
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  align-items: center;
}

/* Coluna Esquerda */
.timeline-nav-left {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.nav-header {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.timeline-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-heading);
  font-size: var(--text-xs);
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.timeline-main-title {
  font-family: var(--font-heading);
  font-size: clamp(3rem, 6vw, 5rem);
  line-height: 1;
  color: var(--text-primary);
  letter-spacing: -1px;
}

.scroll-hint {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.hint-icon {
  animation: bounce-hint 2s infinite ease-in-out;
  color: var(--primary);
}

@keyframes bounce-hint {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(3px); }
}

.progress-track-wrapper {
  display: flex;
  align-items: stretch;
  gap: var(--spacing-md);
  margin-top: var(--spacing-sm);
}

.progress-track {
  width: 4px;
  background-color: var(--border-subtle);
  border-radius: var(--radius-full);
  position: relative;
  min-height: 180px;
}

.progress-fill {
  width: 100%;
  background-color: var(--primary);
  border-radius: var(--radius-full);
  position: absolute;
  top: 0;
  left: 0;
  box-shadow: 0 0 10px var(--primary);
  transition: height 0.1s linear;
}

.years-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2px 0;
}

.year-step-node {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-heading);
  font-size: var(--text-xs);
  color: var(--text-muted);
  transition: color var(--transition-fast);
}

.node-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--border-medium);
  transition: all var(--transition-fast);
}

.year-step-node.is-active {
  color: var(--primary);
}

.year-step-node.is-active .node-dot {
  background-color: var(--primary);
  box-shadow: 0 0 8px var(--primary);
  transform: scale(1.3);
}

.year-step-node.is-passed {
  color: var(--text-secondary);
}

.year-step-node.is-passed .node-dot {
  background-color: var(--primary);
}

/* Coluna Direita */
.timeline-cards-right {
  position: relative;
  min-height: 400px;
  display: flex;
  align-items: center;
}

.year-events-panel {
  position: relative;
  width: 100%;
}

.year-watermark {
  position: absolute;
  top: -40px;
  right: -20px;
  font-family: var(--font-heading);
  font-size: 8rem;
  font-weight: 900;
  color: var(--text-primary);
  opacity: 0.03;
  pointer-events: none;
  line-height: 1;
  user-select: none;
}

.cards-stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  position: relative;
  z-index: 2;
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.cards-stack::-webkit-scrollbar {
  width: 4px;
}

.cards-stack::-webkit-scrollbar-thumb {
  background: var(--border-medium);
  border-radius: var(--radius-full);
}

/* Transições da Timeline */
.timeline-step-enter-active,
.timeline-step-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.timeline-step-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.timeline-step-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media (max-width: 900px) {
  .timeline-scroll-container {
    height: auto;
    margin: var(--spacing-xl) 0;
  }

  .sticky-viewport {
    position: static;
    height: auto;
    padding: 0;
  }

  .scroll-content-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .progress-track-wrapper {
    display: none;
  }

  .year-watermark {
    display: none;
  }

  .cards-stack {
    max-height: none;
  }
}
</style>
