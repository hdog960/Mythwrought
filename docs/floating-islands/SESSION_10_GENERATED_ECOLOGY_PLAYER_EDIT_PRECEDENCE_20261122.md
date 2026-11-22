# MYTHWROUGHT Floating Islands — Session 10 generated ecology and player edit separation

Date: 2026-11-22. **Isolated source-only research checkpoint; NOT deployed or integrated into production.**

## Exact starting refs, source grounding and Codex status

- Verified initial research branch `research/floating-islands-sky-runtime-adapter-20261122` HEAD `4294f7e5bc9f0f98222c8832a2c07f1252817fb2`.
- Verified protected production `main` HEAD `7016e14cd6289f45eaf7fc6a79a362b47996df65`.
- Read `docs/floating-islands/SESSION_9_PHYSICAL_FLORA_PROVENANCE_AND_ROOT_SAFETY_20261122.md` directly on the exact research HEAD.
- One initial GitHub branch/PR/commit search found no accessible Codex Floating Islands generator source. The unpushed generator, sky-save schema, true island density, default height rules, sky ecology and distances beyond 10,000 remain unverified. **Do not invent these.**
- Preserved original physical and existing isolated modules were recovered byte-identically from verified prior test artifacts: `sky-vegetation-physical.mjs` blob `769b2ac67f8bb552aeb8ecfb5a71acbec6fbf54b`, `sky-certified-flora.mjs` blob `6f8de59516325995501f38d4966456b7347d73c0`, `sky-original-flora-authority.mjs` blob `acebd5210dfc5f5abedc6344f48a4e7e679a9afa`, `sky-runtime-adapter.mjs` blob `bfb423288c7005a87521d4e54a1dd222de150603`.
- The existing original **provisional** `sky-sidecar.mjs` was reconstructed and verified to match GitHub blob `fce4ae0c85c5e690eb26e59b0b38f11a602763ec`; native Node exercised it directly for mine/restore tests.

## Source defect and isolated improvement

The Session 9 physical vegetation planner deliberately returned read-only proposed cell placements; those proposals must **not be written into the provisional user-edit ledger**. Otherwise naturally generated trees would consume limited player edits, be permanently treated as user-authored, and become hard to restore after mining. A proper source-only world-view layering is required:

`original upper generator -> deterministic source-certified physical flora -> explicit saved player edits (including AIR=0)`.

A second missed source issue: natural flora at the Y20 upper boundary may change original Y19 surface face visibility; canopy at x/z/y section boundaries must also remesh adjacent sky sections, and every affected neighboring section needs its own source-revision fence.

### New: `src/floating-islands/sky-ecology-overlay.mjs`

- Accepts an already authenticated `planCertifiedSkyVegetation` certificate, authoritative world/gen/section revision readers, actual natural generator `naturalGet`, original `validateId`, protected-cell veto, and bounded separate player AIR/placement edit and rotation maps.
- Creates a read-only **natural** layer for up to 512 existing physical flora voxel proposals. The source material (real 370/379 pine, 375/384 blackwood, 376/385 moonwillow, 287 star-moss) remains real selectable/mineable/collidable physical geometry. No fake flora ID, decorative mesh or new generator.
- Player edit Map overrides generated flora **even when id=0 (mined AIR)**. The natural layer remains intact for subsequent new-world regeneration and is NOT inserted into save edits. A single mined leaf does not erase other trees.
- Saves are never touched; the returned Map getters copy, rather than alias, the original player edit snapshot. Canonical signed coordinates, original registered IDs, nonorphaned rotations, max 8192 authored player edits, max 512 flora cells, and +/-10,000+ distances are guarded.
- Checks exact generator world/seed/fingerprint/epoch and global revision before and after source callbacks, and **all certified and adjacent rendering section revisions**. Public `assertFresh()` is required at every original meshing/renderer publication boundary; it intentionally is *not* called per voxel for iPhone performance.
- Plans sky mesh invalidations for 3D neighbor and vertical seams, and **original ground chunk invalidations on Y20** using production native `cx,cz` key grammar. No actual WebGL/upload or original-world mutations are performed.
- Retains original `SKY_ISLAND_LIGHTING_POLICY` with `darkenGroundUnderIslands=false`, zero new shadow passes, and no independent sky clock; original three-moon cycle remains untouched.

