# Design System & Visual Guidelines — vichsort-portifolio

Este documento consolida os princípios visuais, o sistema de tokens, as camadas de superfícies e os padrões de componentes do projeto.

---

## 1. Filosofia Visual & Identidade de Marca

* **Assinatura Visual**: Estilo *Cyber-Minimalista / Retrô-Futurista* focado em alta densidade de informação, performance e nitidez tipográfica.
* **Cores de Marca (Preservadas)**:
  - **Primária**: Azul Royal Intenso (`#3a31d8` no tema escuro / `#2f27ce` no tema claro).
  - **Acento**: Roxo Neon Vibrante (`#5d1de7` no tema escuro / `#5818e2` no tema claro).
* **Camadas de Superfície (Layered Surfaces)**:
  - Em vez de fundos pretos chapados (`#000000`), o tema escuro utiliza o tom ultra-escuro e sutilmente pigmentado `#080711` (*Canvas*), sobreposto por `#110f22` (*Surface 1*) e `#191632` (*Surface 2*).
  - Isso garante **profundidade tridimensional**, alto contraste sem agressão ocular e valorização dos elementos interativos.

---

## 2. Paleta de Tokens (CSS Custom Properties)

### Cores & Superfícies

| Token CSS | Dark Theme | Light Theme | Finalidade |
| :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#080711` | `#f8f9fe` | Fundo principal da aplicação |
| `--bg-surface-1` | `#110f22` | `#ffffff` | Fundo dos cards primários e seções |
| `--bg-surface-2` | `#191632` | `#f0f2fa` | Superfícies internas de hover, inputs e tags |
| `--bg-surface-elevated` | `rgba(17, 15, 34, 0.85)` | `rgba(255, 255, 255, 0.9)` | Navbar flutuante, modais e gavetas |
| `--primary` | `#3a31d8` | `#2f27ce` | Cor primária para botões, destaques e foco |
| `--primary-subtle` | `rgba(58, 49, 216, 0.15)` | `rgba(47, 39, 206, 0.08)` | Fundo de tags, pills e seleções suaves |
| `--accent` | `#5d1de7` | `#5818e2` | Cor de acento para interações secundárias |
| `--accent-subtle` | `rgba(93, 29, 231, 0.15)` | `rgba(88, 24, 226, 0.08)` | Fundo de badges de acento |
| `--text-primary` | `#f8fafc` | `#0f172a` | Texto de alta ênfase (títulos e conteúdo principal) |
| `--text-secondary` | `rgba(248, 250, 252, 0.75)` | `#475569` | Texto de ênfase média (descrições e legendas) |
| `--text-muted` | `rgba(248, 250, 252, 0.45)` | `#94a3b8` | Texto de baixa ênfase (datas e rodapés) |
| `--border-subtle` | `rgba(255, 255, 255, 0.08)` | `rgba(15, 23, 42, 0.08)` | Bordas delicadas de cards e divisores |
| `--border-medium` | `rgba(255, 255, 255, 0.15)` | `rgba(15, 23, 42, 0.15)` | Bordas de botões e inputs |
| `--border-accent` | `rgba(93, 29, 231, 0.4)` | `rgba(88, 24, 226, 0.3)` | Destaques de borda no hover |
| `--text-on-primary` | `#ffffff` | `#ffffff` | Texto sobre fundos em `--primary` (botões e pills ativos) |
| `--danger` | `#f87171` | `#dc2626` | Erros e estados destrutivos |
| `--neon-cyan` | `#00e5ff` | `#0086a3` | Neon: campos ASCII, prompt e links do terminal |
| `--neon-magenta` | `#c51bff` | `#8a12d6` | Neon: campos ASCII, diretório do prompt e ênfases do terminal |
| `--neon-pink` / `--neon-yellow` / `--neon-orange` | `#ff2e97` / `#ffd23f` / `#ff7a1a` | `#d1006b` / `#b97700` / `#d9480f` | Neon: campos ASCII; `--neon-pink` também no código inline do terminal |

