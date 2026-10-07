# Grafo de Conteúdo — vichsort-portifolio

> **Status: migração implementada.** O vault está em `src/content/` e todas as telas e o terminal leem dele. Ainda não feito: o teste no Obsidian (seção 10). Todos os dados são exemplos (o conteúdo atual do portfólio é fictício).

Este documento define como o conteúdo do portfólio (techs, tópicos, cargos, categorias, projetos, certificações, pesquisas, eventos da timeline e coleções) passa a ser um **grafo de notas interligadas**, no modelo do Obsidian: cada coisa é um nó, os nós se citam por `id`, e as ligações inversas (*backlinks*) são calculadas.

Resolve a discussão `d1` do [PENDENCIAS.md](PENDENCIAS.md) e é pré-requisito do `n4` (techs clicáveis) e do `n5` (cargos do hero clicáveis).

---

## 1. Princípios

1. **Um nó = uma pasta.** Cada tech, tópico, projeto etc. tem a sua pasta, com o nome do `id`. Dentro dela ficam a estrutura, os textos por idioma e os arquivos do nó (ícone, capa, imagens).
2. **Estrutura e conversa separadas.** O que o nó *é* (ligações, datas, URLs) fica num arquivo sem idioma. O que se *diz* sobre ele (título, definição, texto longo) fica em um arquivo por idioma.
3. **Ligações são declaradas uma única vez**, no arquivo de estrutura (ou no corpo de um texto, ver 3.3). Traduzir nunca cria nem quebra uma ligação de estrutura.
4. **Backlinks são calculados.** Os "usos" de uma tech e os "exemplos" de um cargo são quem aponta para eles; ninguém mantém essas listas à mão.
5. **Texto é permitido, não obrigatório.** Um nó pode existir só com estrutura. O site esconde o que não existe em vez de inventar. Quando falta o texto do idioma ativo, mostra o de outro idioma com um aviso (seção 6).
6. **Compatível com Obsidian.** A pasta de conteúdo pode ser aberta como *vault*, e o grafo do Obsidian mostra as mesmas ligações que o site usa.

---

## 2. Onde fica

```
src/content/                         # raiz do vault do Obsidian
├── index.md                         # índice geral, gerado (ver 2.2)
├── COMO-ADICIONAR.md                # guia curto para criar nós
├── _templates/                      # modelos por tipo: <tipo>.md e <tipo>.texto.md (ver 2.3)
├── techs/
│   ├── python/
│   │   ├── python.md                # estrutura
│   │   ├── python.pt.md             # conversa em português (opcional)
│   │   ├── python.en.md             # conversa em inglês (opcional)
│   │   └── icon.svg
│   └── vue/
│       └── ...
├── topics/                          # áreas e conceitos: gis, agritech, edge-computing
├── roles/                           # cargos do hero
├── categories/                      # categorias de projeto: app, cli, website
├── groups/                          # grupos das coleções: languages, frontend, backend
├── projects/
│   └── plante/
│       ├── plante.md
│       ├── plante.pt.md             # título, resumo e o artigo completo (corpo)
│       ├── plante.en.md
│       └── cover.jpg
├── certifications/
├── researches/
├── timeline/
├── gallery/                         # fotos da galeria (tipo photo)
└── collections/                     # listas ordenadas: stacks, cargos do hero
```

### 2.1 Regras da pasta do nó

- **O arquivo principal tem o mesmo nome da pasta** (`python/python.md`, a convenção de *folder note*). É isso que faz `[[python]]` funcionar no Obsidian, que resolve links pelo nome do arquivo. Um `index.md` por pasta quebraria os links.
- **O tipo do nó é a pasta de cima.** Não existe campo `type`: tudo em `techs/` é tech.
- **Os textos usam o sufixo do idioma**: `.pt.md`, `.en.md`, `.es.md`, `.it.md` (lista em `src/core/i18n/languages.js`). O nome de `python.pt.md` é `python.pt`, então não disputa com `[[python]]`.
- **Arquivos do nó têm nome fixo quando o site depende deles:** `icon.svg` (techs, tópicos) e `cover.*` (projetos, pesquisas, certificações e a própria foto, na galeria). O site detecta esses arquivos sozinho, sem campo no frontmatter. Outros arquivos (imagens do artigo) podem ter qualquer nome e são citados pelo corpo.
- **`.obsidian/`** (configuração local do Obsidian) entra no `.gitignore`.

