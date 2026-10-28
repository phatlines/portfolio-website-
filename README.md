# phatlines portfolio

The one-page portfolio for phatlines (Muyiwa Adebayo). Direction: **The cut**, a film opening. Headlines in Gebuk.

See `PRD.md`, `PLAN.md`, `COPY.md`, `DESIGN_SYSTEM.md`, `ARCHITECTURE.md`, `AGENTS.md` and `PENDING.md`.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # project list rules
npm run typecheck
npm run build        # production build to dist/
```

- `/` is the site. Add `?nointro` to skip the countdown; `#work/<slug>` opens a project.
- `/prototypes.html` links the two prototypes and the headline font tester (kept until launch).

## Where things live

- `src/content/`: every word (`site.ts`) and every project (`projects.ts`, typed in `types.ts`). Edit copy here only.
- `src/sections/`: TopBar, Hero, Work, Make, About, Contact, in page order.
- `src/components/`: FilmStrip, ProjectOverlay, LoopClip, Intro, Signature, Cursor, Grain, Button, SectionHeading.
- `src/lib/`: `projects.ts` (which projects show, in what order), `motion.ts` (every timing), `reel.ts` (the WebGL hero).
- `src/styles/`: `base.css` and `site.css` (tokens at the top).
- `public/media/`: clips (under 2 MB) and stills (under 500 KB); the tests check both.
- `src/fonts/headline/`: Gebuk (demo) and the other trial fonts.

## Adding a project

Add an entry to `src/content/projects.ts`, put its clip and poster in `public/media/`, run `npm test`. Set `status: "in-progress"` to keep it hidden until it's ready. No component changes.
