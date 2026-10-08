<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { allProjects } from '@/core/content/projects'
import { useListingFilters, yearsOf } from '@/shared/composables/useListingFilters'
import { useRefFilter } from '@/shared/composables/useRefFilter'
import { useListingView } from '@/shared/composables/useListingView'
import ListingToolbar from '@/shared/components/ui/ListingToolbar.vue'
import ListingEmpty from '@/shared/components/ui/ListingEmpty.vue'
import ProjectCard from '../components/ProjectCard.vue'

const { t, locale } = useI18n()
const { view } = useListingView()

const projects = computed(() => allProjects(locale.value))

const refFilter = useRefFilter()

const { searchQuery, selected, options, filtered, hasActiveFilters, clearFilters, resultsCount, totalCount } =
  useListingFilters(projects, {
    search: (p) => [p.title, p.summary, p.category, ...p.techs],
    filters: {
      category: { values: (p) => [p.category] },
      tech: { values: (p) => p.techs },
      year: { values: (p) => yearsOf(p.date), order: 'desc' }
    },
    predicates: [refFilter.matches]
  })

const toolbarFilters = computed(() => [
  { key: 'category', label: t('projects_page.filter_category'), allLabel: t('projects_page.all_categories'), options: options.value.category },
  { key: 'tech', label: t('projects_page.filter_tech'), allLabel: t('projects_page.all_techs'), options: options.value.tech },
  { key: 'year', label: t('projects_page.filter_year'), allLabel: t('projects_page.all_years'), options: options.value.year }
])
</script>

<template>
  <main class="projects-page">
    <header class="page-header">

      <h1 class="page-title">{{ t('projects_page.title') }}</h1>
      <p class="page-subtitle">{{ t('projects_page.subtitle') }}</p>

      <ListingToolbar
        v-model:search="searchQuery"
        :search-placeholder="t('projects_page.search_placeholder')"
        :filters="toolbarFilters"
        :selected="selected"
        :count-text="t('projects_page.showing_count', { count: resultsCount, total: totalCount })"
        :clear-label="t('projects_page.clear_filters')"
        :has-active-filters="hasActiveFilters"
        :ref-label="refFilter.refLabel.value"
        @select="(key, value) => (selected[key] = value)"
        @clear="clearFilters"
        @clear-ref="refFilter.clear"
      />
    </header>

    <div v-if="filtered.length" class="projects-results" :class="`view-${view}`">
      <ProjectCard
        v-for="project in filtered"
        :key="project.id"
        :project="project"
        :variant="view"
      />
    </div>

    <ListingEmpty
      v-else
      :text="t('projects_page.no_projects_found')"
      :clear-label="t('projects_page.clear_filters')"
      :can-clear="hasActiveFilters"
      @clear="clearFilters"
    />
  </main>
</template>

<style scoped>
.projects-page {
  min-height: 100vh;
  padding: 6rem var(--spacing-xl) var(--spacing-2xl) var(--spacing-xl);
  max-width: calc(var(--page-width) + 2 * var(--spacing-xl));
  margin: 0 auto;
}

.page-header {
  margin-bottom: var(--spacing-xl);
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

.projects-results.view-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: var(--spacing-xl);
}

.projects-results.view-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

@media (max-width: 768px) {
  .projects-page {
    padding: 5rem var(--spacing-md) var(--spacing-xl) var(--spacing-md);
  }

  .projects-results.view-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
}
</style>
