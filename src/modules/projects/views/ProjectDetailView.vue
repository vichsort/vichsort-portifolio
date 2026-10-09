<script setup>
import { vContentLinks } from '@/shared/directives/contentLinks'
import UntranslatedNote from '@/shared/components/ui/UntranslatedNote.vue'
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useProjects } from '../composables/useProjects'
import ProjectPagination from '../components/ProjectPagination.vue'
import NodeMenu from '@/shared/components/node/NodeMenu.vue'
import { ArrowLeft, ExternalLink, Github, Calendar } from 'lucide-vue-next'

const props = defineProps({
  slug: { type: String, default: '' }
})

const route = useRoute()
const { t, locale } = useI18n()
const { loadProject, getAdjacentProjects, formatDateRange, isLoading, error } = useProjects()

const project = ref(null)
const prevProject = ref(null)
const nextProject = ref(null)
const projectId = ref(props.slug || route.params.slug)

const fetchProjectData = async () => {
  if (!projectId.value) return

  const [data, adjacent] = await Promise.all([
    loadProject(projectId.value, locale.value),
    getAdjacentProjects(projectId.value, locale.value)
  ])

  project.value = data
  prevProject.value = adjacent.prev
  nextProject.value = adjacent.next
}

onMounted(() => {
  fetchProjectData()
})

watch(locale, () => {
  fetchProjectData()
})

watch(
  () => route.params.slug,
  (newSlug) => {
    if (newSlug) {
      projectId.value = newSlug
      fetchProjectData()
    }
  }
)
</script>

<template>
  <main class="project-detail-page">
    <div class="page-container">
      <router-link to="/projects" class="back-link">
        <ArrowLeft :size="18" />
        <span>{{ t('project_detail.back_btn') }}</span>
      </router-link>

      <div v-if="isLoading" class="loading-state surface-card">
        <p>{{ t('common.loading') }}</p>
      </div>

      <div v-else-if="project" class="project-article">
        <header class="detail-header">
          <div class="meta-row">
            <span v-if="project.date" class="meta-item">
              <Calendar :size="16" />
              <span>{{ formatDateRange(project.date) }}</span>
            </span>
            <span v-if="project.category" class="badge badge-accent">
              {{ project.category }}
            </span>
          </div>

          <h1 class="project-title">{{ project.title }}</h1>
          <UntranslatedNote :lang="project.fallback" />
          <p v-if="project.summary" class="project-summary">
            {{ project.summary }}
          </p>

          <div v-if="project.techs && project.techs.length > 0" class="tags-row">
            <!-- s7: cada tech abre o menu de nó (onde mais ela aparece), sem o próprio projeto;
                 sem nada para mostrar, fica só o badge -->
            <NodeMenu
              v-for="(tech, index) in project.techs"
              :id="project.techIds[index]"
              :key="project.techIds[index]"
              :exclude="[project.id]"
              class="tech-trigger"
            >
              <template #default="{ open }">
                <span class="badge" :class="{ 'is-open': open }">{{ tech }}</span>
              </template>
            </NodeMenu>
          </div>

          <div class="action-buttons">
            <a
              v-if="project.live"
              :href="project.live"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary"
            >
              <ExternalLink :size="18" />
              <span>{{ t('project_detail.live_demo') }}</span>
            </a>

            <a
              v-if="project.github"
              :href="project.github"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-secondary"
            >
              <Github :size="18" />
              <span>{{ t('project_detail.view_source') }}</span>
            </a>
          </div>
        </header>

        <div v-if="project.image" class="cover-image-wrapper surface-card">
          <img
            :src="project.image"
            :alt="project.title"
            class="cover-img"
          />
        </div>

        <section v-content-links class="markdown-content surface-card" v-html="project.html"></section>

        <!-- Next / Previous Navigation Component -->
        <ProjectPagination
          :prev-project="prevProject"
          :next-project="nextProject"
        />
      </div>

      <div v-else class="not-found-state surface-card">
        <h2>{{ t('project_detail.project_not_found') }}</h2>
        <p>{{ t('project_detail.not_found_desc') }}</p>
        <router-link to="/projects" class="btn-primary">
          {{ t('projects_page.back_to_list') }}
        </router-link>
      </div>
    </div>
  </main>
</template>

<style scoped>
.project-detail-page {
  min-height: 100vh;
  padding: 6rem var(--spacing-xl) var(--spacing-2xl) var(--spacing-xl);
}

.page-container {
  max-width: var(--page-width);
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

.detail-header {
  margin-bottom: var(--spacing-xl);
}

.meta-row {
  display: flex;
  gap: 1rem;
  margin-bottom: var(--spacing-xs);
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.project-title {
  font-family: var(--font-body);
  font-weight: 800;
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  line-height: 1.15;
  letter-spacing: -0.5px;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.project-summary {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: var(--spacing-md);
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: var(--spacing-lg);
}

/* Badge de tech com menu: o gatilho é um <button> (NodeMenu) em volta do badge */
.tech-trigger {
  border-radius: var(--radius-full);
}

.tech-trigger .badge {
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
}

.tech-trigger:hover .badge,
.tech-trigger .badge.is-open {
  background-color: var(--primary);
  border-color: var(--primary);
  color: var(--text-on-primary);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all var(--transition-fast);
}

.btn-primary {
  background-color: var(--primary);
  color: var(--text-on-primary);
  box-shadow: var(--shadow-glow);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: var(--bg-surface-2);
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
}

.btn-secondary:hover {
  border-color: var(--primary-border);
  background-color: var(--primary-subtle);
}

.cover-image-wrapper {
  width: 100%;
  max-height: 480px;
  overflow: hidden;
  margin-bottom: var(--spacing-xl);
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.markdown-content {
  padding: var(--spacing-xl);
  font-size: var(--text-base);
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-2xl);
}

/* O padding do card já dá o respiro: o primeiro título não soma a margem dele */
.markdown-content > :deep(:first-child) {
  margin-top: 0;
}

/* Largura de leitura: texto em ~75 caracteres por linha; imagens e código usam o card todo */
.markdown-content > :deep(:where(p, ul, ol, blockquote, h2, h3, h4)) {
  max-width: 75ch;
}

.markdown-content :deep(h2) {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--text-2xl);
  letter-spacing: -0.3px;
  color: var(--text-primary);
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-sm);
}

.markdown-content :deep(h3) {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--text-primary);
  margin-top: var(--spacing-md);
  margin-bottom: var(--spacing-xs);
}

.markdown-content :deep(p) {
  margin-bottom: var(--spacing-md);
}

.markdown-content :deep(ul) {
  list-style: disc;
  margin-left: 1.5rem;
  margin-bottom: var(--spacing-md);
}

.markdown-content :deep(li) {
  margin-bottom: 0.35rem;
}

.markdown-content :deep(strong) {
  color: var(--text-primary);
}

.project-pagination {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
}

.pagination-card {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-decoration: none;
}

.pagination-card.next {
  text-align: right;
  align-items: flex-end;
}

.pagination-label {
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 0.5px;
}

.pagination-title {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  color: var(--text-primary);
}

.pagination-card:hover .pagination-title {
  color: var(--primary);
}

.loading-state,
.not-found-state {
  padding: var(--spacing-2xl);
  text-align: center;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .project-detail-page {
    padding: 5rem var(--spacing-md) var(--spacing-xl) var(--spacing-md);
  }

  .markdown-content {
    padding: var(--spacing-md);
  }

  .project-pagination {
    grid-template-columns: 1fr;
  }

  .pagination-card.next {
    text-align: left;
    align-items: flex-start;
  }
}
</style>
