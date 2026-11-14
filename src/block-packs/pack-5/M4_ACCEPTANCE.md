# MYTHWROUGHT Block Pack 5 — M4 Civic Interiors / Physical Textile Candidate Acceptance

**Status: ISOLATED PHYSICAL CANDIDATES ONLY.** The three M4 symbolic families `pack5:091`–`pack5:093` have original authored source, dedicated native Node QA and actual Chromium WebGL2 preview evidence. This is **not** final premium artwork approval, HTTP-served-gallery acceptance, runtime/block-ID integration, physical iPhone performance verification or permission to merge/deploy.

## Boundary and coordination

- Main at last audited `ac263720b60641c65b02330348dd76d0ef9cb75e` / checkpoint **008**; Issue [#109](https://github.com/hdog960/Mythwrought/issues/109) manual range coordination and Issue [#117](https://github.com/hdog960/Mythwrought/issues/117) biome130 future-wide-ID dependency checked; all four manual Packs 1–4 and separate automated biome130 reviewed without editing their paths.
- Exclusive owner: draft [PR #119](https://github.com/hdog960/Mythwrought/pull/119), ONLY `src/block-packs/pack-5/**` and `tests/block-packs/pack-5/**`. No central block registry, engine save, world placement, controller, CI, shared renderer or automation changes.
- Symbolic roster only. Existing live 0–8 preserved, 255 sentinel; future manual 9–208 and biome130 256–385 are NOT newly allocated or written to schema-1 saves. v0.10 Gate A OPEN; v0.11 LOCKED.

## Six newly authored original geometry variants / three M4 families

| Symbol | Original source variant | Genuine geometry, placement and collision |
| --- | --- | --- |
| `pack5:091` Desks & Lecterns | `cartographers-oak-desk` | Single occupied voxel; four real table legs, open seated knee void, physical raised map/parchment linework, worktop, side storage drawer fascia (no inventory); **19 source boxes / 228 triangles** |
| 91 | `moonstone-lectern` | Unique high lectern not a shop counter: freestanding stone plinth, tiered stepped manuscript support and physical page details; **15 boxes / 180 triangles** |
| `pack5:092` Carpets & Rugs | `hearthwoven-runner` | **Two independently occupied consecutive floor cells**, each 25 low-profile physical colored/embroidered parts; both cells must be supported, rotated occupied span selects/removes atomically; **50 total boxes / 600 triangles** |
| 92 | `starlace-sigil-rug` | Single-cell low-relief raised textile frame and inlaid star pattern. Genuine shallow material geometry, not paved stone or a magic mechanic; **25 boxes / 300 triangles** |
| `pack5:093` Altars & Pedestals | `runesworn-stone-altar` | Broad stone tabletop with inlaid nonfunctional symbol, true four-pier support and open subtable space; **16 boxes / 192 triangles** |
| 93 | `sunspire-reliquary-plinth` | Tall slender independent pedestal with three metal-band tiers and actually empty top-center recessed display niche; **14 boxes / 168 triangles** |

Each source descriptor has a physical target/remove fixture, four quarter-turn orientations, source-authored AABB union collision, distinct variant identity and isolated snapshot/restore rollback. No writing, enchantments, blessings, looting, trading, cooking, crafting, inventory, furniture interactions, completed structures, terrain or settlements.

## Exact real tests

- Executed `node --test tests/block-packs/pack-5/*.test.mjs` under **native Node 22.16.0** on Pack 5 source and tests corresponding to GitHub source/test blobs: **120/120 PASS, 0 failed/skipped**. Includes prior **105** M0–M3 cases (three new substantive M3 artwork/collision regressions), plus **15 new M4** dedicated cases.
- M4 tests cover original geometric uniqueness, part vs collider equality, desk knee gap, physical lectern support, connected and rotated two-cell rug, missing far-cell support rejection, atomic removal by far cell, thin carpet clearance and physical embroidery, altar broad tabletop, hollow top plinth niche, 24 six-variant/four-rotation source mesh checks, genuine AABB selection/raycast, fixture variant snapshot rollback, palette and preview budgets, manifest policy. Default root `npm test` does not discover nested Pack 5 tests; native focused execution is separate evidence.
- **Genuine Chromium native ES-module WebGL2:** 6/6 new source-exact `m4` screenshots inspected: 667×375, 844×390, 932×430 at rotations 0/1, six distinct nonblank physical models per view, unique GPU-readback fingerprints and visible orientation changes. Reproduce `LIBGL_ALWAYS_SOFTWARE=1 EGL_PLATFORM=x11 xvfb-run -a python tests/block-packs/pack-5/esm-webgl-browser.py m4 <output-directory>`.
- Genuine native browser `import`/`export` runs through offline `data:` URL module graph under Xvfb/software OpenGL. The environment still blocks real HTTP-served localhost pages (`ERR_BLOCKED_BY_ADMINISTRATOR`); no claims about served page or real physical iPhone Safari.
- Source mesh counts are **unculled authoring triangle counts**, not production WebGL GPU draw timing, FPS or future integrated PWA memory. Each occupied cell ≤25 art/physical AABB boxes for these six variants, below the Pack 5 preview budget 64 boxes / 768 triangles **per occupied cell**.

## Decision and next work

- **M4 authored source candidates are technically reviewable; final M4 creator visual/served/runtime acceptance remains OPEN.** Some shapes use intentionally blocky stepped approximations and still require creator scrutiny in the eventual production camera.
- Pack 5 totals **15/18 authored CANDIDATE families / 3 NOT STARTED / 0 INTEGRATED**. M5 Heavy Gates & Portcullis Panels (94), Chandeliers (95) and Stable Stall Partitions & Troughs (96) were **not started** in this session.
- Prior M1/M2/M3 candidates remain unmerged and distinct; separately gated creator art approvals still OPEN. Do not merge, deploy, place, allocate persistent numeric block IDs, alter other lanes, call this physical-iPhone certified, approve Gate A or unlock v0.11.
