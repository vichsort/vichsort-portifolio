<script setup>
import { useI18n } from 'vue-i18n'

const props = defineProps({
    testimonial: { type: Object, required: true }
})

const { rt } = useI18n()
</script>

<template>
    <article class="testimonial-card">
        <div class="card-header">
            <h3 class="person-name">{{ rt(testimonial.name) }}</h3>
            <span class="person-role">{{ rt(testimonial.role) }}</span>
        </div>

        <div class="card-body">
            <p class="quote-text">"{{ rt(testimonial.text) }}"</p>
        </div>

        <div class="quote-icon">”</div>
    </article>
</template>

<style scoped>
.testimonial-card {
    min-width: 400px;
    width: 400px;
    flex-shrink: 0;
    background-color: var(--secondary);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 24px;
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    scroll-snap-align: center;
    transition: transform 0.3s ease, border-color 0.3s;
    user-select: none;
}

.testimonial-card:hover {
    border-color: var(--primary);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.card-header {
    margin-bottom: 2rem;
    text-align: center;
    position: relative;
    z-index: 2;
}

.person-name {
    font-family: var(--font-heading);
    font-size: 1.8rem;
    color: var(--text);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
}

.person-role {
    font-family: var(--font-body);
    color: var(--primary);
    font-weight: bold;
    font-size: 1.2rem;
    letter-spacing: 1px;
}

.card-body {
    position: relative;
    z-index: 2;
}

.quote-text {
    font-family: var(--font-body);
    font-size: 1.5rem;
    line-height: 1.2;
    color: var(--text);
    text-align: center;
    font-style: italic;
}

.quote-icon {
    position: absolute;
    bottom: -20px;
    right: 10px;
    font-family: serif;
    font-size: 10rem;
    color: rgba(255, 255, 255, 0.03);
    line-height: 1;
    pointer-events: none;
}

@media (max-width: 600px) {
    .testimonial-card {
        min-width: 85vw;
        width: 85vw;
    }
}
</style>