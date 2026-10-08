---
title: GNX
summary: Busca de filmes e séries em cartaz pela API do OMDb, com uma API intermediária em Flask que guarda cada consulta no PostgreSQL.
---

## Sobre o projeto

O **GNX** foi um trabalho de Desenvolvimento Web III, no Instituto Federal Catarinense: uma ferramenta para pesquisar um filme ou série, pelo título ou pelo id do IMDb, e ver tudo sobre ele (data de lançamento, duração, gênero, notas e mais).

O que faz dele mais que uma busca é a divisão em duas aplicações [[flask|Flask]], como num sistema de verdade:

- **A API intermediária** recebe a consulta em JSON, chama a API pública do OMDb e devolve a resposta. Cada título encontrado é salvo numa tabela do [[postgresql|PostgreSQL]], acessado direto com psycopg, montando um histórico das buscas.
- **O site** é um cliente dessa API: o formulário envia o tipo da busca e o valor, o servidor do site repassa para a API como faria qualquer cliente REST e mostra o resultado na página.

Como a API é independente do site, ela também pode ser usada direto por um cliente como o Postman ou o Insomnia.
