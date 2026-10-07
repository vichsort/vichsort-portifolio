<script setup>
import UntranslatedNote from '@/shared/components/ui/UntranslatedNote.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { renderMarkdown } from '@/core/content/markdown'
import { formatDateRange } from '../composables/useProjects'
import { Github, ExternalLink, ArrowRight, Calendar } from 'lucide-vue-next'

const props = defineProps({
  project: { type: Object, required: true },
  variant: { type: String, default: 'grid' } // 'grid' | 'carousel'
})

const { t } = useI18n()

const projectId = computed(() => String(props.project?.id || '').trim())
const projectName = computed(() => String(props.project?.title || props.project?.name || '').trim())
const projectDate = computed(() => formatDateRange(props.project?.date))
const projectCategory = computed(() => String(props.project?.category || '').trim())

const projectTechs = computed(() => {
  const raw = props.project?.techs || props.project?.tags
  if (!raw) return []
  if (Array.isArray(raw)) return raw.map((t) => String(t).trim()).filter(Boolean)
  return String(raw).split(',').map((t) => t.trim()).filter(Boolean)
})

const projectImage = computed(() => {
  const img = props.project?.image
  return img && String(img).trim().length > 0 ? String(img).trim() : null
})

const githubLink = computed(() => {
  const link = props.project?.github || props.project?.link_github
  return link && String(link).trim().length > 0 ? String(link).trim() : null
})

const liveLink = computed(() => {
  const link = props.project?.live || props.project?.link_live
  return link && String(link).trim().length > 0 ? String(link).trim() : null
})

const renderedDescription = computed(() => {
  const desc = props.project?.summary || props.project?.short_description || ''
  return renderMarkdown(desc)
})
</script>

<template>
  <article
    class="project-card surface-card"
    :class="[`variant-${variant}`]"
  >
    <div class="card-image-wrapper">
      <img
        v-if="projectImage"
        :src="projectImage"
        :alt="projectName"
        loading="lazy"
        class="card-img"
      />
      <div v-else class="placeholder-bg">
        <span class="placeholder-text">{{ projectName }}</span>
      </div>
      <div class="image-overlay"></div>

      <div v-if="variant === 'grid' && projectDate" class="floating-date-badge">
        <Calendar :size="12" />
        <span>{{ projectDate }}</span>
      </div>
    </div>

    <div class="card-body">
      <header class="card-header">
        <div class="meta-top">
          <div class="tags-container">
            <span v-if="projectCategory" class="badge badge-accent">
              {{ projectCategory }}
            </span>
            <span
              v-for="tech in projectTechs"
              :key="tech"
              class="badge"
            >
              {{ tech }}
            </span>
          </div>
          <span v-if="variant === 'carousel' && projectDate" class="project-date">{{ projectDate }}</span>
        </div>

        <h3 class="project-name">{{ projectName }}</h3>
        <UntranslatedNote :lang="project.fallback" />
      </header>

      <div class="project-content markdown-body" v-html="renderedDescription"></div>

      <footer class="card-footer">
        <div class="external-links">
          <a
            v-if="githubLink"
            :href="githubLink"
            target="_blank"
            rel="noopener noreferrer"
            class="icon-btn"
            aria-label="Repositório no GitHub"
            title="GitHub"
          >
            <Github :size="18" />
          </a>
          <a
            v-if="liveLink"
            :href="liveLink"
            target="_blank"
            rel="noopener noreferrer"
            class="icon-btn"
            aria-label="Demonstração Online"
            title="Live Demo"
          >
            <ExternalLink :size="18" />
          </a>
        </div>

        <router-link :to="`/projects/${projectId}`" class="view-more-btn">
          <span>{{ t('projects_section.card.view_more') }}</span>
          <ArrowRight :size="15" class="btn-arrow" />
        </router-link>
      </footer>
    </div>
  </article>
</template>

<style scoped>
/* Base Project Card */
.project-card {
  overflow: hidden;
  border-radius: var(--radius-lg);
  transition: transform var(--transition-base),
              border-color var(--transition-base),
              box-shadow var(--transition-base);
}

