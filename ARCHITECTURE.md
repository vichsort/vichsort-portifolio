# Arquitetura do Projeto — vichsort-portifolio

Este documento detalha os princípios arquiteturais, a organização de diretórios e o fluxo de dados da aplicação **vichsort-portifolio**, estruturada sob o paradigma de **Arquitetura Modular Orientada a Domínios (Domain-Driven Modular Architecture)** em **Vue 3 + Vite**.

---

## 1. Visão Geral & Princípios Norteadores

A arquitetura foi desenhada para resolver os problemas de escalabilidade, coesão e acoplamento comuns em SPAs crescentes:

1. **Separação por Camadas e Domínios**:
   - **`core/`**: Infraestrutura transversal, configuração de roteamento, motor de tradução e design tokens.
   - **`shared/`**: Componentes de layout e composables utilitários agnósticos de domínio de negócio.
   - **`modules/`**: Módulos de domínio independentes e auto-suficientes contendo suas próprias views, componentes, composables, conteúdos Markdown e arquivos de tradução (`locales/`).
2. **SPA Multi-Route com Code Splitting**:
   - Roteamento nativo via `vue-router` com carregamento sob demanda (*lazy-loading*) por rota.
   - Transições de página suaves preservando o estado global (tema, configurações e acessibilidade).
3. **Locales Descentralizados com Deep Merge Automático**:
   - Dicionários i18n residem no próprio módulo que os consome. O motor central compila e mescla automaticamente todos os arquivos `locales/*.json` sem necessidade de registro manual.
4. **CSS Tokens-First Fatiado**:
   - Estilos globais divididos por responsabilidade única (`tokens`, `fonts`, `reset`, `utilities`).
   - Componentes utilizam estritamente `<style scoped>` consumindo as variáveis dos tokens.

---

## 2. Mapa Estrutural do Código (`src/`)

```
src/
├── App.vue                         # Shell principal da aplicação (Layout, Modais, RouterView)
├── main.js                         # Entry point e bootstrap dos plugins (Router, i18n, Tokens)
│
├── assets/                         # Assets estáticos binários
│   ├── fonts/                      # Fontes locais (Arcade Gamer, Montserrat)
│   └── techs/                      # SVGs monocromáticos do Simple Icons
│
├── core/                           # Camada de Infraestrutura & Fundamentos
│   ├── i18n/                       # Configuração central do Vue-i18n
│   │   ├── index.js                # Auto-merger de dicionários (import.meta.glob)
│   │   └── locales/                # Dicionários GLOBAIS (nav, settings, common)
│   │       ├── pt.json
│   │       └── en.json
│   ├── router/                     # Roteamento central da aplicação
│   │   └── index.js                # Rotas dinâmicas ativas + hooks de navegação
│   ├── styles/                     # Design System Fatiado (ITCSS / Tokens-First)
│   │   ├── fonts.css               # @font-face e swap de fontes
│   │   ├── tokens.css              # Custom properties (:root, dark/light themes)
│   │   ├── reset.css               # CSS Reset e base
│   │   ├── utilities.css           # .surface-card, .glass-panel, .badge, reduce-motion
│   │   └── index.css               # Agregador de estilos
│   └── utils/                      # Utilitários puros
│       └── markdown.js             # Singleton Markdown-it + parser Frontmatter
│
├── shared/                         # Elementos Reutilizáveis Globais
│   ├── components/
│   │   └── layout/                 # TheNavbar, SettingsSidebar, NavigationSidebar
│   └── composables/                # Composables de infraestrutura & UI
│       ├── useTheme.js             # Gestão de tema claro/escuro via VueUse
│       ├── useSettings.js          # Acessibilidade, idioma e persistência
│       ├── useNavigation.js        # Estado do menu lateral
│       ├── useSmartScroll.js       # Detecção de scroll para navbar (com rAF)
│       ├── useDraggableScroll.js   # Drag & Touch para carrosséis
│       └── useScrollProgress.js    # Progresso de leitura de seções
│
└── modules/                        # Módulos de Domínio (Auto-contidos)
    ├── home/                       # Landing Page Principal
    │   ├── views/HomeView.vue
    │   ├── components/             # HeroSection, AboutSection, LeadsSection, TechStackSection
    │   └── locales/                # Traduções específicas da Home (pt.json, en.json)
    │
    ├── projects/                   # Domínio de Projetos & Portfólio
    │   ├── views/
    │   │   ├── ProjectsListView.vue      # Listagem completa com filtros e busca
    │   │   └── ProjectDetailView.vue     # Página dinâmica (/projects/:slug)
    │   ├── components/             # ProjectCard, ProjectShowcaseSection
    │   ├── composables/            # useProjects.js (carregador com cache em memória)
    │   ├── content/                # Arquivos Markdown com YAML Front-matter (.md)
    │   └── locales/                # Traduções de projetos (pt.json, en.json)
    │
    ├── about/                      # Domínio Sobre Mim & Trajetória
    │   ├── views/OverviewView.vue  # Página detalhada (/overview)
    │   └── locales/
    │
    ├── testimonials/               # Domínio de Depoimentos & Feedback
    │   ├── components/             # TestimonialsSection, TestimonialCard
    │   └── locales/
    │
    ├── researches/                 # Domínio de Pesquisas & Artigos
    │   ├── views/ResearchesView.vue# Página (/researches)
    │   └── locales/
    │
    ├── certifications/             # Domínio de Certificações & Cursos
    │   ├── views/CertificationsView.vue # Página (/certifications)
    │   └── locales/
    │
    └── contact/                    # Domínio de Contato & Redes
        ├── views/ContactView.vue   # Página (/contact)
        └── locales/
```

