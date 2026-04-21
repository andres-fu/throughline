# 2026-04-20 — Permanent sidebar layout

## What was decided
Replace the fixed-overlay drawer with a permanent left sidebar (360px) that sits beside
the timeline in a flex row. The timeline is always fully visible. Two sidebar states:
- Default: app title + "Select an entry to edit" hint
- Edit: entry form (same fields as before)

Timeline width is calculated from available window width minus sidebar and padding.

Also fixed: TechStackSection inputs use local state, syncing to onChange only on blur
so commas and mid-value typing work correctly.

## Why
The overlay covered the timeline, defeating the purpose of live preview. A permanent
sidebar keeps both panels visible at all times — standard web app pattern.

## Alternatives considered
- Collapsible sidebar: rejected — adds toggle complexity for minimal benefit.
- "Add Entry" button in default state: deferred — needs its own scope (blank entry
  creation, ID generation). Not part of this change.

## Trade-offs accepted
- Sidebar always takes 360px — less timeline width on smaller screens. Acceptable for
  a desktop-first tool.
- Timeline width derived from window.innerWidth at render time, not a ResizeObserver.
  Good enough for v1.
