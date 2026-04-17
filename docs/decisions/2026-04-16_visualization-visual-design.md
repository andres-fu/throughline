# 2026-04-16 — Visualization Visual Design + Expand Behavior

## What was decided
- Font: Helvetica Neue (with Helvetica, Arial fallback) — Swiss/editorial aesthetic throughout
- Company name: all-caps, bold/heavy weight, tracked out
- Role title: regular weight, inside the bar
- Bar style: minimal rounding (2–3px), architectural not bubbly
- Color palette: curated 5-color rotating set assigned by entry index, not brand-specific
- Expand: click any bar in a company row → that row expands downward (push-down), showing description + impact metrics; rows below shift down via natural HTML flow
- Architecture: HTML/SVG hybrid — SVG for the time axis ruler only, HTML divs for company rows and expanded content

## Why
- Helvetica Neue aesthetic demands precise, intentional layout — HTML gives more control over typography and spacing than SVG text elements
- Push-down expand is more intentional than overlay; communicates structure
- HTML rows make expand/collapse trivial (natural document flow) vs recalculating all SVG y-coordinates on state change
- Non-brand colors keep the tool generic and usable by anyone, not just Andres

## Alternatives considered
- Pure SVG with foreignObject for expanded content: cross-browser issues, harder to style
- Overlay/tooltip expand: cleaner visually but obscures other bars, less intentional

## Trade-offs accepted
- Hybrid architecture means the time axis SVG and the row HTML must stay aligned horizontally — requires careful CSS to keep bar positions in sync with the axis ticks
