---
title: Escutas
summary: Rede social de avaliação de álbuns, um "Letterboxd da música", integrada ao Spotify.
---

## Sobre o projeto

O **Escutas** é uma rede social para avaliar álbuns, no espírito do Letterboxd, só que para música. A pessoa entra com a conta do Spotify, ouve, dá nota faixa a faixa e escreve a resenha do álbum. Com o tempo, o perfil vira um diário de escuta, com estatísticas, conquistas e um resumo do mês.

Fiz o projeto sozinho, em dois repositórios: uma API em [[flask|Flask]] e um front-end em [[vue|Vue]].

### O que dá para fazer

- **Resenhas.** Nota por faixa e nota geral, resenhas públicas ou privadas e rascunhos salvos no navegador, com aviso de conflito quando existe mais de uma versão. Cada resenha pode ser exportada como imagem para compartilhar.
- **Álbuns e artistas.** Páginas de álbum e de artista com discografia, alimentadas pela API do Spotify. Também dá para cadastrar álbuns que não estão no Spotify.
- **Perfil.** Calendário de escuta (dia, mês e ano), sequência de dias, níveis, tierlist exportável e "platinas": um artista vira platina quando toda a discografia dele foi avaliada, e o perfil mostra o progresso de cada um.
- **Wrapped mensal.** Um resumo do mês, que também gera uma playlist pública no Spotify.
- **Explorar e blog.** Uma bolha da comunidade com os álbuns mais bem avaliados e um blog com editor rico (Tiptap), em que dá para mencionar álbuns e artistas no meio do texto.

### Decisões técnicas

- **Camadas bem separadas na API.** Controllers recebem a requisição, schemas [[pydantic|Pydantic]] definem o contrato de entrada e saída, services concentram a regra de negócio e as consultas pesadas ficam isoladas em repositórios com [[sqlalchemy|SQLAlchemy]], para não criar "god objects".
- **Banco fazendo o trabalho pesado.** Estatísticas e o Wrapped são agregados direto no [[postgresql|PostgreSQL]], com índices pensados para essas consultas e `joinedload` para evitar N+1. Álbuns e artistas são gravados na primeira leitura e sincronizados com o Spotify depois, sem depender dos ids do Spotify como chave estrangeira.
- **Economia de cota.** Login por OAuth2 do Spotify, com renovação forçada do token nos endpoints críticos, e cache em [[redis|Redis]] para buscas rápidas e resenhas, com invalidação quando algo muda.
- **Testes.** Testes unitários, de integração e de infraestrutura com [[pytest|pytest]], com a API do Spotify simulada por mocks.
- **Front-end.** [[vue|Vue 3]] com [[vite|Vite]], estado em [[pinia|Pinia]], dados pelo TanStack Query e estilo com [[tailwindcss|Tailwind CSS]]. Os layouts mudam por rota, e as preferências (tema, grade ou lista, menu aberto) ficam salvas.

### Próximos passos

O Escutas foi um projeto de aprendizado, e aprendi bastante com ele. Hoje estou reescrevendo o sistema do zero, com tudo o que aprendi desde então, agora sobre o [[supabase|Supabase]].
