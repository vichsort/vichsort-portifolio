---
title: Bratz
summary: Sistema de gestão para mercados feito pela equipe 4Before, com uma API núcleo que escrevi e um app de caixa em Flutter.
---

## Sobre o projeto

O **Bratz** foi um projeto da equipe **4Before** na disciplina de Desenvolvimento Web III, no Instituto Federal Catarinense: um ecossistema de gestão para mercados de bairro, pensado em várias peças que conversam entre si.

- **BratzCORE**, a API núcleo, que escrevi sozinho.
- **BratzCAIXA**, o app de caixa para desktop em [[flutter|Flutter]], feito pelo resto da equipe.
- **BratzADM** e **BratzSTOCK**, um painel web de administração e um app de estoque para celular, que ficaram no planejamento.

O **BratzCORE** é o centro de tudo: cria as contas, guarda os dados e serve todas as outras partes.

### O caixa

O **BratzCAIXA**, em [[flutter|Flutter]] ([[dart|Dart]]), é a tela do operador: login, busca de produtos por código ou nome, carrinho com totais, troco e comprovante, cadastro de clientes com desconto, criação de produtos e descontos e uma tela de finanças. Tudo passa pela API.

### O que a API cobre

- **Contas e permissões.** Login por JWT e contas com privilégios por área, verificados por decoradores (`@token_required`, `@admin_required`), para que o operador de caixa e o gerente vejam coisas diferentes.
- **Cadastros.** Produtos (com ferramentas de preço e descontos por categoria), clientes e fornecedores.
- **Estoque.** Entradas e saídas ligadas às vendas, para o estoque baixar sozinho a cada venda registrada. A baixa trava a linha do estoque e só acontece se houver quantidade suficiente, então duas vendas ao mesmo tempo não deixam o estoque negativo.
- **Finanças.** Registro de venda com os itens vendidos, vendas por caixa, resumos diários e mensais e relatórios de fluxo de vendas, formas de pagamento e margem de lucro.

### Como foi feito

[[flask|Flask]] com blueprints por domínio sob o prefixo `/bratz`, [[sqlalchemy|SQLAlchemy]] sobre [[postgresql|PostgreSQL]], respostas num formato padronizado e tratamento de erros centralizado. Um seeder popula o banco com dados realistas para testar os clientes da API desde o primeiro dia.
