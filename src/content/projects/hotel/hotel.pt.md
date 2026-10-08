---
title: Hotel MVP
summary: MVP de gestão de reservas para pequenos hotéis, que junta pedidos manuais, planilhas do Booking.com e um chat no site do hotel num só painel.
---

## Sobre o projeto

O **Hotel MVP** é a demonstração de um sistema de reservas para hotéis pequenos, que ainda controlam tudo em caderno ou planilha. A ideia é digitalizar esse controle sem obrigar o hotel a mudar o jeito de trabalhar: os pedidos continuam chegando pelos mesmos lugares, só que agora caem todos no mesmo painel.

São três canais de entrada, todos alimentando o mesmo modelo de reserva:

1. **Cadastro manual.** O funcionário lança o pedido direto no painel.
2. **Importação de CSV.** O hotel exporta o extrato do extranet do Booking.com e importa no sistema, sem precisar de integração oficial com a plataforma.
3. **Widget de chat.** Um script que o hotel cola no próprio site abre uma conversa guiada com o visitante e cria a reserva no fim. Os casos que o bot não resolve entram como pendentes, para revisão humana.

O projeto tem dois repositórios: uma API em [[express|Express]] com [[typescript|TypeScript]] e um painel em [[angular|Angular]].

### O painel

Indicadores do dia, situação dos quartos, atividade de check-in e check-out, listas de reservas, hóspedes, funcionários, quartos e categorias, perfil do hotel e um card com o código do widget pronto para copiar. As fotos das categorias sobem direto do navegador para o Cloudinary, com uma assinatura temporária gerada pela API, e o segredo nunca sai do servidor.

### Decisões técnicas

- **Multi-tenant em banco único.** Toda tabela relevante carrega o `hotelId`, e um middleware garante que cada consulta fique restrita ao hotel de quem está logado. Os hóspedes também ficam isolados por hotel, sem um cadastro global de pessoas, o que facilita a vida com a LGPD.
- **Nada de estado duplicado.** Um quarto guarda só o estado físico (disponível, em limpeza, em manutenção, fora de serviço). Se ele está ocupado numa data, isso é calculado a partir das reservas ativas, e a quantidade de quartos de uma categoria vem da contagem dos quartos, para não haver duas fontes de verdade.
- **Um só caminho para criar reservas.** Os três canais passam pelo mesmo serviço, que confere a disponibilidade da categoria e do quarto físico dentro de uma transação. Cada mudança de status fica num histórico imutável, com o funcionário responsável ou a marca de mudança automática.
- **Modelagem cuidadosa.** [[postgresql|PostgreSQL]] serverless no [[neon|Neon]] com Prisma, ids em UUID, enums para todo campo de valores fechados e exclusão lógica nas entidades editáveis.
- **Segurança.** JWT em cookie httpOnly com `sameSite`, CORS com origem fixa, Helmet e rate limit mais rígido no login e na rota pública do widget, que é a única aberta sem autenticação.
- **Organização por domínio.** Tanto a API quanto o painel são divididos em módulos (hotel, funcionários, hóspedes, quartos, categorias, reservas, widget), e cada serviço da API tem testes com Vitest.