- **Notas soltas na raiz e pastas que começam com `_`** (como `_templates/`) não são conteúdo: o site e a validação as ignoram.

### 2.2 Índice geral

`src/content/index.md` lista todos os nós, agrupados por tipo, como wikilinks. No Obsidian ele vira o ponto de entrada do vault e o centro do grafo.

Ele é **gerado** por um script (`npm run content:index`), não escrito à mão: escrito à mão, ficaria desatualizado na primeira tech nova. O site não depende dele (descobre os nós pelas pastas), e a validação avisa se ele estiver desatualizado.

### 2.3 Modelos

`_templates/` tem dois modelos por tipo: `<tipo>.md` (estrutura) e `<tipo>.texto.md` (texto, igual para todo idioma), com comentários marcando o que é obrigatório e opcional.

```
npm run content:new -- project meu-app
```

cria `projects/meu-app/` com `meu-app.md`, `meu-app.pt.md` e `meu-app.en.md` a partir dos modelos. Os idiomas opcionais (es, it) não são criados: um modelo esquecido apareceria como tradução, enquanto um arquivo ausente cai no fallback com aviso. No Obsidian, os mesmos arquivos servem para o plugin **Templates** (pasta de modelos: `_templates`).

---

## 3. Convenções

### 3.1 Ids

- Nome da pasta e do arquivo principal, em `kebab-case`, minúsculo, sem acento: `python`, `web-development`, `aws-cloud-practitioner`.
- **Únicos no vault inteiro**, não só dentro do tipo. Um projeto e uma tech com o mesmo id seriam ambíguos para o Obsidian. A validação acusa duplicatas.

### 3.2 Ligações na estrutura

Ficam no frontmatter, como **wikilinks entre aspas**, uma por linha:

```yaml
techs:
  - "[[python]]"
  - "[[vue]]"
```

- As aspas são obrigatórias. Sem elas, o YAML lê `[[python]]` como uma lista dentro de lista.
- O site remove os colchetes e usa o id (`python`). O Obsidian enxerga como link de verdade. *(A confirmar na versão instalada do Obsidian: links em propriedades aparecem no grafo.)*
- `[[vue|Vue 3]]` (link com rótulo) é aceito; para a ligação vale só a parte antes do `|`.

**Campos de ligação:**

| Campo | Aponta para | Quem pode declarar |
| :--- | :--- | :--- |
| `techs` | `techs/` | todos os tipos, exceto categorias e coleções |
| `topics` | `topics/` | todos os tipos, exceto categorias e coleções |
| `roles` | `roles/` | projetos, certificações, pesquisas, timeline |
| `category` | `categories/` (um só) | projetos |
| `items` | qualquer tipo, ordenado | coleções |
| `group` | `groups/` (um só, dentro de `items`) | coleções |

Ligações entre conceitos são permitidas: `flask` declara `techs: [[python]]`, `gis` declara `techs: [[postgis]]`. O link é sempre de mão única na escrita, e o backlink aparece do outro lado.

### 3.3 Wikilinks no corpo

`[[plante]]` ou `[[plante|o app]]` dentro do texto de um idioma vira um link para a página do nó citado (`core/content/routes.js`: projetos e fotos têm página própria; pesquisas, certificações e timeline levam ao card na listagem, por âncora: `/certifications#id`). Nós sem página (techs, tópicos, cargos...) viram um nome com sublinhado pontilhado que abre o menu de nó (seção 5.6); o nó dono do texto fica fora desse menu, e se não sobrar nada o nome fica como texto. Um link para a página em que o texto já está também fica como texto. Nas telas, a diretiva `v-content-links` faz os links navegarem pelo router, sem recarregar, e abre o menu dos nomes pontilhados.

- Contam como ligação no grafo, igual às de estrutura. Como o corpo é por idioma, a ligação pode existir em pt e não em en. A validação avisa quando isso acontece.
- Link para id inexistente é erro, como na estrutura.

### 3.4 Aliases

