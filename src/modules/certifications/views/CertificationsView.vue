<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useContent } from '@/core/content/useContent'
import { useListingFilters, yearsOf } from '@/shared/composables/useListingFilters'
import { useRefFilter } from '@/shared/composables/useRefFilter'
import { useListingView } from '@/shared/composables/useListingView'
import ListingToolbar from '@/shared/components/ui/ListingToolbar.vue'
import ListingEmpty from '@/shared/components/ui/ListingEmpty.vue'
import UntranslatedNote from '@/shared/components/ui/UntranslatedNote.vue'
import { CheckCircle2, ExternalLink, Calendar } from 'lucide-vue-next'

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

const { view } = useListingView()

const refFilter = useRefFilter()

const { searchQuery, selected, options, filtered, hasActiveFilters, clearFilters, resultsCount, totalCount } =
  useListingFilters(rawCertifications, {
    search: (c) => [c.name, c.issuer, ...c.skills],
    filters: {
      skill: { values: (c) => c.skills },
      issuer: { values: (c) => [c.issuer] },
      year: { values: (c) => yearsOf(c.date), order: 'desc' }
    },
    predicates: [refFilter.matches]
  })

const toolbarFilters = computed(() => [
  { key: 'skill', label: t('certifications_page.filter_skill'), allLabel: t('certifications_page.all_skills'), options: options.value.skill },
  { key: 'issuer', label: t('certifications_page.filter_issuer'), allLabel: t('certifications_page.all_issuers'), options: options.value.issuer },
  { key: 'year', label: t('certifications_page.filter_year'), allLabel: t('certifications_page.all_years'), options: options.value.year }
])
</script>

<template>
  <main class="certifications-page">
    <div class="page-container">

      <header class="page-header">
        <h1 class="page-title">{{ t('certifications_page.title') }}</h1>
        <p class="page-subtitle">{{ t('certifications_page.subtitle') }}</p>

        <ListingToolbar
          v-model:search="searchQuery"
          :search-placeholder="t('certifications_page.search_placeholder')"
          :filters="toolbarFilters"
          :selected="selected"
          :count-text="t('certifications_page.showing_count', { count: resultsCount, total: totalCount })"
          :clear-label="t('certifications_page.clear_filters')"
          :has-active-filters="hasActiveFilters"
          :ref-label="refFilter.refLabel.value"
          @select="(key, value) => (selected[key] = value)"
          @clear="clearFilters"
          @clear-ref="refFilter.clear"
        />
      </header>

      <div v-if="filtered.length" class="certifications-results" :class="`view-${view}`">
        <article
          v-for="cert in filtered"
          :key="cert.id"
          :id="cert.id"
          class="cert-card surface-card interactive"
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

      <ListingEmpty
        v-else
        :text="t('certifications_page.no_certifications_found')"
        :clear-label="t('certifications_page.clear_filters')"
        :can-clear="hasActiveFilters"
        @clear="clearFilters"
      />
    </div>
  </main>
</template>

<style scoped>
.certifications-page {
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

.certifications-results.view-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: var(--spacing-md);
}

.certifications-results.view-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
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

/* Lista: uma linha por certificação — nome e emissor | habilidades | credencial */
.view-list .cert-card {
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
}

.view-list .cert-content {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1.5fr) auto;
  column-gap: var(--spacing-lg);
  align-items: center;
}

.view-list .cert-meta {
  justify-content: flex-start;
  gap: var(--spacing-sm);
}

.view-list .cert-meta,
.view-list .cert-name,
.view-list .cert-content > .untranslated-note {
  grid-column: 1;
}

.view-list .skills-container {
  grid-column: 2;
  grid-row: 1 / span 3;
  margin: 0;
}

.view-list .credential-link {
  grid-column: 3;
  grid-row: 1 / span 3;
  margin: 0;
}

@media (max-width: 900px) {
  .view-list .cert-content {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .view-list .skills-container {
    display: none;
  }

  .view-list .credential-link {
    grid-column: 2;
  }
}

@media (max-width: 768px) {
  .certifications-page {
    padding: 5rem var(--spacing-md) var(--spacing-xl) var(--spacing-md);
  }

  .certifications-results.view-grid {
    grid-template-columns: 1fr;
  }
}
</style>
