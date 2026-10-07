---
title: Cemitério Caboclo
summary: Site de divulgação de uma pesquisa do IFC sobre a memória cabocla de Concórdia, com linha do tempo, relatos orais, acervo fotográfico e artigos.
---

## Sobre o projeto

O Cemitério Caboclo de Fragosos, em Concórdia (SC), guarda uma parte da história do oeste catarinense que a historiografia oficial quase apagou: a da população cabocla que se estabeleceu na região depois da Guerra do Contestado, antes da chegada dos imigrantes italianos, alemães e poloneses. Um projeto de pesquisa do Instituto Federal Catarinense resgata essa [[cultural-heritage|memória]] com história oral e pesquisa documental, e este site é onde os resultados chegam ao público.

### O que tem no site

- **Linha do tempo** da vida do coronel Miguel Fragoso, de 1856 a 1914, em 19 eventos navegáveis num carrossel, com a versão completa em texto corrido para baixar em PDF ou DOCX.
- **Cultura:** oito temas tirados das entrevistas com moradores, como a origem da comunidade de Fragosos, o Contestado e a imigração, infância, namoro e casamento, cada um aberto num modal com o relato.
- **Galeria** com 35 fotos do cemitério, antes e depois da limpeza, e da cruz reconstruída.
- **Artigos** do projeto, com o PDF e a citação pronta em ABNT, APA e BibTeX.
- **Contato** por formulário.

### Como foi feito

É uma SPA em [[vue|Vue 3]] com Vue Router e [[vite|Vite]]. Todo o conteúdo (linha do tempo, relatos, artigos e downloads) fica em arquivos JSON separados do código, então a equipe de pesquisa atualiza o site sem mexer em componente. As fotos originais, de celular, passam por redução de resolução no build com o vite-imagetools, para o site carregar bem em conexões lentas. Os ajustes de layout no mobile (navbar, cards, modais, linha do tempo) foram organizados em issues no GitHub.

Além do site, sou coautor de um dos artigos publicados nele, *Relatos sobre Caboclos: um exercício de narrativa histórica a respeito da população cabocla de Fragosos* (2025).
