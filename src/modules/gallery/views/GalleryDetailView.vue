<script setup>
import { vContentLinks } from '@/shared/directives/contentLinks'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, ArrowRight, ArrowUpRight, Calendar, MapPin, Image as ImageIcon } from 'lucide-vue-next'
import { allPhotos } from '@/core/content/photos'
import UntranslatedNote from '@/shared/components/ui/UntranslatedNote.vue'

const props = defineProps({
  id: { type: String, required: true }
})

const { t, locale } = useI18n()

const photos = computed(() => allPhotos(locale.value))
const index = computed(() => photos.value.findIndex((p) => p.id === props.id))
const photo = computed(() => photos.value[index.value] || null)

// Anterior e próxima na ordem da galeria (mais recente primeiro), dando a volta nas pontas
const adjacent = computed(() => {
  const list = photos.value
  if (index.value === -1 || list.length < 2) return { prev: null, next: null }
  return {
    prev: list[(index.value - 1 + list.length) % list.length],
    next: list[(index.value + 1) % list.length]
  }
})
</script>

<template>
  <main class="photo-page">
    <div class="page-container">
      <router-link to="/gallery" class="back-link">
        <ArrowLeft :size="18" />
        <span>{{ t('gallery_page.back_to_gallery') }}</span>
      </router-link>

      <article v-if="photo" class="photo-article">
        <figure class="detail-polaroid">
          <div class="photo-frame" :class="{ empty: !photo.image }">
            <img v-if="photo.image" :src="photo.image" :alt="photo.title" class="photo-img" />
            <div v-else class="photo-placeholder" aria-hidden="true">
              <ImageIcon :size="56" />
              <span v-if="photo.category">{{ photo.category }}</span>
            </div>
          </div>

          <figcaption class="detail-caption">
            <h1 class="photo-title">{{ photo.title }}</h1>
            <UntranslatedNote :lang="photo.fallback" />

            <div class="meta-row">
              <span v-if="photo.date" class="meta-item">
                <Calendar :size="15" />
                <span>{{ photo.date }}</span>
              </span>
              <span v-if="photo.location" class="meta-item">
                <MapPin :size="15" />
                <span>{{ photo.location }}</span>
              </span>
            </div>

            <p v-if="photo.caption" class="photo-caption">{{ photo.caption }}</p>
          </figcaption>
        </figure>

        <section v-if="photo.html" v-content-links class="markdown-content" v-html="photo.html"></section>

        <footer v-if="photo.tags.length || photo.related" class="photo-links">
          <div v-if="photo.tags.length" class="tags-row">
            <span v-for="tag in photo.tags" :key="tag" class="badge">{{ tag }}</span>
          </div>

          <router-link v-if="photo.related" :to="photo.related.to" class="related-link surface-card interactive">
            <span class="related-label">{{ t('gallery_page.related') }}</span>
            <span class="related-title">{{ photo.related.title }}</span>
            <ArrowUpRight :size="18" class="related-icon" />
          </router-link>
        </footer>

        <nav v-if="adjacent.prev" class="photo-pagination" :aria-label="t('gallery_page.title')">
          <router-link :to="`/gallery/${adjacent.prev.id}`" class="pagination-card surface-card interactive">
            <span class="pagination-label">
              <ArrowLeft :size="14" />
              {{ t('gallery_page.prev') }}
            </span>
            <span class="pagination-title">{{ adjacent.prev.title }}</span>
          </router-link>
          <router-link :to="`/gallery/${adjacent.next.id}`" class="pagination-card next surface-card interactive">
            <span class="pagination-label">
              {{ t('gallery_page.next') }}
              <ArrowRight :size="14" />
            </span>
            <span class="pagination-title">{{ adjacent.next.title }}</span>
          </router-link>
        </nav>
      </article>

      <div v-else class="not-found-state surface-card">
        <h2>{{ t('gallery_page.not_found') }}</h2>
        <router-link to="/gallery" class="back-link">{{ t('gallery_page.back_to_gallery') }}</router-link>
      </div>
    </div>
  </main>
</template>

<style scoped>
.photo-page {
  min-height: 100vh;
  padding: 6rem var(--spacing-xl) var(--spacing-2xl) var(--spacing-xl);
}

.page-container {
  max-width: 1000px;
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

/* A mesma moldura de polaroid da grade, em tamanho de página */
.detail-polaroid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-md) var(--spacing-md) var(--spacing-lg);
  background-color: var(--bg-surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-card);
  margin-bottom: var(--spacing-xl);
}

.photo-frame {
  display: flex;
  justify-content: center;
  overflow: hidden;
  border-radius: 2px;
  background-color: var(--bg-surface-2);
}

.photo-frame.empty {
  aspect-ratio: 16 / 9;
}

/* A foto inteira, sem corte, no formato original */
.photo-img {
  max-width: 100%;
  max-height: 75vh;
  object-fit: contain;
}

.photo-placeholder {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  color: var(--text-muted);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background-image: repeating-linear-gradient(
    45deg,
    transparent 0 18px,
    var(--border-subtle) 18px 19px
  );
}

.detail-caption {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: 0 var(--spacing-xs);
}

.photo-title {
  font-family: var(--font-body);
  font-weight: 800;
  font-size: clamp(1.8rem, 4vw, 2.75rem);
  line-height: 1.15;
  letter-spacing: -0.5px;
  color: var(--text-primary);
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.photo-caption {
  font-size: var(--text-lg);
  line-height: 1.5;
  color: var(--text-secondary);
}

.markdown-content {
  font-size: var(--text-base);
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
}

.markdown-content :deep(p) {
  margin-bottom: var(--spacing-md);
}

.markdown-content :deep(strong) {
  color: var(--text-primary);
}

.photo-links {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.related-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  text-decoration: none;
}

.related-label {
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
}

.related-title {
  flex: 1;
  font-weight: 700;
  color: var(--text-primary);
}

.related-icon {
  color: var(--text-muted);
  transition: color var(--transition-fast);
}

.related-link:hover .related-title,
.related-link:hover .related-icon {
  color: var(--primary);
}

.photo-pagination {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
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
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 0.5px;
}

.pagination-title {
  font-weight: 700;
  color: var(--text-primary);
}

.pagination-card:hover .pagination-title {
  color: var(--primary);
}

.not-found-state {
  padding: var(--spacing-2xl);
  text-align: center;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .photo-page {
    padding: 5rem var(--spacing-md) var(--spacing-xl) var(--spacing-md);
  }

  .detail-polaroid {
    padding: var(--spacing-sm) var(--spacing-sm) var(--spacing-md);
  }

  .photo-pagination {
    grid-template-columns: 1fr;
  }

  .pagination-card.next {
    text-align: left;
    align-items: flex-start;
  }
}
</style>
