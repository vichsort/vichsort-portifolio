---
title: Atena
summary: Sistema de gestão educacional para redes de ensino, com API, painel web e um módulo que funciona sem internet.
---

## Sobre o projeto

O **Atena** é um sistema de gestão educacional feito sob encomenda, como freelance, em parceria com o Gabriel Dalle Laste. Ele atende a rede de ensino inteira: escolas, turmas, professores e alunos, e também a parte administrativa que costuma ficar em planilhas soltas. Por ser um projeto de cliente, o código é privado e aqui vai só uma visão geral.

O sistema tem três partes:

- **Lambda, a API.** Em [[nodejs|Node.js]] com [[express|Express]] e [[postgresql|PostgreSQL]], organizada em rotas, controllers, services e models, com validação de entrada em Zod.
- **Beta, o painel web.** Em [[react|React]] com [[typescript|TypeScript]] e [[vite|Vite]], usado pela secretaria, pelas escolas e pelos professores.
- **Gama, o sistema offline.** Uma versão para escolas com internet instável, que guarda os dados no navegador e sincroniza com a API quando a conexão volta.

### O que ele cobre

- **Censo escolar.** Coleta e conferência dos dados de escolas, turmas, professores e matrículas, além da exportação no formato exigido.
- **Vida escolar.** Calendário, avisos, avaliações, boletim, planos de aula e frequência.
- **Gestão.** Estoque central, do qual herdam a biblioteca e a merenda (cardápios e ingredientes no padrão do PNAE), patrimônio com responsáveis, transporte escolar e equipe.
- **Competições.** Campeonatos com fases, rodadas e blocos de questões, e uma parte de gamificação.
- **Painéis.** Um assistente que monta gráficos personalizados sobre os dados da rede e exporta em PDF.

### Decisões técnicas

- **Organização por domínio.** O painel separa o código por módulo de negócio (biblioteca, merenda, censo...), não por camada técnica. Cada módulo reúne páginas, componentes, chamadas à API, hooks e tipos, e a regra é imposta por lint (`eslint-plugin-boundaries`) e documentada num ARCHITECTURE.md. Peças genéricas, como formulário, tabela, wizard e confirmação, ficam num `shared` comum.
- **Offline de verdade.** O Gama roda PostgreSQL dentro do navegador com PGlite, é instalável como PWA e conversa com uma rota `/sync` da API, então funciona na escola sem rede e não só como cache de leitura.
- **Segurança e rastreabilidade.** Autenticação por JWT em cookie, rate limiting, Helmet, logs estruturados com Pino e uma trilha de auditoria nas tabelas principais.
- **Infraestrutura.** Arquivos e o arquivamento do ano letivo no S3, e-mails pelo SES (ambos da [[aws|AWS]]), notificações pelo [[firebase|Firebase]], atualização em tempo real por WebSocket e tarefas agendadas com node-cron.

### Minha parte

Escrevi a maior parte da API e do painel web: modelagem e endpoints dos módulos, o fluxo de autenticação, o censo, o construtor de gráficos e a arquitetura por módulos do frontend. No sistema offline, fiz a implementação da sincronização em cima da base que o Gabriel começou.