O campo `aliases` é o nativo do Obsidian. Com `aliases: [Vue 3, Vue.js]` em `vue.md`, tanto o Obsidian quanto o site resolvem `[[Vue 3]]` para `vue`. Isso cobre o problema atual de `Vue 3` vs `Vue.js`.

### 3.5 Corpo do arquivo de estrutura

O site ignora o corpo de `python.md`. Ele pode ser usado para notas no Obsidian, por exemplo `![Python](icon.svg)` para ver o ícone na nota. Mas **vai junto no bundle**, então nada privado ali.

---

## 4. Tipos de nó

Para cada tipo: o que vai na estrutura e o que vai na conversa. Campos marcados com `*` são obrigatórios.

### 4.1 `techs/` — tecnologia

| Estrutura | Conversa |
| :--- | :--- |
| `name`* — nome próprio, igual em todo idioma | `definition` — o que é (curto) |
| `aliases` | `note` — como eu uso (curto) |
| `techs`, `topics` — ligações entre conceitos | corpo — texto livre |
| arquivo `icon.svg` | |

### 4.2 `topics/` — área ou conceito

Mesmo formato da tech, mas o nome é traduzido ("Análise Espacial" / "Spatial Analysis"). Por isso o nome fica na conversa.

| Estrutura | Conversa |
| :--- | :--- |
| `aliases` | `name`* |
| `techs`, `topics` | `definition`, `note`, corpo |
| arquivo `icon.svg` (opcional) | |

### 4.3 `roles/` — cargo do hero

| Estrutura | Conversa |
| :--- | :--- |
| `techs`, `topics` | `name`* — "Desenvolvimento Web" / "Web Development" |
| | `description`, corpo |

A ordem no hero vem da coleção `hero-roles`, não de um campo no cargo.

### 4.4 `categories/` — categoria de projeto

| Estrutura | Conversa |
| :--- | :--- |
| *(vazia)* | `name`* — "Aplicativo" / "App" |
| | `description` |

### 4.5 `projects/` — projeto

| Estrutura | Conversa |
| :--- | :--- |
| `category`* — link | `title`* |
| `date`* — `[início, fim]` em `AAAA-MM` | `summary`* |
| `techs`, `topics`, `roles` | corpo — artigo completo |
| `github`, `live` | |
| arquivo `cover.*` | |

### 4.6 `certifications/` — certificação ou curso

| Estrutura | Conversa |
| :--- | :--- |
| `issuer`* — instituição | `name`* |
| `date`* — `AAAA-MM` | `description` |
| `credential_url` | |
| `techs`, `topics`, `roles` | |
| arquivo `cover.*` (imagem da credencial) | |

### 4.7 `researches/` — pesquisa ou prêmio

| Estrutura | Conversa |
| :--- | :--- |
| `date`* | `title`* |
| `authors` | `institution` — traduzida ("Universidade Federal" / "Federal University") |
| `paper_url` | `award` — "1º Lugar — Apresentação Técnica" |
| `techs`, `topics`, `roles` | `description`, corpo |

A antiga `category` das pesquisas ("Iniciação Científica & GIS") é substituída por `topics`. A página de pesquisas usa o primeiro tópico como categoria.

### 4.8 `timeline/` — evento da trajetória

| Estrutura | Conversa |
| :--- | :--- |
| `date`* | `title`* |
| `kind`* — `education`, `work`, `research`, `project` | `organization` |
| `link` — um nó (projeto, pesquisa, certificação) | `description` |
| `techs`, `topics`, `roles` | |

`link` vira o botão "Ver Projeto" / "Ver Pesquisa" do card, com a rota do nó citado.

### 4.8b `gallery/` — foto da galeria (tipo `photo`)

| Estrutura | Conversa |
| :--- | :--- |
| `date`* | `title`* |
| `format` — `portrait`, `landscape`, `square` (encaixe na grade do Sobre) | `caption` — legenda embaixo da foto |
| `link` — um nó (projeto, pesquisa, certificação, marco) | `location` |
| `techs`, `topics`, `roles` | corpo — a história da foto, na página de detalhes |
| arquivo `cover.*` — a própria foto | |

A página `/gallery` lista as fotos da mais recente para a mais antiga; `/gallery/<id>` mostra a foto inteira, o corpo, as ligações e o `link` como "Relacionado". A seção do Sobre mostra as quatro mais recentes. O formato de tela vem de `core/content/photos.js` (`photoView`, `allPhotos`).

