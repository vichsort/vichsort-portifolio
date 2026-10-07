<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalStorage } from '@vueuse/core'
import { ArrowLeft, Grid3x3, Grid2x2, RectangleHorizontal } from 'lucide-vue-next'
import { allPhotos } from '@/core/content/photos'
import GalleryCard from '../components/GalleryCard.vue'

const { t, locale } = useI18n()

// Tamanho → fotos por linha: médio 3, grande 2, extra grande 1
const SIZES = [
  { id: 'md', icon: Grid3x3 },
  { id: 'lg', icon: Grid2x2 },
  { id: 'xl', icon: RectangleHorizontal }
]

const storedSize = useLocalStorage('gallery-size', 'md')
const size = computed({
  get: () => (SIZES.some((s) => s.id === storedSize.value) ? storedSize.value : 'md'),
  set: (value) => (storedSize.value = value)
})

const photos = computed(() => allPhotos(locale.value))
</script>

<template>
  <main class="gallery-page">
    <header class="page-header">
      <router-link to="/overview" class="back-link">
        <ArrowLeft :size="18" />
        <span>{{ t('gallery_page.back_to_about') }}</span>
      </router-link>

      <h1 class="page-title">{{ t('gallery_page.title') }}</h1>
      <p class="page-subtitle">{{ t('gallery_page.subtitle') }}</p>

      <div class="toolbar">
        <span class="count">{{ t('gallery_page.count', { count: photos.length }) }}</span>

        <div class="size-toggle" role="radiogroup" :aria-label="t('gallery_page.size_label')">
          <button
            v-for="option in SIZES"
            :key="option.id"
            type="button"
            role="radio"
            class="size-btn"
            :class="{ active: size === option.id }"
            :aria-checked="size === option.id"
            :title="t(`gallery_page.sizes.${option.id}`)"
            @click="size = option.id"
          >
            <component :is="option.icon" :size="16" aria-hidden="true" />
            <span class="size-label">{{ t(`gallery_page.sizes.${option.id}`) }}</span>
          </button>
        </div>
      </div>
    </header>

    <div v-if="photos.length" class="gallery-grid" :class="`size-${size}`">
      <GalleryCard v-for="photo in photos" :key="photo.id" :photo="photo" :size="size" />
    </div>

    <p v-else class="empty-state surface-card">{{ t('gallery_page.empty') }}</p>
  </main>
</template>

<style scoped>
.gallery-page {
  min-height: 100vh;
  padding: 6rem var(--spacing-xl) var(--spacing-2xl) var(--spacing-xl);
  max-width: 1300px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: var(--spacing-xl);
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
  max-width: 650px;
  margin-bottom: var(--spacing-lg);
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.count {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--text-muted);
}

.size-toggle {
  display: inline-flex;
  padding: 0.25rem;
  gap: 0.25rem;
  background-color: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
}

.size-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.9rem;
  border: none;
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--text-secondary);
  font-size: var(--text-xs);
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.size-btn:hover {
  color: var(--text-primary);
}

.size-btn.active {
  background-color: var(--primary);
  color: var(--text-on-primary);
}

.size-btn:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.gallery-grid {
  display: grid;
  gap: var(--spacing-lg);
  align-items: start;
}

.gallery-grid.size-md {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.gallery-grid.size-lg {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

/* Uma por linha: largura de leitura, para a foto não esticar até a borda */
.gallery-grid.size-xl {
  grid-template-columns: minmax(0, 1fr);
  max-width: 960px;
  margin: 0 auto;
  gap: var(--spacing-xl);
}

.empty-state {
  padding: var(--spacing-2xl);
  text-align: center;
  color: var(--text-muted);
}

@media (max-width: 900px) {
  .gallery-grid.size-md {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .gallery-page {
    padding: 5rem var(--spacing-md) var(--spacing-xl) var(--spacing-md);
  }

  .gallery-grid.size-lg {
    grid-template-columns: minmax(0, 1fr);
  }

  /* No celular o seletor mostra só os ícones */
  .size-label {
    display: none;
  }
}
</style>
