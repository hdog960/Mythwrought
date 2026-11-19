# Mythwrought M3 traversal / M4 staging handoff — draft only

## Accepted isolated M3 predecessor

PR #251 HEAD `e7e7d665f776efc9f4d42f3fd2884a1b670d7d2e` accepted on five exact-source successful GitHub Actions: #44237133945 (12/12 contracts; 995/995 native; 20/20 full Chromium WebGL2 scripts), #44237133965 (995/995 native and real deep-world / Creative flight WebGL2), #44237133962 (8/8 source-native; 15/15 source-specific actual Desert scene/excavation PNGs), #44237133958 (all 12 real 4-biome scenes), #44237133956 (full 100 chunk / 8 MiB GPU budget). Prior PRs #244/#238/#231 and original #172 remain draft and untouched. Production main `e9223217ef1e91d282900c3fc13a21eeda316b63` remains unchanged. All saved-world migrations, production merges and Pages deploys forbidden.

## Current separate traversal stage

This child branch adds only read-only `shoulder-traversal.mjs`, focused tests and a focused workflow. It uses the production `collides` AABB solver, `GROUND_PROBE`, `STEP_HEIGHT`, and `stepPlayer`. It attempts an actual, bounded, source-backed Desert-to-unmodified legacy shoulder walking route across multiple chunks, proves safe foot clearance and floor contact, verifies real simulated stepping on sampled segments, refuses a deliberately blocked route, and checks untouched immutable v2 profiles. A route trace cannot edit world, build artificial bridges, move the UI, teleport the player or reveal the minimap.

A **negative** traversal result is a genuine blocker until investigated; do not manufacture a path or weaken the physical checks. This is a geometric source probe, not yet a continuous live iPhone thumbstick journey from spawn to the faraway Desert anchor at x=512. That 512-block walk, on-map fog-of-war behavior and naturally discoverable biome boundaries still require a later actual browser/iPhone route acceptance.

## Planned M4 refinement — not yet accepted

Create another isolated child after traversal gating. Preserve immutable v2 and v3 profile identities; new Snow/Mountain/Enchanted terrain variation must use v4 only on explicitly created new worlds. Use *registered existing physical solid IDs* for layered snow glades, mountain ridges and enchanted clearings, with true mine/collision/support, protected cave entrances and landmarks. Leave :48 non-block vegetation/flora automation ownership alone: avoid adding shader-painted plants and do not edit automations, caves or builders. Full 25-chunk GPU caps for all four regions; retain M3 Desert as byte-identical v3 baseline and prior M2 v2 generation. Actual 667×375, 844×390, 932×430 source-specific Chromium exterior/cutaway images plus full native, 20-script browser, depth/Creative. Independent iPhone/offline acceptance, vault/mirror profile-safe backup, minimap/fog, full journey and production reconciliations remain open.

**No merge, rebase, Pages deploy, PR ownership violation or v0.11 unlock.**
