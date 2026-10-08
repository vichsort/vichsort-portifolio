<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDraggableScroll } from '@/shared/composables/useDraggableScroll'
import TestimonialCard from './TestimonialCard.vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const { t, tm } = useI18n()
const { containerRef, isDragging, startDrag, stopDrag, moveDrag } = useDraggableScroll()

const testimonials = computed(() => tm('testimonials_section.list'))
const scrollAmount = 400

const scrollLeft = () => {
  containerRef.value?.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
}
const scrollRight = () => {
  containerRef.value?.scrollBy({ left: scrollAmount, behavior: 'smooth' })
}
</script>

<template>
  <section class="testimonials-container">
    <div class="header-wrapper">
      <h2 class="section-title">{{ t('testimonials_section.title') }}</h2>

      <div class="controls-top">
        <button
          @click="scrollLeft"
          class="nav-btn"
          :aria-label="t('testimonials_section.prev')"
        >
          <ChevronLeft :size="20" />
        </button>
        <button
          @click="scrollRight"
          class="nav-btn"
          :aria-label="t('testimonials_section.next')"
        >
          <ChevronRight :size="20" />
        </button>
      </div>
    </div>

    <div
      class="carousel-track"
      :class="{ active: isDragging }"
      ref="containerRef"
      @mousedown="startDrag"
      @mouseleave="stopDrag"
      @mouseup="stopDrag"
      @mousemove="moveDrag"
      @touchstart="startDrag"
      @touchmove="moveDrag"
      @touchend="stopDrag"
    >
      <TestimonialCard
        v-for="item in testimonials"
        :key="item.id"
        :testimonial="item"
      />
    </div>
  </section>
</template>

<style scoped>
.testimonials-container {
  padding: var(--spacing-2xl) 0;
  width: 100%;
}

.header-wrapper {
  max-width: 1400px;
  margin: 0 auto var(--spacing-lg) auto;
  padding: 0 var(--spacing-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-secondary);
  max-width: 600px;
}

.controls-top {
  display: flex;
  gap: 0.75rem;
}

.nav-btn {
  background: var(--bg-surface-1);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  width: 42px;
  height: 42px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.nav-btn:hover {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--text-on-primary);
  transform: scale(1.05);
}

.carousel-track {
  display: flex;
  gap: var(--spacing-lg);
  overflow-x: auto;
  /* Respiro para a subida e a sombra do card no hover: com overflow-x: auto o
     eixo y também recorta. A margem negativa devolve o espaço ao layout. */
  padding: 1.5rem var(--spacing-xl) 3rem var(--spacing-xl);
  margin: -1.5rem 0 -2rem;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  cursor: grab;
}

.carousel-track.active {
  cursor: grabbing;
  scroll-snap-type: none;
}

.carousel-track::-webkit-scrollbar {
  display: none;
}

@media (max-width: 768px) {
  .header-wrapper {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .controls-top {
    display: none;
  }

  .carousel-track {
    padding: 1.5rem var(--spacing-md) 3rem var(--spacing-md);
  }
}
</style>
