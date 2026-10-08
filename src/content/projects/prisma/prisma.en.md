---
title: Projeto Prisma
summary: A financial dashboard for small businesses that combines revenue and expenses with Brazilian Central Bank indicators and AI analysis. Finalist at the 1st IFC Concórdia Hackathon.
---

## About the project

**Projeto Prisma** is a financial dashboard for small businesses, built during the [[hackathon-ifc-2025|1st IFC Campus Concórdia Hackathon]] in October 2025, where it made the **finals**. The idea of combining business data with the outside picture came from [[hackathon-agro-2024|AgroInsights]], which won the campus agro hackathon the year before. The idea was to go beyond an income-and-expenses spreadsheet: besides showing how the business is doing, the dashboard puts those numbers next to the economic picture to help the owner make decisions.

### What it does

- **Dashboard.** Revenue, expenses and net profit in real time, with management of products, expenses and income.
- **Market intelligence.** Pulls economic indicators and retail and tourism seasonality series from SGS, the Brazilian Central Bank's time series system, plus Focus Bulletin forecasts, both [[open-data|open data]].
- **AI analysis.** Builds a report with the business's numbers and the economic picture and asks GPT for a strategic reading, with a chat to dig deeper.
- **Export.** Income and expenses for a period as CSV, ready for spreadsheets or accounting.

### How it was built

A [[flask|Flask]] API with [[sqlalchemy|SQLAlchemy]] and migrations on [[postgresql|PostgreSQL]], JWT authentication and data scoped per account. Central Bank requests retry on failure and are cached with a lifetime, so pages don't hit the external API on every load. The front end is plain HTML, CSS and [[javascript|JavaScript]], and a command seeds the database with sample data for the demo.