### 4.9 `groups/` — grupo de uma coleção

Os grupos dos stacks ("Linguagens", "Backend & Dados") são nós próprios, para poderem ser explicados como qualquer outra coisa.

| Estrutura | Conversa |
| :--- | :--- |
| `lucide` — nome do ícone Lucide (opcional) | `name`* |
| arquivo `icon.svg` (opcional, alternativa ao Lucide) | `description`, corpo |

O mesmo grupo pode aparecer em mais de uma coleção (`frontend` na home e no Sobre).

### 4.10 `collections/` — lista ordenada

Uma coleção diz **quais nós aparecem num lugar do site e em que ordem**. Os stacks e o hero são coleções.

| Estrutura | Conversa |
| :--- | :--- |
| `items`* — links, ou grupos de links (ver 5.4) | `title` |

Coleções previstas: `home-stack`, `about-stack`, `hero-roles`.

---

## 5. Exemplos completos

### 5.1 Uma tech com definição e ligação a outra tech

`techs/python/python.md`
```markdown
---
name: Python
aliases:
  - python3
---
![Python](icon.svg)
```

`techs/python/python.pt.md`
```markdown
---
definition: Linguagem de programação interpretada, de tipagem dinâmica e propósito geral.
note: Minha escolha para scripts, ciência de dados e APIs pequenas.
---
```

`techs/flask/flask.md`
```markdown
---
name: Flask
techs:
  - "[[python]]"
---
```

### 5.2 Uma tech sem nenhum texto

`techs/redis/redis.md` + `techs/redis/icon.svg`
```markdown
---
name: Redis
---
```

Sem `redis.pt.md` nem `redis.en.md`. É válido: o cartão mostra nome, ícone e os usos, sem definição.

### 5.3 Um projeto

`projects/plante/plante.md`
```markdown
---
category: "[[app]]"
date: [2024-03, 2024-08]
github: https://github.com/vitor/plante
techs:
  - "[[vue]]"
  - "[[python]]"
  - "[[flask]]"
topics:
  - "[[agritech]]"
roles:
  - "[[web-development]]"
  - "[[data-science]]"
---
```

`projects/plante/plante.pt.md`
```markdown
---
title: PlantE
summary: Gestão agrícola com diagnóstico de pragas por IA.
---

## Sobre o PlantE

A API foi escrita em [[flask|Flask]] e o diagnóstico roda sobre [[gemini]].

![Tela inicial](screenshot-home.png)
```

O `[[gemini]]` do corpo cria uma ligação `plante → gemini` só em pt. Se `plante.en.md` não citar `gemini`, a validação avisa.

### 5.4 Uma coleção com grupos

`collections/home-stack/home-stack.md`
```markdown
---
items:
  - group: "[[languages]]"
    items:
      - "[[typescript]]"
      - "[[python]]"
  - group: "[[frontend]]"
    items:
      - "[[vue]]"
      - "[[react]]"
---
```

`groups/languages/languages.md`
```markdown
---
lucide: code-2
---
```

`groups/languages/languages.pt.md`
```markdown
---
name: Linguagens
description: As linguagens em que escrevo no dia a dia.
---
```

`collections/hero-roles/hero-roles.md` (sem grupos)
```markdown
---
items:
  - "[[web-development]]"
  - "[[app-development]]"
  - "[[data-science]]"
  - "[[software-architecture]]"
---
```

### 5.5 O que o grafo calcula

Supondo também `tera` (techs: python) e o evento `2023-fullstack` (techs: vue, python):

| Consulta | Resultado |
| :--- | :--- |
| `backlinks('python')` | techs: `flask` · projetos: `plante`, `tera` · timeline: `2023-fullstack` · coleções: `home-stack` |
| `backlinks('redis')` | só coleções → cartão mostra "no stack, sem uso público ainda" |
| `backlinks('data-science')` | projetos: `plante` |
| `backlinks('app')` | projetos: `plante` (é assim que a listagem filtra por categoria) |
| `related('plante')` | nós que compartilham ligações, ordenados por quantidade em comum |

Backlinks vindos de coleções servem para a validação e para o Obsidian, mas não aparecem no cartão do site.

### 5.6 O que o visitante vê

