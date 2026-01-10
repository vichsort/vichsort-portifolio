<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

/*
  Configuração dos Cards:
  - value: O número de destaque (fixo).
  - unit: Opcional (ex: '+', '%').
  - labelKey: Chave de tradução do título.
  - route: Para onde o clique leva.
  - gridClass: Tamanho no grid (span-7, span-3, etc).
  - themeClass: Cor do card (definida no CSS abaixo).
*/
const statsCards = [
  {
    id: 'projects',
    value: '20',
    unit: '',
    labelKey: 'leads.stats.projects',
    route: '/projects',
    gridClass: 'span-7',
    themeClass: 'card-primary' 
  },
  {
    id: 'experience',
    value: '3',
    unit: '+',
    labelKey: 'leads.stats.experience',
    route: '/overview',
    gridClass: 'span-3',
    themeClass: 'card-secondary'
  },
  {
    id: 'researches',
    value: '5',
    unit: '',
    labelKey: 'leads.stats.researches',
    route: '/researches',
    gridClass: 'span-5',
    themeClass: 'card-dark'
  },
  {
    id: 'certs',
    value: '12',
    unit: '',
    labelKey: 'leads.stats.certs',
    route: '/certifications',
    gridClass: 'span-5',
    themeClass: 'card-accent'
  }
]
</script>

<template>
  <section class="leads-container">
    <div class="grid-wrapper">
      
      <router-link 
        v-for="card in statsCards" 
        :key="card.id"
        :to="card.route"
        class="stat-card"
        :class="[card.gridClass, card.themeClass]"
      >
        <div class="card-inner">
          <div class="stat-header">
            <span class="stat-value">
              {{ card.value }}<span class="stat-unit" v-if="card.unit">{{ card.unit }}</span>
            </span>
            
            <span class="arrow-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </span>
          </div>

          <div class="stat-footer">
            <h3 class="stat-label">{{ t(card.labelKey) }}</h3>
            <span class="hover-label">{{ t('leads.action') }}</span>
          </div>
        </div>

        <div class="pixel-deco"></div>
      </router-link>

    </div>
  </section>
</template>

<style scoped>
.leads-container {
  padding: var(--spacing-xl);
  width: 100%;
}

.grid-wrapper {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: var(--spacing-md);
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

/* --- Grid Spans --- */
.span-7 { grid-column: span 7; }
.span-3 { grid-column: span 3; }
.span-5 { grid-column: span 5; }

/* --- Estilo Base do Card --- */
.stat-card {
  border-radius: 16px;
  padding: var(--spacing-lg);
  position: relative;
  text-decoration: none;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  min-height: 280px; /* Altura generosa */
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow: 0 15px 35px rgba(0,0,0,0.2);
  z-index: 2;
}

.card-inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

/* --- Temas de Cores (Themes) --- */

/* Primary: Azulão (Projetos) */
.card-primary {
  background-color: var(--primary);
  color: #fff;
}

/* Secondary: Fundo claro/escuro dependendo do tema (Experience) */
.card-secondary {
  background-color: var(--secondary);
  color: var(--text);
  border: 1px solid rgba(128,128,128, 0.2);
}

/* Accent: Roxo vibrante (Certs) */
.card-accent {
  background-color: var(--accent);
  color: #fff;
}

/* Dark: Quase preto (Researches) */
.card-dark {
  background-color: #1a1a1a; /* Cor fixa ou var(--text) invertido */
  color: #fff;
}
/* Ajuste se estiver no tema light, talvez queira inverter */
:root[data-theme="light"] .card-dark {
  background-color: #000;
  color: #fff;
}

/* --- Tipografia e Layout Interno --- */
.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.stat-value {
  font-family: var(--font-heading);
  font-size: clamp(4rem, 6vw, 6rem);
  line-height: 0.9;
}

.stat-unit {
  font-size: 0.5em;
  opacity: 0.8;
  vertical-align: super;
}

.arrow-icon {
  opacity: 0.6;
  transition: transform 0.3s, opacity 0.3s;
}

.stat-card:hover .arrow-icon {
  opacity: 1;
  transform: translate(5px, -5px);
}

.stat-footer {
  margin-top: auto;
}

.stat-label {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  font-weight: bold;
  letter-spacing: -0.5px;
  margin: 0;
}

.hover-label {
  font-family: var(--font-body);
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 10px;
  display: block;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.stat-card:hover .hover-label {
  opacity: 1;
  transform: translateY(0);
}

.pixel-deco {
  position: absolute;
  bottom: -20px;
  right: -20px;
  width: 100px;
  height: 100px;
  background-image: radial-gradient(circle, rgba(255,255,255,0.1) 2px, transparent 2.5px);
  background-size: 10px 10px;
  opacity: 0.5;
  pointer-events: none;
}

@media (max-width: 900px) {
  .grid-wrapper {
    display: flex;
    flex-direction: column;
  }

  .stat-card {
    min-height: 200px;
    width: 100%;
  }

  .stat-value {
    font-size: 4rem;
  }
}
</style>