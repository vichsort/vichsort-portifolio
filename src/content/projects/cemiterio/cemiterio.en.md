---
title: Cemitério Caboclo
summary: Outreach website for an IFC research project on the caboclo memory of Concórdia, Brazil, with a timeline, oral histories, a photo archive and papers.
---

## About the project

The Caboclo Cemetery of Fragosos, in Concórdia, Santa Catarina, holds a part of western Santa Catarina's history that official historiography nearly erased: that of the caboclo population (people of mixed Indigenous and European descent) who settled in the region after the Contestado War, before Italian, German and Polish immigrants arrived. A research project at the Instituto Federal Catarinense recovers that [[cultural-heritage|memory]] through oral history and archival research, and this website is where its results reach the public.

### What's on the site

- **Timeline** of Colonel Miguel Fragoso's life, from 1856 to 1914, in 19 events browsable in a carousel, with the full narrative text available as a PDF or DOCX download.
- **Culture:** eight themes drawn from interviews with residents, such as the origins of the Fragosos community, the Contestado and immigration, childhood, courtship and marriage, each opening in a modal with the account.
- **Gallery** with 35 photos of the cemetery, before and after it was cleaned up, and of the rebuilt cross.
- **Papers** from the project, with the PDF and a ready-made citation in ABNT, APA and BibTeX.
- **Contact** through a form.

### How it was built

It's a [[vue|Vue 3]] SPA with Vue Router and [[vite|Vite]]. All content (timeline, accounts, papers and downloads) lives in JSON files separate from the code, so the research team can update the site without touching components. The original phone photos are downscaled at build time with vite-imagetools, so the site loads well on slow connections. Mobile layout fixes (navbar, cards, modals, timeline) were tracked as GitHub issues.

Beyond the website, I co-authored one of the papers published on it, *Relatos sobre Caboclos: um exercício de narrativa histórica a respeito da população cabocla de Fragosos* (2025).
