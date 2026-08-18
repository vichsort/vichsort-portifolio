<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProjects } from '../composables/useProjects'
import { useProjectsFilter } from '../composables/useProjectsFilter'
import ProjectCard from '../components/ProjectCard.vue'
import BaseSearchInput from '@/shared/components/ui/BaseSearchInput.vue'
import BaseSelect from '@/shared/components/ui/BaseSelect.vue'
import { ArrowLeft, RotateCcw, Sparkles } from 'lucide-vue-next'

const { t, locale } = useI18n()
const { loadAllProjects, isLoading } = useProjects()

const rawProjects = ref([])

const fetchProjects = async () => {
  rawProjects.value = await loadAllProjects(locale.value)
}

onMounted(() => {
  fetchProjects()
})

watch(locale, () => {
  fetchProjects()
})

const {
  searchQuery,
  selectedCategory,
  selectedTech,
  selectedYear,
  availableCategories,
  availableTechs,
  availableYears,
  hasActiveFilters,
  filteredProjects,
  resultsCount,
  totalCount,
  clearFilters
} = useProjectsFilter(rawProjects)
</script>

<template>
  <main class="projects-page">
    <div class="page-header">
      <router-link to="/" class="back-link">
        <ArrowLeft :size="18" />
        <span>{{ t('common.back_to_home') }}</span>
      </router-link>

      <h1 class="page-title">{{ t('projects_page.title') }}</h1>
      <p class="page-subtitle">{{ t('projects_page.subtitle') }}</p>

      <!-- Advanced Multi-Filter Toolbar -->
      <div class="filters-toolbar">
        <div class="search-box">
          <BaseSearchInput
            v-model="searchQuery"
            :placeholder="t('projects_page.search_placeholder')"
          />
        </div>

        <div class="dropdowns-group">
          <BaseSelect
            v-model="selectedCategory"
            :options="availableCategories"
            :all-label="t('projects_page.all_categories')"
            :placeholder="t('projects_page.filter_category')"
            :label="t('projects_page.filter_category')"
          />

          <BaseSelect
            v-model="selectedTech"
            :options="availableTechs"
            :all-label="t('projects_page.all_techs')"
            :placeholder="t('projects_page.filter_tech')"
            :label="t('projects_page.filter_tech')"
          />

          <BaseSelect
            v-model="selectedYear"
            :options="availableYears"
            :all-label="t('projects_page.all_years')"
            :placeholder="t('projects_page.filter_year')"
            :label="t('projects_page.filter_year')"
          />

          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="clear-filters-btn"
            type="button"
            :aria-label="t('projects_page.clear_filters')"
          >
            <RotateCcw :size="14" />
            <span>{{ t('projects_page.clear_filters') }}</span>
          </button>
        </div>
      </div>

      <!-- Results Meta Counter -->
      <div class="results-meta">
        <span class="count-badge">
          <Sparkles :size="13" class="sparkle-icon" />
          {{ t('projects_page.showing_count', { count: resultsCount, total: totalCount }) }}
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state surface-card">
      <p>{{ t('common.loading') }}</p>
    </div>

    <!-- Projects Grid -->
    <div v-else-if="filteredProjects.length > 0" class="projects-grid">
      <ProjectCard
        v-for="(project, index) in filteredProjects"
        :key="project.id || index"
        :project="project"
        variant="grid"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state surface-card">
      <p class="empty-text">{{ t('projects_page.no_projects_found') }}</p>
      <button
        v-if="hasActiveFilters"
        @click="clearFilters"
        class="clear-filters-btn empty-action"
        type="button"
      >
        <RotateCcw :size="14" />
        <span>{{ t('projects_page.clear_filters') }}</span>
      </button>
    </div>
  </main>
</template>

<style scoped>
.projects-page {
  min-height: 100vh;
  padding: 6rem var(--spacing-xl) var(--spacing-2xl) var(--spacing-xl);
  max-width: 1300px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: var(--spacing-xl);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-bottom: var(--spacing-md);
  transition: color var(--transition-fast);
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
  max-width: 650px;
  margin-bottom: var(--spacing-xl);
}

/* Filters Toolbar */
.filters-toolbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.search-box {
  flex: 1;
  min-width: 280px;
  max-width: 440px;
}

.dropdowns-group {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.clear-filters-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1rem;
  border-radius: var(--radius-full);
  background-color: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-size: var(--text-xs);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  height: 40px;
}

.clear-filters-btn:hover {
  color: #ffffff;
  background-color: var(--primary);
  border-color: var(--primary);
}

/* Results Meta */
.results-meta {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-top: var(--spacing-xs);
}

.count-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--text-muted);
}

.sparkle-icon {
  color: var(--primary);
}

/* Grid Layout */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: var(--spacing-xl);
  width: 100%;
}

/* Empty State */
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

.empty-text {
  font-size: var(--text-base);
  color: var(--text-secondary);
}

.empty-action {
  margin-top: var(--spacing-xs);
}

@media (max-width: 900px) {
  .filters-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: 100%;
  }

  .dropdowns-group {
    width: 100%;
  }

  .dropdowns-group > * {
    flex: 1;
    min-width: 140px;
  }
}

@media (max-width: 768px) {
  .projects-page {
    padding: 5rem var(--spacing-md) var(--spacing-xl) var(--spacing-md);
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
}
</style>
