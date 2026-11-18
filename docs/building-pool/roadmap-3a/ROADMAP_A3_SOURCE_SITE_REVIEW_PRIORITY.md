# MYTHWROUGHT Roadmap A3 — source-specific risk review order

**Status: read-only. Nothing is approved for physical installation.** The protected 345 original Builder 3A blueprints, original draft PR #183, the five Manual Packs and all saved-world data remain immutable. This documents the *next human/engineering review order*, not design repairs.

## Priority sequence (from original source evidence)

| Review lane | Evidence | Before any creator-authorized repair |
|---|---|---|
| P0 — hollow smoke lumen | 60 four-yaw Pack4 fireplace/chimney fixture collision cases overlap the reserved flue; group by **the 30 source fixture IDs/positions** | Reject obstructing yaws, inspect source smoke shaft from bottom to cap, ensure real oriented producer boxes and all resulting heat/weather/cap surfaces keep the flue open |
| P1 — mounted fixture attachment | 118/120 Pack4 mount/yaw combinations lack authored producer support; 108 proxy-neighbor yaw cases prevent exact assembled clearance claims | Determine source-anchored rear/floor attachment and structural load, then model true producer collision, occupied and support offsets in all four yaws without inserting any blocks |
| P1 — roof beams | 156 uninstalled M2 third-variant source positions (624 yaw observations); all 156 lack an immediately verified authored bearing path | Check actual load transfer through posts and walls to foundations, corridor/headroom, chimney heat and roof-weather support, rather than accepting an apparently empty coordinate |
| P2 — roof witness gaps | 274 sampled absent-near-bearing roof positions (33 M2 fourth, 118 M2 fifth, 83 M3 second, 40 M3 third) | Trace each source roof tile through a genuine support path and separate genuine missing supports from heuristic false positives; not a declaration of 274 engineering failures |

The new source-only review planner `src/building-pool/roadmap-3a/a3-per-building-review-order.mjs` groups every issue by its **actual source blueprint ID and coordinate**, returning P0/P1/P2 groups, distinct YAW alternatives and source evidence. Its test asserts all protected counts and no geometry changes. This is a sorted **review queue only**, not authorization to create a building or to change the original PR.

A nominal clear AABB or nominally supported yaw is never certified: unknown producer-neighbor geometry, weather, fire, real mesh collision, structural capacity, true iPhone performance, gameplay placement and schema-1 saves remain unverified. No beam/support/fixture is installed. No main merge, Pages deployment, original blueprint rebase, other-builder work, shared CI or v0.11 unlock is within this audit scope.

**Separate written creator approval is required before any geometry repair or production incorporation.**
