---
title: PlantE
summary: Identificação botânica por foto para quem cultiva em casa, com cuidados guiados e uma base aberta da flora brasileira construída por ciência cidadã.
---

## Sobre o projeto

O **PlantE** ("mais que no solo") transforma a câmera do celular num tutor de plantas. A pessoa fotografa uma planta e recebe o nome científico e popular, a família botânica e uma ficha completa da espécie. A partir daí, a planta entra num jardim virtual com lembretes de rega e poda, alertas de clima e diagnóstico de pragas e doenças.

Por trás disso tem um objetivo maior: combater a cegueira botânica e construir uma base de dados [[open-data|aberta]] da flora doméstica brasileira. Cada identificação confirmada é anonimizada e vira um registro georreferenciado que pesquisadores, escolas e iniciativas ESG podem usar.

É o meu projeto favorito, e está sendo reescrito do zero. Na versão nova, a API já expõe autenticação, perfil e identificação; o jardim, o diagnóstico e a agenda de cuidados já existem no domínio e ainda estão ganhando rotas.

### O motor de consenso

Nenhuma API de [[computer-vision|visão computacional]] acerta sempre, então o PlantE consulta duas ao mesmo tempo, Kindwise e PlantNet, e uma política de domínio decide o resultado:

- **Mesma espécie:** a confiança final é a média ponderada das duas (60% Kindwise, 40% PlantNet).
- **Mesmo gênero, espécies diferentes:** vence a mais confiante, e o resultado sai marcado como de baixa confiança.
- **Desacordo total:** a Kindwise vence, a não ser que a PlantNet esteja pelo menos 20 pontos mais confiante.
- **Uma das fontes falhou:** a outra assume sozinha.

Depois o [[gemini|Gemini]] enriquece a espécie com uma ficha em português, acessível para leigos e detalhada o bastante para quem pesquisa.

### Arquitetura

O backend, em [[python|Python]] com [[fastapi|FastAPI]], segue arquitetura hexagonal (ports and adapters). O domínio tem entidades, value objects (confiança, sequência de dias cuidando, plano de assinatura, coordenadas), políticas e mais de vinte casos de uso, sem importar nada de infraestrutura. Tudo o que é externo entra por uma porta com um adaptador:

- **IA:** Kindwise, PlantNet e Gemini
- **Persistência:** [[postgresql|PostgreSQL]] com [[sqlalchemy|SQLAlchemy]] assíncrono e Alembic
- **Cache e tokens:** [[redis|Redis]]
- **Imagens e e-mail:** S3 e SES, na [[aws|AWS]]
- **Clima e geocodificação:** Open-Meteo e Nominatim
- **Notificações push:** [[firebase|Firebase]] Cloud Messaging

A injeção de dependência fica num container próprio. Os eventos de domínio saem por um publicador que usa o [[celery|Celery]], e os workers cuidam dos lembretes e da anonimização das amostras depois de 30 dias, de forma idempotente. Uma política de assinatura separa o plano gratuito, com limite de plantas e de identificações diárias, do pago, que libera a análise profunda com IA. Para engajar, há conquistas e sequências de cuidado.

### Do protótipo à versão atual

A primeira versão, de 2025, foi um backend em [[flask|Flask]] rodando numa instância EC2, com um app em [[flutter|Flutter]] organizado em features com Cubit. Ela validou a ideia (identificação, jardim virtual, notificações e conquistas) e mostrou os limites de uma estrutura acoplada. A reescrita trocou o Flask por FastAPI assíncrono, o identificador único pelo motor de consenso e a organização por camadas pela arquitetura hexagonal.

O site institucional, em [[react|React]] com [[tailwindcss|Tailwind]] e publicado na [[cloudflare|Cloudflare]], apresenta a iniciativa, a tecnologia e as frentes de parceria com universidades, escolas e investidores ESG.
