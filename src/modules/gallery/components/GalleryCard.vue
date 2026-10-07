<script setup>
import { computed } from 'vue'
import { Image as ImageIcon } from 'lucide-vue-next'
import UntranslatedNote from '@/shared/components/ui/UntranslatedNote.vue'

const props = defineProps({
  photo: { type: Object, required: true },
  // 'md' | 'lg' | 'xl': 3, 2 ou 1 foto por linha
  size: { type: String, default: 'md' }
})

const meta = computed(() => [props.photo.date, props.photo.location].filter(Boolean).join(' · '))
</script>

<template>
  <router-link :to="`/gallery/${photo.id}`" class="polaroid" :class="`size-${size}`">
    <div class="photo-frame">
      <img
        v-if="photo.image"
        :src="photo.image"
        :alt="photo.title"
        loading="lazy"
        class="photo-img"
      />
      <div v-else class="photo-placeholder" aria-hidden="true">
        <ImageIcon :size="size === 'md' ? 32 : 44" />
        <span v-if="photo.category">{{ photo.category }}</span>
      </div>
    </div>

    <div class="polaroid-caption">
      <h2 class="photo-title">{{ photo.title }}</h2>
      <UntranslatedNote :lang="photo.fallback" />
      <p v-if="meta" class="photo-meta">{{ meta }}</p>
      <p v-if="photo.caption" class="photo-caption">{{ photo.caption }}</p>
    </div>
  </router-link>
</template>

<style scoped>
/* Moldura de polaroid: borda fina em volta da foto e mais espaço embaixo, para a legenda */
.polaroid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-sm) var(--spacing-md);
  background-color: var(--bg-surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-card);
  color: inherit;
  text-decoration: none;
  transition: transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base);
}

/* Inclinação leve ao passar o mouse, alternando o lado como fotos soltas numa mesa */
.polaroid:hover {
  transform: translateY(-4px) rotate(-0.6deg);
  box-shadow: var(--shadow-card-hover);
  border-color: var(--border-accent);
}

.polaroid:nth-child(even):hover {
  transform: translateY(-4px) rotate(0.6deg);
}

.polaroid:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 3px;
}

.photo-frame {
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 2px;
  background-color: var(--bg-surface-2);
}

/* Uma por linha: foto retangular */
.size-xl .photo-frame {
  aspect-ratio: 16 / 9;
}

.photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  color: var(--text-muted);
  font-size: var(--text-xs);
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background-image: repeating-linear-gradient(
    45deg,
    transparent 0 14px,
    var(--border-subtle) 14px 15px
  );
}

.polaroid-caption {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0 var(--spacing-xs);
}

.photo-title {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 700;
  line-height: 1.3;
  color: var(--text-primary);
}

.size-lg .photo-title {
  font-size: var(--text-lg);
}

.size-xl .photo-title {
  font-size: var(--text-xl);
}

.photo-meta {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.photo-caption {
  font-size: var(--text-sm);
  line-height: 1.5;
  color: var(--text-secondary);
}

/* Foto pequena (duas por linha no celular): sem o nome da categoria no placeholder */
@media (max-width: 640px) {
  .size-md .photo-placeholder span {
    display: none;
  }
}

/* Três por linha: legenda curta, em até duas linhas */
.size-md .photo-caption {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.size-xl .photo-caption {
  font-size: var(--text-base);
}
</style>
