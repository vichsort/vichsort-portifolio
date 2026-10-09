---
title: IArte
summary: An art and artificial intelligence project shown at FECITAC 2024, where visitors drew on a graphics tablet and watched their sketch turn into a landscape on the website.
---

## About the project

**IArte** (a play on "IA", Portuguese for AI, and "arte") started from one question: *does artificial intelligence make art?* Instead of answering with a poster, the group, eight students from the Instituto Federal Catarinense with a teacher as advisor, put the discussion into practice. The project was shown at **FECITAC 2024**, part of the 5th Teaching, Research and Extension Week at IFC Campus Concórdia, over a full day of interactive presentations.

Anyone who stopped by got a graphics tablet and sketched in NVIDIA Canvas, NVIDIA's free tool that uses [[generative-ai|generative AI]] to turn blobs of color into realistic landscapes. Each person picked the materials (sky, water, mountain, grass...) and watched their drawing become an almost photographic image. The conversation ended in a debate between two positions: art as human expression that a machine can't reach, and art as something that has always changed, with AI being just the next chapter.

### The live site

The generated pieces went to a public website so every visitor could find theirs later. The first version was built by Rômulo, one of the group members, with VuePress and GitHub Pages, and that was the one live on the day of the fair. Each new piece was committed to the repository, and a [[github-actions|GitHub Actions]] workflow rebuilt and published the site on its own, so the gallery grew throughout the day without anyone stopping to deploy. By the end, there were 60 pieces.

### The second version

After the fair, we rebuilt the site from scratch in [[vue|Vue]], with better navigation, cards for the pieces, the project's text sections (the idea, the goals and the experience) and a responsive layout. It was also published on GitHub Pages and is now offline.
