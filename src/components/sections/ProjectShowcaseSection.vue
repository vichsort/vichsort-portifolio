<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDraggableScroll } from '@/composables/useDraggableScroll'
import ProjectCard from '@/components/ui/ProjectCard.vue'

const { t, tm } = useI18n()
const { containerRef, startDrag, stopDrag, moveDrag } = useDraggableScroll()
const projects = computed(() => tm('projects_section.list'))

const scrollAmount = 932

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
            <ProjectCard v-for="(proj, index) in projects" :key="index" :project="proj" />

            <router-link to="/projects" class="see-all-card">
                <span class="see-all-text">{{ t('projects_section.action_view_all') }}</span>
                <span class="arrow-icon">&rarr;</span>
            </router-link>

        </div>
    </section>
</template>

<style scoped>
.showcase-container {
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
    opacity: 0.8;
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
    padding: 0 calc(50vw - 450px);

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
    width: 300px;
    flex-shrink: 0;
    background-color: var(--secondary);
    border-radius: 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    color: var(--text);
    border: 1px dashed rgba(255, 255, 255, 0.2);
    transition: all 0.3s;
    scroll-snap-align: center;
}

.see-all-card:hover {
    background-color: var(--primary);
    color: #fff;
    border-style: solid;
}

.see-all-text {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 1rem;
}

@media (max-width: 900px) {
    .header-wrapper {
        flex-direction: column;
        gap: 1rem;
    }

    .controls-top {
        display: none;
    }

    .carousel-track {
        padding: 0 var(--spacing-md);
        scroll-padding-left: var(--spacing-md);
    }
}
</style>