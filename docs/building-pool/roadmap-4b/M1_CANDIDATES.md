# Builder 4B — M1 candidate architectural handoff (not creator-accepted)

This file records first five **original** coordinate-authored theoretical building candidates on [draft PR #185](https://github.com/hdog960/Mythwrought/pull/185). No legacy #123 category candidates were reused. None have been placed in Mythwrought, merged, published, creator-approved, or validated on physical iPhone.

## Actual authored source and census

Source: src/building-pool/roadmap-4b/m1-exemplars.mjs; validation: tests/building-pool/roadmap-4b/m1-exemplars.test.mjs. Authoring uses explicit hand-picked floor bands, room footprints, interior partition lines, two-height door apertures, window coordinates, roof ridge bands, fixture positions and material choices. The resulting source emits real physical coordinate cells, not bounding-box-only, title-only or seed-only records.

| Stable original-category ID | Biome | Size | Functional architectural distinction |
|---|---|---|---|
| r4:healers-house:temperate:small:01 | Temperate | Small | Cross-gable clinic with treatment bay, separate recovery room, front waiting, rear herb-storage annex |
| r4:library:snow:medium:01 | Snow | Medium | Asymmetric clerestory and book-gallery L-plan with western stacks, reading room and rear catalogue wing |
| r4:schoolhouse:desert:small:01 | Desert | Small | Transverse classroom volume and rear teaching-study wing, two teaching spaces and central hall |
| r4:magical-research-institute:enchanted-forest:medium:01 | Enchanted forest | Medium | Cruciform research hall with distinct secure repository and observation/instrument wing (no magic simulation) |
| r4:arcane-academy:mountain:large:01 | Mountain | Large | U-shaped open-sky court and paired enclosed wings; lecture hall, independent study and practice rooms, rear archive |

Census: **5 distinct source-authored / 0 inherited / 280 remaining / 0 creator-approved / 0 integrated**. No full-quota claim. Every owned category has an original candidate. Across all 15 biome-size combinations only five slots are occupied (each one unit); the remaining allocations are in manifest.json.

## Explicit limitations (do not erase)

1. Manual 96-family/106-variant builder catalog lives in main. Candidate glass/furniture entries use provenance-preserving `pack4:030`, `pack4:058`, `pack4:059`, `pack4:037` and statue `pack3:078` symbolic family references. Each carries explicit unknown collision profile, rotation, occupied-cell footprint, mount/support, pick and persistence acceptance items. No numeric block IDs are allocated or claimed production-ready.
2. Door apertures are two-cell-clear, but `pack2:020` wooden doors are **planned closure metadata** only, not installed/interactable doors. Clear windows are symbolic glazing, not verified physically loaded transparent panes.
3. Roof weather planes, intersecting purlins and differing raised ridge silhouettes have actual coordinates. Their practical load transfer and real physical stair/slab integration have **not** been proven; large or upper-level programs will need source-exact support and navigation audits. No powered research apparatus, traps, NPCs, healing, classes, or spells have been implemented.
4. The new `m1-preview.html` is a real WebGL2 *cube-proxy coordinate diagnostic*, not the real family-shaped GPU renderer. The independent `m1-preview-browser.py` script defines **30** screenshot inspections: five source designs × exterior/section × 667×375, 844×390 and 932×430. Merely committing this harness does **not** establish those 30 runs were executed. Report exact render/output evidence only after running it.
5. Required PR CI runs lane-native tests and ordinary production-game smoke/layout; that is **not** a 4B geometry screenshot test or physical iPhone hardware test. Creator-art, final blocker-free physical asset ABI, world height, save orientation, central integrator mixed-settlement, and Gate A remain future gates.

## M1 review priorities

Run the exact-head focused GitHub CI after all M1 source/docs/test changes. Correct only proven owned-scope failures. Separately execute/inspect the 30 real-Chromium cube-proxy captures and record source hash, rendering classification, image evidence, errors and layout defects. Then progress toward M2's additional healer/library variants with truly distinct geometric programs, never palette/rotation-only duplicates.

**Immutable boundary:** No edits outside roadmap-4b source/tests/docs. Old PR #123 stays unmodified, draft and open. This PR stays DRAFT, UNMERGED, UNDEPLOYED. v0.10 Gate A OPEN, v0.11 LOCKED; no physical-iPhone or creator-art signoff.
