---
title: Energin
summary: A real-time dashboard for a micro hydroelectric plant, with data read by a Raspberry Pi.
---

## About the project

**Energin** is the dashboard for a micro hydroelectric plant: water flows in, spins a turbine and the turbine drives the generator. A [[raspberry-pi|Raspberry Pi]] connected to the generator reads the sensors and exposes the measurements through a small API I wrote for it; the site polls that API every two seconds and shows generation live, so anyone watching the presentation can follow along on their phone.

The project won [[feira-energia-limpa-ita|1st place at the Consórcio Itá Clean Energy Fair]].

### What the dashboard shows

- **Live.** A gauge with the turbine's speed (RPM), power (W), voltage (V) and system status.
- **Operating mode.** Speed ranges map to modes (eco, normal and high), each with its own color, so non-technical visitors can tell at a glance what's going on.
- **Generation summary.** Total energy generated in Wh and kWh, average power and voltage, peak RPM and uptime.
- **History.** An area chart of power over time.

### How it was built

The front end is [[vue|Vue 3]] with [[vite|Vite]] and Bootstrap, designed mobile first. The gauge and the history chart are drawn with [[d3|D3]], with smooth transitions between readings. All communication with the API lives in a single composable that polls, keeps the latest state and flags when the Raspberry Pi goes offline.
