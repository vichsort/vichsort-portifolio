<script setup>
import { useNavigation } from '@/composables/useNavigation'

const { isNavOpen, closeNav } = useNavigation()

const menuItems = [
    { label: 'Início', path: '/' },
    { label: 'Sobre', path: '/overview' },
    { label: 'Projetos', path: '/projects' },
    { label: 'Pesquisas', path: '/researches' },
    { label: 'Certificações', path: '/certifications' },
    { label: 'Contato', path: '/contact' },
]
</script>

<template>
    <teleport to="body">
        <transition name="slide-right">
            <div v-if="isNavOpen" class="nav-overlay" @click.self="closeNav">

                <aside class="nav-panel">
                    <header class="nav-header">
                        <span class="nav-logo">MENU_</span>
                        <button @click="closeNav" class="close-btn" aria-label="Fechar Menu">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </header>

                    <nav class="nav-links">
                        <ul class="links-list">
                            <li v-for="(item, index) in menuItems" :key="item.path"
                                :style="{ '--delay': `${index * 0.1}s` }">
                                <router-link :to="item.path" class="nav-item">
                                    <span class="item-text">{{ item.label }}</span>
                                    <span class="item-decoration"></span>
                                </router-link>
                            </li>
                        </ul>
                    </nav>

                    <footer class="nav-footer">
                        <div class="social-mini">
                            <a href="#" target="_blank">GH</a>
                            <span class="separator">/</span>
                            <a href="#" target="_blank">LN</a>
                        </div>
                        <p class="copyright">© 2026 Vitor.</p>
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

.nav-panel {
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

.nav-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-xl);
}

.nav-logo {
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

.links-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.nav-item {
    position: relative;
    font-family: var(--font-heading);
    font-size: 2.5rem;
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
    position: relative;
    z-index: 2;
}

.nav-item::before {
    content: '<';
    position: absolute;
    right: -30px;
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
    right: -25px;
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

.nav-footer {
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

.social-mini a {
    font-weight: bold;
    transition: color 0.2s;
}

.social-mini a:hover {
    color: var(--primary);
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

.slide-right-enter-active .nav-panel {
    transition: transform 0.4s cubic-bezier(0.2, 1, 0.3, 1);
}

.slide-right-leave-active .nav-panel {
    transition: transform 0.3s ease-in;
}

.slide-right-enter-from .nav-panel,
.slide-right-leave-to .nav-panel {
    transform: translateX(100%);
}
</style>