---
title: Lago Azul
summary: A rainfall analysis and forecasting dashboard for Santa Catarina, Brazil, built on 16 years of INMET data with 12-month SARIMA forecasts.
---

## About the project

**Lago Azul** ("Blue Lake") puts Santa Catarina's rainfall history in one place and tries to see what's coming. It ingests [[open-data|open data]] from INMET's automatic weather stations (Brazil's national meteorology institute; 24 stations across the state, from 2009 to 2024), stores it in a relational database and serves stats and forecasts through an API that feeds a web dashboard.

### What it does

- **Batch ingestion.** One command reads every yearly INMET CSV at once, cleans up the format (metadata headers, decimal commas, hourly readings) and stores daily records in [[postgresql|PostgreSQL]], with the schema versioned through migrations.
- **Stats.** Paginated daily records, yearly and monthly accumulated rainfall and each city's wettest day on record.
- **Forecasting.** For any city with enough history, a SARIMA model projects rainfall for the next 12 months.
- **Dashboard.** Built with [[vue|Vue]] and [[vite|Vite]], with yearly accumulation, monthly accumulation and forecast charts drawn in [[d3|D3]], plus a script that starts back end and front end together and opens the browser.

### Technical decisions

- **Why SARIMA.** Rainfall has strong yearly seasonality, and the model's seasonal component is built for exactly that. It's also interpretable (you can see why it reached a forecast) and works well with a few years of data, without needing dozens of features. Parameters are picked automatically by `auto_arima`, with pandas and statsmodels underneath.
- **Cached forecasts.** Fitting the model is slow, so forecasts are generated on demand (via `POST` or the CLI), cached with a configurable lifetime and read instantly through `GET`.
- **A tidy API.** [[flask|Flask]] with an application factory, a versioned blueprint (`/api/v1`), [[sqlalchemy|SQLAlchemy]] and a service layer that keeps ingestion and forecasting out of the routes.

### What's next

The project is being rewritten on the [[databricks|Databricks]] platform, moving ingestion and modeling onto a proper data architecture.
