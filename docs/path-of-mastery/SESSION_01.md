# Path of Mastery — session 01 (PM0 / PM1 / PM2)
Owner: Personal / SKILL DEV; assignment #512. Creator roadmap PM0–PM15. Source base 222b0a8acd736a6502d85c5797f77f0d4f38a861. Rules #492/#498/#501/#509 read, no Codex, no production writes. New exclusive paths only.
## Source observations
- src/main.mjs:1141–1152 routes MINE to existing mob attack first; :500–542 owns mob session and damage/respawn callback. Combat DEV and MOB DEV must agree successful-event identity and damage authority; do not use MINE presses as XP.
- src/main.mjs:1274–1290 obtains applyBlockAction result, checks result.ok and then saves. Candidate mine seam only after successful natural extraction with provenance and durable dedupe; placed-block loops, Creative and unsuccessful/failed-save actions must not grant XP. Existing unified #503 owns shared runtime seam; no changes here.
- src/exploration-map.mjs:15–95 stores seed-scoped observed cells; reveal counts new cells, not necessarily meaningful landmarks. Navigation owner must supply a durable unique discovery contract; no tile farming.
- src/physics.mjs:30–33 newPlayer has movement state, not a full RPG stat record. :12 owns movement. No speed/stat overrides.
- src/persistence.mjs:15–41 preserves original schema-1 edit deltas; future PM4 must coordinate with save owners, backup/import and mode identity. No schema/sidecar changes now.
- Existing toolkit registry identifies #503, #502 and #500; Resonance :24/:36/:48 independent. Candidate roster/mastery/valor searches returned no existing assignment; review further owner-specific refs before shared integration. Coordination not yet acknowledged by other lanes.
## Implemented isolated foundation
PM1: 24 namespaced immutable candidate definitions, six per category, tree references, metadata, no XP sources or activation. Icons intentionally null pending artwork/UI. No crafting IDs.
PM2: configurable strictly increasing safe-integer 99-level threshold array; provisional engineering curve T(L)=25(L-1)^2+5(L-1)^3; binary-search levels, progress, capped arithmetic and levels gained. No real event issuance, dedupe, level-up dispatcher, balance or persistence. Curve is a test candidate only; simulate rates and tune with creator before activation. All 24 skills inactive.
PM0 is partial: verified original sources, ownership intake and proposed seams; remaining active-branch contracts and integration availability require owner review.
## Qualification
Five focused Node tests authored, covering 99 exact and 98 predecessor boundaries, 24 registry entries, cap, invalid inputs, alternative curves. No broad suite requested. Exact execution result to be recorded on draft PR. No browser or physical device claim.
## Next session
Authenticate existing exact draft checks once; complete PM0 owner-interface audit and PM1 registry validation (icons later), simulate candidate curve/multiple play-rate scenarios and advance PM2 per-skill ledger and PM3 event admission with durable event identity design, fail-closed source/mode validation and no gameplay activation. Do not modify shared main, persistence, map, mob, movement, workflows or cache without coordination. PM4–PM15 remain; initial estimate 16–26 substantial sessions, subject to combat and other dependencies. No merges/deployments.
