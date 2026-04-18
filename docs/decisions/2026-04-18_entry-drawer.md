# 2026-04-18 — Entry drawer form (structured input UI)

## What was decided
Clicking a company row on the timeline opens a side drawer (slides in from the right)
with a structured form for editing that entry. Timeline updates live on save.

Scope (Tier 1):
- Company name, type, stage, location
- Roles: title, startDate, endDate (add/remove roles)
- Tech stack: languages, frameworks, tools, cloud (comma-separated inputs → string[])

Deferred to Tier 2: impact metrics, team composition breakdown, projects,
architecture patterns, career breaks.

State lifted into App.tsx: `CareerEntry[]` + `selectedId: string | null`.
CareerTimeline gains an `onEntryClick` prop so rows are clickable.

## Why
Editing in context of the visualization gives immediate feedback — you see the timeline
update as you change dates or roles. A separate edit view loses that connection.

## Alternatives considered
- Separate edit view (toggle View/Edit): rejected — loses live preview.
- JSON editor: tried and reverted — too fragile, easy to accidentally delete everything.

## Trade-offs accepted
- Tier 2 fields (impact metrics, team composition, projects) not editable in v1.
- Tech stack entered as comma-separated strings, split on save — simpler than tag inputs.
- No add/delete entry in v1 — only editing existing entries.
