---
title: Next Signage
summary: Plataforma brasileira de sinalização digital que cadastra players em Raspberry Pi e exibe neles playlists de imagens e vídeos.
---

## Sobre o projeto

O **Next Signage** é uma plataforma de sinalização digital, aquelas telas de avisos e mídia espalhadas por corredores, recepções e lojas. Cada tela é ligada a um player de baixo custo feito com [[raspberry-pi|Raspberry Pi]]. Num painel web, o administrador cadastra os players, monta playlists de imagens e vídeos e decide o que cada tela exibe e por quanto tempo.

O projeto nasceu num grupo de colegas do Instituto Federal Catarinense e chegou a ser apresentado na **Latinoware 2025**, o congresso latino-americano de software livre e tecnologias abertas.

### Como funciona

- **Painel administrativo.** Cadastro e login de administradores, com confirmação por e-mail e recuperação de senha. Pelo painel se cadastram players, se envia mídia e se criam playlists, com tempo de exibição por item e reordenação por arrastar e soltar.
- **Players.** Cada Raspberry Pi roda uma página de player em tela cheia, em [[linux|Linux]], que busca a playlist associada a ele e passa as mídias em sequência.
- **Envio de playlists.** Um módulo à parte cuida de levar os arquivos do servidor até o player e de manter as duas pontas sincronizadas.

### Arquitetura

O back-end é em [[php|PHP]] puro, sem framework: um roteador próprio despacha cada requisição para um controller, e as camadas de service, DAO e model separam a regra de negócio do acesso ao banco ([[mysql|MariaDB]], via PDO). O front-end é HTML, CSS e [[javascript|JavaScript]] sem bibliotecas pesadas, para rodar bem também em hardware modesto.

### Minha parte

Participei do começo do projeto, no protótipo do módulo de envio de playlists: o upload de arquivos para o player, a leitura do diretório de mídias no Debian do Raspberry Pi e a troca das imagens antigas pelas novas a cada envio. Hoje não estou mais no desenvolvimento do dia a dia, mas sigo acompanhando o projeto, que continua ativo e evoluindo com a equipe.
