# Como adicionar um nó

Cada coisa do portfólio (tech, projeto, pesquisa...) é uma pasta com a estrutura e um texto por idioma:

```
techs/nova-tech/
├── nova-tech.md       ← estrutura: ligações, datas, links (sem idioma)
├── nova-tech.pt.md    ← texto em português (obrigatório)
├── nova-tech.en.md    ← texto em inglês (obrigatório)
├── nova-tech.es.md    ← texto em espanhol (opcional)
└── nova-tech.it.md    ← texto em italiano (opcional)
```

## Pelo terminal (mais rápido)

```
npm run content:new -- <tipo> <id>
```

Exemplo: `npm run content:new -- project meu-app` cria `projects/meu-app/` com a estrutura e os textos pt e en, preenchidos com o modelo. Para traduzir para es ou it, copie um dos textos e renomeie.

Tipos: `tech`, `topic`, `role`, `category`, `group`, `project`, `certification`, `research`, `timeline`, `collection`.

## Pelo Obsidian

1. Crie a pasta `<tipo>/<id>/` (ex.: `techs/nova-tech/`).
2. Crie a nota `<id>` dentro dela e insira o modelo do tipo (`tech`).
3. Crie as notas `<id>.pt` e `<id>.en` (e, se quiser, `<id>.es` e `<id>.it`) e insira o modelo de texto (`tech.texto`).

Os modelos ficam em [[_templates/tech|_templates]]. Para inserir pelo Obsidian, ative o plugin **Templates** (Settings → Core plugins) e aponte a pasta de modelos para `_templates`.

## Depois de criar

1. Troque os valores de exemplo. Os comentários (`# obrigatório`, `# opcional`) dizem o que pode ficar vazio; campos opcionais podem ser apagados.
2. Arquivos extras da pasta: `icon.svg` (techs e tópicos) e `cover.jpg` (projetos) são detectados sozinhos.
3. Rode `npm run check:content` para validar e `npm run content:index` para atualizar o índice.

## Regras rápidas

- O `id` é o nome da pasta: minúsculo, com hífens, sem acento, único no vault inteiro.
- Ligações são wikilinks **entre aspas**: `- "[[python]]"`.
- Texto é opcional (exceto títulos e nomes traduzidos). Sem o arquivo de um idioma, o site mostra o texto em inglês (ou português) com o aviso "não traduzido".
- Notas soltas aqui na raiz e pastas que começam com `_` não entram no site.

Referência completa: `GRAPH.md` na raiz do repositório.
