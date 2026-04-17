# 2026-04-16 — Career data model

## What was decided
`techStack` lives at `CareerEntry` level (company), not `Role` level. It represents the cumulative set of all technologies used during a tenure — multiple clouds, migrated frameworks, all of it. A hiring manager sees the full picture, not a snapshot.

Added `cloud: string[]` to `TechStack` as a first-class field — cloud platform is too high-signal to bury in `tools`.

New fields added to model:
- `CareerEntry.companyStage: CompanyStage` — pre-product / early-startup / growth / scale-up / enterprise
- `CareerEntry.isBreak?: boolean` + `breakReason?: string` — career breaks are first-class, not hacks
- `Role.impactMetrics: ImpactMetric[]` — quantified outcomes (dollars, percentages)
- `Role.teamComposition?: TeamComposition` — direct reports, total team size
- `Role.architecturePatterns: ArchitecturePattern[]` — event-driven, cloud-native, etc. per role
- `Role.workType: WorkType[]` — greenfield / modernization / platform / data / ai-ml / devops / founding

`WorkType` uses `'founding'` (not `'org-building'`) to describe early-stage setup work where building the engineering function is the work itself.

## Why
Real career data (Andres's resume) showed tech stacks evolve within a single tenure (Blackbaud: Java/AWS → Java/Azure + Kafka). A hiring manager wants the cumulative picture, not a per-role snapshot. Simpler model, more accurate signal.

## Alternatives considered
- `techStack` on `Role`: accurate for evolution but loses the cumulative view. Rejected.
- `techStack` on both levels: redundant and a maintenance burden. Rejected.

## Trade-offs accepted
We lose the ability to show exactly *when* a technology was adopted within a tenure. Accepted — the timeline of adoption is a level of detail that belongs in the role description, not the data model.
