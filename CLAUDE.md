# CLAUDE.md — throughline

This file defines how Claude Code should behave in this repo.
Read this before writing any code.

---

## Project Context

**throughline** is a visual, interactive career timeline web app. It renders a career
as a pure SVG visualization — by company type, tech stack, team composition, and time.
It is a personal learning project. Treat it like a real production codebase — clean, testable, and maintainable.

Stack: React + TypeScript, Vite, Vitest + React Testing Library, D3 (scaleLinear only).
No backend. Career data lives in `src/data/career.ts`. State is persisted to localStorage.

**Architectural rule: the timeline is pure SVG. No HTML elements inside `CareerTimeline`.
All layout is computed geometrically before rendering. This rule applies to all future edits.**

---

## The Three-Phase Rule

**Never start implementing until Phase 1 is complete.**

### Phase 1 — Plan (before any code)
- Explore the affected files (~5 tool calls max before asking questions)
- Propose 2–3 approaches with trade-offs
- Get explicit sign-off on the chosen approach
- If the task is ambiguous, ask one clarifying question at a time
- Save a brief decision note to `docs/decisions/YYYY-MM-DD_<slug>.md`

### Phase 2 — Build (one module at a time)
- Follow TDD: write the failing test first, make it pass, then refactor
- Run the specific test by name during red-green — don't run the full suite until done
- One logical unit of work per session — don't sprawl

### Phase 3 — Review (fresh eyes, every time)
- After building, stop and review the diff as if you didn't write it
- Check against the review checklist below before calling anything done

---

## Code Standards

- **Clarity over cleverness** — if it needs a comment to explain, rewrite it
- **Explicit error handling** — no silent failures, no bare catch blocks
- **No hidden side effects** — functions do what their name says, nothing else
- **Small, focused modules** — if a file is getting long, it's probably doing too much
- **No comments** — well-named identifiers are the documentation

---

## Testing Conventions

- Every non-trivial function gets a test
- Test behavior, not implementation details
- No mocking what you own — if you need to mock your own module, the design is off
- Tests live in `tests/` mirroring `src/` structure

---

## Review Checklist

Before marking any work done, verify:

- [ ] Does it match what was agreed in Phase 1?
- [ ] Are edge cases handled (empty arrays, invalid dates, missing fields)?
- [ ] Is there anything that would be confusing to read in 3 months?
- [ ] Are tests actually testing the right thing?

---

## Project Structure

```
throughline/
├── docs/
│   └── decisions/          # One markdown file per significant decision
├── src/
│   ├── data/
│   │   └── career.ts       # Source of truth — career data model and entries
│   ├── utils/              # Pure transformer functions (most testable layer)
│   │   ├── calculateDuration.ts
│   │   ├── createBlankEntry.ts
│   │   ├── exportSvgToPng.ts
│   │   ├── formatDuration.ts
│   │   ├── groupByCompanyType.ts
│   │   ├── layoutChips.ts  # Geometry-first chip row layout for SVG
│   │   └── sortEntriesByDate.ts
│   ├── components/
│   │   ├── CareerTimeline.tsx   # Pure SVG timeline — all layout computed before render
│   │   ├── EntryDrawer.tsx      # Sidebar form with draft state pattern
│   │   ├── CompanyInfoSection.tsx
│   │   ├── RolesSection.tsx     # Includes collapsible team composition per role
│   │   └── TechStackSection.tsx
│   ├── hooks/
│   │   └── usePersistedEntries.ts  # localStorage persistence
│   └── main.tsx
├── tests/               # Mirrors src/ structure
├── CLAUDE.md            # This file
└── README.md
```

---

## What NOT to Do

- Don't modify multiple unrelated modules in one session
- Don't skip Phase 1 because the task "seems small"
- Don't write tests after the fact
- Don't leave TODO comments — either do it now or log a decision note
- Don't push without running the review checklist

---

## Decision Log Format

When saving to `docs/decisions/`:

```markdown
# YYYY-MM-DD — <short title>

## What was decided
...

## Why
...

## Alternatives considered
...

## Trade-offs accepted
...
```
