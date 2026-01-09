<script setup>
import { useNavigation } from '@/composables/useNavigation'
import { useI18n } from 'vue-i18n'

const { isNavOpen, closeNav } = useNavigation()
const { t } = useI18n()

const menuItems = [
    { labelKey: 'nav.home', path: '/' },           // Antes era: label: 'Início'
    { labelKey: 'nav.about', path: '/overview' },  // Antes era: label: 'Sobre'
    { labelKey: 'nav.projects', path: '/projects' },
    { labelKey: 'nav.researches', path: '/researches' },
    { labelKey: 'nav.certifications', path: '/certifications' },
    { labelKey: 'nav.contact', path: '/contact' },
]
</script>

<template>
    <teleport to="body">
        <transition name="slide-right">
            <div v-if="isNavOpen" class="nav-overlay" @click.self="closeNav">

                <aside class="sidebar-panel">
                    <header class="sidebar-header">
                        <span class="sidebar-title">Menu</span>
                        <button @click="closeNav" class="close-btn" aria-label="Fechar Menu">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </header>

                    <nav class="sidebar-content">
                        <ul class="links-group">
                            <li v-for="(item, index) in menuItems" :key="item.path"
                                :style="{ '--delay': `${index * 0.1}s` }">
                                <router-link :to="item.path" class="nav-item">

                                    <span class="item-text">{{ t(item.labelKey) }}</span>

                                    <span class="item-decoration"></span>
                                </router-link>
                            </li>
                        </ul>
                    </nav>

                    <footer class="sidebar-footer">
                        <p class="copyright">© 2026 <a>NEAT</a> by Vitor.</p>
                    </footer>
                </aside>

            </div>
        </transition>
    </teleport>
</template>

<style scoped>
.nav-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 2000;
    display: flex;
    justify-content: flex-end;
}

.sidebar-panel {
    width: 100%;
    max-width: 400px;
    height: 100%;
    background-color: var(--background);
    border-left: 1px solid var(--secondary);
    display: flex;
    flex-direction: column;
    box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
    padding: var(--spacing-lg);
    position: relative;
    overflow: hidden;
}

.sidebar-header {
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-title {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    color: var(--primary);
    opacity: 0.8;
}

.close-btn {
    background: none;
    border: none;
    color: var(--text);
    cursor: pointer;
    transition: color 0.2s, transform 0.2s;
}

.close-btn:hover {
    color: var(--accent);
    transform: rotate(90deg);
}

.sidebar-content {
    padding: 1.5rem;
    flex: 1;
    overflow-y: auto;
}

.links-group {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.nav-item {
    position: relative;
    font-family: var(--font-heading);
    font-size: 1.8rem;
    color: var(--text);
    text-transform: uppercase;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    transition: color 0.3s;
    opacity: 0;
    animation: slideInItem 0.5s ease forwards;
    animation-delay: var(--delay);
}

.item-text {
    font-size: 1.2rem;
    position: relative;
    z-index: 2;
}

.nav-item::before {
    content: '<';
    position: absolute;
    right: -40px;
    left: auto;
    opacity: 0;
    color: var(--accent);
    transition: all 0.3s ease;
    transform: translateX(10px);
}

.nav-item:hover {
    color: var(--primary);
    padding-right: 10px;
    padding-left: 0;
}

.nav-item:hover::before {
    opacity: 1;
    transform: translateX(0);
    right: -35px;
}

.router-link-active {
    color: var(--accent);
}

.router-link-active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: var(--primary);
}

.sidebar-footer {
    margin-top: auto;
    border-top: 1px solid var(--secondary);
    padding-top: var(--spacing-md);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: var(--font-body);
    color: var(--text);
    opacity: 0.6;
}

.copyright a {
    font-weight: bold;
    color: var(--accent);
}

.separator {
    margin: 0 5px;
}

@keyframes slideInItem {
    from {
        opacity: 0;
        transform: translateX(20px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.slide-right-enter-active,
.slide-right-leave-active {
    transition: opacity 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
    opacity: 0;
}

.slide-right-enter-active .sidebar-panel {
    transition: transform 0.4s cubic-bezier(0.2, 1, 0.3, 1);
}

.slide-right-leave-active .sidebar-panel {
    transition: transform 0.3s ease-in;
}

.slide-right-enter-from .sidebar-panel,
.slide-right-leave-to .sidebar-panel {
    transform: translateX(100%);
}
</style>