---
title: CICC
summary: A carbon footprint calculator for self-service kiosks that turns each person's commute into trees to plant.
---

## About the project

**CICC** (*Calculadora de Impacto de Carbono*, or Carbon Impact Calculator) is an interactive kiosk system built in a partnership between Consórcio Itá and the Instituto Federal Catarinense, Concórdia campus. People at the kiosk log how they got there: distance, vehicle, fuel and how many people rode along. The system computes the CO₂ for that trip and adds it to a live dashboard that shows how many trees it would take to offset the emissions, at 7 trees per metric ton.

### How it works

- **Parameterized calculation.** Emission factors (kg of CO₂ per person-kilometer) vary by vehicle category (car, motorcycle, minibus, city or coach bus), fuel (gasoline, flex, ethanol, diesel, biodiesel) and occupancy. A car carrying five people emits, per person, a fifth of what it does with one.
- **Live dashboard.** Total CO₂, distance traveled, trees to offset, and vehicle and fuel charts drawn with [[d3|D3.js]].
- **Built for kiosks.** It runs full screen in the browser's kiosk mode, with exit shortcuts blocked and a touch-first interface. After 60 seconds without interaction, it returns to the welcome screen.
- **Data export.** Tapping the consortium logo five times opens a PIN-protected CSV download. Data can also be exported through a command-line script or a local network endpoint.

![[form.jpg]]

### Architecture

The [[flask|Flask]] backend is layered (route → service → database adapter), with [[pydantic|Pydantic]] input validation and strict typing. Storage switches by configuration between [[sqlite|SQLite]] in WAL mode, which survives power loss at the kiosk, and [[postgresql|PostgreSQL]]. In production, Flask itself serves the [[vue|Vue 3]] build behind Waitress, without Docker. A single script starts the server and opens the browser in kiosk mode, on Windows or Linux.

![[charts.jpg]]

### My part

I built the project with Gabriel Jappe and Gustavo Peretti. I owned the [[vue|Vue]] frontend: the API connection, the D3 charts and the translation of vehicle and fuel types. I also adapted the system to the consortium's branding and built the spreadsheet export. A year later, I got the system ready to run on the kiosk: the service layer with SQLite and PostgreSQL, the Pydantic schemas, the PIN and export routes, the inactivity composables, the Waitress server and the kiosk-mode scripts.
