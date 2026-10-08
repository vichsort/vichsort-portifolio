---
title: tera-cli
summary: CLI de documentação como código que converte qualquer especificação de API numa representação canônica e dela gera OpenAPI, Markdown, HTML e Postman.
---

## Sobre o projeto

O **tera-cli** separa a entrada da saída na documentação de APIs. Em vez de traduzir o código direto para um formato final, tudo passa por uma representação intermediária canônica, o `docs.yaml`. Esse arquivo pode ser extraído do código-fonte, escrito à mão com autocompletar no editor, reconstruído a partir de tráfego de rede, validado em CI e exportado para vários formatos.

```text
Flask / FastAPI (scan) ─┐
OpenAPI / Swagger ──────┤                     ┌─→ OpenAPI 3.0
Postman (v1 a v3) ──────┼─→ docs.yaml (IR) ───┼─→ Markdown
HAR (tráfego) ──────────┤                     ├─→ HTML (Redoc)
URL / revisão do Git ───┘                     └─→ Postman v2.1
```

### De onde ele veio

No começo, a ideia era só um site: o **Tera Docs**, um painel em [[vue|Vue]] para navegar pela documentação das APIs que eu desenvolvia, lida de arquivos OpenAPI em JSON. O tera-cli surgiu para alimentar esse painel, gerando os arquivos a partir do código. Conforme o CLI cresceu, passou a exportar HTML, servir Swagger UI e Redoc localmente e fazer tudo o que o site fazia, e o Tera Docs perdeu o sentido.

### O que ele faz

São 17 comandos, organizados em torno do mesmo `docs.yaml`:

- **Entrada.** `scan` lê apps [[flask|Flask]] por análise estática de AST (rotas, conversores como `<int:id>`, docstrings, decoradores de autenticação, modelos [[pydantic|Pydantic]]) e apps [[fastapi|FastAPI]] por introspecção. `import` aceita [[openapi|OpenAPI]] 3.x e Swagger 2.0, coleções Postman, URLs e arquivos `.har`.
- **Saída.** `build` gera OpenAPI 3.0; `export` gera Markdown, HTML offline com Redoc e coleção Postman; `serve` sobe Swagger UI ou Redoc localmente, sem dependências extras.
- **Evolução do contrato.** `diff` compara duas versões semanticamente e acusa mudanças que quebram clientes; `semver` recomenda o próximo número de versão e `changelog` escreve as notas no padrão Keep a Changelog. Qualquer lado pode ser uma revisão do [[git|Git]], como `HEAD~1:docs.yaml`.
- **Qualidade.** `lint`, `validate`, `coverage` (o quanto da API está documentado), `security` (decoradores de autenticação no código contra o que a documentação promete) e `audit`, uma auditoria determinística de coerência entre métodos, status e caminhos, sem LLM.
- **Manutenção.** `sync` faz um merge do código com a documentação existente: rotas, parâmetros e tipos vêm do código, e o que foi escrito à mão (resumos, descrições, exemplos, erros) é preservado.

### Decisões técnicas

- **Clean Architecture com camadas isoladas.** O domínio são modelos Pydantic sem I/O; os contratos de drivers, writers e linters são `Protocol`s; drivers e writers são resolvidos por um registro com prioridade, o que permite plugins por entry points ou pelo `tera.toml`.
- **Engenharia reversa de tráfego.** O driver de HAR agrupa URLs concretas em rotas (`/users/42` vira `/users/{id}`) reconhecendo números, UUIDs e ids hexadecimais, e infere os campos do corpo a partir dos payloads observados.
- **Tipagem estrita e testes.** O código passa no [[pyright|Pyright]] em modo strict e tem 227 testes de unidade e integração com [[pytest|pytest]], rodando em Python 3.10 a 3.12.
- **Feito para CI.** Toda verificação tem saída JSON e flags para falhar o pipeline (`--fail-on-breaking`, `--min-coverage`, `--strict`). O repositório também é uma action do [[github-actions|GitHub Actions]] e oferece hooks de pre-commit.

Escrito em [[python|Python]], com [[typer|Typer]] na interface de linha de comando e Jinja2 nos templates.
