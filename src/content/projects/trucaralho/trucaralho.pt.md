---
title: trucaralho
summary: App de jogos de cartas em Flutter, de truco a poker, que começou como marcador de fichas e está sendo reescrito sobre um motor de truco em Dart puro.
---

## Sobre o projeto

O **trucaralho** (truco + baralho) é um app de jogos de cartas para jogar com os amigos: truco, blackjack, fodinha e poker, com apostas em fichas virtuais, sem dinheiro de verdade. Ele passou por três versões, e cada uma subiu um degrau.

### Primeira versão: o marcador

A primeira versão, de maio de 2025, feita em [[flutter|Flutter]] com um colega, era um companheiro de mesa: quem jogava era o baralho físico, e o app cuidava das fichas, das apostas, do placar e do histórico de cada um dos quatro jogos, com um guia de regras para cada um. Fiquei com a lógica: as apostas, o histórico, o poker e a organização em módulos, um por jogo.

### Segunda versão: o truco jogável

Na segunda, em julho e agosto de 2025, já com um grupo maior, o truco virou jogo de verdade contra o celular: cartas na mesa, pedido de truco, seis, nove e doze, notificações e vibração, e partidas antigas salvas para retomar depois. A minha parte foi a jogada automática do adversário seguindo as regras do truco, a limpeza do código e da navegação e o visual das cartas fora de jogo.

### A reescrita

Agora estou reescrevendo o projeto sozinho, começando pelo que faltava nas outras versões: um motor de regras sólido. O núcleo é [[dart|Dart]] puro, sem depender de Flutter, e a interface só vem depois.

- **Truco Paulista completo.** Partidas de 2 ou 4 jogadores em duplas, baralho de 40 cartas com vira e manilhas, vazas e empates, mão de onze, placar e toda a negociação do truco.
- **Motor genérico.** Ciclo de vida, ações, estado e serialização são abstratos, para outros jogos de cartas reaproveitarem a mesma base. O estado é validado a cada ação e pode ser salvo e restaurado, com versão.
- **Peças separadas.** A IA (uma aleatória e uma básica), o histórico da partida e a persistência local ficam fora do motor, atrás de interfaces, e uma camada de aplicação monta partidas 1v1 e 2v2 com jogadores, duplas e IA.
- **Qualidade.** Análise estática estrita, testes de unidade e de ponta a ponta e CI no [[github-actions|GitHub Actions]].
