<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDraggableScroll } from '@/composables/useDraggableScroll'
import TestimonialCard from '@/components/ui/TestimonialCard.vue'

const { t, tm } = useI18n()
const { containerRef, startDrag, stopDrag, moveDrag } = useDraggableScroll()

const testimonials = computed(() => tm('testimonials_section.list'))
const scrollAmount = 432

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
        <button @click="scrollLeft" class="nav-btn" aria-label="Previous">
          &larr;
        </button>
        <button @click="scrollRight" class="nav-btn" aria-label="Next">
          &rarr;
        </button>
      </div>
    </div>

    <div class="carousel-track" ref="containerRef" @mousedown="startDrag" @mouseleave="stopDrag" @mouseup="stopDrag"
      @mousemove="moveDrag">
      <TestimonialCard v-for="item in testimonials" :key="item.id" :testimonial="item" />
    </div>
  </section>
</template>

<style scoped>
.testimonials-container {
  padding: var(--spacing-xl) 0;
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
  font-size: 1.5rem;
  color: var(--text);
  max-width: 600px;
}

.section-title::selection {
  background-color: var(--primary)
}

.controls-top {
  display: flex;
  gap: 1rem;
}

.nav-btn {
  background: transparent;
  border: 1px solid var(--primary);
  color: var(--primary);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.nav-btn:hover {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--background);
}

.carousel-track {
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  padding: 0 var(--spacing-xl) 2rem var(--spacing-xl);
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  cursor: grab;
}

.carousel-track.active {
  cursor: grabbing;
  scroll-snap-type: none;
  scroll-behavior: auto;
}

.carousel-track::-webkit-scrollbar {
  display: none;
}

@media (max-width: 768px) {
  .header-wrapper {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .controls-top {
    display: none;
  }

  .carousel-track {
    padding: 0 var(--spacing-md) 2rem var(--spacing-md);
  }
}
</style>