---
title: Lago Azul
summary: Painel de análise e previsão de chuva em Santa Catarina, com 16 anos de dados do INMET e previsões de 12 meses por modelo SARIMA.
---

## Sobre o projeto

O **Lago Azul** junta o histórico de chuva de Santa Catarina num só lugar e tenta enxergar o que vem pela frente. Ele ingere os dados [[open-data|abertos]] das estações automáticas do INMET (24 estações, de Chapecó ao litoral, entre 2009 e 2024), guarda tudo num banco relacional e expõe estatísticas e previsões numa API, consumida por um painel web.

### O que ele faz

- **Ingestão em lote.** Um comando lê de uma vez todos os CSVs anuais do INMET, limpa o formato (cabeçalhos de metadados, vírgula decimal, leituras horárias) e grava os registros diários no [[postgresql|PostgreSQL]], com o esquema versionado por migrations.
- **Estatísticas.** Registros diários paginados, chuva acumulada por ano e por mês e o dia mais chuvoso de cada cidade.
- **Previsão.** Para qualquer cidade com histórico suficiente, um modelo SARIMA projeta a chuva dos próximos 12 meses.
- **Painel.** Em [[vue|Vue]] com [[vite|Vite]], com gráficos de acumulado anual, acumulado mensal e previsão desenhados em [[d3|D3]], e um script que sobe back-end e front-end juntos e abre o navegador.

### Decisões técnicas

- **Por que SARIMA.** Chuva tem sazonalidade anual forte, e o componente sazonal do modelo foi feito para isso. Ele também é interpretável (dá para entender por que chegou a uma previsão) e funciona bem com alguns anos de dados, sem precisar de dezenas de variáveis. Os parâmetros são escolhidos automaticamente pelo `auto_arima`, com pandas e statsmodels por baixo.
- **Previsão em cache.** Ajustar o modelo é lento, então a previsão é gerada sob demanda (por `POST` ou pelo terminal), fica em cache com tempo de vida configurável e é lida de forma instantânea pelo `GET`.
- **API organizada.** Em [[flask|Flask]] com application factory, blueprint versionado (`/api/v1`), [[sqlalchemy|SQLAlchemy]] e uma camada de serviços que separa ingestão e previsão das rotas.

### Próximos passos

O projeto está sendo reescrito sobre a plataforma [[databricks|Databricks]], levando a ingestão e a modelagem para uma arquitetura de dados de verdade.
