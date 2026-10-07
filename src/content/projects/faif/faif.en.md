---
title: FAIF
summary: An app and API that bring Brazilian federal open data (congress members, budget amendments, company registry, IBGE) behind a single interface.
---

## About the project

**FAIF** (*Facilitador de Acesso à Informação Federal*, or Federal Information Access Facilitator) started at the Instituto Federal Catarinense as a tool for political awareness: instead of navigating half a dozen government portals, each with its own format, people query everything in one place. It was a team project with two parts: an intermediary API in [[flask|Flask]] and a [[flutter|Flutter]] app.

### The API

The API is a middleware over official [[open-data|open data]] sources:

- **Chamber of Deputies**: search congress members by name and fetch each one's details.
- **Transparency Portal (CGU)**: parliamentary budget amendments, civil servants and individual lookup by CPF and NIS.
- **BrasilAPI**: company registry (CNPJ) and postal codes (CEP).
- **IBGE**: metadata for the national statistics institute's surveys.
- **gov.br portal**: public agencies and services.

Every source answers differently; FAIF normalizes them all into the same envelope (`{ ok, data }` on success, `{ ok, error: { code, message, details } }` on failure), so the app consumes one predictable API. It is structured as an application factory with one blueprint per source and a service layer that holds the normalization. Requests are logged to a history table in [[postgresql|PostgreSQL]] through [[sqlalchemy|SQLAlchemy]], with Alembic migrations and parameter truncation to keep the database small.

### The app

The [[flutter|Flutter]] app has screens for congress members (list and details), amendments, CNPJ and IBGE surveys, plus a unified search that switches between those domains. A settings screen, with global state through Provider, controls light or dark theme and font size, with accessibility in mind.

### My part

I started both repositories and built the API's foundation: the Transparency Portal and IBGE integrations, the normalizers, the blueprint split, the health check, congress member search and the request history. On the app, I made the wireframes, the Provider state management, navigation to congress member details and the refactor of the CNPJ, IBGE and amendments screens.
