# Leonida Legend — GTA VI Trophy Guide &amp; Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/lbs16st/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/lbs16st/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline web guide and tracker for all **55 Grand Theft Auto VI trophies** on PlayStation 5 — built for the [make.fun bounty](https://make.fun/bounty/gta6-trophy-guide-01). Open `app/index.html` in a desktop browser; it works with the network off.

## What it does

- **Every trophy, verified.** Official names, descriptions and grades for all 55 trophies (1 platinum, 2 gold, 6 silver, 46 bronze), verified 19 November 2026 against Exophase and PSNProfiles — the two lists agree on all 55, including PSN progress targets (250 stunts, 42 shooting-range challenges, 14 drone-race locations, 18 meditation spots, 52 areas of Leonida).
- **An original guide for every trophy, with its sources.** Each trophy has a how-to written in our own words, with named source links beside it (Exophase, PSNProfiles, PowerPyx). Where the guide sites mark a method as not yet known (5 trophies), this guide says so plainly instead of inventing a method.
- **A road to the platinum.** Difficulty 4/10, about 200 hours, 1 playthrough, 0 online trophies — in three steps: story first, then the 100% checklist, then cleanup.
- **The one missable trophy, flagged.** Positive Mental Attitude is the only trophy reported as possibly missable (a Chapter 1 meditation at Jason's house). It gets a warning banner and its own tag.
- **A checklist that lives in your browser.** Tick trophies off; progress is saved in localStorage, with export/import (JSON) and reset. Filter by kind (story, missable, collectibles, activities, online), grade, or search; sort by list order, grade, or name; hide earned trophies. Filtered views are shareable (`?kind=story&grade=silver&q=meditate`).
- **A spoiler setting.** Story trophy names and descriptions stay blurred until earned (on by default); turn it off to reveal them.

## Run it

```sh
node serve.ts        # serves app/ on http://localhost:8080
```

Or open `app/index.html` directly. No build step, no dependencies, no network requests — the app loads only its own files.

## Files

- `app/index.html`, `app/style.css`, `app/app.js` — the guide itself.
- `app/data/trophies.json` — the 55 trophies with guides and sources.
- `screenshots/` — renders of the guide.
- `main.ts` — copies `app/` and `screenshots/` to the output directory and writes `dossier.json` (Node 22, standard library only; `vendor/makefun-frontend.ts` is the vendored make.fun library, unchanged).
- `serve.ts` — tiny static server for local testing.

## Sources

- Trophy names, descriptions, grades: [Exophase](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/) and [PSNProfiles](https://psnprofiles.com/trophies/43531-grand-theft-auto-vi)
- How-to details and roadmap: [PowerPyx — GTA 6 Trophy Guide &amp; Roadmap](https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/)
- Missable warning cross-checked with [GTA Zone](https://gta-zone.com/news/gta-6-trophies-achievements/)

## Disclaimer

Unofficial fan guide. Not affiliated with, endorsed by, or connected to Rockstar Games or Take-Two Interactive. Grand Theft Auto, GTA, and related marks are trademarks of Take-Two Interactive. No official artwork or logos are used; the design is original. Game released 19 November 2026; guide data verified 19 November 2026.
