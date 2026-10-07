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
| **`t6`** | **Currículo (`resume.pdf`)**: decidir se o site terá um | `public/`, `vfs/manifest.js`, `commands/portfolio/resume.js` | O PDF não existe (`public/` só tem `images/`): o comando `resume` anuncia um download que falha. Com PDF (um por idioma?), o `cat resume.pdf` também baixa; sem PDF, remover o arquivo do `ls` e o comando |

## Fundação técnica

| # | Pendência | Observação |
| :--- | :--- | :--- |
| **`a3`** | **TypeScript** em `core/content/` e no núcleo do terminal | Componentes migram aos poucos, quando forem mexidos |
| **`a4`** | **Gráficos a partir do grafo** | Visualização do grafo, matriz tech × projeto, adoção de techs no tempo. Definir a métrica de "projeto complexo". Só faz sentido com conteúdo real |
| **`a5`** | **Revisar as traduções es/it** da interface | Feitas por IA a partir do pt; conferir tom e termos, principalmente nos textos do Sobre e dos depoimentos |
| **`a9`** | **Navbar sobre o cabeçalho do terminal** | Em `/terminal`, "Voltar ao início" e o título "Terminal" ficam embaixo do logo e das configurações da navbar global. Esconder a navbar nessa rota ou descer o cabeçalho |

Ordem sugerida: `a3` → `a4`.

Os depoimentos ficam nos dicionários de interface (`testimonials/locales`), não no grafo: cada idioma novo precisa traduzir esses itens também.

## Conteúdo real

Todo o conteúdo atual é fictício. Depende de material, não de código.

* **`c1`** — Dados de contato e redes em `core/config/profile.js` (placeholders, há um `TODO`).
* **`c2`** — Projetos reais em `src/content/projects/`, incluindo os mais antigos (antigo `n6`). Hoje há 3 de exemplo.
* **`c5`** — Fotos da galeria: as 4 de exemplo em `src/content/gallery/` não têm imagem (aparecem com placeholder). Colocar cada foto como `cover.jpg` na pasta do nó.
* **`c3`** — Certificações, pesquisas, timeline e definições das techs em `src/content/`. Várias techs só têm o arquivo de estrutura, sem texto pt/en.
* **`c4`** — Abrir `src/content/` no Obsidian e confirmar que as ligações das propriedades aparecem no grafo ([GRAPH.md](GRAPH.md), seção 10).

---

## Concluído

* Auditoria da arquitetura (`a1`): ARCHITECTURE.md e READMEs dos módulos atualizados; um só módulo de Markdown (`core/content/markdown.js`); removido o pacote `@lucide/vue` sem uso; token `--text-on-primary` no lugar do branco fixo
* Página da galeria (`a6`): `/gallery` com polaroids em três tamanhos (3, 2 ou 1 por linha, escolha salva no navegador) e `/gallery/<id>` com a foto inteira, história, ligações e navegação; fotos viraram nós do grafo (tipo `photo`); o botão "Galeria" da home agora leva para ela
* Pipes e encadeamento no terminal (`t4`): `|` passa a saída adiante (o `grep` filtra a entrada; o `ls` sai um por linha num pipe), `&&` para no primeiro erro, operadores entre aspas são texto, erro de sintaxe para operador sem comando
* Grafo inteiro no terminal (`t5`): pastas `techs/`, `topics/`, `roles/` e `timeline/` com um `<id>.md` por nó (texto + ligações nos dois sentidos) e o comando `links <id>`; o Tab completa ids no `links`. De quebra: o terminal ignorava o idioma ativo e sempre lia o conteúdo em pt
* Atalhos do terminal (`t1`–`t3`): ↑/↓ no histórico (sem duplicar o comando anterior e guardando a linha em edição), Tab completa comandos e caminhos (lista as opções quando há mais de uma), Ctrl+L limpa a tela, Ctrl+C abandona a linha; copiar e colar exigem Shift (Ctrl+Shift+C / Ctrl+Shift+V), como num terminal Linux
* Terminal no padrão visual (`a7`): só tokens do site, segue o tema claro/escuro; tokens novos `--danger` e neons documentados no DESIGN.md
* Formato do projeto compartilhado (`a8`): `core/content/projects.js`, usado pelas telas e pelo terminal
* Header ASCII sorteado ao entrar no terminal (`t7`): não aparecia porque o glob dos headers era desativado no navegador; corrigido, o comando `header` também volta a funcionar
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
