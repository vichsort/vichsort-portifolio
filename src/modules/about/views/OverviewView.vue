<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useContent } from '@/core/content/useContent'
import { nodeRoute } from '@/core/content/routes'
import { useTimeline } from '../composables/useTimeline'
import { allPhotos } from '@/core/content/photos'

import ProfileSummarySection from '../components/ProfileSummarySection.vue'
import CoreStackSection from '../components/CoreStackSection.vue'
import GraphPreviewSection from '@/modules/graph/components/GraphPreviewSection.vue'
import DescriptionSection from '../components/DescriptionSection.vue'
import TimelineSection from '../components/TimelineSection.vue'
import GallerySection from '../components/GallerySection.vue'

import { FolderGit2, Mail, ArrowUpRight } from 'lucide-vue-next'

const { t } = useI18n()
const { ofType, node, text, fallback, label, linked } = useContent()

// date é 'AAAA', 'AAAA-MM' ou [início, fim]; o marco fica no início
const startDate = (date) => String([date].flat()[0] ?? '')

const event = (item, fields) => {
  const route = nodeRoute(item)
  return {
    id: item.id,
    date: startDate(item.data.date),
    year: startDate(item.data.date).slice(0, 4),
    fallback: fallback(item.id),
    link_type: route ? item.type : '',
    link_url: route || '',
    ...fields
  }
}

const tagsOf = (id, ...fields) => fields.flatMap((field) => linked(id, field)).map(label)

/**
 * Marcos da linha do tempo, todos reais e vindos do grafo: os nós da timeline
 * (formação, trabalho), as pesquisas e os projetos em destaque.
 */
const timelineEvents = computed(() => {
  const milestones = ofType('timeline').map((item) => {
    const target = item.links.link ? node(item.links.link) : null
    const route = nodeRoute(target)
    return {
      ...event(item, { type: item.data.kind, ...text(item.id), tags: tagsOf(item.id, 'techs', 'topics') }),
      link_type: route ? target.type : '',
      link_url: route || ''
    }
  })
  const researches = ofType('research').map((item) => {
    const { title, institution, award, description } = text(item.id)
    return event(item, { type: 'research', title, organization: institution, award, description, tags: tagsOf(item.id, 'topics') })
  })
  const projects = ofType('project')
    .filter((item) => item.data.featured === true)
    .map((item) => {
      const { title, summary } = text(item.id)
      const [category] = linked(item.id, 'category')
      return event(item, {
        type: 'project',
        title,
        organization: category ? label(category) : '',
        description: summary,
        tags: tagsOf(item.id, 'techs').slice(0, 4)
      })
    })
  return [...milestones, ...researches, ...projects]
})

const { sortOrder, selectedCategory, availableCategories, eventsByYear, totalCount, toggleSortOrder, setCategory } =
  useTimeline(timelineEvents)

const hasPhotos = allPhotos('pt').length > 0
</script>

<template>
  <main class="overview-page">
    <div class="page-container">

      <!-- Cabeçalho Principal -->
      <header class="page-header">
        <h1 class="page-title">{{ t('about_page.title') }}</h1>
        <p class="page-subtitle">{{ t('about_page.subtitle') }}</p>
      </header>

      <!-- s1: Perfil & Informações Básicas -->
      <ProfileSummarySection />

      <!-- s2: Core Stack & Ecossistema -->
      <CoreStackSection />

      <!-- s2b: Stack em uso (prévia dos gráficos, módulo graph) -->
      <GraphPreviewSection />

      <!-- s3: Janela macOS + README GitHub -->
      <DescriptionSection />

      <!-- s4: Linha do tempo (projetos em destaque, pesquisas e marcos) -->
      <TimelineSection
        v-if="totalCount > 0"
        :events-by-year="eventsByYear"
        :categories="availableCategories"
        :selected-category="selectedCategory"
        :sort-order="sortOrder"
        @select-category="setCategory"
        @toggle-sort="toggleSortOrder"
      />

      <!-- s6: Galeria Bento Grid (Registros & Em Campo) -->
      <GallerySection v-if="hasPhotos" />

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
  max-width: var(--page-width);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}


.page-header {
  margin-bottom: var(--spacing-md);
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
  color: var(--text-on-primary);
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