| `--viz-accent` | `#7a72f0` | `#2f27ce` | Gráficos: marca de tom único (adoção, matriz). No escuro é mais claro que o `--primary`, que fica abaixo de 3:1 na superfície |
| `--viz-project` / `--viz-tech` / `--viz-research` | `#3987e5` / `#d95926` / `#199e70` | `#2a78d6` / `#eb6834` / `#1baf7a` | Gráficos: paleta categórica dos tipos de nó, validada para todos os pares nos dois temas. Sempre com forma ou rótulo junto (o verde do claro fica abaixo de 3:1) |

**Nenhuma cor fixa em componentes.** Toda cor vem de um token, inclusive no terminal, que segue o tema do site. Os neons têm valores próprios no tema claro, escurecidos para manter contraste. Exceções aceitas: os três botões de janela do `MacWindowFrame` (cores do macOS), textos e degradês sobre fotos, e sombras/fundos escurecidos em preto translúcido (`rgba(0, 0, 0, …)`), que valem igual nos dois temas.

---

## 3. Sistema Tipográfico

* **Fonte de Títulos**: `Arcade Gamer` (monospace display).
* **Fonte de Leitura**: `Montserrat` (100–900 com variação itálica).
* **Base Web**: `16px` (`1rem = 16px`).

### Escala de Tamanhos

| Token | Tamanho em Rem | Equivalente em Pixels | Utilização Recomendada |
| :--- | :--- | :--- | :--- |
| `--text-xs` | `0.75rem` | `12px` | Badges, tags e metadados compactos |
| `--text-sm` | `0.875rem` | `14px` | Textos auxiliares e botões pequenos |
| `--text-base` | `1rem` | `16px` | Texto de parágrafos padrão e corpo |
| `--text-lg` | `1.125rem` | `18px` | Parágrafos de introdução e links de menu |
| `--text-xl` | `1.25rem` | `20px` | Subtítulos e títulos de cards |
| `--text-2xl` | `1.5rem` | `24px` | Títulos de seção secundários (H3) |
| `--text-3xl` | `2rem` | `32px` | Títulos de seção principais (H2) |
| `--text-4xl` | `2.75rem` | `44px` | Destaques numéricos e títulos de página |
| `--text-5xl` | `3.75rem` | `60px` | Título do Hero e display principal |

---

## 4. Padrões de Componentes & Interação

### A. Cards (`.surface-card`)
- **Fundo**: `--bg-surface-1` com borda `--border-subtle`.
- **Raio de Borda**: `--radius-lg` (`24px`).
- **Estado de Hover** (só com `.interactive`: card clicável ou item de coleção; containers de conteúdo, seções e campos ficam parados):
  - `transform: translateY(-4px);`
  - `border-color: var(--primary-border);`
  - `box-shadow: var(--shadow-card-hover);`

### B. Badges e Tags (`.badge`)
- Pílulas arredondadas com `--radius-full` (`9999px`).
- Fundo translúcido com `--primary-subtle` e borda `--primary-border`.
- Texto em caixa alta (`uppercase`) e letter-spacing refinado (`0.5px`).

### C. Painéis Glassmorphism (`.glass-panel`)
- Fundo semitransparente `--bg-glass` com `backdrop-filter: blur(12px)`.
- Borda sutil de 1px para delimitação luminosa.

### D. Acessibilidade & Movimento Reduzido
- Suporte nativo à media query `@media (prefers-reduced-motion: reduce)`.
- Classe `body.reduce-motion` controlada de forma reativa nas configurações de acessibilidade.

---

## 5. Diretrizes de SVG & Tech Stack
- Todos os ícones de tecnologias mantêm o formato vetorial monocromático oficial com `filter: invert(1)` no tema escuro e opacidade controlada para harmonização estética no grid.
