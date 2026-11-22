# MYTHWROUGHT — Enchanted Forest Phase 2: Real Player Walking Headroom Native Gate

Date: November 22, 2026. **Isolated experimental tree candidate; no merge, deployment, default-generator change or save migration.**

## Source and protected reference evidence

- Entry branch `research/enchanted-p2-physical-root-safety-20261121` HEAD: `e8937ec3aa83a53f50fd0910ed206d486de2a2bf`.
- Production `main` verified `7016e14cd6289f45eaf7fc6a79a362b47996df65`.
- Protected Enchanted Forest parent verified `db8cad02387050579c75cbdcdea3e94a9f6d6bee`.
- New **exact tested source revision**: `5aa7a4eb1aa74b4e8edb0d1270ef968ca9f3b12d`.
- No change to production main, protected parent, other developers, other biome lanes, five automations, caves, settlements, Codex, physical iPhone PWA, historical M7 generator ID, or any persistent user saves.

## Genuine Phase 2 physical walking source change

The original game `src/voxel.mjs` implements a true full-cube AABB body of **radius .28 blocks** and **height 1.78 blocks**; leaves `G.aetherLeaves/G.moonLeaves` collide as solids. In an elevated adjacent terrain column, a candidate leaf may occupy either of the first **two voxel layers above an existing surface** and obstruct ordinary player walking even though its originating trunk stands on valid ground.

- New `src/manual-biomes/enchanted-tree-walking-clearance.mjs` scans only existing **experimental candidate** leaf coordinates against the real source `readCell` baseline for the two lower layers. It **removes a leaf only if one of those two layers is not original AIR**. Unchanged canopies reuse their input array (copy-on-first-removal); bark/root/branch IDs are never deleted, terrain/cave/landmark sources are never mutated or filled, and seed/density rolling is unchanged.
- `src/manual-biomes/environment-v7.mjs` runs the helper **only after the original tree grounded/placement AIR preflight has passed and only for explicit experimental enchanted trees**. Historical M7 trees continue their original path exactly; other biomes and save serialization remain untouched.
- This preserves original bodily headroom while continuing to enforce real two-by-two Giant root cap/subsoil safety, canonical Y19 height, native 8 MiB maximum per-chunk mesh bytes, and face-connected original mineable shafts.

## Authentic source-native acceptance

**Single** GitHub Actions run [#45035989738](https://github.com/hdog960/Mythwrought/actions/runs/45035989738), exact source HEAD `5aa7a4eb1aa74b4e8edb0d1270ef968ca9f3b12d`, job `137249739046`: **SUCCESS**. Complete relevant source-native logs inspected. **33/33 Node 22 tests PASS, 0 fail**, only eight focused original M7/enchanted test files, no Chromium, npm dependency download or whole repository suite.

New direct tests:
- 5 native unit tests in `tests/manual-biomes/enchanted-tree-walking-clearance.test.mjs`: precise two-voxel body clearance, source-landmark and raised-cliff conservation, fail-closed unknown data, copy-on-first-cut fast path, all three species across nine style variants with intact bark, and the genuine original source `collides` detecting an obstructive leaf before and a genuinely walkable space after a cut, with the unchanged physical ground probe still supported.
- 3 real-world native integration tests in `tests/manual-biomes/enchanted-tree-walking-real-m7.test.mjs` using original `FourRegionWorld`, real M7 cave/landmark/soil material, actual `collides`, and genuine original `stepPlayer` physics.
  - **2,507** actual naturally generated leaf voxels individually checked in three seeds across six original chunks per seed, every leaf with two AIR layers below in original authoritative terrain/cave source; **2,926** total authored tree voxels sampled, **7** with first supporting original ground 3 layers below, and 0 violations.
  - Source-authentic tree sites of Starspire `(-38,7,-525)`, Moonwillow `(-36,10,-499)`, Ancient Giant `(20,6,-525)` each passed original source walkability: **168, 167, 163** true standable cells respectively (**498** total within tested neighborhoods), with true baseline ground probe, zero introduced obstruction at positions previously standable in historical M7 outside real trunks.
  - At least one actual original-world physically clear adjacent corridor passed `stepPlayer` movement (real source physics input and collisions) with no foliage block, no unexpected step-up, no falling below support, genuine positive horizontal displacement.
- Retained 25 existing focused root/canopy/voxel/collision/mesher/save regression tests passed **on this exact modified source**, including **12 natural Giant placements** (seed179=5, seed7919=1, seed-88=6), **48** authentically supported Giant roots, **62** connected cross-chunk physical voxel pairs, **2,926** voxels and **465** source border voxels in the sampled source chunk family. All nine physically connected bark style variations remain genuine.
- Actual original native six-chunk source `meshChunk` **historical 963,360 bytes vs experimental 1,012,824 bytes**, ratio 1.051, all individual chunk meshes within unchanged `MAX_CHUNK_UPLOAD_BYTES=8,388,608`. This is an upload-size sample, **not FPS, latency or physical device measurement**.
- Experimental `FourRegionWorld.save()` still **throws** instead of silently saving a changed tree baseline under historical M7 schema/generator identity; legacy default saves and other biome output retained.

## CI efficiency and explicit acceptance boundary

- **Executed:** 1 targeted authentic source-native job, 33/33 PASS on exact head.
- **Reused:** prior successful 25/25 native and original-engine WebGL2 evidence only where underlying source unchanged; did not misrepresent previous native evidence as certification of today's new headroom code.
- **Avoided:** duplicate full suites, repeated GitHub queue audits, broad browser/screenshot/PWA CI, other developer CI, unrelated workflow changes and cancellations. Later documentation-only commits may reuse exact-source acceptance without rerun.
- **Outstanding:** original-game WebGL2 visual review of the updated crown where leaves were pruned; walking/collision coverage across more real forest seeds and terrain shoulders; iPhone 17 Pro Max installed Home Screen PWA long-walk FPS/p95, chunk streaming/memory/energy; any required whole-release integration gates; a **separately approved new generator ID and version-safe save strategy** before the experimental trees can ship. No unauthorized merge/deployment.

**Conclusion: native Phase 2 canopy walking-clearance engineering accepted at the specified exact source revision; not release-ready.**
