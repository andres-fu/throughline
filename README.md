# throughline

> A visual, interactive timeline of a career — because a career isn't a list of jobs, it's the thread that runs through all of them.

## What it does

- **Pure SVG timeline** — proportional or equal-width view, with year grid lines and a NOW marker
- **Per-company cards** — company type/stage chips, work type, team composition, and tech stack
- **Structured entry editor** — sidebar drawer with company info, roles, team details (direct reports, org size, breakdown), and tech stack
- **PNG export** — LinkedIn Featured (1584px) or LinkedIn Post (1200px) presets
- **localStorage persistence** — edits survive page refresh; reset to defaults any time

## Stack

- React + TypeScript
- Vite
- Vitest + React Testing Library
- D3 (`scaleLinear` for proportional layout)

## Development

```bash
npm install
npm run dev        # start dev server
npm test           # run tests in watch mode
npm run typecheck  # type check without building
```

## TDD Workflow

Red → green → refactor, strictly. Tests live in `/tests` mirroring `/src`. No implementation ships without a failing test first.

## Data

Career data lives in `src/data/career.ts`. It's typed, version-controlled, and yours. The sidebar editor writes to localStorage; use **Reset to Defaults** to restore the file's contents.