### New: `src/floating-islands/sky-ecology-stage.mjs`

- Runs the previously authenticated **actual isolated source planner** `planOriginalSkyEcology`, which requires the exact same original physical-world object used by the generator source, then constructs the new overlay. This path does NOT accept a caller-fabricated certificate.
- Validates every provided player edit is *already* represented in the same physical world `get()` reader, so a source tree cannot accidentally grow on a root mined out in a separate, stale edit view.
- Hands the physical host a read-only descriptor with `skyGet` natural source, `skyRotationAt` including authentic original source orientation, separate `skyEdits` including AIR, and `assertFresh` for the caller. It does not instantiate the direct-import production `sky-original-host.mjs`, whose complete import closure remains unavailable locally.
- 0 writes to world, original Schema-1, provisional sky save or GPU, and 0 additional ground shadow passes.

## Test provenance and anti-clogging

- Local Node **v22.16.0** `node --test` on precisely changed files, plus **byte-identical unchanged original isolated dependencies**:
  - `tests/floating-islands/sky-ecology-overlay.test.mjs`: **26 PASS**
  - `tests/floating-islands/sky-ecology-stage.test.mjs`: **15 PASS**
  - `tests/floating-islands/sky-ecology-sidecar-roundtrip.test.mjs`: **6 PASS**
  - Total **47/47 new focused tests passed**; exact `node --check` passed for every new `.mjs`.
- The `sky-sidecar.mjs` tests execute the prior authentic provisional save module, including mining a naturally generated trunk to AIR=0, exporting JSON and reloading it without changing original Schema-1, reverting to the generator baseline, unknown ID rejection and generator fingerprint mismatch refusal.
- Prior unchanged S9 31/31 and S8 73/73 results were **not redundantly rerun**. Three earlier genuine complete-repository `sky-original-native.test.mjs` tests remain **UNRUN**. The user-provided Codex generator, original WebGL2/iPhone Home Screen PWA, original renderer lighting and worldwide island density have NOT been tested.
- No GitHub Actions, Chromium browser jobs, redundant suites, CI cancellation, branch merges, new production save writes or deployments.

## Next short-term integration priorities

1. Obtain Codex's actual original island-generator source, world/read API, saved upper edits, world edit and per-section revision semantics; adapt this provisional layer without overwriting its author.
2. Run the three original `VoxelWorld`/biome130/direct-import tests once on a complete original source checkout. Confirm actual physical log/leaf boxes and original shape collider/selection match the rendered trees, including cutout/transparency handling.
3. At a renderer-owned frame boundary, revalidate overlay `assertFresh` around original physical meshing and source-attested `sky-certified-owner` GPU publish, preserving <=25 authorized ground+sky slots, <=2 uploads/frame, untouched original 27/34 depth exception and transparent-water buffers.
4. Bind the original G2 safety and section queue to the same sky overlay and saved AIR layer. Check every x/z/Y crossing and all 8 full-body seam sections. Do not let proposed synthetic G2 requests leak into the real native queue.
5. Genuine source and browser acceptance must verify organic giant lush islands in signed +/-10,000+ world coordinates, physically mine/place/restore, sunlight beneath islands, original three moons and day/night, iPhone frame budgets and installed Home Screen PWA.
6. Long-term mobs, structures, settlements and villages remain on hold. No merging, deployment, cancellations, changes to automations or other developer lanes without authorization.

**Release gate:** source-only. This checkpoint is NOT a playable Floating Islands release.
