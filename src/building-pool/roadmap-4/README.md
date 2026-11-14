# Roadmap 4 — Government & Arcane Knowledge

**Candidate-only, theoretical, isolated.** No game imports this directory; no world generation, save writes, merge or deployment is authorized.

- `schema.mjs` defines stable identity, 600 expected keys, explicit 3D occupancy, biome/size/type labels, complete architectural roles, entrances, room plans, supported walking routes, vertical-stair contracts, symbolic asset dependencies, canonical serialization and duplicate-structure detection.
- `manifest.json` is the honest *planned* catalog. **0 authored / 0 accepted** until actual blueprints are committed and independently tested.
- Node test command: `node --test tests/building-pool/roadmap-4/*.test.mjs` (nested location is deliberately not included in current root `npm test` wildcard).
- Next: M1 creates **30 individually authored blueprints**: one civic hall and one castle/palace × all 5 biomes × 3 sizes. M2–M4 fill the complete 600.
- Existing blocks `base:grass` etc refer to confirmed physical IDs 1–8. Future `pack1:...` through `pack5:...` and `biome130:...` are **symbolic**, with no allocated persistent ID or claim of working collision, orientation, lighting, door or stair mechanics. Every use must enumerate unresolved geometry/attachment/orientation dependencies.
- A cell is a one-grid occupancy **reservation**. It is not a promise that a future partial or multi-cell mesh fits. Reconcile before any physical world integration.
- Navigation validates clearance over occupied whole cells and authored support, with one-cell step/stair adjacency only. This is deliberately a *theoretical reachability proxy* and cannot certify actual iPhone controller ergonomics, swept-body collision, running game pathfinding or player-feet movement. M5 needs genuine WebGL2/headroom/physical-asset checks and creator review.
