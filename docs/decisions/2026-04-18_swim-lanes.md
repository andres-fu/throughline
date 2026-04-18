# 2026-04-18 — Always-visible metadata swim lanes

## What was decided
Replace the click-to-expand detail panel with always-visible metadata lanes rendered
directly below each company's bar. Each company block is self-contained: bars on top,
three chip rows below (company type/stage, work type, tech stack).

A color legend sits at the top of the chart for company type and stage.

## Why
The click-to-expand pattern hid the most interesting data (what kind of company, what
kind of work, what tech) behind an interaction. The lanes make the career story
scannable at a glance — which is the core purpose of the visualization.

## Alternatives considered
- Keep click-to-expand alongside lanes: rejected — two disclosure patterns for the same
  data adds complexity without benefit.
- Color-code bars by companyType (Option A): rejected in favor of always-visible lanes
  that carry richer information.

## Trade-offs accepted
- Impact metrics (previously in expanded panel) are not shown in the lane view. They
  remain in the data model and can be surfaced later (tooltip, hover, separate view).
- Swim lanes increase row height — the chart is taller overall.
- Multi-value fields (workType[], techStack) use stacked/wrapped chips rather than
  splitting the bar, which keeps geometry simple.
