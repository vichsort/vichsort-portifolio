<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useContent } from '@/core/content/useContent'
import { useTimeline } from '../composables/useTimeline'
import { useSettings } from '@/shared/composables/useSettings'

import ProfileSummarySection from '../components/ProfileSummarySection.vue'
import CoreStackSection from '../components/CoreStackSection.vue'
import DescriptionSection from '../components/DescriptionSection.vue'
import TimelineScrollSection from '../components/TimelineScrollSection.vue'
import TimelineFullSection from '../components/TimelineFullSection.vue'
import GallerySection from '../components/GallerySection.vue'

import { ArrowLeft, FolderGit2, Mail, ArrowUpRight } from 'lucide-vue-next'

const { t } = useI18n()
const { reduceMotion } = useSettings()
const { ofType, node, text, label, linked } = useContent()

// Rota de cada tipo que um evento pode citar em `link`
const LINK_ROUTES = {
  project: (id) => `/projects/${id}`,
  research: () => '/researches',
  certification: () => '/certifications'
}

const rawEvents = computed(() =>
  ofType('timeline').map((event) => {
    const target = event.links.link ? node(event.links.link) : null
    const route = target && LINK_ROUTES[target.type]
    return {
      id: event.id,
      year: String(event.data.date).slice(0, 4),
      date: String(event.data.date),
      type: event.data.kind,
      ...text(event.id),
      link_type: route ? target.type : '',
      link_url: route ? route(target.id) : '',
      tags: [...linked(event.id, 'techs'), ...linked(event.id, 'topics')].map(label)
    }
  })
)

const {
  sortOrder,
  selectedCategory,
  eventsByYear,
  consolidatedEvents,
  toggleSortOrder,
  setCategory
} = useTimeline(rawEvents)
</script>

<template>
  <main class="overview-page">
    <div class="page-container">
      <!-- Botão Voltar -->
      <router-link to="/" class="back-link">
        <ArrowLeft :size="18" />
        <span>{{ t('common.back_to_home') }}</span>
      </router-link>

      <!-- Cabeçalho Principal -->
      <header class="page-header">
        <h1 class="page-title">{{ t('about_page.title') }}</h1>
        <p class="page-subtitle">{{ t('about_page.subtitle') }}</p>
      </header>

      <!-- s1: Perfil & Informações Básicas -->
      <ProfileSummarySection />

      <!-- s2: Core Stack & Ecossistema -->
      <CoreStackSection />

      <!-- s3: Janela macOS + README GitHub -->
      <DescriptionSection />

      <!-- s4: Timeline Interativa com Scroll Lock (Ocultada se movimento reduzido ativo) -->
      <TimelineScrollSection
        v-if="!reduceMotion && eventsByYear.length > 0"
        :events-by-year="eventsByYear"
      />

      <!-- s5: Timeline Completa Consolidada -->
      <TimelineFullSection
        :events="consolidatedEvents"
        :sort-order="sortOrder"
        :selected-category="selectedCategory"
        @toggle-sort="toggleSortOrder"
        @select-category="setCategory"
      />

      <!-- s6: Galeria Bento Grid (Registros & Em Campo) -->
      <GallerySection />

      <!-- Bloco Final de CTA -->
      <section class="cta-section surface-card">
        <div class="cta-content">
          <h2 class="cta-title">{{ t('about_page.cta.title') }}</h2>
          <p class="cta-subtitle">{{ t('about_page.cta.subtitle') }}</p>
        </div>

        <div class="cta-actions">
          <router-link to="/projects" class="btn-primary">
            <FolderGit2 :size="16" />
            <span>{{ t('about_page.cta.projects_btn') }}</span>
            <ArrowUpRight :size="14" />
          </router-link>

          <router-link to="/contact" class="btn-secondary">
            <Mail :size="16" />
            <span>{{ t('about_page.cta.contact_btn') }}</span>
          </router-link>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.overview-page {
  min-height: 100vh;
  padding: 6rem var(--spacing-xl) var(--spacing-2xl) var(--spacing-xl);
}

.page-container {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--text-sm);
  color: var(--text-muted);
  transition: color var(--transition-fast);
  width: fit-content;
}

.back-link:hover {
  color: var(--primary);
}

.page-header {
  margin-bottom: var(--spacing-md);
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
}

/* CTA Section */
.cta-section {
  padding: var(--spacing-2xl);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--spacing-xl);
  margin-top: var(--spacing-2xl);
  background: radial-gradient(circle at bottom left, var(--primary-subtle), var(--bg-surface-1) 70%);
  border: 1px solid var(--border-subtle);
}

.cta-content {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  max-width: 550px;
}

.cta-title {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.cta-subtitle {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-full);
  background-color: var(--primary);
  color: #ffffff;
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-decoration: none;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-glow);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-full);
  background-color: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.btn-secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .overview-page {
    padding: 5rem var(--spacing-md) var(--spacing-xl) var(--spacing-md);
  }

  .cta-section {
    padding: var(--spacing-lg);
    flex-direction: column;
    align-items: flex-start;
  }

  .cta-actions {
    width: 100%;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>
