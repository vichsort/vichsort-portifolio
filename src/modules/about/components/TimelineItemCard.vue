<script setup>
import UntranslatedNote from '@/shared/components/ui/UntranslatedNote.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Briefcase,
  FolderGit2,
  BookOpen,
  GraduationCap,
  Calendar,
  Building2,
  ArrowUpRight
} from 'lucide-vue-next'

const props = defineProps({
  event: {
    type: Object,
    required: true
  },
  compact: {
    type: Boolean,
    default: false
  }
})

const { t } = useI18n()

const categoryConfig = computed(() => {
  switch (props.event.type) {
    case 'work':
      return {
        icon: Briefcase,
        labelKey: 'about_page.s5_timeline.category_work',
        badgeClass: 'badge-work'
      }
    case 'project':
      return {
        icon: FolderGit2,
        labelKey: 'about_page.s5_timeline.category_project',
        badgeClass: 'badge-project'
      }
    case 'research':
      return {
        icon: BookOpen,
        labelKey: 'about_page.s5_timeline.category_research',
        badgeClass: 'badge-research'
      }
    case 'education':
    default:
      return {
        icon: GraduationCap,
        labelKey: 'about_page.s5_timeline.category_education',
        badgeClass: 'badge-education'
      }
  }
})

const hasLink = computed(() => {
  return props.event.link_url && String(props.event.link_url).trim().length > 0
})

const linkLabel = computed(() => {
  if (props.event.link_type === 'project') {
    return t('about_page.s5_timeline.view_project')
  }
  if (props.event.link_type === 'research') {
    return t('about_page.s5_timeline.view_research')
  }
  return t('about_page.s5_timeline.view_project')
})
</script>

<template>
  <article
    class="timeline-card surface-card interactive"
    :class="{ 'is-compact': compact }"
  >
    <div class="card-top">
      <div class="category-meta">
        <span class="category-badge" :class="categoryConfig.badgeClass">
          <component :is="categoryConfig.icon" :size="12" />
          <span>{{ t(categoryConfig.labelKey) }}</span>
        </span>
      </div>

      <span class="date-badge">
        <Calendar :size="12" />
        <span>{{ event.year || event.date }}</span>
      </span>
    </div>

    <div class="title-block">
      <h3 class="event-title">{{ event.title }}</h3>
      <UntranslatedNote :lang="event.fallback" />
      <div class="org-row" v-if="event.organization">
        <Building2 :size="13" class="org-icon" />
        <span>{{ event.organization }}</span>
      </div>
    </div>

    <p class="event-desc">{{ event.description }}</p>

    <div class="card-bottom">
      <div class="tags-row" v-if="event.tags && event.tags.length > 0">
        <span
          v-for="tag in event.tags"
          :key="tag"
          class="tag-item"
        >
          {{ tag }}
        </span>
      </div>

      <router-link
        v-if="hasLink"
        :to="event.link_url"
        class="event-link"
      >
        <span>{{ linkLabel }}</span>
        <ArrowUpRight :size="14" />
      </router-link>
    </div>
  </article>
</template>

<style scoped>
.timeline-card {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  border-radius: var(--radius-lg);
  transition: transform var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.timeline-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary-border);
  box-shadow: var(--shadow-card-hover);
}

.timeline-card.is-compact {
  padding: var(--spacing-md);
  gap: var(--spacing-sm);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.category-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.badge-work {
  background-color: var(--primary-subtle);
  border: 1px solid var(--primary-border);
  color: var(--primary);
}

.badge-project {
  background-color: var(--accent-subtle);
  border: 1px solid var(--border-accent);
  color: var(--accent);
}

.badge-research {
  background-color: var(--primary-subtle);
  border: 1px solid var(--primary-border);
  color: var(--primary);
}

.badge-education {
  background-color: var(--bg-surface-2);
  border: 1px solid var(--border-medium);
  color: var(--text-secondary);
}

.date-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-muted);
}

.title-block {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.event-title {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--text-lg);
  color: var(--text-primary);
  line-height: 1.3;
}

.is-compact .event-title {
  font-size: var(--text-base);
}

.org-row {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-muted);
}

.org-icon {
  color: var(--primary);
}

.event-desc {
  font-size: var(--text-sm);
  line-height: 1.7;
  color: var(--text-secondary);
}

.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-top: auto;
  padding-top: var(--spacing-xs);
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.tag-item {
  font-size: var(--text-xs);
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-full);
  background-color: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  color: var(--text-muted);
}

.event-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-decoration: none;
  margin-left: auto;
  transition: opacity var(--transition-fast);
}

.event-link:hover {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .timeline-card {
    padding: var(--spacing-md);
  }

  .card-bottom {
    flex-direction: column;
    align-items: flex-start;
  }

  .event-link {
    margin-left: 0;
  }
}
</style>
