<script setup>
import { ref, computed } from 'vue'
import { useScrollProgress } from '@/shared/composables/useScrollProgress'
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
        <div class="progress-track" aria-hidden="true">
          <div class="progress-fill" :style="{ height: barHeight }"></div>
        </div>

        <div class="text-area">
          <transition name="fade" mode="out-in">
            <div :key="currentSlide.id" class="slide-content">
              <p class="bio-text">
                {{ t(currentSlide.textKey) }}
              </p>

              <router-link
                v-if="currentSlide.hasAction"
                to="/gallery"
                class="action-btn"
              >
                {{ t('about.button') }} &rarr;
              </router-link>
            </div>
          </transition>
        </div>
      </div>

      <div class="content-right">
        <div class="title-group">
          <span class="small-label">{{ t('about.small') }}</span>
          <h2 class="section-title">
            {{ t('about.big') }}<span class="highlight">{{ t('about.highlight') }}</span>
          </h2>
        </div>

        <div class="decorative-circle" aria-hidden="true"></div>
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
  background-color: var(--bg-canvas);
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
  height: 260px;
  background-color: var(--border-subtle);
  margin-right: var(--spacing-lg);
  position: relative;
  border-radius: var(--radius-full);
}

.progress-fill {
  width: 100%;
  background-color: var(--primary);
  position: absolute;
  top: 0;
  left: 0;
  border-radius: var(--radius-full);
  box-shadow: 0 0 10px var(--primary);
  transition: height 0.1s linear;
}

.text-area {
  max-width: 580px;
}

.bio-text {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--primary);
  color: var(--text-on-primary);
  padding: 0.75rem 2.5rem;
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-glow);
}

.action-btn:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
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
  margin-bottom: var(--spacing-lg);
}

.small-label {
  display: block;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: var(--spacing-xs);
}

.section-title {
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  line-height: 1;
  text-transform: uppercase;
  color: var(--text-primary);
}

.highlight {
  color: var(--primary);
}

.decorative-circle {
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, var(--accent) 0%, var(--accent-hover) 100%);
  border-radius: 50%;
  margin-right: 40px;
  box-shadow: 0 20px 50px var(--accent-glow);
  opacity: 0.85;
  /* Durações primas entre si: os ciclos quase nunca se alinham e o movimento não parece repetir */
  animation:
    circle-drift 9s ease-in-out infinite,
    circle-breathe 7s ease-in-out infinite;
}

@keyframes circle-drift {
  0%, 100% { translate: 0 0; }
  25% { translate: 6px -14px; }
  50% { translate: -4px -22px; }
  75% { translate: -8px -8px; }
}

@keyframes circle-breathe {
  0%, 100% { scale: 1; box-shadow: 0 20px 50px var(--accent-glow); }
  50% { scale: 1.04; box-shadow: 0 32px 70px var(--accent-glow); }
}

@media (prefers-reduced-motion: reduce) {
  .decorative-circle {
    animation: none;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-15px);
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
    margin-bottom: var(--spacing-md);
  }

  .title-group {
    text-align: left;
  }

  .decorative-circle {
    display: none;
  }

  .section-title {
    font-size: 2.5rem;
  }

  .progress-track {
    height: 120px;
  }
}
</style>
