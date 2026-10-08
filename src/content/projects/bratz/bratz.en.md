---
title: Bratz
summary: A management system for grocery stores built by the 4Before team, with a core API I wrote and a Flutter checkout app.
---

## About the project

**Bratz** was a project by the **4Before** team for the Web Development III course at the Instituto Federal Catarinense: a management ecosystem for neighborhood grocery stores, designed as several pieces that talk to each other.

- **BratzCORE**, the core API, which I wrote on my own.
- **BratzCAIXA**, the desktop checkout app in [[flutter|Flutter]], built by the rest of the team.
- **BratzADM** and **BratzSTOCK**, a web admin dashboard and a mobile stock app, which stayed on the drawing board.

**BratzCORE** is the center of it all: it creates accounts, stores the data and serves every other piece.

### The checkout

**BratzCAIXA**, in [[flutter|Flutter]] ([[dart|Dart]]), is the cashier's screen: login, product search by code or name, a cart with totals, change and receipt, customer records with discounts, creating products and discounts, and a finance screen. Everything goes through the API.

### What the API covers

- **Accounts and permissions.** JWT login and accounts with per-area privileges, checked by decorators (`@token_required`, `@admin_required`), so a cashier and a manager see different things.
- **Records.** Products (with pricing tools and per-category discounts), customers and suppliers.
- **Stock.** Stock movements tied to sales, so stock goes down automatically with every recorded sale. The update locks the stock row and only goes through if there is enough quantity, so two simultaneous sales can never push stock below zero.
- **Finance.** Sale registration with the items sold, sales per register, daily and monthly summaries, and reports on sales flow, payment methods and profit margin.

### How it was built

[[flask|Flask]] with per-domain blueprints under the `/bratz` prefix, [[sqlalchemy|SQLAlchemy]] on [[postgresql|PostgreSQL]], a standardized response format and centralized error handling. A seeder fills the database with realistic data so the API's clients could be tested from day one.
