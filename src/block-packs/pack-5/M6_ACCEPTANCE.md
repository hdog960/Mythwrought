# MYTHWROUGHT Block Pack 5 — M6 Cross-Family Integration-Readiness Acceptance

**Decision (November 14, 2026): PASS for isolated candidate source-level cross-family readiness.**
**NOT a production incorporation, actual in-game validation, final creator artwork approval, HTTP-served browser certification, physical-iPhone control/performance approval, merge, or deployment.**

## Verified baseline and exclusive boundaries

- Latest checked `main`: `ac263720b60641c65b02330348dd76d0ef9cb75e`, integration checkpoint **008**. Subsequent main incorporates only specifically eligible automated work and **not** any manual Block Packs.
- Rechecked Issues [#109](https://github.com/hdog960/Mythwrought/issues/109) and [#117](https://github.com/hdog960/Mythwrought/issues/117), four other manual draft pack PRs **#113/#114/#112/#115**, and separate biome130 automated draft PR **#118** / catalog. Candidate geometry has distinct scope; no numeric assignments or external lane ownership changes.
- Exclusive source and tests remain within `src/block-packs/pack-5/**` or `tests/block-packs/pack-5/**`. The [Pack 5 draft PR #119](https://github.com/hdog960/Mythwrought/pull/119) remains **DRAFT, UNMERGED, UNDEPLOYED**.
- Full ledger: **18/18 authored physical family candidates** `pack5:079..096`, **two independently authored variants per family = 36 variants**, **0 INTEGRATED**, **0 allocated persistent numeric IDs**. Preserve live IDs 0–8, reserved sentinel 255 and future biome130 symbolic/widened-ID boundary. No shared engine, production schema-1 saves, terrain/world placement, CI, animations, automations or other packs modified.

## New substantive cross-family execution

A separately committed dedicated file, `tests/block-packs/pack-5/m6-cross-family.test.mjs`, introduces **22 genuine native Node tests** against the original isolated Pack 5 source modules and their **shared test fixture** (not a mock of production engine):
 
1. Verify exact symbol uniqueness across 18 family models, two variants per family (36 original variant keys), manifest/source ownership, no central registry/production save imports.
2. Place all 18 families together in one fixture without alias collisions, and place adjacent distinct one-cell objects without false overlap at shared cell boundaries.
3. Reject conflicting footprints **atomically**: a desk in the far occupied bed cell, a runner with one unsupported cell beside a bed, and a two-cell gate conflicting with a rotated two-cell stable partition.
4. Place a supported ceiling chandelier above floor furniture in separate cells; reject false ceiling attachment from floor support. Verify correct directional support for rotated wall plaster.
5. Confirm genuine **partial subcell collision** across three separate furniture classes, no phantom full-cube colliders across 36 variants, and targetable physical hit rays in mixed layouts.
6. Verify a targeted removal of one family does not damage its neighbor; mixed four-way rotation and multi-cell anchor preservation in deterministic fixture snapshots.
7. Restore corrupted, overlapping, or variant-invalid mixed snapshots **atomically**, leaving existing placements unchanged. Reject production schema-1-looking snapshots in the isolated fixture rather than pretending candidate save compatibility.
8. Check every authored variant under original **64 source boxes / 768 uncullled preview triangles per occupied cell** across all four rotations, and no physically overlapping geometry across adjacent occupied-cell boundaries.

**Actual source-only test result:** `node --test tests/block-packs/pack-5/*.test.mjs` under **native Node 22.16.0: 178/178 PASS, 0 failed/skipped**. This contains **156 previous verified M0–M5 cases + 22 new M6 cases**. Original M6 test source **Git blob `5395171b45d86dc28c56c0c40b534526d4b2eb57`**, matching the locally executed file byte-for-byte. The seven candidate source modules and all preceding focused test blobs were previously independently matched to PR Git blobs. The local manifest's evidence metadata was older than latest PR metadata but its relevant 18-CANDIDATE/0-ID policy assertions matched. Tests run against the candidate-only fixture; **not native game renderer/raycast or production saves**.

## Authentic browser evidence reviewed again

Reexecuted `tests/block-packs/pack-5/esm-webgl-browser.py` in each of **six modes** `m1,m2,m3,m3b,m4,m5`, using `LIBGL_ALWAYS_SOFTWARE=1 EGL_PLATFORM=x11 xvfb-run -a python ... <mode> <output>`.

- **36/36 PASS** genuine Chromium native ES-module WebGL2 captures: six galleries × three 667×375, 844×390, 932×430 mobile-landscape viewports × two rotations (0,1).
- Each contains all intended distinct original candidate geometry panels, nonblank WebGL2 framebuffer readbacks, and orientation changes. Examined M5 844×390 screenshot: heavy ironbound leaves vs real-slot portcullis are distinct, as are chandelier arm structures, stable divider kickboard and dry hollow feed trough. No new reproducible screen clipping or per-box mesh defect.
- Browser runs actual WebGL2 / native ES-module semantics with offline `data:` module URL imports under virtual X/software GL. **Localhost HTTP navigation remains blocked by administrator**; this does **not** validate source-served GitHub Pages, production iPhone PWA, on-device GPU/FPS, real player controls or production world geometry.

## Acceptance disposition / still-open gates

**M6 baseline candidate-source cross-family readiness = PASS (178/178).** No proven shape defect was identified in that initial phase; subsequent post-M6 verification demonstrated and repaired a candidate fixture ray-reach defect, documented below.

**NOT ACCEPTED / still separate:** creator premium art sign-off for M1–M5, an authorized actual HTTP-served gallery, physical-iPhone device performance and two-thumb control acceptance, production registry allocation and 8-bit/256+ widening, schema-1 save compatibility, production renderer/raycast/placement integration, actual mixed-building placement, merge/deployment and v0.11 unlock. Latest exact-head root GitHub Actions status must be checked separately; queued is never green certification. Root workflow does not discover nested Pack 5 test files.

This dossier is a *handoff for eventual authorized integration*. Keep PR #119 draft/unmerged/undeployed; **do not** assign persistent IDs, edit other packs/automations/shared systems, modify production schema-1 saves, approve Gate A or unlock v0.11 without explicit creator authorization.

## Post-M6 focused final readiness — demonstrated ray reach repair (2026-11-14)

### Demonstrated source-only bug and actual patch

Reproduced on genuine authored `pack5:086` Ledger Service Shop Counter in the *isolated* Pack 5 fixture: a ray originating at `[0.5,2,0.5]` with a 0.5-world-unit reach cap incorrectly selected **and removed** the counter when passed direction `[0,-3,0]`, despite the physical upper surface being farther away. With unit direction `[0,-1,0]`, the same cap correctly returned no hit. The bug was that the original slab-ray solver treated non-normalized ray parameters as world-distance units, allowing overreach.

Fixed **only** `src/block-packs/pack-5/fixture.mjs`: finite, nonzero ray direction is normalized once before shape AABB intersections, keeping `maxDistance` and reported `hit.distance` in actual world units. Explicitly reject directions whose Euclidean norm overflows; preserve existing unit-vector behavior, subcell physical hitboxes, nearest-hit ordering, and atomic fixture removal. This is **not** a change to the production game raycast or controls.

Four new source-native M6 regressions in `tests/block-packs/pack-5/m6-cross-family.test.mjs` check scaled directions at small/large magnitudes, removal limited by genuine distance, stacked chandelier-and-counter nearest targets, and invalid finite-component but nonfinite-length direction vectors. These are **demonstrated test-fixture corrections**, not simulated mobile-user tests.

**Exact committed Git blob parity** with locally executed source and regressions:

- `src/block-packs/pack-5/fixture.mjs`: `cf7baf90555d81ddd4dcba496f2d3ea469b12a41`
- `tests/block-packs/pack-5/m6-cross-family.test.mjs`: `de5ee4ae2ad0b17165a13245b874e407725aa6da`

### Reproducible result after the patch

- `node --test tests/block-packs/pack-5/*.test.mjs` under **native Node v22.16.0: 182/182 PASS, zero failed/skipped**, comprising the original 156 M0–M5, the original 22 M6 cross-family tests, and four new ray-reach regressions. All preexisting candidate geometry and original tests continue to pass.
- Reexecuted **36/36 genuine Chromium native ES-module/WebGL2 source-preview captures PASS**, six galleries `m1,m2,m3,m3b,m4,m5` × 667×375, 844×390, 932×430 CSS landscape × 0/1 rotations. Each gallery displays its true physical candidate geometry, with nonblank per-card GPU framebuffer readback. No blank/clipped new panel was identified in the M5 844×390 review. Source is offline native `data:` ES-module imported under virtual X/software GL; **HTTP-served Pages/real iPhone GPU/production controls still not proven**.
- Latest rechecked main `ac263720b60641c65b02330348dd76d0ef9cb75e` / checkpoint **008**, Issues #109/#117, current manual Packs 1–4 draft PR heads and biome130 ownership. No other lane files changed. All 18 unique provisional symbolic family entries remain CANDIDATE, **zero integrated, zero persistent numeric block IDs**.
- GitHub exact-head root workflow may remain queued; its result is independent of the separately executed 182 dedicated source-native tests. Never label queued CI as successful.

**Final isolated readiness disposition: source-only post-M6 technical QA PASS after one proven fixture defect repair.** All creator aesthetic approvals, real iPhone control/GPU checks, actual served Pages, safe schema-1 save/ID widening and live shape/registry integration remain OPEN. PR #119 must stay DRAFT, unmerged/undeployed; no Gate A approval or v0.11 unlock.

## Additional post-M6 isolation acceptance: failed restore after support loss (2026-11-14)

**Demonstrated bug**: A physically authored `pack5:086` Ledger Service shop counter could be placed on a supported cell, then the backing support could be removed independently. If a subsequent incoming candidate fixture snapshot contained a bad variant, `restore()` would reject it, then attempt to recover the previous state by calling `place()` for the backup. Because the support no longer existed, that recovery itself failed and the previously placed counter disappeared. Reproduced without editing the production engine. The same failure applied to a rotated two-cell runner and a ceiling-supported chandelier.

**Pack 5-only fix**: In `src/block-packs/pack-5/fixture.mjs`, failed-snapshot recovery now snapshots the existing `placed` and `occupied` Map records and restores them atomically when placement of an incoming entry throws or rejects, rather than revalidating historical pieces against changed support conditions. Existing geometry, support rules for *new* placements, actual world-unit ray selection and production schema-1 saves remain untouched. The backup retains exact multi-cell anchors, rotations, variant and collision records. Source SHA **`b5f2b49285a010bee98c720462c4a324bf0f5057`**.

**Before/after proof**: Three new genuine native Node cases **failed on the old isolated fixture** (the lost floor-supported counter, the partially unsupported rotated two-cell runner with a distinct ceiling lamp, and the independently unsupported chandelier). After the correction all three pass; the complete existing Pack 5 source-only suite is **185/185 PASS (zero skips/failures) on Node 22.16.0**, up from 182. Exact test blob **`9e8267b5bbc4607b1a43e1d4d5f766b426c321cc`** in `tests/block-packs/pack-5/m6-cross-family.test.mjs`, matching the locally executed source.

**Authentic browser recheck after the fix:** **36/36 PASS**, all six M1–M5 native ES-module Chromium software-WebGL2 previews at 667×375 / 844×390 / 932×430 CSS landscape in both 0/1 orientations. Reviewed M5 844×390 source-driven models, all six visible without blank panel or new crop defect. These are isolated offline `data:` import previews, **not** an actual HTTP-served GitHub Pages app or physical iPhone hardware certification.

**Disposition:** one demonstrated post-M6 state-integrity defect fixed with 3 focused regressions. The earlier 182-test figure is superseded by **185/185**; 18 source-only families remain CANDIDATE / 0 integrated / 0 registered numeric IDs. Main checkpoint 008 and Issues #109/#117 unchanged. Draft PR #119 must stay unmerged and undeployed; creator artwork, source-served HTTP, iPhone GPU and two-thumb controls, production renderer/registry/shape/save compatibility, Gate A and v0.11 remain independent OPEN gates.
