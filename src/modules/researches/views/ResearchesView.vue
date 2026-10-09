<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useContent } from '@/core/content/useContent'
import { useListingFilters, yearsOf } from '@/shared/composables/useListingFilters'
import { useRefFilter } from '@/shared/composables/useRefFilter'
import { useListingView, listingItemStyle } from '@/shared/composables/useListingView'
import ListingToolbar from '@/shared/components/ui/ListingToolbar.vue'
import ListingEmpty from '@/shared/components/ui/ListingEmpty.vue'
import ResearchCard from '../components/ResearchCard.vue'

const { t } = useI18n()
const { ofType, text, fallback, label, linked } = useContent()

const rawResearches = computed(() =>
  ofType('research', { recent: true }).map((node) => {
    const topics = linked(node.id, 'topics')
    return {
      id: node.id,
      ...text(node.id),
      fallback: fallback(node.id),
      // O primeiro tópico faz o papel da antiga categoria da pesquisa
      category: topics.length ? label(topics[0]) : '',
      authors: node.data.authors || '',
      year: String(node.data.date),
      paper_url: node.data.paper_url || '',
      tags: [...linked(node.id, 'techs'), ...topics].map(label)
    }
  })
)

const { view } = useListingView()

const refFilter = useRefFilter()

const { searchQuery, selected, options, filtered, hasActiveFilters, clearFilters, resultsCount, totalCount } =
  useListingFilters(rawResearches, {
    search: (r) => [r.title, r.description, r.category, r.award, r.institution, r.authors, ...r.tags],
    filters: {
      category: { values: (r) => [r.category] },
      award: { values: (r) => [r.award] },
      year: { values: (r) => yearsOf(r.year), order: 'desc' }
    },
    predicates: [refFilter.matches]
  })

const toolbarFilters = computed(() => [
  { key: 'category', label: t('researches_page.filter_category'), allLabel: t('researches_page.all_categories'), options: options.value.category },
  { key: 'award', label: t('researches_page.filter_award'), allLabel: t('researches_page.all_awards'), options: options.value.award },
  { key: 'year', label: t('researches_page.filter_year'), allLabel: t('researches_page.all_years'), options: options.value.year }
])
</script>

<template>
  <main class="researches-page">
    <div class="page-container">

      <header class="page-header">
        <h1 class="page-title">{{ t('researches_page.title') }}</h1>
        <p class="page-subtitle">{{ t('researches_page.subtitle') }}</p>

        <ListingToolbar
          v-model:search="searchQuery"
          :search-placeholder="t('researches_page.search_placeholder')"
          :filters="toolbarFilters"
          :selected="selected"
          :count-text="t('researches_page.showing_count', { count: resultsCount, total: totalCount })"
          :clear-label="t('researches_page.clear_filters')"
          :has-active-filters="hasActiveFilters"
          :ref-label="refFilter.refLabel.value"
          @select="(key, value) => (selected[key] = value)"
          @clear="clearFilters"
          @clear-ref="refFilter.clear"
        />
      </header>

      <!-- Grade: duas colunas com o resumo encurtado; lista: uma por linha, completa -->
      <div v-if="filtered.length" class="researches-results" :class="`view-${view}`">
        <ResearchCard
          v-for="item in filtered"
          :key="item.id"
          :id="item.id"
          :research="item"
          class="listing-item"
          :style="listingItemStyle(item.id)"
          :compact="view === 'grid'"
          @select-tag="(tag) => (searchQuery = tag)"
          @select-category="(category) => (selected.category = category)"
        />
      </div>

      <ListingEmpty
        v-else
        :text="t('researches_page.no_researches_found')"
        :clear-label="t('researches_page.clear_filters')"
        :can-clear="hasActiveFilters"
        @clear="clearFilters"
      />
    </div>
  </main>
</template>

<style scoped>
.researches-page {
  min-height: 100vh;
  padding: 6rem var(--spacing-xl) var(--spacing-2xl) var(--spacing-xl);
}

.page-container {
  max-width: var(--page-width);
  margin: 0 auto;
}


.page-header {
  margin-bottom: var(--spacing-2xl);
}

.page-title {
  font-family: var(--font-heading);
  font-size: var(--text-page-title);
  line-height: 1;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.page-subtitle {
  font-size: var(--text-base);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
}

.researches-results.view-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.researches-results.view-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-lg);
  align-items: start;
}

@media (max-width: 768px) {
  .researches-results.view-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 768px) {
  .researches-page {
    padding: 5rem var(--spacing-md) var(--spacing-xl) var(--spacing-md);
  }
}
</style>
