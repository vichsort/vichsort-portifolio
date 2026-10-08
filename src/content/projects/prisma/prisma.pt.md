---
title: Projeto Prisma
summary: Dashboard financeiro para pequenas empresas que cruza receitas e despesas com indicadores do Banco Central e gera análises com IA. Finalista do 1º Hackathon do IFC Concórdia.
---

## Sobre o projeto

O **Projeto Prisma** é um dashboard financeiro para pequenas empresas, feito durante o [[hackathon-ifc-2025|1º Hackathon do IFC Campus Concórdia]], em outubro de 2025, onde ficou entre os **finalistas**. A ideia de cruzar os dados do negócio com o cenário de fora vinha do [[hackathon-agro-2024|AgroInsights]], que venceu o hackathon agro do campus no ano anterior. A ideia era ir além da planilha de entradas e saídas: além de mostrar como a empresa está, o painel coloca esses números ao lado do cenário econômico, para ajudar o dono a decidir.

### O que ele faz

- **Painel.** Faturamento, gastos e lucro líquido em tempo real, com gestão de produtos, despesas e receitas.
- **Inteligência de mercado.** Busca indicadores econômicos e séries de sazonalidade do varejo e do turismo no SGS, o sistema de séries temporais do Banco Central, e as projeções do Boletim Focus, ambos [[open-data|dados abertos]].
- **Análise com IA.** Monta um relatório com os números da empresa e o cenário econômico e pede ao GPT uma leitura estratégica, com conversa para aprofundar.
- **Exportação.** Receitas e despesas de um período em CSV, prontas para planilha ou contabilidade.

### Como foi feito

API em [[flask|Flask]] com [[sqlalchemy|SQLAlchemy]] e migrations sobre [[postgresql|PostgreSQL]], autenticação por JWT e dados separados por conta. As consultas ao Banco Central têm nova tentativa em caso de falha e ficam em cache com tempo de vida, para não depender da API externa a cada carregamento. O front-end é em HTML, CSS e [[javascript|JavaScript]] puros, e um comando popula o banco com dados de exemplo para a demonstração.
