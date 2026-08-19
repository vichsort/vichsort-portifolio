<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResearchesFilter } from '../composables/useResearchesFilter'
import ResearchCard from '../components/ResearchCard.vue'
import BaseSearchInput from '@/shared/components/ui/BaseSearchInput.vue'
import BaseSelect from '@/shared/components/ui/BaseSelect.vue'
import { ArrowLeft, RotateCcw, Sparkles } from 'lucide-vue-next'

const { t, tm, rt } = useI18n()
const rawResearches = computed(() => tm('researches_page.list') || [])

const {
  searchQuery,
  selectedCategory,
  selectedYear,
  selectedAward,
  selectedTag,
  availableCategories,
  availableYears,
  availableAwards,
  availableTags,
  hasActiveFilters,
  filteredResearches,
  resultsCount,
  totalCount,
  clearFilters
} = useResearchesFilter(rawResearches, rt)

const handleSelectTag = (tag) => {
  selectedTag.value = tag
}

const handleSelectCategory = (category) => {
  selectedCategory.value = category
}
</script>

<template>
  <main class="researches-page">
    <div class="page-container">
      <router-link to="/" class="back-link">
        <ArrowLeft :size="18" />
        <span>{{ t('common.back_to_home') }}</span>
      </router-link>

      <header class="page-header">
        <h1 class="page-title">{{ t('researches_page.title') }}</h1>
        <p class="page-subtitle">{{ t('researches_page.subtitle') }}</p>

        <!-- Multi-Filter Toolbar -->
        <div class="filters-toolbar">
          <div class="search-box">
            <BaseSearchInput
              v-model="searchQuery"
              :placeholder="t('researches_page.search_placeholder')"
            />
          </div>

          <div class="dropdowns-group">
            <BaseSelect
              v-model="selectedCategory"
              :options="availableCategories"
              :all-label="t('researches_page.all_categories')"
              :placeholder="t('researches_page.filter_category')"
              :label="t('researches_page.filter_category')"
            />

            <BaseSelect
              v-model="selectedYear"
              :options="availableYears"
              :all-label="t('researches_page.all_years')"
              :placeholder="t('researches_page.filter_year')"
              :label="t('researches_page.filter_year')"
            />

            <BaseSelect
              v-model="selectedAward"
              :options="availableAwards"
              :all-label="t('researches_page.all_awards')"
              :placeholder="t('researches_page.filter_award')"
              :label="t('researches_page.filter_award')"
            />

            <BaseSelect
              v-model="selectedTag"
              :options="availableTags"
              :all-label="t('researches_page.all_tags')"
              :placeholder="t('researches_page.filter_tag')"
              :label="t('researches_page.filter_tag')"
            />

            <button
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="clear-filters-btn"
              type="button"
              :aria-label="t('researches_page.clear_filters')"
            >
              <RotateCcw :size="14" />
              <span>{{ t('researches_page.clear_filters') }}</span>
            </button>
          </div>
        </div>

        <!-- Results Meta Counter -->
        <div class="results-meta">
          <span class="count-badge">
            <Sparkles :size="13" class="sparkle-icon" />
            {{ t('researches_page.showing_count', { count: resultsCount, total: totalCount }) }}
          </span>
        </div>
      </header>

      <!-- Researches List -->
      <div v-if="filteredResearches.length > 0" class="researches-list">
        <ResearchCard
          v-for="item in filteredResearches"
          :key="rt(item.id)"
          :research="item"
          @select-tag="handleSelectTag"
          @select-category="handleSelectCategory"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state surface-card">
        <p class="empty-text">{{ t('researches_page.no_researches_found') }}</p>
        <button
          v-if="hasActiveFilters"
          @click="clearFilters"
          class="clear-filters-btn empty-action"
          type="button"
        >
          <RotateCcw :size="14" />
          <span>{{ t('researches_page.clear_filters') }}</span>
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.researches-page {
  min-height: 100vh;
  padding: 6rem var(--spacing-xl) var(--spacing-2xl) var(--spacing-xl);
}

.page-container {
  max-width: 1000px;
  margin: 0 auto;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-bottom: var(--spacing-lg);
  transition: color var(--transition-fast);
}

.back-link:hover {
  color: var(--primary);
}

.page-header {
  margin-bottom: var(--spacing-2xl);
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
  max-width: 400px;
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

/* Researches List */
.researches-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
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
    min-width: 130px;
  }
}

@media (max-width: 768px) {
  .researches-page {
    padding: 5rem var(--spacing-md) var(--spacing-xl) var(--spacing-md);
  }
}
</style>
