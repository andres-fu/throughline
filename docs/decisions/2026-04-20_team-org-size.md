# 2026-04-20 — Team org size field

## What was decided
Add `orgSize?: number` to `TeamComposition`. On the timeline card, combine
directReports and orgSize into a single chip: "30 total (5 direct)". If only
one is present, show "N total org" or "N direct reports" respectively.

## Why
Senior managers are responsible for skip-level reports too. The distinction
between "who reports to me" and "how many people am I responsible for" is
meaningful on a career timeline.

## Alternatives considered
Two separate chips — rejected because they add visual noise and the combined
format communicates the relationship better.

## Trade-offs accepted
Combined chip is slightly longer than individual chips; chip width estimate
should handle it.
