<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import TimelineItemCard from './TimelineItemCard.vue'
import {
  ArrowUpDown,
  ListFilter,
  Briefcase,
  FolderGit2,
  BookOpen,
  GraduationCap
} from 'lucide-vue-next'

const props = defineProps({
  events: {
    type: Array,
    required: true
  },
  sortOrder: {
    type: String,
    default: 'asc'
  },
  selectedCategory: {
    type: String,
    default: 'ALL'
  },
  availableCategories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['toggleSort', 'selectCategory'])

const { t } = useI18n()

const categoryTabs = [
  { id: 'ALL', labelKey: 'about_page.s5_timeline.all_events', icon: ListFilter },
  { id: 'work', labelKey: 'about_page.s5_timeline.category_work', icon: Briefcase },
  { id: 'project', labelKey: 'about_page.s5_timeline.category_project', icon: FolderGit2 },
  { id: 'research', labelKey: 'about_page.s5_timeline.category_research', icon: BookOpen },
  { id: 'education', labelKey: 'about_page.s5_timeline.category_education', icon: GraduationCap }
]

const sortLabel = computed(() => {
  return props.sortOrder === 'asc'
    ? t('about_page.s5_timeline.sort_oldest')
    : t('about_page.s5_timeline.sort_newest')
})
</script>

<template>
  <section class="timeline-full-section">
    <header class="section-header">
      <div class="header-titles">
        <h2 class="section-title">{{ t('about_page.s5_timeline.title') }}</h2>
        <p class="section-subtitle">{{ t('about_page.s5_timeline.subtitle') }}</p>
      </div>

      <!-- Toolbar com Filtros de Categoria e Alternância de Ordenação -->
      <div class="controls-toolbar">
        <div class="category-filters">
          <button
            v-for="tab in categoryTabs"
            :key="tab.id"
            type="button"
            class="filter-pill"
            :class="{ 'is-active': selectedCategory === tab.id }"
            @click="emit('selectCategory', tab.id)"
          >
            <component :is="tab.icon" :size="13" />
            <span>{{ t(tab.labelKey) }}</span>
          </button>
        </div>

        <button
          type="button"
          class="sort-btn"
          @click="emit('toggleSort')"
          :title="sortLabel"
        >
          <ArrowUpDown :size="14" />
          <span>{{ sortLabel }}</span>
        </button>
      </div>
    </header>

    <!-- Grid Consolidado de Eventos -->
    <div v-if="events.length > 0" class="events-grid">
      <TimelineItemCard
        v-for="event in events"
        :key="event.id"
        :event="event"
      />
    </div>

    <!-- Empty State se nenhum evento corresponder ao filtro -->
    <div v-else class="empty-state surface-card">
      <p>{{ t('researches_page.no_researches_found') }}</p>
      <button
        type="button"
        class="filter-pill is-active"
        @click="emit('selectCategory', 'ALL')"
      >
        <span>{{ t('about_page.s5_timeline.all_events') }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.timeline-full-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  margin-top: var(--spacing-2xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--border-subtle);
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.header-titles {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.section-title {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.section-subtitle {
  font-size: var(--text-base);
  color: var(--text-secondary);
}

.controls-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  border-radius: var(--radius-full);
  background-color: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-size: var(--text-xs);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-pill:hover {
  color: var(--text-primary);
  border-color: var(--primary-border);
}

.filter-pill.is-active {
  color: var(--text-on-primary);
  background-color: var(--primary);
  border-color: var(--primary);
  box-shadow: 0 0 10px var(--primary-subtle);
}

.sort-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  background-color: var(--bg-surface-1);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-size: var(--text-xs);
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-left: auto;
}

.sort-btn:hover {
  color: var(--primary);
  border-color: var(--primary);
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: var(--spacing-lg);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--text-muted);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

@media (max-width: 900px) {
  .controls-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .sort-btn {
    margin-left: 0;
  }

  .events-grid {
    grid-template-columns: 1fr;
  }
}
</style>
