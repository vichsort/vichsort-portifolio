<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useContent } from '@/core/content/useContent'
import { useCertificationsFilter } from '../composables/useCertificationsFilter'
import BaseSearchInput from '@/shared/components/ui/BaseSearchInput.vue'
import BaseSelect from '@/shared/components/ui/BaseSelect.vue'
import UntranslatedNote from '@/shared/components/ui/UntranslatedNote.vue'
import { ArrowLeft, CheckCircle2, ExternalLink, Calendar, RotateCcw, Sparkles } from 'lucide-vue-next'

const { t } = useI18n()
const { ofType, text, fallback, label, linked } = useContent()

const rawCertifications = computed(() =>
  ofType('certification', { recent: true }).map((node) => ({
    id: node.id,
    name: text(node.id).name,
    fallback: fallback(node.id),
    issuer: node.data.issuer,
    date: String(node.data.date),
    credential_url: node.data.credential_url || '',
    skills: [...linked(node.id, 'techs'), ...linked(node.id, 'topics')].map(label)
  }))
)

const {
  searchQuery,
  selectedIssuer,
  selectedSkill,
  selectedYear,
  availableIssuers,
  availableSkills,
  availableYears,
  hasActiveFilters,
  filteredCertifications,
  resultsCount,
  totalCount,
  clearFilters
} = useCertificationsFilter(rawCertifications)
</script>

<template>
  <main class="certifications-page">
    <div class="page-container">
      <router-link to="/" class="back-link">
        <ArrowLeft :size="18" />
        <span>{{ t('common.back_to_home') }}</span>
      </router-link>

      <header class="page-header">
        <h1 class="page-title">{{ t('certifications_page.title') }}</h1>
        <p class="page-subtitle">{{ t('certifications_page.subtitle') }}</p>

        <!-- Advanced Multi-Filter Toolbar -->
        <div class="filters-toolbar">
          <div class="search-box">
            <BaseSearchInput
              v-model="searchQuery"
              :placeholder="t('certifications_page.search_placeholder')"
            />
          </div>

          <div class="dropdowns-group">
            <BaseSelect
              v-model="selectedSkill"
              :options="availableSkills"
              :all-label="t('certifications_page.all_skills')"
              :placeholder="t('certifications_page.filter_skill')"
              :label="t('certifications_page.filter_skill')"
            />

            <BaseSelect
              v-model="selectedIssuer"
              :options="availableIssuers"
              :all-label="t('certifications_page.all_issuers')"
              :placeholder="t('certifications_page.filter_issuer')"
              :label="t('certifications_page.filter_issuer')"
            />

            <BaseSelect
              v-model="selectedYear"
              :options="availableYears"
              :all-label="t('certifications_page.all_years')"
              :placeholder="t('certifications_page.filter_year')"
              :label="t('certifications_page.filter_year')"
            />

            <button
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="clear-filters-btn"
              type="button"
              :aria-label="t('certifications_page.clear_filters')"
            >
              <RotateCcw :size="14" />
              <span>{{ t('certifications_page.clear_filters') }}</span>
            </button>
          </div>
        </div>

        <!-- Results Meta Counter -->
        <div class="results-meta">
          <span class="count-badge">
            <Sparkles :size="13" class="sparkle-icon" />
            {{ t('certifications_page.showing_count', { count: resultsCount, total: totalCount }) }}
          </span>
        </div>
      </header>

      <!-- Certifications Grid -->
      <div v-if="filteredCertifications.length > 0" class="certifications-grid">
        <article
          v-for="cert in filteredCertifications"
          :key="cert.id"
          class="cert-card surface-card"
        >
          <div class="cert-icon-wrapper">
            <CheckCircle2 :size="24" class="cert-icon" />
          </div>

          <div class="cert-content">
            <div class="cert-meta">
              <span class="issuer">{{ cert.issuer }}</span>
              <span class="date">
                <Calendar :size="12" />
                {{ cert.date }}
              </span>
            </div>

            <h2 class="cert-name">{{ cert.name }}</h2>
            <UntranslatedNote :lang="cert.fallback" />

            <!-- Skills Badges -->
            <div v-if="cert.skills && cert.skills.length > 0" class="skills-container">
              <span
                v-for="skill in cert.skills"
                :key="skill"
                class="badge"
              >
                {{ skill }}
              </span>
            </div>

            <a
              v-if="cert.credential_url && cert.credential_url.trim().length > 0"
              :href="cert.credential_url"
              target="_blank"
              rel="noopener noreferrer"
              class="credential-link"
            >
              <span>{{ t('certifications_page.view_credential') }}</span>
              <ExternalLink :size="14" />
            </a>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state surface-card">
        <p class="empty-text">{{ t('certifications_page.no_certifications_found') }}</p>
        <button
          v-if="hasActiveFilters"
          @click="clearFilters"
          class="clear-filters-btn empty-action"
          type="button"
        >
          <RotateCcw :size="14" />
          <span>{{ t('certifications_page.clear_filters') }}</span>
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.certifications-page {
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

/* Certifications Grid */
.certifications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: var(--spacing-md);
}

.cert-card {
  padding: var(--spacing-lg);
  display: flex;
  gap: var(--spacing-md);
  align-items: flex-start;
  border-radius: var(--radius-lg);
  transition: transform var(--transition-fast), border-color var(--transition-fast);
}

.cert-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary-border);
}

.cert-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background-color: var(--primary-subtle);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cert-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.cert-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-xs);
  gap: 0.5rem;
}

.issuer {
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.date {
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

.cert-name {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--text-base);
  color: var(--text-primary);
  line-height: 1.35;
}

.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.35rem;
  margin-bottom: 0.2rem;
}

.credential-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-muted);
  margin-top: 0.5rem;
  transition: color var(--transition-fast);
}

.credential-link:hover {
  color: var(--primary);
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
  .certifications-page {
    padding: 5rem var(--spacing-md) var(--spacing-xl) var(--spacing-md);
  }

  .certifications-grid {
    grid-template-columns: 1fr;
  }
}
</style>
