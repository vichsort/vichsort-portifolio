<script setup>
import { useI18n } from 'vue-i18n'

defineProps({
    currentTheme: {
        type: String,
        default: 'dark'
    }
})

const { t } = useI18n()

const getAssetUrl = (name) => {
    return new URL(`../../assets/techs/${name}`, import.meta.url).href
}

const stack = [
    { name: 'Vue.js', icon: 'vuedotjs.svg' },
    { name: 'JavaScript', icon: 'javascript.svg' },
    { name: 'Python', icon: 'python.svg' },
    { name: 'React', icon: 'react.svg' },
    { name: 'TypeScript', icon: 'typescript.svg' },
    { name: 'Node.js', icon: 'nodedotjs.svg' },
    { name: 'AWS', icon: 'aws.svg' },
    { name: 'PostgreSQL', icon: 'postgresql.svg' },
    { name: 'Angular', icon: 'angular.svg' },
    { name: 'Flask', icon: 'flask.svg' },
    { name: 'Flutter', icon: 'flutter.svg' },
    { name: 'Git', icon: 'git.svg' },
    { name: 'MongoDB', icon: 'mongodb.svg' },
    { name: 'MySQL', icon: 'mysql.svg' },
    { name: 'PHP', icon: 'php.svg' },
    { name: 'Redis', icon: 'redis.svg' },
    { name: 'Sass', icon: 'sass.svg' },
    { name: 'SQLite', icon: 'sqlite.svg' },
    { name: 'Tailwind CSS', icon: 'tailwindcss.svg' },
    { name: 'Vite', icon: 'vite.svg' },
    { name: 'Railway', icon: 'railway.svg' },
    { name: 'ExpressJS', icon: 'express.svg' },
    { name: 'NeonDB', icon: 'neon.svg' },
    { name: 'Nginx', icon: 'nginx.svg' },
    { name: 'Raspberry PI', icon: 'raspberrypi.svg' },
]
</script>

<template>
    <section class="tech-section">
        <div class="content-wrapper">

            <div class="stack-introduction">
                <span class="small-label">{{ t('tech_stack.label') }}</span>
                <h2 class="main-title">TECH <span class="highlight">STACK</span></h2>
            </div>

            <div class="tech-grid">
                <div v-for="tech in stack" :key="tech.name" class="tech-item">
                    <div class="icon-wrapper">
                        <img :src="getAssetUrl(tech.icon)" :alt="tech.name" loading="lazy" class="tech-icon"
                            :class="{ 'inverted-icon': currentTheme === 'dark' }" />
                    </div>

                    <span class="tooltip">{{ tech.name }}</span>
                </div>
            </div>

        </div>
    </section>
</template>

<style scoped>
.tech-section {
    padding: var(--spacing-xl) 0;
    background-color: var(--background);
}

.content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-xl);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10rem;
}

.stack-introduction {
    flex: 1;
    max-width: 35%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    z-index: 10;
}

.small-label {
    font-family: var(--font-body);
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--text);
}

.main-title {
    font-family: var(--font-heading);
    font-size: clamp(3rem, 5vw, 6rem);
    line-height: 1;
    letter-spacing: -0.02em;
    margin-left: -5px;
    color: var(--text);
}

.highlight {
    color: var(--primary);
}

.highlight::selection {
    background-color: var(--text);
}

.stack-introduction::selection {
    background-color: var(--primary)
}

.tech-grid {
    flex: 1.5;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 1.5rem;
}

.tech-item {
    position: relative;
    width: 70px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: z-index 0s 0.3s;
}

.tech-item:hover {
    z-index: 10;
    transition: z-index 0s;
}

.icon-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.tech-icon {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: filter 0.3s ease, transform 0.3s ease;
    will-change: transform, filter;
    opacity: 0.7;
}

.tech-icon.inverted-icon {
    filter: invert(1);
    opacity: 0.8;
}

.tech-item:hover .tech-icon {
    opacity: 1;
    transform: scale(1.1);
}

.tech-item:hover .tech-icon.inverted-icon {
    filter: invert(1);
    opacity: 1;
}

.tooltip {
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    background-color: var(--primary);
    color: #fff;
    padding: 5px 10px;
    border-radius: 6px;
    font-family: var(--font-body);
    font-size: 1.2rem;
    font-weight: bold;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
    pointer-events: none;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.tooltip::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid var(--primary);
}

.tech-item:hover .tooltip {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
}

@media (max-width: 900px) {
    .content-wrapper {
        flex-direction: column;
        gap: 2rem;
        text-align: center;
    }

    .stack-introduction {
        max-width: 100%;
        align-items: center;
    }

    .tech-grid {
        justify-content: center;
    }
}
</style>