---
title: Criptografy
summary: A web lab for experimenting with cryptography, from classic ciphers like Caesar and Hill to AES-256-GCM, SHA and encodings.
---

## About the project

**Criptografy** is a lab for understanding cryptography by playing with it: pick an algorithm, tweak the key or parameters, encrypt, decrypt and see the result right away. The project has gone through two phases and is being rewritten.

### The first version

Version 1.0, nicknamed "Mino", came together in a few days in May 2025, in plain [[javascript|JavaScript]] with Lit web components. It did one thing: encrypt and decrypt text with the Hill cipher, from a random key matrix you could edit by hand. It's still live.

### The rewrite

In September 2026 the project started over from scratch, split into an API and a front end, covering many more algorithms:

- **Classic ciphers:** Caesar, Vigenère and Hill.
- **Modern cryptography:** AES-256-GCM, with a random nonce on every operation and an authentication tag.
- **Hashing:** SHA-256 and SHA-512.
- **Encodings:** Base64 and hex, with a note that they hide nothing.

The **API**, in [[laravel|Laravel]] ([[php|PHP]]), is stateless and stores nothing. Each algorithm is a pure class that implements a contract (reversible cipher, hash or encoding) and describes itself, and a central registry resolves algorithms by identifier. Adding one means writing the class and registering a single line, without touching anything else (the open/closed principle). Controllers are thin, and domain exceptions become 404 or 422 in a single place. A detail that matters in cryptography: the input field skips the framework's automatic trimming, because whitespace and empty strings are valid data (the SHA-256 of an empty string is a well-known value). Unicode, empty strings and large inputs are covered by tests.

The **front end**, in [[nextjs|Next.js]] with [[typescript|TypeScript]], [[tailwindcss|Tailwind CSS]] and shadcn/ui, feels like an IDE: a VS Code-style explorer sidebar with algorithms grouped by category, dedicated controls for each cipher (such as a matrix editor for Hill that checks the key is invertible) and a split console for input and output. Each algorithm is a vertical slice with its own types, Zod schemas and components, and the API integration is tested end to end across all eight algorithms.

### What's next

The rewrite is still in progress.
