<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useIntersectionObserver } from '@vueuse/core'
import { useSettings } from '@/shared/composables/useSettings'
import TimelineItemCard from './TimelineItemCard.vue'
import { ArrowUpDown, ListFilter, Briefcase, FolderGit2, BookOpen, GraduationCap } from 'lucide-vue-next'

/**
 * Linha do tempo do Sobre (n23), na linguagem da AboutSection da home: à esquerda,
 * presa na tela, o rótulo, o título pixel, o ano ativo com a trilha de progresso e
 * os filtros; à direita, os marcos rolando normalmente, agrupados por ano.
 * Sem scroll lock: funciona igual com movimento reduzido e no celular (uma coluna).
 */
const props = defineProps({
  eventsByYear: { type: Array, required: true },
  categories: { type: Array, default: () => [] },
  selectedCategory: { type: String, default: 'ALL' },
  sortOrder: { type: String, default: 'desc' }
})

const emit = defineEmits(['selectCategory', 'toggleSort'])

const { t } = useI18n()
const { isMotionAllowed } = useSettings()

const CATEGORY_TABS = {
  project: { labelKey: 'about_page.s5_timeline.category_project', icon: FolderGit2 },
  research: { labelKey: 'about_page.s5_timeline.category_research', icon: BookOpen },
  work: { labelKey: 'about_page.s5_timeline.category_work', icon: Briefcase },
  education: { labelKey: 'about_page.s5_timeline.category_education', icon: GraduationCap }
}

const tabs = computed(() => [
  { id: 'ALL', labelKey: 'about_page.s5_timeline.all_events', icon: ListFilter },
  ...props.categories.map((id) => ({ id, ...CATEGORY_TABS[id] }))
])

const sortLabel = computed(() =>
  t(props.sortOrder === 'asc' ? 'about_page.s5_timeline.sort_oldest' : 'about_page.s5_timeline.sort_newest')
)

// Ano ativo: o grupo que cruza a faixa do meio da tela
const groupEls = ref([])
const activeYear = ref(null)

useIntersectionObserver(
  groupEls,
  (entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting)
    if (visible.length) activeYear.value = visible[0].target.dataset.year
  },
  { rootMargin: '-45% 0px -50% 0px' }
)

// Filtro ou ordem novos: o primeiro ano da lista volta a ser o ativo
watch(
  () => props.eventsByYear.map((g) => g.year).join(),
  () => (activeYear.value = props.eventsByYear[0]?.year ?? null),
  { immediate: true }
)

const activeIndex = computed(() => Math.max(0, props.eventsByYear.findIndex((g) => g.year === activeYear.value)))
const progress = computed(() => {
  const steps = props.eventsByYear.length - 1
  return steps > 0 ? activeIndex.value / steps : 1
})

const goToYear = (year) => {
  const el = groupEls.value.find((g) => g?.dataset.year === year)
  el?.scrollIntoView({ block: 'start', behavior: isMotionAllowed.value ? 'smooth' : 'auto' })
}
</script>

<template>
  <section class="timeline-section">
    <aside class="timeline-aside">
      <div class="aside-inner">
        <div class="title-group">
          <span class="small-label">{{ t('about_page.s4_timeline.label') }}</span>
          <h2 class="section-title">
            {{ t('about_page.s4_timeline.title') }}<span class="highlight">.</span>
          </h2>
          <p class="section-subtitle">{{ t('about_page.s4_timeline.subtitle') }}</p>
        </div>

        <div class="year-track">
          <div class="progress-track" aria-hidden="true">
            <div class="progress-fill" :style="{ height: `${Math.max(6, progress * 100)}%` }"></div>
          </div>

          <ol class="years-list">
            <li v-for="group in eventsByYear" :key="group.year">
              <button
                type="button"
                class="year-step"
                :class="{ 'is-active': group.year === activeYear }"
                :aria-current="group.year === activeYear ? 'step' : undefined"
                @click="goToYear(group.year)"
              >
                <span class="step-year">{{ group.year }}</span>
                <span class="step-count">{{ group.events.length }}</span>
              </button>
            </li>
          </ol>
        </div>

        <div class="controls">
          <div class="category-filters">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              class="filter-pill"
              :class="{ 'is-active': selectedCategory === tab.id }"
              :aria-pressed="selectedCategory === tab.id"
              @click="emit('selectCategory', tab.id)"
            >
              <component :is="tab.icon" :size="13" aria-hidden="true" />
              <span>{{ t(tab.labelKey) }}</span>
            </button>
          </div>

          <button type="button" class="sort-btn" @click="emit('toggleSort')">
            <ArrowUpDown :size="14" aria-hidden="true" />
            <span>{{ sortLabel }}</span>
          </button>
        </div>
      </div>
    </aside>

    <div class="timeline-groups">
      <section
        v-for="group in eventsByYear"
        :key="group.year"
        ref="groupEls"
        :data-year="group.year"
        class="year-group"
        :aria-label="group.year"
      >
        <h3 class="group-year" :class="{ 'is-active': group.year === activeYear }">{{ group.year }}</h3>
        <div class="group-events">
          <TimelineItemCard v-for="event in group.events" :key="event.id" :id="event.id" :event="event" compact />
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.timeline-section {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.4fr);
  gap: var(--spacing-2xl);
  align-items: start;
  margin: var(--spacing-2xl) 0;
}

