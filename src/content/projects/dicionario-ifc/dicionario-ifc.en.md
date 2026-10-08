---
title: Dicionário IFC
summary: A dictionary of a class's slang and inside jokes at IFC, written together in a Google Doc and published as a site automatically.
---

## About the project

**Dicionário IFC** ("IFC Dictionary") started as a joke among friends: a shared Google Doc where the class kept track of the words, nicknames and expressions that only make sense if you lived through the institute, each with a pronunciation, a definition and synonyms. The site turns that document into a real dictionary, with a page per entry.

The point is that nobody has to touch code to write. Editing still happens in Google Docs, the way everyone was already doing it, and the site updates itself.

### How it works

- **From Docs to the repository.** A Google Apps Script exports the document as Markdown and commits it to GitHub whenever the text changes.
- **From Markdown to the site.** Before each build, a Node parser reads the Markdown, spots each entry by its bold term, splits out pronunciation, definition and synonyms, builds a slug and cross-links entries that mention each other. The output is a JSON file the front end imports directly.
- **Publishing.** The commit triggers a new deploy on Vercel, so whatever the class writes in the Doc shows up on the site minutes later.

### The site

Built with [[react|React]], [[vite|Vite]] and [[tailwindcss|Tailwind CSS]]:

- A sidebar with entries grouped by letter in an accordion, and accent-insensitive search.
- A word of the day, picked deterministically from the date so everyone sees the same one.
- A random entry button, a shortcut to the original document and light or dark theme.
- Text-to-speech for the pronunciation through the Web Speech API.
