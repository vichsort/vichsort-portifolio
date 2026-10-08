---
title: Escutas
summary: A social network for rating albums, a "Letterboxd for music", integrated with Spotify.
---

## About the project

**Escutas** ("listens" in Portuguese) is a social network for rating albums, in the spirit of Letterboxd but for music. You sign in with your Spotify account, listen, rate each track and write a review of the album. Over time, your profile becomes a listening diary with stats, achievements and a monthly recap.

I built it on my own, in two repositories: a [[flask|Flask]] API and a [[vue|Vue]] front end.

### What you can do

- **Reviews.** Per-track and overall ratings, public or private reviews, and drafts saved in the browser, with a conflict warning when more than one version exists. Every review can be exported as an image to share.
- **Albums and artists.** Album and artist pages with discographies, fed by the Spotify API. Albums that aren't on Spotify can be added by hand.
- **Profile.** A listening calendar (day, month and year), streaks, ranks, an exportable tier list and "platinums": an artist goes platinum once you've reviewed their whole discography, and the profile shows your progress on each one.
- **Monthly wrapped.** A recap of the month, which also creates a public playlist on Spotify.
- **Explore and blog.** A community bubble with the best-rated albums, and a blog with a rich text editor (Tiptap) where you can mention albums and artists inline.

### Technical decisions

- **Clearly separated layers in the API.** Controllers take the request, [[pydantic|Pydantic]] schemas define the input and output contract, services hold the business rules, and heavy queries are isolated in [[sqlalchemy|SQLAlchemy]] repositories to avoid god objects.
- **Letting the database do the heavy lifting.** Stats and the wrapped are aggregated directly in [[postgresql|PostgreSQL]], with indexes designed for those queries and `joinedload` to avoid N+1. Albums and artists are stored on first read and synced with Spotify later, without using Spotify ids as foreign keys.
- **Saving API quota.** Spotify OAuth2 login, with forced token refresh on critical endpoints, and a [[redis|Redis]] cache for quick search and reviews, invalidated when something changes.
- **Tests.** Unit, integration and infrastructure tests with [[pytest|pytest]], with the Spotify API mocked out.
- **Front end.** [[vue|Vue 3]] with [[vite|Vite]], state in [[pinia|Pinia]], data through TanStack Query and styling with [[tailwindcss|Tailwind CSS]]. Layouts change per route, and preferences (theme, grid or list, open menu) are saved.

### What's next

Escutas was a learning project, and I learned a lot from it. I'm now rewriting it from scratch, with everything I've learned since.
