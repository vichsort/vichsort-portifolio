---
title: FAIF
summary: App e API que reúnem dados abertos do governo federal (deputados, emendas, CNPJ, IBGE) atrás de uma interface única.
---

## Sobre o projeto

O **FAIF** (Facilitador de Acesso à Informação Federal) nasceu no Instituto Federal Catarinense como uma ferramenta de consciência política: em vez de navegar por meia dúzia de portais do governo, cada um com seu formato, a pessoa consulta tudo num só lugar. O projeto foi feito em equipe e tem duas partes: uma API intermediária em [[flask|Flask]] e um app em [[flutter|Flutter]].

### A API

A API funciona como um middleware sobre as fontes oficiais de [[open-data|dados abertos]]:

- **Câmara dos Deputados**: busca de deputados por nome e ficha detalhada de cada um.
- **Portal da Transparência (CGU)**: emendas parlamentares, servidores públicos e consulta de pessoa física por CPF e NIS.
- **BrasilAPI**: CNPJ e CEP.
- **IBGE**: metadados das pesquisas do instituto.
- **Portal gov.br**: órgãos e serviços públicos.

Cada fonte responde de um jeito; o FAIF normaliza todas para o mesmo envelope (`{ ok, data }` no sucesso, `{ ok, error: { code, message, details } }` na falha), então o app consome uma API só, previsível. A estrutura é uma application factory com um blueprint por fonte e uma camada de serviços que concentra a normalização. As requisições ficam registradas num histórico em [[postgresql|PostgreSQL]] via [[sqlalchemy|SQLAlchemy]], com migrations pelo Alembic e truncamento dos parâmetros para não inflar o banco.

### O app

O app em [[flutter|Flutter]] tem telas para deputados (lista e detalhes), emendas, CNPJ e pesquisas do IBGE, além de uma busca unificada que alterna entre esses domínios. Uma tela de configurações, com estado global via Provider, controla tema claro ou escuro e tamanho da fonte, pensando em acessibilidade.

### Minha parte

Comecei os dois repositórios e montei a base da API: a integração com o Portal da Transparência e o IBGE, os normalizadores, a divisão em blueprints, o health check, a busca de deputados e o histórico de requisições. No app, fiz os wireframes, o gerenciamento de estado com Provider, a navegação até os detalhes de deputados e a refatoração das telas de CNPJ, IBGE e emendas.
