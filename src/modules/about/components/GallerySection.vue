<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Camera,
  Calendar,
  MapPin,
  Sparkles,
  ArrowUpRight,
  Image as ImageIcon
} from 'lucide-vue-next'

const { t, tm, rt } = useI18n()

const rawItems = computed(() => tm('about_page.s6_gallery.items') || [])

const galleryItems = computed(() => {
  return rawItems.value.map((item) => ({
    id: rt(item.id),
    title: rt(item.title),
    category: rt(item.category),
    date: rt(item.date),
    location: rt(item.location),
    caption: rt(item.caption),
    image: rt(item.image),
    format: rt(item.format) || 'square'
  }))
})
</script>

<template>
  <section class="gallery-section">
    <header class="section-header">
      <div class="header-titles">
        <span class="gallery-badge">
          <Camera :size="13" />
          <span>{{ t('about_page.s6_gallery.photo_badge') }}</span>
        </span>
        <h2 class="section-title">{{ t('about_page.s6_gallery.title') }}</h2>
        <p class="section-subtitle">{{ t('about_page.s6_gallery.subtitle') }}</p>
      </div>

      <router-link to="/gallery" class="view-gallery-btn">
        <Sparkles :size="14" />
        <span>{{ t('about_page.s6_gallery.view_full_gallery') }}</span>
        <ArrowUpRight :size="14" />
      </router-link>
    </header>

    <!-- Bento Grid (Opção 1: 3 Colunas x 2 Linhas) -->
    <div class="bento-grid">
      <div
        v-for="item in galleryItems"
        :key="item.id"
        class="bento-card surface-card"
        :class="`format-${item.format}`"
      >
        <!-- Container de Imagem / Placeholder -->
        <div class="image-wrapper">
          <img
            v-if="item.image"
            :src="item.image"
            :alt="item.title"
            loading="lazy"
            class="bento-img"
            @error="(e) => e.target.style.display = 'none'"
          />

          <!-- Fallback Visual Elegante quando não há imagem carregada -->
          <div class="placeholder-pattern" aria-hidden="true">
            <ImageIcon :size="36" class="placeholder-icon" />
            <span class="placeholder-label">{{ item.category }}</span>
          </div>

          <div class="gradient-overlay" aria-hidden="true"></div>
        </div>

        <!-- Conteúdo Textual Sobreposto -->
        <div class="card-content">
          <div class="card-meta">
            <span class="category-pill">{{ item.category }}</span>
            <span class="date-pill" v-if="item.date">
              <Calendar :size="11" />
              <span>{{ item.date }}</span>
            </span>
          </div>

          <div class="text-block">
            <h3 class="item-title">{{ item.title }}</h3>
            <p class="item-caption">{{ item.caption }}</p>
          </div>

          <div class="location-row" v-if="item.location">
            <MapPin :size="12" class="loc-icon" />
            <span>{{ item.location }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gallery-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  margin-top: var(--spacing-2xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--border-subtle);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.header-titles {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.gallery-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-heading);
  font-size: var(--text-xs);
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
}

.section-title {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.section-subtitle {
  font-size: var(--text-base);
  color: var(--text-secondary);
}

.view-gallery-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 1.15rem;
  border-radius: var(--radius-full);
  background-color: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.view-gallery-btn:hover {
  background-color: var(--primary);
  border-color: var(--primary);
  color: var(--text-on-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

/* Bento Grid */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 240px;
  gap: var(--spacing-md);
}

.bento-card {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  transition: transform var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.bento-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary-border);
  box-shadow: var(--shadow-card-hover);
}

/* Variações de Tamanho do Bento Box */
.format-portrait {
  grid-column: span 1;
  grid-row: span 2;
}

.format-landscape {
  grid-column: span 2;
  grid-row: span 1;
}

.format-square {
  grid-column: span 1;
  grid-row: span 1;
}

/* Imagem & Overlay */
.image-wrapper {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-color: var(--bg-surface-2);
}

.bento-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.bento-card:hover .bento-img {
  transform: scale(1.05);
}

.placeholder-pattern {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--text-muted);
  opacity: 0.35;
  background: radial-gradient(circle at center, var(--primary-subtle), transparent 70%);
}

.placeholder-icon {
  color: var(--primary);
}

.placeholder-label {
  font-family: var(--font-heading);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(8, 7, 17, 0.95) 0%, rgba(8, 7, 17, 0.45) 50%, rgba(8, 7, 17, 0.1) 100%);
  pointer-events: none;
}

/* Conteúdo Textual */
.card-content {
  position: relative;
  z-index: 2;
  height: 100%;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.category-pill {
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--primary);
  background-color: var(--bg-surface-elevated);
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--primary-border);
  backdrop-filter: blur(8px);
}

.date-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: var(--text-xs);
  color: var(--text-muted);
  background-color: rgba(8, 7, 17, 0.7);
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-full);
  backdrop-filter: blur(4px);
}

.text-block {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-top: auto;
}

.item-title {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--text-base);
  color: #ffffff;
  line-height: 1.3;
}

.format-portrait .item-title {
  font-size: var(--text-lg);
}

.item-caption {
  font-size: var(--text-xs);
  color: rgba(248, 250, 252, 0.8);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.location-row {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: var(--text-xs);
  color: rgba(248, 250, 252, 0.6);
  padding-top: var(--spacing-xs);
}

.loc-icon {
  color: var(--primary);
}

@media (max-width: 900px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 220px;
  }

  .format-portrait {
    grid-column: span 1;
    grid-row: span 2;
  }

  .format-landscape {
    grid-column: span 2;
    grid-row: span 1;
  }
}

@media (max-width: 600px) {
  .bento-grid {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
  }

  .format-portrait,
  .format-landscape,
  .format-square {
    grid-column: span 1;
    grid-row: span 1;
    min-height: 240px;
  }

  .card-content {
    padding: var(--spacing-md);
  }
}
</style>
