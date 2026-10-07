---
title: tera-cli
summary: A documentation-as-code CLI that turns any API spec into a canonical representation and builds OpenAPI, Markdown, HTML and Postman from it.
---

## About the project

**tera-cli** decouples API documentation inputs from outputs. Instead of translating code straight into a final format, everything goes through a canonical intermediate representation, `docs.yaml`. That file can be extracted from source code, written by hand with editor autocomplete, rebuilt from network traffic, checked in CI and exported to several formats.

```text
Flask / FastAPI (scan) ─┐
OpenAPI / Swagger ──────┤                     ┌─→ OpenAPI 3.0
Postman (v1 to v3) ─────┼─→ docs.yaml (IR) ───┼─→ Markdown
HAR (traffic) ──────────┤                     ├─→ HTML (Redoc)
URL / Git revision ─────┘                     └─→ Postman v2.1
```

### What it does

It has 17 commands, all built around the same `docs.yaml`:

- **Input.** `scan` reads [[flask|Flask]] apps through static AST analysis (routes, converters such as `<int:id>`, docstrings, auth decorators, [[pydantic|Pydantic]] models) and [[fastapi|FastAPI]] apps through introspection. `import` takes [[openapi|OpenAPI]] 3.x and Swagger 2.0, Postman collections, URLs and `.har` files.
- **Output.** `build` produces OpenAPI 3.0; `export` produces Markdown, offline Redoc HTML and a Postman collection; `serve` runs Swagger UI or Redoc locally with no extra dependencies.
- **Contract evolution.** `diff` compares two versions semantically and flags breaking changes; `semver` recommends the next version number and `changelog` writes Keep a Changelog release notes. Either side can be a [[git|Git]] revision, such as `HEAD~1:docs.yaml`.
- **Quality.** `lint`, `validate`, `coverage` (how much of the API is documented), `security` (auth decorators in code against what the docs promise) and `audit`, a deterministic consistency check across methods, status codes and paths, with no LLM involved.
- **Maintenance.** `sync` merges code into the existing docs: routes, parameters and types come from code, while hand-written content (summaries, descriptions, examples, errors) is preserved.

### Technical decisions

- **Clean Architecture with isolated layers.** The domain is I/O-free Pydantic models; driver, writer and linter contracts are `Protocol`s; drivers and writers resolve through a priority registry, which enables plugins via entry points or `tera.toml`.
- **Reverse engineering traffic.** The HAR driver collapses concrete URLs into routes (`/users/42` becomes `/users/{id}`) by recognizing numbers, UUIDs and hex ids, and infers body fields from the observed payloads.
- **Strict typing and tests.** The code passes [[pyright|Pyright]] in strict mode and has 227 unit and integration tests with [[pytest|pytest]], running on Python 3.10 to 3.12.
- **Built for CI.** Every check has JSON output and flags that fail the pipeline (`--fail-on-breaking`, `--min-coverage`, `--strict`). The repository is also a [[github-actions|GitHub Actions]] action and ships pre-commit hooks.

Written in [[python|Python]], with [[typer|Typer]] for the command-line interface and Jinja2 for templates.
