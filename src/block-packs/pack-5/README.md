# Mythwrought Block Pack 5 — isolated interiors and specialty architecture

**Draft-only isolated pack.** No production registration or world placement; no numeric ID assigned.
The creator reserved 18 roster entries `pack5:079`–`pack5:096`. These are **symbolic**, not game block IDs.
Latest checked main: `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`, checkpoint 006. Read Issues
#109 and #117 every session. Never touch the four other manual packs or biome130 catalog.

## Milestone 1 — physical architectural surfaces (CANDIDATE)
`architectural-surfaces.mjs` authors six ORIGINAL physical box-part variants across three symbolic
families, each with an explicit material palette, actual selectable 3D box volumes, bounded typed
mesh vertices/triangles, appropriate support and *partial-volume* collision where applicable.

| Symbolic | Family | Distinct variants | Support |
| --- | --- | --- | --- |
| pack5:079 | Plaster & Stucco | chalk-lime; hand-troweled | wall behind negative local Z |
| pack5:080 | Fired Brick Masonry | hearth-running-bond; kiln-soldier-course | free/standalone |
| pack5:081 | Ceramic Interior Floor Tiles | sunburst-encaustic; moonwoven-glaze | floor below negative Y |

All variants are currently **CANDIDATE**, not integrated. A variant is authored geometric material
state under the same symbolic family, not a separately allocated numeric game ID. There is no desert
adobe duplicate, exterior paving clone, original STONE 3 alias or worldgen-generated placement.

`fixture.mjs` remains a test-only, multi-cell occupancy, shape raycast, partial collider,
four-way rotation, support, and reversible **fixture-specific** snapshot adapter. Tests can supply
variant names to `place(symbolicId,cell,rotation,variant)` and roundtrip a 6-column candidate-only
snapshot; original 5-column fixture rows still work. Neither envelope is Mythwrought schema 1.

Test natively from repository root:
`node --test tests/block-packs/pack-5/*.test.mjs`
The default CI `npm test` only discovers `tests/*.test.mjs` and does **not** run these nested tests.

For a genuine browser art check after Chromium access is repaired, serve the isolated tree and
open `tests/block-packs/pack-5/architectural-gallery.html`: it renders actual physical box
triangle meshes with WebGL2. Its source alone is not screenshot evidence. Never claim actual
mobile performance, physical iPhone controls, or premium art acceptance without direct evidence.

Future shared registry, engine shape/collision, attachment support, persistent variant state,
save compatibility and world-placements belong to central creator-authorized integration.
Read `PROGRESS.md` and `manifest.json` for true candidate/verification statuses and handoff.
