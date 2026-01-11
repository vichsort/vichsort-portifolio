<script setup>
import { ref, computed } from 'vue'
import { useScrollProgress } from '@/composables/useScrollProgress'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const containerRef = ref(null)
const { progress } = useScrollProgress(containerRef)

const slides = [
  {
    id: 1,
    textKey: 'about.slide1',
    hasAction: false
  },
  {
    id: 2,
    textKey: 'about.slide2',
    hasAction: true
  }
]

const currentSlideIndex = computed(() => {
  return progress.value < 0.5 ? 0 : 1
})

const currentSlide = computed(() => slides[currentSlideIndex.value])


const barHeight = computed(() => {
  return Math.max(10, Math.min(progress.value * 100, 100)) + '%'
})
</script>

<template>
  <section ref="containerRef" class="scroll-container">

    <div class="sticky-wrapper">

      <div class="content-left">

        <div class="progress-track">
          <div class="progress-fill" :style="{ height: barHeight }"></div>
        </div>

        <div class="text-area">
          <transition name="fade" mode="out-in">
            <div :key="currentSlide.id" class="slide-content">
              <p class="bio-text">
                {{ t(currentSlide.textKey) }}
              </p>

              <router-link v-if="currentSlide.hasAction" to="/gallery" class="action-btn">
                {{ t('about.button') }}
              </router-link>
            </div>
          </transition>
        </div>
      </div>

      <div class="content-right">
        <div class="title-group">
          <span class="small-label"> {{ t('about.small') }}</span>
          <h2 class="section-title"> {{ t('about.big') }}<span class="highlight"> {{ t('about.highlight') }}</span></h2>
        </div>

        <div class="decorative-circle"></div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.scroll-container {
  height: 250vh;
  position: relative;
}

.sticky-wrapper {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  display: flex;
  background-color: var(--background);
  overflow: hidden;
  padding: 0 var(--spacing-xl);
}

.content-left {
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
  padding-right: var(--spacing-lg);
}

.progress-track {
  width: 4px;
  height: 300px;
  background-color: rgba(255, 255, 255, 0.1);
  margin-right: var(--spacing-lg);
  position: relative;
  border-radius: 2px;
}

.progress-fill {
  width: 100%;
  background-color: var(--primary);
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 2px;
  transition: height 0.1s linear;
}

.text-area {
  max-width: 600px;
}

.bio-text {
  font-family: var(--font-body);
  font-size: 1.8rem;
  line-height: 1.4;
  color: var(--text);
  margin-bottom: var(--spacing-lg);
}

.title-group::selection, .bio-text::selection, .small-label::selection {
  background-color: var(--primary)
}

.action-btn {
  display: inline-block;
  background-color: var(--primary);
  color: #fff;
  padding: 0.5rem 4rem;
  border-radius: 50px;
  font-family: var(--font-body);
  font-size: 1.5rem;
  transition: transform 0.2s, background-color 0.2s;
}

.action-btn:hover {
  background-color: var(--accent);
  transform: scale(1.05);
}

.content-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  position: relative;
}

.title-group {
  text-align: right;
  z-index: 2;
  margin-bottom: 2rem;
}

.small-label {
  display: block;
  font-family: var(--font-body);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  opacity: 0.8;
}

.section-title {
  font-family: var(--font-heading);
  font-size: 5rem;
  line-height: 1;
  text-transform: uppercase;
}

.highlight {
  color: var(--primary);
}

.highlight::selection {
    background-color: var(--text);
}

.decorative-circle {
  width: 300px;
  height: 300px;
  background-color: var(--accent);
  border-radius: 50%;
  margin-right: 50px;
  box-shadow: 10px 10px 0px rgba(0, 0, 0, 0.2);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media (max-width: 768px) {
  .sticky-wrapper {
    flex-direction: column-reverse;
    padding: var(--spacing-md);
    justify-content: center;
  }

  .content-right {
    flex: 0;
    align-items: flex-start;
    margin-bottom: 2rem;
  }

  .decorative-circle {
    display: none;
  }

  .section-title {
    font-size: 3rem;
  }

  .progress-track {
    height: 150px;
  }
}
</style>