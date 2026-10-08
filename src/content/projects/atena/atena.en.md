---
title: Atena
summary: An education management system for school networks, with an API, a web dashboard and a module that works without internet.
---

## About the project

**Atena** is a custom education management system, built as a freelance job together with Gabriel Dalle Laste. It covers a whole school network: schools, classes, teachers and students, plus the administrative side that usually lives in scattered spreadsheets. Since it is client work, the code is private and this is only an overview.

The system has three parts:

- **Lambda, the API.** Built with [[nodejs|Node.js]], [[express|Express]] and [[postgresql|PostgreSQL]], split into routes, controllers, services and models, with input validation in Zod.
- **Beta, the web dashboard.** Built with [[react|React]], [[typescript|TypeScript]] and [[vite|Vite]], used by the education office, schools and teachers.
- **Gama, the offline system.** A version for schools with unreliable internet that stores data in the browser and syncs with the API once the connection is back.

### What it covers

- **School census.** Collecting and checking data on schools, classes, teachers and enrollments, and exporting it in the required format.
- **School life.** Calendar, announcements, assessments, report cards, lesson plans and attendance.
- **Administration.** A central inventory that the library and school meals (menus and ingredients following Brazil's PNAE program) build on, assets with assigned owners, school transport and staff.
- **Competitions.** Championships with phases, rounds and question blocks, plus gamification.
- **Dashboards.** A wizard that builds custom charts over the network's data and exports them to PDF.

### Technical decisions

- **Organized by domain.** The dashboard groups code by business module (library, meals, census...) rather than by technical layer. Each module holds its pages, components, API calls, hooks and types, and the rule is enforced by lint (`eslint-plugin-boundaries`) and written down in an ARCHITECTURE.md. Generic pieces such as the form, table, wizard and confirm dialog live in a common `shared` folder.
- **Truly offline.** Gama runs PostgreSQL inside the browser with PGlite, installs as a PWA and talks to a `/sync` route on the API, so it works at a school with no network instead of only caching reads.
- **Security and traceability.** JWT auth in a cookie, rate limiting, Helmet, structured logs with Pino and an audit trail on the main tables.
- **Infrastructure.** Files and end-of-year archiving on S3, email through SES (both [[aws|AWS]]), notifications through [[firebase|Firebase]], real-time updates over WebSocket and scheduled jobs with node-cron.

### My part

I wrote most of the API and the web dashboard: data modeling and endpoints for the modules, the auth flow, the census, the chart builder and the frontend's module architecture. On the offline system, I implemented sync on top of the base Gabriel started.
