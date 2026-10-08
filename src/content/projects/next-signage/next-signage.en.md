---
title: Next Signage
summary: A Brazilian digital signage platform that registers Raspberry Pi players and plays playlists of images and videos on them.
---

## About the project

**Next Signage** is a digital signage platform, the kind of screens showing notices and media in hallways, lobbies and shops. Each screen is driven by a low-cost [[raspberry-pi|Raspberry Pi]] player. From a web dashboard, an administrator registers players, builds playlists of images and videos and decides what each screen shows and for how long.

The project started among a group of classmates at the Instituto Federal Catarinense and became research: it was presented at the campus [[sinalizacao-digital|15th Scientific Initiation Exhibition]] and published as a paper in the proceedings of **Latinoware 2025**, the Latin American conference on free software and open technologies ([[sinalizacao-latinoware|read the paper]]).

### How it works

- **Admin dashboard.** Admin sign-up and login, with email confirmation and password recovery. The dashboard is where players are registered, media is uploaded and playlists are built, with a display time per item and drag-and-drop reordering.
- **Players.** Each Raspberry Pi runs a [[python|Python]] client on [[linux|Linux]] that fetches its assigned playlist and plays the media in sequence, full screen.
- **Playlist delivery.** A separate module carries the files from the server to the player and keeps both ends in sync.

### Architecture

The back end is plain [[php|PHP]] with no framework: a custom router dispatches each request to a controller, and service, DAO and model layers keep business rules apart from database access ([[mysql|MariaDB]], through PDO). The front end is HTML, CSS and [[javascript|JavaScript]] with no heavy libraries, so it also runs well on modest hardware.

### My part

I was there at the start, on the prototype of the playlist delivery module: uploading files to the player, reading the media directory on the Raspberry Pi's Debian and replacing old images with new ones on each upload. I'm no longer in the day-to-day development, but I keep following the project, which is still active and growing with the team.
