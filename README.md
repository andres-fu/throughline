# throughline

> A visual, interactive timeline of a career — because a career isn't a list of jobs, it's the thread that runs through all of them.

## Stack

- React + TypeScript
- Vite
- Vitest + React Testing Library
- D3.js
- Tailwind CSS

## Development

```bash
npm install
npm run dev        # start dev server
npm test           # run tests in watch mode
npm run typecheck  # type check without building
```

## TDD Workflow

This project follows red → green → refactor strictly.
Tests live in `/tests`. No implementation ships without a failing test first.

## Data

Your career data lives in `src/data/career.ts`. It's typed, version-controlled, and yours.
