<script setup>
import { useSettings } from '@/composables/useSettings'
import { useTheme } from '@/composables/useTheme'

const {
    isSidebarOpen,
    closeSidebar,
    currentLang,
    setLanguage,
    areAnimationsEnabled,
    toggleAnimations,
    changeFontSize,
    fontSizeLevel
} = useSettings()

const { theme, toggleTheme } = useTheme()

const languages = [
    { code: 'pt', label: 'Português', flag: '🇧🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
]
</script>

<template>
    <teleport to="body">
        <transition name="slide-fade">
            <div v-if="isSidebarOpen" class="sidebar-overlay" @click.self="closeSidebar">

                <aside class="sidebar-panel">
                    <header class="sidebar-header">
                        <h3 class="sidebar-title">Configurações</h3>
                        <button @click="closeSidebar" class="close-btn" aria-label="Fechar Menu">
                            &times;
                        </button>
                    </header>

                    <div class="sidebar-content">

                        <div class="setting-group">
                            <label class="group-label">Aparência</label>
                            <button @click="toggleTheme" class="theme-toggle-btn" :class="theme">
                                <div class="theme-icon">
                                    <svg v-if="theme === 'light'" xmlns="http://www.w3.org/2000/svg" width="20"
                                        height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="5" />
                                        <path d="M12 1v2" />
                                        <path d="M12 21v2" />
                                        <path d="M4.22 4.22l1.42 1.42" />
                                        <path d="M18.36 18.36l1.42 1.42" />
                                        <path d="M1 12h2" />
                                        <path d="M21 12h2" />
                                        <path d="M4.22 19.78l1.42-1.42" />
                                        <path d="M18.36 5.64l1.42-1.42" />
                                    </svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                    </svg>
                                </div>
                                <span>{{ theme === 'dark' ? 'Modo Escuro' : 'Modo Claro' }}</span>
                            </button>
                        </div>

                        <hr class="divider">

                        <div class="setting-group">
                            <label class="group-label">Idioma</label>
                            <div class="lang-grid">
                                <button v-for="lang in languages" :key="lang.code" @click="setLanguage(lang.code)"
                                    class="lang-btn" :class="{ active: currentLang === lang.code }">
                                    <span class="flag">{{ lang.flag }}</span>
                                    <span class="lang-name">{{ lang.label }}</span>
                                </button>
                            </div>
                        </div>

                        <hr class="divider">

                        <div class="setting-group">
                            <label class="group-label">Acessibilidade</label>

                            <div class="control-row">
                                <span>Tamanho da Fonte</span>
                                <div class="stepper">
                                    <button @click="changeFontSize('down')" :disabled="fontSizeLevel <= -1">-</button>
                                    <span class="stepper-value">{{ fontSizeLevel > 0 ? '+' : '' }}{{ fontSizeLevel
                                        }}</span>
                                    <button @click="changeFontSize('up')" :disabled="fontSizeLevel >= 3">+</button>
                                </div>
                            </div>

                            <div class="control-row">
                                <span>Animações</span>
                                <button @click="toggleAnimations" class="toggle-btn"
                                    :class="{ active: areAnimationsEnabled }">
                                    {{ areAnimationsEnabled ? 'ON' : 'OFF' }}
                                </button>
                            </div>
                        </div>

                    </div>

                    <footer class="sidebar-footer">
                        <p>v1.0.0 • Portfólio Inteligente</p>
                    </footer>
                </aside>

            </div>
        </transition>
    </teleport>
</template>

<style scoped>
.sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    justify-content: flex-end;
}

.sidebar-panel {
    width: 100%;
    max-width: 350px;
    height: 100%;
    background-color: var(--background);
    border-left: 1px solid var(--secondary);
    display: flex;
    flex-direction: column;
    box-shadow: -5px 0 30px rgba(0, 0, 0, 0.3);
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
    font-size: 2rem;
    color: var(--primary);
}

.close-btn {
    background: none;
    border: none;
    font-size: 2.5rem;
    line-height: 1;
    color: var(--text);
    cursor: pointer;
}

.sidebar-content {
    padding: 1.5rem;
    flex: 1;
    overflow-y: auto;
}

.setting-group {
    margin-bottom: 2rem;
}

.group-label {
    display: block;
    font-family: var(--font-body);
    font-weight: bold;
    opacity: 0.7;
    margin-bottom: 1rem;
    font-size: 1.2rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.divider {
    border: 0;
    height: 1px;
    background: var(--secondary);
    margin: 0 0 2rem 0;
    opacity: 0.3;
}

.theme-toggle-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: 8px;
    background-color: var(--secondary);
    color: var(--text);
    border: 2px solid transparent;
    cursor: pointer;
    font-family: var(--font-body);
    font-size: 1.2rem;
    transition: all 0.2s;
}

.theme-toggle-btn:hover {
    border-color: var(--primary);
    background-color: var(--background);
}

.theme-toggle-btn.dark .theme-icon {
    color: var(--accent);
}

.lang-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.lang-btn {
    background: var(--secondary);
    border: 2px solid transparent;
    color: var(--text);
    padding: 0.8rem;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    transition: all 0.2s;
}

.lang-btn:hover {
    border-color: var(--primary);
}

.lang-btn.active {
    background: var(--primary);
    color: #fff;
    border-color: var(--accent);
}

.flag {
    font-size: 1.5rem;
}

.lang-name {
    font-size: 1rem;
    font-family: var(--font-body);
}

.control-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    font-family: var(--font-body);
    font-size: 1.4rem;
}

.stepper {
    display: flex;
    align-items: center;
    background: var(--secondary);
    border-radius: 20px;
    overflow: hidden;
}

.stepper button {
    background: none;
    border: none;
    color: var(--text);
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 1.2rem;
}

.stepper button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.stepper-value {
    min-width: 30px;
    text-align: center;
    font-weight: bold;
}

.toggle-btn {
    background: var(--secondary);
    color: var(--text);
    border: none;
    padding: 0.5rem 1.5rem;
    border-radius: 20px;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.3s;
}

.toggle-btn.active {
    background: var(--primary);
    color: white;
}

.sidebar-footer {
    padding: 1rem;
    text-align: center;
    font-size: 0.9rem;
    opacity: 0.5;
    font-family: var(--font-body);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: opacity 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    opacity: 0;
}

.slide-fade-enter-active .sidebar-panel {
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-fade-leave-active .sidebar-panel {
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-fade-enter-from .sidebar-panel,
.slide-fade-leave-to .sidebar-panel {
    transform: translateX(100%);
}
</style>