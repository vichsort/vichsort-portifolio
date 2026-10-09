---
title: IArte
summary: Projeto de arte e inteligência artificial apresentado na FECITAC 2024, em que o público desenhava numa mesa digitalizadora e via o rascunho virar paisagem no site.
---

## Sobre o projeto

O **IArte** partiu de uma pergunta: *inteligência artificial faz arte?* Em vez de responder com um cartaz, o grupo, formado por oito alunos do Instituto Federal Catarinense com orientação de um professor, levou a discussão para a prática. O projeto foi apresentado na **FECITAC 2024**, dentro da V Semana de Ensino, Pesquisa e Extensão do IFC Campus Concórdia, durante um dia inteiro de apresentações interativas.

Quem passava pela sala recebia uma mesa digitalizadora e fazia um rascunho no NVIDIA Canvas, ferramenta gratuita da NVIDIA que usa [[generative-ai|IA generativa]] para transformar manchas de cor em paisagens realistas. Cada pessoa escolhia os materiais (céu, água, montanha, grama...) e via o próprio desenho virar uma imagem quase fotográfica. A conversa terminava no debate entre duas posições: a arte como expressão humana, que a máquina não alcança, e a arte como algo que sempre mudou, de que a IA seria só o próximo capítulo.

### O site ao vivo

As obras geradas iam para um site público, para cada visitante encontrar a sua depois. A primeira versão foi feita pelo Rômulo, um dos integrantes do grupo, com VuePress e GitHub Pages, e foi ela que ficou no ar no dia da feira. A cada nova obra, as imagens entravam no repositório com um commit e um workflow do [[github-actions|GitHub Actions]] reconstruía e publicava o site sozinho. A galeria foi crescendo ao longo do dia, sem ninguém precisar parar para fazer deploy. No fim, foram 60 obras.

### A segunda versão

Depois da feira, refizemos o site do zero em [[vue|Vue]], com uma navegação mais cuidada, cards com as obras, as seções de texto do projeto (a ideia, os objetivos e a experiência) e layout responsivo. Ele também foi publicado pelo GitHub Pages e hoje está fora do ar.