.project-card:hover {
  border-color: var(--primary-border);
  box-shadow: var(--shadow-card-hover);
}

/* Image Wrapper */
.card-image-wrapper {
  position: relative;
  background-color: var(--bg-surface-2);
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-smooth);
}

.project-card:hover .card-img {
  transform: scale(1.05);
}

.placeholder-bg {
  width: 100%;
  height: 100%;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bg-surface-2), var(--accent-subtle));
}

.placeholder-text {
  font-family: var(--font-body);
  font-weight: 800;
  font-size: var(--text-lg);
  color: var(--primary);
  opacity: 0.75;
  letter-spacing: 0.5px;
}

.image-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.floating-date-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(8, 7, 17, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  padding: 4px 10px;
  font-size: var(--text-xs);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 0.35rem;
  z-index: 2;
}

/* Card Body */
.card-body {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--spacing-md);
  flex: 1;
}

.meta-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
  flex-wrap: wrap;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.project-date {
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-style: italic;
}

.project-name {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--text-xl);
  color: var(--text-primary);
  letter-spacing: -0.3px;
  line-height: 1.25;
  margin-top: 0.35rem;
  transition: color var(--transition-fast);
}

.project-card:hover .project-name {
  color: var(--primary);
}

.project-content {
  font-size: var(--text-sm);
  line-height: 1.6;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-content :deep(strong) {
  color: var(--text-primary);
  font-weight: 600;
}

.project-content :deep(em) {
  color: var(--primary);
  font-style: normal;
}

/* Card Footer */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--border-subtle);
  margin-top: auto;
}

.external-links {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  color: var(--text-secondary);
  padding: 0.45rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  background-color: var(--bg-surface-2);
}

.icon-btn:hover {
  color: var(--primary);
  background-color: var(--primary-subtle);
  transform: translateY(-2px);
}

.view-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 1.15rem;
  border: 1px solid var(--primary-border);
  border-radius: var(--radius-full);
  color: var(--text-primary);
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: var(--primary-subtle);
  transition: all var(--transition-fast);
}

.btn-arrow {
  transition: transform var(--transition-fast);
}

.view-more-btn:hover {
  background-color: var(--primary);
  border-color: var(--primary);
  color: #ffffff;
}

.view-more-btn:hover .btn-arrow {
  transform: translateX(3px);
}

/* ==========================================================================
   VARIANT: GRID (Used in ProjectsListView)
   ========================================================================== */
.variant-grid {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.variant-grid:hover {
  transform: translateY(-6px);
}

.variant-grid .card-image-wrapper {
  width: 100%;
  height: 220px;
}

.variant-grid .image-overlay {
  background: linear-gradient(to bottom, transparent 65%, var(--bg-surface-1) 100%);
}

/* ==========================================================================
   VARIANT: CAROUSEL (Used in HomeView Showcase)
   ========================================================================== */
.variant-carousel {
  width: 860px;
  max-width: 88vw;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  scroll-snap-align: center;
  user-select: none;
}

.variant-carousel .card-image-wrapper {
  width: 44%;
  min-height: 340px;
}

.variant-carousel .image-overlay {
  background: linear-gradient(to right, transparent 60%, var(--bg-surface-1) 100%);
}

.variant-carousel .card-body {
  width: 56%;
}

.variant-carousel .project-name {
  font-size: var(--text-2xl);
}

.variant-carousel .project-content {
  -webkit-line-clamp: 4;
  line-clamp: 4;
}

@media (max-width: 900px) {
  .variant-carousel {
    flex-direction: column;
    width: 85vw;
  }

  .variant-carousel .card-image-wrapper {
    width: 100%;
    height: 200px;
    min-height: auto;
  }

  .variant-carousel .image-overlay {
    background: linear-gradient(to bottom, transparent 60%, var(--bg-surface-1) 100%);
  }

  .variant-carousel .card-body {
    width: 100%;
    padding: var(--spacing-md);
  }

  .variant-carousel .project-name {
    font-size: var(--text-xl);
  }
}
</style>

