# Pendências — vichsort-portifolio

Lista do que falta na interface tradicional. Revisada em 2026-10-07 contra o código.

---

## Em aberto

| # | Pendência | Arquivos | A decidir |
| :--- | :--- | :--- | :--- |
| **`n1`** | Alternar **grade / lista** nas listagens | `ProjectsListView.vue`, `ResearchesView.vue`, `CertificationsView.vue`, `ProjectCard.vue`, `ResearchCard.vue` | Preferência por página ou global; `ProjectCard` hoje só tem as variantes `grid` e `carousel` |
| **`n2`** | Novo padrão de **busca e filtros** | `BaseSearchInput.vue`, `BaseSelect.vue` e as três views de listagem | Absorve a antiga harmonização de altura (busca 41px, selects 39px) |
| **`n4`** | Clicar numa **tech** mostra definição e usos | `TechStackSection.vue`, `CoreStackSection.vue` | Popover ou modal. Os usos vêm dos backlinks do grafo ([GRAPH.md](GRAPH.md)) |
| **`n5`** | Clicar num **cargo do hero** mostra exemplos | `HeroSection.vue`, coleção `hero-roles` | Formato da exibição. Os exemplos vêm dos backlinks do nó do cargo; manter `data-ascii-safe` |
| **`n7`** | **Redesenhar a tela de contato** | `ContactView.vue` | Alinhar à identidade do hero e do footer |
| **`n8`** | **Modal de certificação** | `CertificationsView.vue`, novo `CertificationModal.vue` | Ainda faz sentido? O card já tem link direto para a credencial |
| **`n9`** | **Wikilinks do corpo** como links clicáveis | `core/content/markdown.js`, `links.js` | Ver [GRAPH.md](GRAPH.md) |

## Terminal

O planejamento original (`terminal.md`, fora do git) se perdeu. A lista abaixo é o que se sabe que falta; o resto precisa ser recuperado.

| # | Pendência | Arquivos | Observação |
| :--- | :--- | :--- | :--- |
| **`t0`** | **Recuperar o escopo idealizado** do terminal | — | Procurar o `terminal.md` em backups ou outra máquina; senão, reescrever o escopo |
| **`t1`** | Histórico de comandos com **↑ / ↓** | `TerminalPrompt.vue`, `useTerminal.js` | O prompt só trata o Enter |
| **`t2`** | **Autocompletar com Tab** | `TerminalPrompt.vue`, `useTerminal.js` | `getCompletions` já existe em `vfs/engine.js`, só falta ligar à tecla |
| **`t3`** | Atalhos **`Ctrl+L`** (limpar) e **`Ctrl+C`** (cancelar linha) | `TerminalPrompt.vue` | |
| **`t4`** | **Pipes e encadeamento** (`\|`, `&&`) | `parser/lexer.js`, `dispatcher.js` | Hoje o `grep` só lê arquivos |
| **`t5`** | **Grafo inteiro no VFS**: `techs/`, `topics/`, `roles/`, `timeline/` | `vfs/manifest.js`, `vfs/connectors.js` | Talvez um comando `links <id>` para mostrar ligações e backlinks |
| **`t6`** | **Download do `resume.pdf`** | `vfs/manifest.js`, `dispatcher.js` | O nó declara `action: 'download_resume'`, mas nada trata essa ação |
| **`t7`** | **Header ASCII sorteado ao entrar** | `TerminalScreen.vue`, `banner/headers.js` | O sorteio já existe no `onMounted`; conferir se está aparecendo como idealizado |

## Fundação técnica

| # | Pendência | Observação |
| :--- | :--- | :--- |
| **`a3`** | **TypeScript** em `core/content/` e no núcleo do terminal | Componentes migram aos poucos, quando forem mexidos |
| **`a4`** | **Gráficos a partir do grafo** | Visualização do grafo, matriz tech × projeto, adoção de techs no tempo. Definir a métrica de "projeto complexo". Só faz sentido com conteúdo real |
| **`a5`** | **Revisar as traduções es/it** da interface | Feitas por IA a partir do pt; conferir tom e termos, principalmente nos textos do Sobre e dos depoimentos |
| **`a6`** | Link **"Ver galeria completa"** leva a `/gallery`, que não existe | `GallerySection.vue` cai no 404. Criar a página ou tirar o link |
| **`a7`** | **Cores fixas no terminal** | `OutputMarkdown.vue` usa tokens que não existem (`--text-tertiary`, `--primary-light`) e cai nos valores fixos; prompt e histórico têm paleta própria. Decidir se o terminal segue os tokens ou mantém identidade própria (e documentar no DESIGN.md) |
| **`a8`** | `projectsLoader.js` do terminal **repete o `toProject`** de `projects/useProjects.js` | Mover o formato do projeto para `core/content` e usar nos dois |

Ordem sugerida: `a3` → `a4`.

Galeria e depoimentos ficam nos dicionários de interface (`about/locales`, `testimonials/locales`), não no grafo: cada idioma novo precisa traduzir esses itens também.

## Conteúdo real

Todo o conteúdo atual é fictício. Depende de material, não de código.

* **`c1`** — Dados de contato e redes em `core/config/profile.js` (placeholders, há um `TODO`).
* **`c2`** — Projetos reais em `src/content/projects/`, incluindo os mais antigos (antigo `n6`). Hoje há 3 de exemplo.
* **`c3`** — Certificações, pesquisas, timeline e definições das techs em `src/content/`. Várias techs só têm o arquivo de estrutura, sem texto pt/en.
* **`c4`** — Abrir `src/content/` no Obsidian e confirmar que as ligações das propriedades aparecem no grafo ([GRAPH.md](GRAPH.md), seção 10).

---

## Concluído

* Auditoria da arquitetura (`a1`): ARCHITECTURE.md e READMEs dos módulos atualizados; um só módulo de Markdown (`core/content/markdown.js`); removido o pacote `@lucide/vue` sem uso; token `--text-on-primary` no lugar do branco fixo
* i18n para pt, en, es e it (`a2`): lista única em `core/i18n/languages.js`; interface traduzida; conteúdo sem tradução cai para en → pt com o selo "não traduzido"; terminal sem textos fixos no código

* Rodapé global com contato e "voltar ao topo", fora do `/terminal` (`8bd105e`)
* Esfera flutuante na seção Sobre da home (`01c7d13`)
* Ícones do stack invertidos no tema escuro (`feb9c36`)
* Anos da timeline clicáveis com rolagem suave (`46e28dc`)
* Botões de fechar e tela cheia no README (`5f4a6eb`, antigo `n3`)
* Grafo de conteúdo em `src/content/` (`5f66c42`, `a05a011`, antiga discussão `d1`)
* Logo NEAT no tema claro: o asset agora tem transparência

## Descartado

* Easter egg no grid de pixels do hero: o grid deixou de existir com o novo hero ASCII (`fd7de0e`). Se ainda quiser um easter egg no hero, vira uma pendência nova.
