<script setup>
import UntranslatedNote from '@/shared/components/ui/UntranslatedNote.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { BookOpen, Award, Calendar, ExternalLink, Building2, Users } from 'lucide-vue-next'

const props = defineProps({
  research: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['selectTag', 'selectCategory'])

const { t } = useI18n()

const resolve = (val) => (val === undefined || val === null ? '' : String(val).trim())

const title = computed(() => resolve(props.research.title))
const category = computed(() => resolve(props.research.category))
const award = computed(() => resolve(props.research.award))
const year = computed(() => resolve(props.research.year || props.research.date))
const description = computed(() => resolve(props.research.description))
const institution = computed(() => resolve(props.research.institution))
const authors = computed(() => resolve(props.research.authors))
const paperUrl = computed(() => resolve(props.research.paper_url))
const tags = computed(() => {
  const raw = props.research.tags
  if (Array.isArray(raw)) {
    return raw.map((t) => resolve(t)).filter(Boolean)
  }
  if (typeof raw === 'string' && raw.trim().length > 0) {
    return raw.split(',').map((t) => t.trim()).filter(Boolean)
  }
  return []
})
</script>

<template>
  <article class="research-card surface-card">
    <div class="card-header">
      <div class="meta-row">
        <button
          type="button"
          class="badge category-badge"
          @click="emit('selectCategory', category)"
          :title="category"
        >
          <BookOpen :size="12" />
          <span>{{ category }}</span>
        </button>

        <span class="badge badge-accent" v-if="award">
          <Award :size="12" />
          <span>{{ award }}</span>
        </span>
      </div>

      <span class="year-badge" v-if="year">
        <Calendar :size="13" />
        <span>{{ year }}</span>
      </span>
    </div>

    <h2 class="research-title">{{ title }}</h2>
    <UntranslatedNote :lang="research.fallback" />

    <div class="institutional-meta" v-if="institution || authors">
      <span class="meta-item" v-if="institution" :title="t('researches_page.institution_label')">
        <Building2 :size="13" class="meta-icon" />
        <span>{{ institution }}</span>
      </span>
      <span class="meta-item" v-if="authors" :title="t('researches_page.authors_label')">
        <Users :size="13" class="meta-icon" />
        <span>{{ authors }}</span>
      </span>
    </div>

    <p class="research-desc">{{ description }}</p>

    <div class="card-footer">
      <div class="tags-container" v-if="tags.length > 0">
        <button
          v-for="tag in tags"
          :key="tag"
          type="button"
          class="tag-pill"
          @click="emit('selectTag', tag)"
        >
          {{ tag }}
        </button>
      </div>

      <a
        v-if="paperUrl"
        :href="paperUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="paper-link"
      >
        <span>{{ t('researches_page.view_paper') }}</span>
        <ExternalLink :size="14" />
      </a>
    </div>
  </article>
</template>

<style scoped>
.research-card {
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  border-radius: var(--radius-lg);
  transition: transform var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.research-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary-border);
  box-shadow: var(--shadow-card-hover);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.category-badge {
  background: var(--primary-subtle);
  border: 1px solid var(--primary-border);
  color: var(--primary);
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.category-badge:hover {
  background-color: var(--primary);
  color: var(--text-on-primary);
}

.year-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-muted);
}

.research-title {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--text-xl);
  color: var(--text-primary);
  line-height: 1.35;
  letter-spacing: -0.2px;
}

.institutional-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.meta-icon {
  color: var(--primary);
  flex-shrink: 0;
}

.research-desc {
  font-size: var(--text-base);
  line-height: 1.7;
  color: var(--text-secondary);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xs);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--border-subtle);
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.tag-pill {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--text-secondary);
  background-color: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  padding: 0.2rem 0.6rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tag-pill:hover {
  color: var(--text-on-primary);
  background-color: var(--primary);
  border-color: var(--primary);
}

.paper-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-left: auto;
  transition: opacity var(--transition-fast);
}

.paper-link:hover {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .research-card {
    padding: var(--spacing-md);
  }

  .institutional-meta {
    flex-direction: column;
    gap: 0.25rem;
  }

  .card-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .paper-link {
    margin-left: 0;
  }
}
</style>