/* Coluna presa: fica abaixo da navbar enquanto os marcos rolam */
.timeline-aside {
  position: sticky;
  top: 6rem;
}

.aside-inner {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.small-label {
  display: block;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: var(--spacing-xs);
}

.section-title {
  font-family: var(--font-heading);
  /* mínimo em vw: "trajetória" precisa caber numa tela de 360px */
  font-size: clamp(min(2.25rem, 8vw), 3.5vw, 3rem);
  line-height: 1;
  text-transform: uppercase;
  color: var(--text-primary);
}

.highlight {
  color: var(--primary);
}

.section-subtitle {
  margin-top: var(--spacing-sm);
  font-size: var(--text-base);
  line-height: 1.7;
  color: var(--text-secondary);
  max-width: 34ch;
}

/* Trilha com os anos, como a barra de progresso da AboutSection */
.year-track {
  display: flex;
  gap: var(--spacing-lg);
}

.progress-track {
  position: relative;
  width: 4px;
  flex-shrink: 0;
  background-color: var(--border-subtle);
  border-radius: var(--radius-full);
}

.progress-fill {
  position: absolute;
  inset: 0 0 auto 0;
  background-color: var(--primary);
  border-radius: var(--radius-full);
  box-shadow: 0 0 10px var(--primary);
  transition: height var(--transition-base);
}

.years-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.year-step {
  display: inline-flex;
  align-items: baseline;
  gap: var(--spacing-sm);
  padding: 0.2rem 0;
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  color: var(--text-muted);
  transition: color var(--transition-fast);
}

.year-step:hover,
.year-step.is-active {
  color: var(--text-primary);
}

.year-step.is-active .step-year {
  color: var(--primary);
}

.step-count {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-muted);
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-sm);
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.filter-pill,
.sort-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.85rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-subtle);
  background-color: var(--bg-surface-1);
  color: var(--text-secondary);
  font-size: var(--text-xs);
  font-weight: 600;
  transition: color var(--transition-fast), border-color var(--transition-fast), background-color var(--transition-fast);
}

.filter-pill:hover,
.sort-btn:hover {
  border-color: var(--primary-border);
  color: var(--text-primary);
}

.filter-pill.is-active {
  background-color: var(--primary);
  border-color: var(--primary);
  color: var(--text-on-primary);
}

.sort-btn {
  border-style: dashed;
}

.timeline-groups {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

/* Âncora do scrollIntoView: o ano não fica por baixo da navbar */
.year-group {
  scroll-margin-top: 6rem;
}

.group-year {
  font-family: var(--font-heading);
  font-size: var(--text-4xl);
  line-height: 1;
  color: var(--text-muted);
  margin-bottom: var(--spacing-md);
  transition: color var(--transition-base);
}

.group-year.is-active {
  color: var(--text-primary);
}

.group-events {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
  gap: var(--spacing-md);
}

@media (max-width: 960px) {
  .timeline-section {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--spacing-xl);
  }

  /* Uma coluna: a trilha de anos sai (os anos já aparecem nos grupos) e nada fica preso */
  .timeline-aside {
    position: static;
  }

  .year-track {
    display: none;
  }
}
</style>
