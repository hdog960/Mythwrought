# M0 — Builder 1B safe isolated intake

**Draft-only independent builder lane.** Created from current `main` **e6bd7c173a4531ba7efc153e5f2eb89870c3b9db** after creator-authorized merger of infrastructure PR #178. Exact-head infrastructure workflow #43762245025: **success**. Current incorporation ledger: checkpoint **009**. Original PR [#121](https://github.com/hdog960/Mythwrought/pull/121) was still draft/unmerged at head **88a9e410a0eda7cf961cb6b624241666eb3a48a1**, read as source only.

## Owned scope
Only `src/building-pool/roadmap-1b/`, `tests/building-pool/roadmap-1b/`, `docs/building-pool/roadmap-1b/` modified. Protected sibling original 1A, 2A–4B categories and original four draft PRs are unchanged. Three owned trees only; no shared runtime, CI, ID registry, saves, checkpoint, game controls, automations, engine or deployment changes.

## Source-exact stable extraction
Exactly **15 original, coordinate-authored stable candidates**, one per 5 biomes × 3 sizes, inherited **not newly invented**. Original IDs `r1:stable:...:001/002/003` are preserved. The stable design rows are copied verbatim from original PR #121; original factory remains unchanged except local import paths and final iteration restricted to stable. The old schema and candidate-footprint helper are preserved as exact original source text. No house/tavern design rows imported. Read `src/building-pool/roadmap-1b/legacy-inheritance.json` for each original identity → new module and original Git source blob provenance. Static source transformation preserves the stable constructor; independent FULL original-vs-extracted geometry output parity remains a separately required M1 acceptance check, **not claimed yet**.

## Target/counters
Bathhouse **60**, stable **75**, farm-barn **60**, greenhouse **60**, fishing-lodge **60**, harbor-office **60**, lighthouse **60**. **435 target; 15 inherited authored, 0 new authored this milestone, 420 remaining, 0 creator approved, 0 integrated.** New variant IDs / full architectural layouts for the 420 additional proposals do not yet exist. Original source of 15 is preserved, not double-counted.

## Asset and acceptance gates
Main includes the integrated manual 96-family / 106-variant builder catalog. Original candidates retain conservative unresolved Pack family support, shapes, orientation, collision and schema-1 adapter dependencies pending exact final-runtime physical profile reconciliation. Automated biome130 not independently approved for world placement. Native module test: `node --test tests/building-pool/roadmap-1b/*.test.mjs` tests real generated voxel coordinates, rooms, openings and deterministic fingerprints; exact-head CI results to be verified after PR creation. Browser/Chromium landscape 667×375, 844×390, 932×430, physical-family WebGL2 and actual iPhone/creator art acceptance remain separate open evidence. No bridge to world writing; M1 next.
