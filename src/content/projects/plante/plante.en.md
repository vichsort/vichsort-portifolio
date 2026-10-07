---
title: PlantE
summary: Photo-based plant identification for home growers, with guided care and an open database of Brazilian flora built through citizen science.
---

## About the project

**PlantE** ("more than in the soil") turns a phone camera into a plant tutor. People photograph a plant and get its scientific and common names, botanical family and a full species profile. From there, the plant joins a virtual garden with watering and pruning reminders, weather alerts and pest and disease diagnosis.

Behind it is a bigger goal: fighting plant blindness and building an [[open-data|open]] database of Brazil's household flora. Every confirmed identification is anonymized and becomes a geotagged record that researchers, schools and ESG initiatives can use.

It's my favorite project, and it's being rewritten from scratch. In the new version, the API already exposes authentication, profile and identification; the garden, diagnosis and care schedule already exist in the domain and are still getting their routes.

### The consensus engine

No [[computer-vision|computer vision]] API is always right, so PlantE queries two at once, Kindwise and PlantNet, and a domain policy settles the result:

- **Same species:** the final confidence is a weighted average of both (60% Kindwise, 40% PlantNet).
- **Same genus, different species:** the more confident one wins, and the result is flagged as low confidence.
- **Full disagreement:** Kindwise wins, unless PlantNet is at least 20 points more confident.
- **One source failed:** the other one takes over alone.

[[gemini|Gemini]] then enriches the species with a profile in Portuguese, accessible to laypeople and detailed enough for researchers.

### Architecture

The backend, in [[python|Python]] with [[fastapi|FastAPI]], follows hexagonal architecture (ports and adapters). The domain holds entities, value objects (confidence, care streak, subscription tier, coordinates), policies and more than twenty use cases, without importing any infrastructure. Everything external comes in through a port with an adapter:

- **AI:** Kindwise, PlantNet and Gemini
- **Persistence:** [[postgresql|PostgreSQL]] with async [[sqlalchemy|SQLAlchemy]] and Alembic
- **Cache and tokens:** [[redis|Redis]]
- **Images and email:** S3 and SES, on [[aws|AWS]]
- **Weather and geocoding:** Open-Meteo and Nominatim
- **Push notifications:** [[firebase|Firebase]] Cloud Messaging

Dependency injection lives in its own container. Domain events go out through a [[celery|Celery]]-backed publisher, and workers handle reminders and idempotent anonymization of samples after 30 days. A subscription policy separates the free tier, with limits on plants and daily identifications, from the paid one, which unlocks deep AI analysis. Achievements and care streaks keep people engaged.

### From prototype to current version

The first version, from 2025, was a [[flask|Flask]] backend running on an EC2 instance, with a [[flutter|Flutter]] app organized into features with Cubit. It validated the idea (identification, virtual garden, notifications and achievements) and exposed the limits of a coupled structure. The rewrite swapped Flask for async FastAPI, the single identifier for the consensus engine and layer-based organization for hexagonal architecture.

The institutional website, in [[react|React]] with [[tailwindcss|Tailwind]] and published on [[cloudflare|Cloudflare]], presents the initiative, the technology and partnership tracks with universities, schools and ESG investors.
