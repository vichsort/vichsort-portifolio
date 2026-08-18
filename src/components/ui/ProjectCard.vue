<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { renderMarkdown } from '@/utils/markdown'
import { Github, ExternalLink, ArrowRight } from 'lucide-vue-next'

const props = defineProps({
  project: { type: Object, required: true }
})

const { t, rt } = useI18n()

const renderedDescription = computed(() => {
  return renderMarkdown(rt(props.project.short_description))
})

const parsedTags = computed(() => {
  const rawTags = rt(props.project.tags)
  if (!rawTags) return []
  if (Array.isArray(rawTags)) return rawTags
  return String(rawTags).split(',').map(tag => tag.trim()).filter(Boolean)
})
</script>

<template>
  <article class="project-card surface-card">
    <div class="card-image-wrapper">
      <img
        v-if="project.image"
        :src="project.image"
        :alt="rt(project.name)"
        loading="lazy"
        class="card-img"
      />
      <div v-else class="placeholder-bg">
        <span class="placeholder-text">{{ rt(project.name) }}</span>
      </div>
      <div class="image-overlay"></div>
    </div>

    <div class="card-body">
      <header class="card-header">
        <div class="meta-top">
          <div class="tags-container">
            <span v-for="tag in parsedTags" :key="tag" class="badge">
              {{ tag }}
            </span>
          </div>
          <span class="project-date">{{ rt(project.date) }}</span>
        </div>

        <h3 class="project-name">{{ rt(project.name) }}</h3>
      </header>

      <div class="project-content markdown-body" v-html="renderedDescription"></div>

      <footer class="card-footer">
        <div class="external-links">
          <a
            v-if="project.link_github"
            :href="project.link_github"
            target="_blank"
            rel="noopener noreferrer"
            class="icon-btn"
            aria-label="GitHub Repository"
          >
            <Github :size="20" />
          </a>
          <a
            v-if="project.link_live"
            :href="project.link_live"
            target="_blank"
            rel="noopener noreferrer"
            class="icon-btn"
            aria-label="Live Demo"
          >
            <ExternalLink :size="20" />
          </a>
        </div>

        <router-link :to="`/projects/${project.id}`" class="view-more-btn">
          <span>{{ t('projects_section.card.view_more') }}</span>
          <ArrowRight :size="16" class="btn-arrow" />
        </router-link>
      </footer>
    </div>
  </article>
</template>

<style scoped>
.project-card {
  width: 860px;
  max-width: 88vw;
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  scroll-snap-align: center;
  user-select: none;
}

.card-image-wrapper {
  width: 44%;
  min-height: 340px;
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
  transform: scale(1.04);
}

.placeholder-bg {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bg-surface-2), var(--accent-subtle));
}

.placeholder-text {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  color: var(--primary);
  opacity: 0.6;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, transparent 60%, var(--bg-surface-1) 100%);
  pointer-events: none;
}

.card-body {
  width: 56%;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.meta-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
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
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  color: var(--text-primary);
  letter-spacing: -0.5px;
  line-height: 1.1;
  margin-top: 0.25rem;
}

.project-content {
  font-size: var(--text-sm);
  line-height: 1.5;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
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

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--border-subtle);
}

.external-links {
  display: flex;
  gap: 0.75rem;
}

.icon-btn {
  color: var(--text-secondary);
  padding: 0.4rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.icon-btn:hover {
  color: var(--primary);
  background-color: var(--primary-subtle);
  transform: translateY(-2px);
}

.view-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
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

@media (max-width: 900px) {
  .project-card {
    flex-direction: column;
    width: 85vw;
  }

  .card-image-wrapper {
    width: 100%;
    height: 200px;
    min-height: auto;
  }

  .image-overlay {
    background: linear-gradient(to bottom, transparent 60%, var(--bg-surface-1) 100%);
  }

  .card-body {
    width: 100%;
    padding: var(--spacing-md);
  }

  .project-name {
    font-size: var(--text-xl);
  }
}
</style>