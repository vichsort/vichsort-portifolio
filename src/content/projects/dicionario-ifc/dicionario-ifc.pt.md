---
title: Dicionário IFC
summary: Dicionário das gírias e piadas internas de uma turma do IFC, escrito a várias mãos num Google Docs e publicado sozinho como site.
---

## Sobre o projeto

O **Dicionário IFC** começou como brincadeira entre amigos: um Google Docs compartilhado onde a turma registrava as palavras, apelidos e expressões que só fazem sentido para quem viveu o instituto, cada uma com pronúncia, definição e sinônimos. O site transforma esse documento num dicionário de verdade, com uma página por verbete.

O detalhe é que ninguém precisa mexer no código para escrever. A edição continua no Google Docs, do jeito que todo mundo já fazia, e o site se atualiza sozinho.

### Como funciona

- **Do Docs para o repositório.** Um script em Google Apps Script exporta o documento como Markdown e faz o commit no GitHub sempre que o texto muda.
- **Do Markdown para o site.** Antes de cada build, um parser em Node lê o Markdown, reconhece cada verbete pelo termo em negrito, separa a pronúncia, a definição e os sinônimos, gera um slug e cria ligações cruzadas entre verbetes que se citam. O resultado é um JSON que o front-end importa direto.
- **Publicação.** O commit dispara um novo deploy na Vercel, então o que a turma escreve no Docs aparece no site minutos depois.

### O site

Feito em [[react|React]] com [[vite|Vite]] e [[tailwindcss|Tailwind CSS]]:

- Barra lateral com os verbetes agrupados por letra, em sanfona, e busca que ignora acentos.
- Palavra do dia, escolhida de forma determinística pela data, igual para todo mundo.
- Botão de verbete aleatório, atalho para o documento original e tema claro ou escuro.
- Leitura em voz alta da pronúncia pela Web Speech API.
