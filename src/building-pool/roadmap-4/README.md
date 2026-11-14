# Roadmap 4 — Government & Arcane Knowledge

**Candidate-only, theoretical, isolated.** No game imports this directory; no world generation, save writes, merge or deployment is authorized.

- `schema.mjs` defines stable identity, 600 expected keys, explicit 3D occupancy, biome/size/type labels, complete architectural roles, entrances, room plans, supported walking routes, vertical-stair contracts, symbolic asset dependencies, canonical serialization and duplicate-structure detection.
- `manifest.json` is the honest *planned* catalog. **0 authored / 0 accepted** until actual blueprints are committed and independently tested.
- Node test command: `node --test tests/building-pool/roadmap-4/*.test.mjs` (nested location is deliberately not included in current root `npm test` wildcard).
- M0 is technically complete following native Node exact-Git-source acceptance. M1's **30 authored candidates** are in \`m1-blueprints.mjs\`: one civic hall and one castle/palace × 5 biomes × 3 sizes. Real WebGL2 and physical asset confirmation remain open. M2–M4 will fill the remaining 570 structures.
- Existing blocks `base:grass` etc refer to confirmed physical IDs 1–8. Future `pack1:...` through `pack5:...` and `biome130:...` are **symbolic**, with no allocated persistent ID or claim of working collision, orientation, lighting, door or stair mechanics. Every use must enumerate unresolved geometry/attachment/orientation dependencies.
- A cell is a one-grid occupancy **reservation**. It is not a promise that a future partial or multi-cell mesh fits. Reconcile before any physical world integration.
- Navigation validates clearance over occupied whole cells and authored support, with one-cell step/stair adjacency only. This is deliberately a *theoretical reachability proxy* and cannot certify actual iPhone controller ergonomics, swept-body collision, running game pathfinding or player-feet movement. M5 needs genuine WebGL2/headroom/physical-asset checks and creator review.

## Current native QA

- Run \`node --test tests/building-pool/roadmap-4/*.test.mjs\` from repository root: **18/18** native Node 22 tests passed on exact GitHub SHA-matching sources in the last developer session.
- Thirty real Chromium **Canvas2D** engineering screenshots captured, 10 representative structures in each of 667×375, 844×390 and 932×430. **WebGL2 was disabled by the available browser environment**, so none is accepted as a WebGL2 performance screenshot.
- M1 candidate floor plans have explicitly assigned rooms on every floor. Partial stairs/roofing, pane mounts and tall-world integration remain unverified and unresolved.
- Read \`docs/building-pool/roadmap-4/M1_CANDIDATE_ACCEPTANCE.md\` for the full dossier and hard blockers.