---

## 3. Fluxo de Dados & Integração

### A. Carregamento Automático de Locales (i18n)
O arquivo [`src/core/i18n/index.js`](file:///home/vitor/projects/vichsort-portifolio/src/core/i18n/index.js) utiliza `import.meta.glob` para escanear `src/core/i18n/locales/*.json` e todos os `src/modules/**/locales/*.json`.
Em tempo de build e execução, ele executa um algoritmo recursivo de *Deep Merge*, agrupando automaticamente todas as chaves nos namespaces de idioma (`pt` e `en`).

### B. Gestão de Conteúdo de Projetos (Markdown + Frontmatter)
Os projetos residem em `src/modules/projects/content/*.md`. Cada arquivo possui cabeçalho YAML Front-matter:
```markdown
---
id: plante
title: PlantE — Gestão Agrícola Inteligente
date: Dezembro, 2024
tags: [App, Vue, API, Gemini AI]
image: /images/plante-cover.jpg
github: https://github.com/vitor/plante
live: https://plante.app
summary: Um ecossistema completo para monitoramento com IA.
---
## Conteúdo em Markdown...
```
O composable [`useProjects.js`](file:///home/vitor/projects/vichsort-portifolio/src/modules/projects/composables/useProjects.js) processa os metadados através do utilitário [`src/core/utils/markdown.js`](file:///home/vitor/projects/vichsort-portifolio/src/core/utils/markdown.js), armazenando o resultado em um cache em memória (`Map`) para navegações instantâneas.

### C. Gestão de Estado & Acessibilidade
- O tema é persistido e sincronizado reativamente via `@vueuse/core` (`useColorMode`), injetando `data-theme="dark"` ou `data-theme="light"` na raiz `<html>`.
- As preferências de tamanho de fonte e animações reduzidas (`usePreferredReducedMotion`) operam com persistência em `localStorage` e respeitam as diretrizes de acessibilidade sem degradar a usabilidade.

---

## 4. Roteamento da Aplicação

| Rota | View | Módulo | Descrição |
| :--- | :--- | :--- | :--- |
| `/` | `HomeView` | `home` | Landing page com Hero, Teasers e Stack |
| `/overview` | `OverviewView` | `about` | Detalhes sobre formação, visão e pilares |
| `/projects` | `ProjectsListView` | `projects` | Listagem completa com busca e filtros por tag |
| `/projects/:slug` | `ProjectDetailView` | `projects` | Renderização do artigo em Markdown do projeto |
| `/researches` | `ResearchesView` | `researches` | Artigos acadêmicos e premiações |
| `/certifications`| `CertificationsView`| `certifications`| Credenciais e certificações |
| `/contact` | `ContactView` | `contact` | Canais diretos de contato e redes sociais |
| `/*` | *Redirect* | `core` | Redirecionamento automático de rotas não encontradas |
