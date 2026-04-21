# 2026-04-20 — Team Composition UI

## What was decided
Add a collapsible "+ TEAM DETAILS" toggle inside each role card in RolesSection. When expanded, shows directReports (number), notes (text), and TeamBreakdown fields (engineers, architects, managers, designers, qa, data, other) as a compact grid.

## Why
teamComposition lives at the Role level in the data model, so team editing belongs co-located with the role it describes. Collapsible keeps role cards compact for entries where team data is sparse or irrelevant.

## Alternatives considered
- Inline always-visible fields in role card (too heavy for common case)
- Separate top-level TeamCompositionSection (breaks co-location with role)

## Trade-offs accepted
Collapse state is local to RolesSection (not persisted). Breakdown fields use number inputs with empty string → undefined coercion.
