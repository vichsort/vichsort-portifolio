---
title: GNX
summary: A search for movies and shows in theaters through the OMDb API, with a Flask middle API that stores every lookup in PostgreSQL.
---

## About the project

**GNX** was a Web Development III assignment at the Instituto Federal Catarinense: a tool to look up a movie or show by title or IMDb id and see everything about it (release date, runtime, genre, ratings and more).

What makes it more than a search box is the split into two [[flask|Flask]] applications, like a real system:

- **The middle API** takes the query as JSON, calls the public OMDb API and returns the response. Every title found is saved to a [[postgresql|PostgreSQL]] table, accessed directly with psycopg, building a history of searches.
- **The website** is a client of that API: the form sends the search type and value, the site's server forwards it to the API like any REST client would and shows the result on the page.

Since the API is independent from the site, it can also be used directly from a client like Postman or Insomnia.
