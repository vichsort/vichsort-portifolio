---
title: trucaralho
summary: A Flutter card games app, from truco to poker, that started as a chip tracker and is being rewritten on top of a pure Dart truco engine.
---

## About the project

**trucaralho** (a cheeky mix of *truco* and *baralho*, Portuguese for a deck of cards) is a card games app for playing with friends: truco, blackjack, fodinha and poker, with bets in virtual chips and no real money. It has gone through three versions, each one a step up.

### First version: the tracker

The first version, from May 2025, built in [[flutter|Flutter]] with a classmate, was a table companion: the physical deck did the playing, and the app handled chips, bets, scores and history for each of the four games, with a rules guide for each. I took the logic: bets, history, poker and the per-game module structure.

### Second version: playable truco

In the second, in July and August 2025 with a larger group, truco became a real game against the phone: cards on the table, calling truco, six, nine and twelve, notifications and vibration, and past matches saved to resume later. My part was the opponent's automatic play following truco rules, cleaning up the code and navigation, and the look of out-of-play cards.

### The rewrite

I'm now rewriting the project on my own, starting with what the other versions lacked: a solid rules engine. The core is pure [[dart|Dart]] with no Flutter dependency, and the UI comes later.

- **Complete Truco Paulista.** 2- or 4-player matches in teams, a 40-card deck with the *vira* and trump cards, tricks and ties, the "hand of eleven", scoring and the whole truco raise negotiation.
- **Generic engine.** Lifecycle, actions, state and serialization are abstract, so other card games can reuse the same base. State is validated on every action and can be saved and restored, with versioning.
- **Separate pieces.** The AI (one random, one basic), match history and local persistence live outside the engine behind interfaces, and an application layer sets up 1v1 and 2v2 matches with players, teams and AI.
- **Quality.** Strict static analysis, unit and end-to-end tests and CI on [[github-actions|GitHub Actions]].
