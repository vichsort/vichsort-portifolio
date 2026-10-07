---
title: CICC
summary: Calculadora de pegada de carbono para totens de autoatendimento, que transforma o trajeto de cada pessoa em árvores a plantar.
---

## Sobre o projeto

A **CICC** (Calculadora de Impacto de Carbono) é um sistema de totem interativo feito numa parceria entre o Consórcio Itá e o Instituto Federal Catarinense, campus Concórdia. Quem passa pelo totem registra como chegou: a distância, o veículo, o combustível e quantas pessoas estavam junto. O sistema calcula o CO₂ daquele trajeto e soma tudo num painel ao vivo, que mostra quantas árvores seriam necessárias para compensar as emissões, a uma taxa de 7 árvores por tonelada.

### Como funciona

- **Cálculo parametrizado.** Os fatores de emissão (kg de CO₂ por pessoa e quilômetro) variam por categoria do veículo (carro, moto, micro-ônibus, ônibus municipal ou de viagem), combustível (gasolina, flex, etanol, diesel, biodiesel) e ocupação. Um carro com cinco pessoas emite, por pessoa, um quinto do que emite com uma.
- **Painel ao vivo.** Total de CO₂, distância percorrida, árvores para compensar e gráficos de veículos e combustíveis desenhados com [[d3|D3.js]].
- **Feito para totem.** Roda em tela cheia no modo quiosque do navegador, com atalhos de saída bloqueados e interface pensada para toque. Depois de 60 segundos sem interação, volta para a tela inicial.
- **Exportação de dados.** Tocar cinco vezes no logo do consórcio abre um download em CSV protegido por PIN. Os dados também saem por um script de linha de comando ou por um endpoint na rede local.

![[form.jpg]]

### Arquitetura

O backend em [[flask|Flask]] segue camadas (rota → serviço → adaptador de banco), com validação de entrada por [[pydantic|Pydantic]] e tipagem estrita. O armazenamento alterna por configuração entre [[sqlite|SQLite]] em modo WAL, que aguenta queda de energia no totem, e [[postgresql|PostgreSQL]]. Em produção, o próprio Flask serve o build do [[vue|Vue 3]] atrás do Waitress, sem Docker. Um único script sobe o servidor e abre o navegador em modo quiosque, no Windows ou no Linux.

![[charts.jpg]]

### Minha parte

Fiz o projeto com Gabriel Jappe e Gustavo Peretti. Fiquei com o frontend em [[vue|Vue]]: a conexão com a API, os gráficos em D3 e a tradução dos tipos de veículo e combustível. Também adaptei o sistema à identidade do consórcio e criei a exportação para planilha. Um ano depois, preparei o sistema para rodar no totem: a camada de serviço com SQLite e PostgreSQL, os schemas Pydantic, as rotas de PIN e exportação, os composables de inatividade, o servidor Waitress e os scripts de modo quiosque.
