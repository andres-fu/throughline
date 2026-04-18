# 2026-04-18 — Year grid lines and duration badges

## What was decided
Two visual polish additions:
1. **Year grid lines** — faint gray vertical lines at each year position, rendered as a
   single absolutely-positioned SVG overlay spanning the full height of the rows container.
   Proportional mode only (equal mode has no meaningful time axis).
2. **Duration in date label** — append formatted duration to the existing date range span
   in the company label area, e.g. `2014 — 2020 · 5y 6mo`. Calculated from first role
   start to last role end using a new `formatDuration(months)` utility.

## Why
Grid lines give the chart a proper Gantt feel and make year-reading much easier without
adding visual noise. Duration in the label surfaces tenure length at a glance — currently
only inferrable by reading the year range.

## Alternatives considered
- Duration badges inside bar segments (white text below role title): rejected — label
  area is less crowded and doesn't compete with role title readability.
- Grid lines per-row SVG (one line per entry's SVG): rejected — produces gaps at row
  gaps in the flex column; a single overlay covers the full height cleanly.

## Trade-offs accepted
- Grid lines only in proportional mode — equal mode gets no time grid (no meaningful
  x-axis positions to draw lines at).
- Duration is total tenure (entry start → entry end), not per-role — keeps the label
  compact; per-role duration is already implicit from the bar segment widths.
