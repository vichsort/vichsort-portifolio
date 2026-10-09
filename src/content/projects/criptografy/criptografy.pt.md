---
title: Criptografy
summary: Laboratório web para experimentar criptografia, de cifras clássicas como César e Hill a AES-256-GCM, SHA e codificações.
---

## Sobre o projeto

O **Criptografy** é um laboratório para entender criptografia mexendo nela: você escolhe um algoritmo, ajusta a chave ou os parâmetros, cifra, decifra e vê o resultado na hora. O projeto já passou por duas fases e está sendo reescrito.

### A primeira versão

A versão 1.0, apelidada de "Mino", nasceu em poucos dias, em novembro de 2024, em [[javascript|JavaScript]] puro com Web Components em Lit. Ela fazia uma coisa só: cifrar e decifrar texto com a cifra de Hill, a partir de uma matriz-chave aleatória que dava para editar à mão. A ideia era mostrar o poder das matrizes: com uma única matriz aleatória dá para cifrar de senhas e textos até imagens. Ainda está no ar.

### A reescrita

Em setembro de 2026, o projeto recomeçou do zero, separado em API e front-end, cobrindo bem mais algoritmos:

- **Cifras clássicas:** César, Vigenère e Hill.
- **Criptografia moderna:** AES-256-GCM, com nonce aleatório a cada operação e tag de autenticação.
- **Hash:** SHA-256 e SHA-512.
- **Codificações:** Base64 e hexadecimal, com o aviso de que não escondem nada.

A **API**, em [[laravel|Laravel]] ([[php|PHP]]), é stateless e não guarda nada. Cada algoritmo é uma classe pura que implementa um contrato (cifra reversível, hash ou codificação) e se descreve sozinha, e um registro central resolve o algoritmo pelo identificador. Adicionar um novo é criar a classe e registrar uma linha, sem tocar no resto (princípio aberto/fechado). Os controllers são finos e as exceções de domínio viram 404 ou 422 num só lugar. Um detalhe que importa em criptografia: o campo de entrada escapa da limpeza automática do framework, porque espaços e string vazia são dados válidos (o SHA-256 da string vazia é um valor conhecido). Os casos de Unicode, string vazia e entradas grandes estão cobertos por testes.

O **front-end**, em [[nextjs|Next.js]] com [[typescript|TypeScript]], [[tailwindcss|Tailwind CSS]] e shadcn/ui, parece uma IDE: um explorador lateral no estilo do VS Code, com os algoritmos por categoria, controles próprios para cada cifra (como um editor de matriz para a de Hill, que confere se a chave tem inversa) e um console dividido para entrada e saída. Cada algoritmo é uma fatia vertical com tipos, schemas Zod e componentes próprios, e a integração com a API é testada de ponta a ponta nos oito algoritmos.

### Próximos passos

A reescrita ainda está em andamento.
