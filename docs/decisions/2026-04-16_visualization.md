# 2026-04-16 — Career Timeline Visualization

## What was decided
Horizontal Gantt-style SVG timeline. One row per CareerEntry, each row has a company name label above a segmented bar. Each segment = one Role, width proportional to duration in months. X axis = linear month scale from Dec 2014 to present, tick marks at year boundaries only.

## Why
- Month-precision scale ensures bars start/end at the correct position within a year, not snapped to year boundaries
- Segmented bars surface promotions within a company (e.g. Blackbaud: EM → Sr. EM) without needing separate rows
- Company name as top label per row keeps the visual scannable at a glance
- isBreak entries render as a muted bar using breakStartDate/breakEndDate — unnamed gaps are ignored

## Alternatives considered
- Swim-lane by companyType: deferred — too complex for first phase, can be layered on top later
- Vertical stacked cards: rejected — not visually distinctive, doesn't show the "through line"
- Toggle compressed/real-time: deferred — adds complexity, Option C (named breaks only) is sufficient

## Trade-offs accepted
- D3 handles scale math only; React owns the DOM. Slightly more verbose than letting D3 mutate the SVG directly, but makes testing straightforward without a real browser.
- Small unnamed gaps (e.g. Shippo → HEB, 2 months) are silently absorbed. Named breaks (isBreak: true) are the ones worth telling.
