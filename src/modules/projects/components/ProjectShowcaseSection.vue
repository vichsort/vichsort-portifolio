<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDraggableScroll } from '@/shared/composables/useDraggableScroll'
import { useProjects } from '../composables/useProjects'
import ProjectCard from './ProjectCard.vue'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-vue-next'

const { t, locale } = useI18n()
const { loadAllProjects } = useProjects()
const { containerRef, isDragging, startDrag, stopDrag, moveDrag } = useDraggableScroll()

const projects = ref([])

const fetchProjects = async () => {
  projects.value = await loadAllProjects(locale.value)
}

onMounted(() => {
  fetchProjects()
})

watch(locale, () => {
  fetchProjects()
})

const scrollAmount = 880

const scrollLeft = () => {
  containerRef.value?.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
}
const scrollRight = () => {
  containerRef.value?.scrollBy({ left: scrollAmount, behavior: 'smooth' })
}
</script>

<template>
  <section class="showcase-container">
    <div class="header-wrapper">
      <h2 class="section-title">{{ t('projects_section.title') }}</h2>

      <div class="controls-top">
        <button
          @click="scrollLeft"
          class="nav-btn"
          aria-label="Projeto anterior"
        >
          <ChevronLeft :size="20" />
        </button>
        <button
          @click="scrollRight"
          class="nav-btn"
          aria-label="Próximo projeto"
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
      <ProjectCard
        v-for="(proj, index) in projects"
        :key="index"
        :project="proj"
        variant="carousel"
      />

      <router-link to="/projects" class="see-all-card surface-card">
        <span class="see-all-text">{{ t('projects_section.action_view_all') }}</span>
        <div class="see-all-icon">
          <ArrowRight :size="24" />
        </div>
      </router-link>
    </div>
  </section>
</template>

<style scoped>
.showcase-container {
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
  color: #ffffff;
  transform: scale(1.05);
}

.carousel-track {
  display: flex;
  gap: var(--spacing-lg);
  overflow-x: auto;
  padding: 0 max(var(--spacing-xl), calc((100vw - 1400px) / 2));
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

.see-all-card {
  width: 280px;
  flex-shrink: 0;
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  border: 1px dashed var(--border-medium);
  scroll-snap-align: center;
  padding: var(--spacing-lg);
  gap: var(--spacing-md);
  text-align: center;
}

.see-all-card:hover {
  border-style: solid;
  border-color: var(--primary-border);
  background-color: var(--bg-surface-2);
}

.see-all-text {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.see-all-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background-color: var(--primary-subtle);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition-fast), background-color var(--transition-fast), color var(--transition-fast);
}

.see-all-card:hover .see-all-icon {
  transform: translateX(4px);
  background-color: var(--primary);
  color: #ffffff;
}

@media (max-width: 900px) {
  .header-wrapper {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .controls-top {
    display: none;
  }

  .carousel-track {
    padding: 0 var(--spacing-md);
  }
}
</style>
