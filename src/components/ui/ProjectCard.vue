<script setup>
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import { useI18n } from 'vue-i18n'

const props = defineProps({
    project: { type: Object, required: true }
})

const { t, rt } = useI18n()
const md = new MarkdownIt({ html: true, breaks: true })

const renderedDescription = computed(() => {
    return md.render(rt(props.project.short_description))
})
</script>

<template>
    <article class="project-card">
        <div class="card-image-wrapper">
            <div v-if="!project.image" class="placeholder-bg">
            </div>
        </div>

        <div class="card-body">
            <main>
                <div class="card-header">
                    <div class="meta-top">
                        <span class="project-tags">{{ rt(project.tags) }}</span>
                        <span class="project-date">{{ rt(project.date) }}</span>
                    </div>
                    <h3 class="project-name">{{ rt(project.name) }}</h3>
                </div>

                <div class="project-content markdown-body" v-html="renderedDescription"></div>
            </main>


            <div class="card-footer">
                <div class="external-links">
                    <a v-if="project.link_github" :href="project.link_github" target="_blank" class="icon-btn"
                        aria-label="GitHub">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path
                                d="M15 22v-4a4.8 5 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0 3 1.5-2.64-.5-5.36.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                            <path d="M9 18c-4.51 2-5-2-7-2" />
                        </svg>
                    </a>
                    <a v-if="project.link_live" :href="project.link_live" target="_blank" class="icon-btn"
                        aria-label="Live">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                    </a>
                </div>

                <router-link :to="`/projects/${project.id}`" class="view-more-btn">
                    {{ t('projects_section.card.view_more') }}
                </router-link>
            </div>
        </div>
    </article>
</template>

<style scoped>
.project-card {
    width: 900px;
    max-width: 90vw;
    flex-shrink: 0;
    background-color: var(--secondary);
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
    display: flex;
    flex-direction: row;
    scroll-snap-align: center;
    transition: transform 0.3s ease, border-color 0.3s;
    user-select: none;
}

.project-card:hover {
    border-color: var(--primary);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.card-image-wrapper {
    width: 45%;
    min-height: 350px;
    background-color: var(--accent);
    position: relative;
}

.card-body {
    width: 55%;
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.meta-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
    opacity: 0.7;
}

.project-name {
    font-family: var(--font-heading);
    font-size: 2.5rem;
    color: var(--text);
    text-transform: uppercase;
    margin-bottom: 1.5rem;
    line-height: 1;
}

.project-tags {
    color: var(--primary);
    font-weight: bold;
}

.project-date {
    font-style: italic;
    color: var(--primary)
}

.project-content {
    font-size: 1.5rem;
    line-height: 1.2;
    color: var(--text);
    margin-bottom: 2rem;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.external-links {
    display: flex;
    gap: 1rem;
}

.icon-btn {
    color: var(--text);
    opacity: 0.5;
    transition: all 0.2s;
}

.icon-btn:hover {
    opacity: 1;
    color: var(--primary);
    transform: translateY(-2px);
}

.view-more-btn {
    padding: 0.5rem 2.2rem;
    border: 1px solid var(--accent);
    border-radius: 30px;
    color: var(--accent);
    text-decoration: none;
    font-weight: bold;
    font-size: 1.2rem;
    transition: all 0.3s;
}

.view-more-btn:hover {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--background);
}

@media (max-width: 900px) {
    .project-card {
        flex-direction: column;
        width: 85vw;
    }

    .card-image-wrapper {
        width: 100%;
        height: 200px;
        min-height: auto;
    }

    .card-body {
        width: 100%;
        padding: 1.5rem;
    }

    .project-name {
        font-size: 1.8rem;
    }
}
</style>