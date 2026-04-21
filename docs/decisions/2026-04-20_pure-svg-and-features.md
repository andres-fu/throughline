# 2026-04-20 — Pure SVG timeline + add/delete + export

## What was decided

### Rule: Pure SVG only for all timeline UI
All timeline rendering must be SVG — no HTML divs, no CSS flexbox inside the chart.
Chip layout, text, labels, metadata lanes: everything is SVG geometry.
This applies to all future timeline edits going forward.

### Why
Mixed HTML+SVG cannot be exported cleanly to PNG. Pure SVG enables:
- Direct SVG serialization → canvas → PNG
- Resolution-independent export at any scale
- Clean LinkedIn exports without html2canvas hacks

### Pure SVG rewrite scope
Rewrite CareerTimeline to a single `<svg>` element:
- All chips: `<rect>` (rounded) + `<text>`
- All labels: `<text>`
- Chip wrapping calculated geometrically (text width estimation + row overflow logic)
- Entry heights computed from chip row count (not CSS auto)
- Year grid lines, NOW marker, break bars, accent stripes: all SVG

### Add/delete entries
- Add: button in default sidebar → blank CareerEntry (startup / early-startup defaults),
  generated ID, opens immediately in edit mode
- Delete: button in EntryDrawer footer, confirmation required

### Export
- Export button in default sidebar
- Two LinkedIn presets:
  - Featured image: 1584 × 396
  - Post image: 1200 × 627
- Flow: capture SVG → serialize → draw on canvas at target scale → PNG download

## Build order
1. Pure SVG rewrite of CareerTimeline
2. Add/delete entries
3. Export with preset options

## Trade-offs accepted
- Chip text width is estimated (char count × per-char width + padding) not measured.
  Close enough for layout; pixel-perfect measurement would require canvas or DOM measurement
  on every render.
- Entry heights are fixed-computed, not auto — tall chip rows need the height formula
  to be correct.
