<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ProjectCard from '../components/ProjectCard.vue'
import { ArrowLeft, Search } from 'lucide-vue-next'

const { t, tm } = useI18n()
const projects = computed(() => tm('projects_section.list') || [])
const selectedFilter = ref('ALL')
const searchQuery = ref('')

const allTags = computed(() => {
  const tagsSet = new Set()
  projects.value.forEach(p => {
    const raw = p.tags
    if (raw) {
      const parts = String(raw).split(',').map(s => s.trim()).filter(Boolean)
      parts.forEach(tag => tagsSet.add(tag))
    }
  })
  return ['ALL', ...Array.from(tagsSet)]
})

const filteredProjects = computed(() => {
  return projects.value.filter(p => {
    const nameMatch = p.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                      p.short_description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const tagMatch = selectedFilter.value === 'ALL' ||
                     p.tags?.toLowerCase().includes(selectedFilter.value.toLowerCase())
    return nameMatch && tagMatch
  })
})
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

      <div class="filters-bar">
        <div class="search-input-wrapper surface-card">
          <Search :size="18" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar projetos..."
            class="search-input"
          />
        </div>

        <div class="tags-filter">
          <button
            v-for="tag in allTags"
            :key="tag"
            @click="selectedFilter = tag"
            class="filter-pill"
            :class="{ active: selectedFilter === tag }"
          >
            {{ tag === 'ALL' ? t('projects_page.filter_all') : tag }}
          </button>
        </div>
      </div>
    </div>

    <div class="projects-grid" v-if="filteredProjects.length > 0">
      <ProjectCard
        v-for="(project, index) in filteredProjects"
        :key="project.id || index"
        :project="project"
        class="full-card"
      />
    </div>

    <div v-else class="empty-state surface-card">
      <p>{{ t('projects_page.no_projects_found') }}</p>
    </div>
  </main>
</template>

<style scoped>
.projects-page {
  min-height: 100vh;
  padding: 6rem var(--spacing-xl) var(--spacing-2xl) var(--spacing-xl);
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: var(--spacing-2xl);
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
  max-width: 600px;
  margin-bottom: var(--spacing-lg);
}

.filters-bar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  max-width: 400px;
  border-radius: var(--radius-full);
}

.search-icon {
  color: var(--text-muted);
}

.search-input {
  background: none;
  border: none;
  color: var(--text-primary);
  font-family: inherit;
  font-size: var(--text-sm);
  width: 100%;
  outline: none;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.tags-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-pill {
  padding: 0.4rem 1rem;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: var(--bg-surface-2);
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
  transition: all var(--transition-fast);
}

.filter-pill:hover {
  border-color: var(--primary-border);
  color: var(--text-primary);
}

.filter-pill.active {
  background-color: var(--primary);
  border-color: var(--primary);
  color: #ffffff;
}

.projects-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  align-items: center;
}

.full-card {
  width: 100%;
  max-width: 1000px;
}

.empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .projects-page {
    padding: 5rem var(--spacing-md) var(--spacing-xl) var(--spacing-md);
  }
}
</style>
