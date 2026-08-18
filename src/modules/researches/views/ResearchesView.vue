<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, Award, BookOpen, Calendar } from 'lucide-vue-next'

const { t, tm, rt } = useI18n()
const researches = computed(() => tm('researches_page.list') || [])
</script>

<template>
  <main class="researches-page">
    <div class="page-container">
      <router-link to="/" class="back-link">
        <ArrowLeft :size="18" />
        <span>{{ t('common.back_to_home') }}</span>
      </router-link>

      <header class="page-header">
        <h1 class="page-title">{{ t('researches_page.title') }}</h1>
        <p class="page-subtitle">{{ t('researches_page.subtitle') }}</p>
      </header>

      <div class="researches-list">
        <article
          v-for="item in researches"
          :key="rt(item.id)"
          class="research-card surface-card"
        >
          <div class="card-header">
            <div class="meta-row">
              <span class="badge">
                <BookOpen :size="12" />
                {{ rt(item.category) }}
              </span>
              <span class="badge badge-accent" v-if="item.award">
                <Award :size="12" />
                {{ rt(item.award) }}
              </span>
            </div>

            <span class="year-badge">
              <Calendar :size="14" />
              {{ rt(item.year) }}
            </span>
          </div>

          <h2 class="research-title">{{ rt(item.title) }}</h2>
          <p class="research-desc">{{ rt(item.description) }}</p>
        </article>
      </div>
    </div>
  </main>
</template>

<style scoped>
.researches-page {
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
}

.researches-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.research-card {
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
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
}

.year-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.research-title {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  color: var(--text-primary);
  line-height: 1.2;
}

.research-desc {
  font-size: var(--text-base);
  line-height: 1.7;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .researches-page {
    padding: 5rem var(--spacing-md) var(--spacing-xl) var(--spacing-md);
  }

  .research-card {
    padding: var(--spacing-md);
  }
}
</style>
