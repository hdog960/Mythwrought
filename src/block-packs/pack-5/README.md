# Mythwrought Block Pack 5 — isolated interiors and specialty architecture

**Draft-only isolated pack.** No production registration or world placement; no numeric ID assigned.
The creator reserved 18 roster entries `pack5:079`–`pack5:096`. These are **symbolic**, not game block IDs.
Latest checked main: `caf47776b723a36684edc1a72749e49268ccc688`, checkpoint 007 (branch historically based on checkpoint 006). Read Issues
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

## Latest Milestone 1 candidate acceptance review

- Genuine Node 22.16.0 dedicated suite: **44/44 PASS**, exact checked-in source and tests matched Git blob hashes.
- Physical fired brick now wraps original manufactured running/soldier courses around all four lateral faces; both have real solid collision, not plain reverse-face paint. Source-box budgets are 504 and 636 triangles, respectively, under the existing preview bounds.
- `canvas-gallery.mjs` uses the same source-derived physical mesh triangles and a CPU depth buffer, avoiding previously mis-sorted painter-order artifacts. This is **genuine Chromium Canvas2D** only, not WebGL2.
- `tests/block-packs/pack-5/capture-canvas.py` reproducibly captures six screenshots across 667×375, 844×390, 932×430 and rotations 0/1; it verifies six unique asset-panel pixel hashes per image and meaningful rotation changes.
- Authentic source-served WebGL2 is **NOT VERIFIED** in this environment. Pixel fingerprints and candidate snapshots cannot substitute for actual engine integration, premium-art approval, in-game target/collision, or backward-safe schema-1 save tests.
- `M1_ACCEPTANCE.md` contains full verified evidence; **M1 acceptance remains open** and M2 residential furniture is not authorized to begin merely because the source was authored.

## Reproducible landscape WebGL2 preview

Run in a Chromium/Xvfb environment with Mesa software OpenGL:

`LIBGL_ALWAYS_SOFTWARE=1 EGL_PLATFORM=x11 xvfb-run -a python tests/block-packs/pack-5/gallery-webgl-browser.py <output-dir>`

This Pack 5-only Python Playwright runner verifies six *genuine* WebGL2 draws at 667×375, 844×390 and 932×430, for 0° and 90° shape rotations; it writes screenshots and requires unique nonblank pixel readback for all six candidates. Browser navigation to localhost is blocked in the current test sandbox, so the runner assembles the exact checked-out JavaScript sources inline in an offline `about:blank` page. This is **not** proof that the original served HTML/module graph loads correctly. Do not describe this as physical iPhone testing, deployed renderer output, premium art approval or live schema-1 state support. See `M1_ACCEPTANCE.md`.

## Milestone 2 — isolated physical residential candidate pool

`residential-furnishings.mjs` defines four **CANDIDATE** physical families, each with two distinct original geometric variants: 82 Beds (genuine two-cell head/foot with per-cell floor support and canopy), 83 Chairs & Stools (single-person seat silhouettes, no sitting), 84 Bookshelves (modeled books/scrolls with rear/side joinery, not retail display shelving), and 85 Cabinets & Wardrobes (closed paneled furniture, not gameplay inventory). No housing, room assembly, NPCs or new gameplay.

`residential-gallery.html` previews the eight candidates in a responsive WebGL2 4×2 grid. Native Node: `node --test tests/block-packs/pack-5/*.test.mjs` (**66/66** currently pass). Reproducible genuine Chromium WebGL2 **with actual native ES module execution** for both M1 and M2:
`LIBGL_ALWAYS_SOFTWARE=1 EGL_PLATFORM=x11 xvfb-run -a python tests/block-packs/pack-5/esm-webgl-browser.py m2 <output-directory>`
(use `m1` for previous architectural surfaces).

The runner changes relative imports to absolute `data:` module URLs for offline about:blank because the environment prevents localhost HTTP navigation; it **does not certify source-served module loading**, real iPhone GPU performance, live registry/collision/save state, or creator visual approval. Review `M2_ACCEPTANCE.md` and `M1_ACCEPTANCE.md`. Latest checked `main` is checkpoint **008**; Pack 5 is still unmerged/development-only.
