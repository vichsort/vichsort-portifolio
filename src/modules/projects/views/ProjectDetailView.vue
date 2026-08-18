<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useProjects } from '../composables/useProjects'
import { ArrowLeft, ArrowRight, ExternalLink, Github, Calendar, Tag } from 'lucide-vue-next'

const props = defineProps({
  slug: { type: String, default: '' }
})

const route = useRoute()
const { t, locale, tm, rt } = useI18n()
const { loadProject, isLoading, error } = useProjects()

const projectData = ref(null)
const projectId = ref(props.slug || route.params.slug)

const allProjects = computed(() => tm('projects_section.list') || [])

const currentIndex = computed(() => {
  return allProjects.value.findIndex(p => rt(p.id) === projectId.value)
})

const nextProject = computed(() => {
  if (allProjects.value.length === 0 || currentIndex.value === -1) return null
  const nextIdx = (currentIndex.value + 1) % allProjects.value.length
  return allProjects.value[nextIdx]
})

const prevProject = computed(() => {
  if (allProjects.value.length === 0 || currentIndex.value === -1) return null
  const prevIdx = (currentIndex.value - 1 + allProjects.value.length) % allProjects.value.length
  return allProjects.value[prevIdx]
})

const fetchProject = async () => {
  if (!projectId.value) return
  const data = await loadProject(projectId.value, locale.value)
  projectData.value = data
}

onMounted(() => {
  fetchProject()
})

watch(locale, () => {
  fetchProject()
})

watch(
  () => route.params.slug,
  (newSlug) => {
    if (newSlug) {
      projectId.value = newSlug
      fetchProject()
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

      <div v-else-if="projectData && projectData.attributes" class="project-article">
        <header class="detail-header">
          <div class="meta-row">
            <span v-if="projectData.attributes.date" class="meta-item">
              <Calendar :size="16" />
              <span>{{ projectData.attributes.date }}</span>
            </span>
          </div>

          <h1 class="project-title">{{ projectData.attributes.title || projectData.attributes.name }}</h1>
          <p v-if="projectData.attributes.summary" class="project-summary">
            {{ projectData.attributes.summary }}
          </p>

          <div v-if="projectData.attributes.tags" class="tags-row">
            <span
              v-for="tag in projectData.attributes.tags"
              :key="tag"
              class="badge"
            >
              <Tag :size="12" />
              {{ tag }}
            </span>
          </div>

          <div class="action-buttons">
            <a
              v-if="projectData.attributes.live"
              :href="projectData.attributes.live"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary"
            >
              <ExternalLink :size="18" />
              <span>{{ t('project_detail.live_demo') }}</span>
            </a>

            <a
              v-if="projectData.attributes.github"
              :href="projectData.attributes.github"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-secondary"
            >
              <Github :size="18" />
              <span>{{ t('project_detail.view_source') }}</span>
            </a>
          </div>
        </header>

        <div v-if="projectData.attributes.image" class="cover-image-wrapper surface-card">
          <img
            :src="projectData.attributes.image"
            :alt="projectData.attributes.title"
            class="cover-img"
          />
        </div>

        <section class="markdown-content surface-card" v-html="projectData.html"></section>

        <!-- Next / Previous Navigation -->
        <nav class="project-pagination" aria-label="Navegação entre projetos">
          <router-link
            v-if="prevProject"
            :to="`/projects/${rt(prevProject.id)}`"
            class="pagination-card prev surface-card"
          >
            <span class="pagination-label">&larr; {{ t('project_detail.prev_project') }}</span>
            <span class="pagination-title">{{ rt(prevProject.name) }}</span>
          </router-link>

          <router-link
            v-if="nextProject"
            :to="`/projects/${rt(nextProject.id)}`"
            class="pagination-card next surface-card"
          >
            <span class="pagination-label">{{ t('project_detail.next_project') }} &rarr;</span>
            <span class="pagination-title">{{ rt(nextProject.name) }}</span>
          </router-link>
        </nav>
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
  max-width: 900px;
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
  font-family: var(--font-heading);
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  line-height: 1.05;
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
  color: #ffffff;
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

.markdown-content :deep(h2) {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
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
