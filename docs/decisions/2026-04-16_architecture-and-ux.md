# 2026-04-16 — Architecture and UX decisions

## What was decided

### No AI in the application
Resume parsing uses pure software logic — pdfjs-dist (PDF), mammoth (DOCX), and custom regex/heuristics. No Claude or any AI API calls at runtime. AI involvement ends at this planning session.

Low-confidence extractions are flagged with `inferred: string[]` on CareerEntry and Role. The UI shows "confirm this?" prompts for inferred fields.

### Manual entry is first-class
Parser and manual entry both produce `CareerEntry[]` and flow into the same edit form. The form IS the manual entry UI. KISS: one form, one data shape, two ways to populate it.

Build order: data model → visualization → form/manual entry → parser.

### Three visual themes
- **Material Clean** — card-based, professional, print-friendly
- **Terminal Dark** — dark background, monospace accents, developer culture
- **Editorial/Minimal** — Linear/NYT aesthetic, strong typography, white space

Implemented via CSS custom properties on the root element. Each theme is a set of variable values — one class swap, all components update. No heavy theming library.

### SVG-based visualization with high-res PNG export
D3 renders SVG (not HTML divs). SVG is resolution-independent — exports cleanly at any size. Export flow: SVG → Canvas at 2x/3x → PNG download. LinkedIn presets: 1584×396 (featured) and 1200×627 (post).

### localStorage for session persistence
CareerEntry[] serialized to JSON on every change. On load, check localStorage first. No server, no accounts, no database. User data never leaves their browser — a privacy feature. Add "start over" button to clear. 5MB localStorage limit is not a practical concern for this data shape.

## Why
KISS and DRY throughout. Every decision avoids infrastructure complexity while keeping the door open for future expansion. The data model is the single source of truth — everything else (parser, form, visualization, export) is just a different way of reading or writing it.

## Alternatives considered
- AI parsing (Claude API): rejected — user explicitly wants pure software, no AI in the app
- Backend storage / user accounts: rejected — too much scope for v1, localStorage solves the actual problem
- HTML/CSS div-based visualization: rejected — SVG required for clean high-res export
- Single theme: rejected — 3 themes as a product differentiator and LinkedIn flex

## Trade-offs accepted
- Parser will not be perfect — graceful degradation and manual editing is the answer, not a smarter parser
- localStorage data is device-specific — user loses data if they switch devices or clear browser storage. Accepted for v1.