**`n4` — clicar no Vue.js no stack (idioma pt):** um menu de contexto, no estilo do macOS, com o que aponta para o nó. Sem contadores nem títulos; o rótulo segue o número de itens.
```
 [Vue]
┌──────────────────────┐   ┌───────────────────┐
│ Ver projetos       › │ → │ PlantE            │
│ Ver pesquisa         │   │ Cemitério Caboclo │
│ Ver certificado      │   └───────────────────┘
│ Ver na trajetória  › │
│ Relacionadas       › │  (JavaScript, Pinia: em cinza, sem destino)
└──────────────────────┘
```

- Os grupos vêm de `backlinks(id)` por tipo, sem coleções; as techs relacionadas, de `relatedTechs(id)` (só o campo `techs`).
- Um item só: a linha já é o link. Mais de 6: os 6 mais recentes e "Ver todos", que abre a listagem com `?ref=<id>`.
- Certificações, pesquisas e timeline não têm página própria: o link vai ao card, por âncora (`/certifications#id`).
- Passar o mouse abre o submenu; o clique o trava. No mobile, o submenu desliza para dentro do menu.

**`n5` — clicar em "Ciência de Dados" no hero:** o mesmo menu, com o que aponta para `[[data-science]]`.

**Wikilink no corpo:** "Python" no texto do PlantE abre o mesmo menu, sem o próprio PlantE (que é a página em que se está). O HTML traz `<button class="node-ref" data-node="python" data-from="plante">`; a diretiva `v-content-links` abre o `NodeMenuHost`, um menu único montado no `App.vue`.

---

## 6. Validação

Roda no carregamento em dev (aviso no console) e num script `npm run check:content` (falha com código ≠ 0, para usar antes do build).

| Nível | Caso | Exemplo |
| :--- | :--- | :--- |
| erro | link para id inexistente (estrutura ou corpo) | `"[[pyhton]]"` em `plante.md` |
| erro | id duplicado no vault | `projects/vue/` e `techs/vue/` |
| erro | arquivo principal com nome diferente da pasta | `techs/python/index.md` |
| erro | campo obrigatório ausente | `plante.pt.md` sem `title` |
| erro | link no campo errado | `category: "[[python]]"` (python não é categoria) |
| erro | campo de ligação que o tipo não aceita | `roles` em `techs/python/python.md` |
| aviso | texto opcional só num idioma | `definition` em `python.pt.md` mas não em `python.en.md` |
| aviso | wikilink do corpo só num idioma | `[[gemini]]` em `plante.pt.md` mas não em `plante.en.md` |
| aviso | tech com ícone fora de qualquer coleção | `techs/sass/` com `icon.svg` e fora dos stacks |
| aviso | `index.md` desatualizado | nó novo sem rodar `content:index` |

**Idiomas obrigatórios e opcionais.** pt e en são obrigatórios: os campos de `requiredText` precisam existir nos dois. es e it são opcionais: só são validados quando o arquivo existe, e a assimetria é comparada sempre contra o pt.

**Fallback por arquivo, com aviso.** Se o nó não tem o arquivo de texto do idioma ativo, o site usa o primeiro que existir na ordem *idioma ativo → en → pt* e mostra o selo "não traduzido" (`UntranslatedNote`) nos cards e páginas do nó. O fallback é do arquivo inteiro, não de campo: se o arquivo do idioma existe e um campo opcional falta nele, o campo não aparece. Os avisos de assimetria existem para isso não passar despercebido.

---

## 7. Como o site consome

```
src/core/content/
├── index.js         # import.meta.glob em src/content/**; monta o grafo uma vez e avisa problemas em dev
├── schema.js        # tipos, campos obrigatórios e campos de ligação (seção 4)
├── links.js         # lê "[[id|rótulo]]" no frontmatter e no corpo
├── graph.js         # monta nós, resolve ids e aliases, arestas e backlinks (sem depender do Vite)
├── validate.js      # regras da seção 6
├── queries.js       # consultas com idioma explícito (usadas pelo terminal)
├── projects.js      # formato de projeto usado pelas telas e pelo terminal (projectView, allProjects)
├── photos.js        # formato de foto da galeria (photoView, allPhotos)
├── routes.js        # destino de cada nó (nodeRoute) e listagem filtrada por ?ref= (listingRoute)
├── nodeMenu.js      # grupos do menu de nó (n4/n5): backlinks por tipo, até 6 itens, "ver todos"
├── useNodeMenu.js   # nodeMenu no idioma ativo, convertido para os itens do ContextMenu
├── markdown.js      # renderiza o corpo: wikilinks viram texto, imagens relativas viram arquivos do nó
└── useContent.js    # as mesmas consultas no idioma ativo, para componentes
scripts/content.mjs  # npm run check:content / content:index / content:new
```

