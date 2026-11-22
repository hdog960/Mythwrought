# Original-source regional ecology cadence — detached research component

Only `src/mobs/ecosystem-region-cadence.mjs`, its focused native test and this documentation are new. No live PopulationManager/MobEngine/PWA/main changes.

The existing source manager owns **INTERVAL=.5s**, **MAX_TESTS=6**, **REPLENISH=12s**, **1.5s post-birth cooldown**, and **max 64 records** with cursor rotation. Our existing detached position-proposal module intentionally does NOT create mobs. Without a matching schedule, any future integration could generate extra candidates too frequently or let depleted populations instantly replenish. This new pure record component therefore mirrors the original first-visit deferral, per-species population high-water decline delay and post-*confirmed engine birth* cooldown. It has immutable serial/high-water snapshots, fail-closed complete original preview species counts and explicit source timing invariants.

It is a **regional-only** cadence primitive, not a replacement for the original manager's global interval, 64-region eviction, cursor rotation, away/dormant/reconcile or save behavior. These remain required source integration gates. A physically eligible proposal does **NOT** count as a birth or trigger cooldown until the original engine actually admits it. No physical M7 or natural birth claims were made.

Focused native test source is authored for five cases; no true Node run until the exact source checkout is accessible. Existing historic M7 original 161/504 vs source-compatible 227/504 placements and original seed179 1308 attempts/18 births are from protected head only. The protected head's offline worker gate still fails; do not waive it.
