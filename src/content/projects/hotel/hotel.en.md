---
title: Hotel MVP
summary: A booking management MVP for small hotels that brings manual bookings, Booking.com spreadsheets and a chat on the hotel's website into one dashboard.
---

## About the project

**Hotel MVP** is a demo of a booking system for small hotels that still track everything in notebooks or spreadsheets. The idea is to digitize that without forcing the hotel to change how it works: bookings keep coming from the same places, but now they all land in the same dashboard.

There are three entry channels, all feeding the same booking model:

1. **Manual entry.** Staff enter the booking straight into the dashboard.
2. **CSV import.** The hotel exports a statement from the Booking.com extranet and imports it, with no official platform integration needed.
3. **Chat widget.** A script the hotel pastes into its own website opens a guided conversation with the visitor and creates the booking at the end. Cases the bot can't handle come in as pending, for human review.

The project has two repositories: an [[express|Express]] API in [[typescript|TypeScript]] and an [[angular|Angular]] dashboard.

### The dashboard

Today's KPIs, room status, check-in and check-out activity, lists of bookings, guests, staff, rooms and room types, the hotel profile and a card with the widget snippet ready to copy. Room type photos upload straight from the browser to Cloudinary with a short-lived signature from the API, so the secret never leaves the server.

### Technical decisions

- **Multi-tenant on a single database.** Every relevant table carries a `hotelId`, and a middleware keeps each query scoped to the logged-in user's hotel. Guests are also isolated per hotel, with no global people table, which makes LGPD (Brazil's data protection law) compliance easier.
- **No duplicated state.** A room stores only its physical state (available, cleaning, maintenance, out of service). Whether it's occupied on a given date is computed from active bookings, and a room type's room count comes from counting rooms, so there are never two sources of truth.
- **One path to create bookings.** All three channels go through the same service, which checks room type and physical room availability inside a transaction. Every status change goes into an immutable history, with the staff member responsible or a mark for automatic changes.
- **Careful modeling.** Serverless [[postgresql|PostgreSQL]] on [[neon|Neon]] with Prisma, UUID ids, enums for every closed set of values and soft deletes on editable entities.
- **Security.** JWT in an httpOnly cookie with `sameSite`, CORS locked to a fixed origin, Helmet and stricter rate limits on login and on the widget's public route, the only one open without authentication.
- **Organized by domain.** Both the API and the dashboard are split into modules (hotel, staff, guests, rooms, room types, bookings, widget), and every API service has Vitest tests.