API para componentes:

```js
const { node, text, fallback, label, ofType, linked, collection, backlinks, outlinks, related, icon, cover, html } = useContent()

node('python')                     // { id, type, data, aliases, texts, assets, links }
text('python')                     // { definition, note, body } no idioma ativo (ou no do fallback), ou {}
fallback('python')                 // idioma usado no lugar do ativo, ou null se não precisou
label('python')                    // nome de exibição no idioma ativo
ofType('research', { recent: true }) // nós do tipo; recent ordena por data, mais novo primeiro
linked('plante', 'techs')          // ids ligados por um campo
collection('home-stack')           // [{ group, items }] já resolvidos, na ordem
backlinks('python')                // { tech: [...], project: [...], timeline: [...] }
outlinks('python')                 // o inverso: para onde o nó aponta, agrupado por tipo do destino
relatedTechs('vue')                // techs ligadas pelo campo techs, nos dois sentidos
related('plante')                  // [{ node, shared }] do mais ao menos parecido
icon('python'), cover('plante')    // URLs dos arquivos da pasta do nó
html('plante')                     // corpo renderizado
```

Fora de componentes (terminal), `content` de `@/core/content` tem as mesmas funções, recebendo o idioma como último argumento.

Para o `n4` e o `n5`, `<NodeMenu id="...">gatilho</NodeMenu>` (`shared/components/node/`) monta o menu de qualquer nó sobre o `ContextMenu` genérico (`shared/components/ui/menu/`); o `TechIcon` é o ícone de tech dos stacks já com o menu.

---

## 8. O que mudou no código

| Antes | Agora |
| :--- | :--- |
| `projects/content/*.{pt,en}.md` com frontmatter duplicado | `content/projects/<id>/` |
| `category` do projeto como texto (`App`, `CLI`, `Website`) | `content/categories/` |
| `certifications_page.list` em `certifications/locales/*.json` | `content/certifications/` |
| `researches_page.list` em `researches/locales/*.json` | `content/researches/` |
| `tags` de pesquisas e timeline (texto livre) | `techs` + `topics` |
| `s5_timeline.events` em `about/locales/*.json` | `content/timeline/` |
| listas fixas em `TechStackSection.vue` e `CoreStackSection.vue` | `collections/home-stack` e `collections/about-stack` |
| `hero.roles` em `home/locales/*.json` | `content/roles/` + `collections/hero-roles` |
| `src/assets/techs/*.svg` | `icon.svg` na pasta de cada tech |
| texto fixo do stack em `terminal/core/vfs/connectors.js` | gerado a partir de `collections/about-stack` |

Os `locales/*.json` ficam só com textos de interface: rótulos, botões, placeholders.

Como o conteúdo é fictício, a migração é reescrever exemplos, não converter dados.

---

## 9. Fora do escopo (ganhos futuros)

- **Depoimentos** (`modules/testimonials`) e **galeria** (`about/GallerySection.vue`) continuam como estão. Podem virar tipos do grafo depois: um depoimento ligado ao projeto em que a pessoa trabalhou, uma foto ligada a um evento da timeline.
- **Visualização do grafo no site**, estilo Obsidian (talvez em ASCII, com o motor do `AsciiField`).
- **Navegação do grafo pelo terminal** (`ls /techs/python` listando backlinks).

---

## 10. Questões em aberto

1. **Carregamento.** Implementado como "tudo junto": o vault inteiro entra no JavaScript inicial. Se o conteúdo crescer, os corpos longos podem passar a ser carregados sob demanda sem mudar a API do `useContent`.
2. **Confirmar no Obsidian** que links em propriedades aparecem no grafo, com um vault de teste de 2 ou 3 nós, antes de migrar.
