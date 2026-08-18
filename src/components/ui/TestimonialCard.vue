<script setup>
import { useI18n } from 'vue-i18n'
import { Quote } from 'lucide-vue-next'

const props = defineProps({
  testimonial: { type: Object, required: true }
})

const { rt } = useI18n()
</script>

<template>
  <article class="testimonial-card surface-card">
    <div class="card-header">
      <h3 class="person-name">{{ rt(testimonial.name) }}</h3>
      <span class="person-role badge">{{ rt(testimonial.role) }}</span>
    </div>

    <div class="card-body">
      <p class="quote-text">“{{ rt(testimonial.text) }}”</p>
    </div>

    <div class="quote-watermark" aria-hidden="true">
      <Quote :size="72" />
    </div>
  </article>
</template>

<style scoped>
.testimonial-card {
  min-width: 380px;
  width: 380px;
  flex-shrink: 0;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  scroll-snap-align: center;
  user-select: none;
}

.card-header {
  margin-bottom: var(--spacing-md);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
  position: relative;
  z-index: 2;
}

.person-name {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  color: var(--text-primary);
  letter-spacing: -0.5px;
  text-transform: uppercase;
}

.person-role {
  align-self: flex-start;
}

.card-body {
  position: relative;
  z-index: 2;
  margin-top: 0.5rem;
}

.quote-text {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: 1.6;
  color: var(--text-secondary);
  font-style: italic;
}

.quote-watermark {
  position: absolute;
  bottom: -10px;
  right: 10px;
  color: var(--text-primary);
  opacity: 0.04;
  pointer-events: none;
}

@media (max-width: 600px) {
  .testimonial-card {
    min-width: 85vw;
    width: 85vw;
    padding: var(--spacing-md);
  }
}
</style>