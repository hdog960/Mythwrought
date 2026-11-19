# Mythwrought — M2 Live Four-Biome Integration Candidate

**State:** creator-directed isolated DRAFT implementation, not deployed or merged.
**Parent accepted bridge:** [PR #238](https://github.com/hdog960/Mythwrought/pull/238), SHA `7ece70f1fa4a852026f29efcd51c22d9c746082c`; exact-head [Actions #44223588557](https://github.com/hdog960/Mythwrought/actions/runs/44223588557) SUCCESS: **12/12 CI contracts, 981/981 native tests, all 20/20 legacy browser/WebGL2 regressions**. Independent artifact ZIP 26,156,421 bytes: **88/88 PNGs decoded, 86 unique SHA256 hashes**, sizes included 667x375, 844x390, 932x430. Those images are previous live-game LEGACY screenshots only — do NOT use them to claim four-biome runtime visuals.
**Original source candidates:** biome PR #172 SHA `19db446458a61075be5103e1490fb16637ce641a`; M0/M1 PR #231 SHA `a8d878633eef9c94f64ba225c80a19ac1f2216ea`. Main inspected at `104e57ff678a0c58593d1e3c85c13c6c112da992`. None is modified by this branch.

## This child draft's runtime path

The actual game in `src/main.mjs` now branches **only on verified persisted biome profile metadata**, using `openM2World` + `FourRegionWorld` as the base inside the exact existing `Pack2LiveWorld`. The original `loadWorldSafe` and Pack2 loader remain in place for unprofiled legacy seeds. Existing world/seed UI does not silently opt into new generation.

An explicit and separate **CREATE NEW FOUR-BIOME WORLD** button is placed inside the existing settings sheet, not touch rails or the upper-right minimap. It requires a different, unused seed and explicit user confirmation; attempts to convert a previously saved/explored/sidecar-bearing seed are rejected by the source-level immutable-profile gate. Successful activation persists the profile, verifies the schema-1 base and independent Pack2 sidecar, clears GPU chunk caches and resets world-bound physical-pack consumers. Player controls, physical world readers, raycast and collision use the real live wrapper, not the older read-only candidate view.

On a **profiled** world, SAVE uses `saveM2World` (Pack2 then authoritative profile-aware base reload verification). On a **legacy** world the original saver remains unchanged. LOAD/CREATE checks the destination's profile before choosing the correct saver, preserving the old-world code path.

Export on profiled seeds includes a versioned generator profile, schema-1 edits AND a full Pack2 physical sidecar. Import of such a bundle is validated without writes, then requires explicit confirmation and allows **new, unused seed only**; old stored seeds can never be replaced by the new-profile branch. Legacy-only imports are rejected when their destination has a biome profile. The original legacy import path stays intact for ordinary worlds.

The existing IndexedDB **vault and mirror are legacy-format-only**; they cannot safely store the generator identity yet. This child fails closed for profile-world vault BACKUP/RESTORE, mirror enable/export/RESTORE and automatic mirroring; source-validated portable WORLD EXPORT is offered instead. These features are not claimed as fully profile-aware backup services. A later review must establish equivalent profiled vault/mirror capability or keep clear limitations and alternative independent backups. No silent data loss is acceptable.

## New genuine WebGL2 acceptance

`scripts/ci/manual-biomes-m2-live-webgl2.mjs` serves the actual repository game over localhost and uses pinned Playwright/Chromium WebGL2 SwiftShader. The test chooses legacy seed 7, explicitly creates NEW four-biome seed 179 using the settings UI, validates real `FourRegionWorld` through localhost-only game diagnostics, teleports on the real game world's physical source to Desert, Snow, Mountains, Enchanted Forest, and captures a source-specific image for each at **667x375, 844x390, 932x430** (12 total). It asserts actual registered top surface block IDs, independently recorded screenshot hashes/dimensions, and tests a real-world edit/SAVE/hard-reload roundtrip, retaining seed 7's legacy profile-free identity. No synthetic mocks, preview world view or static image substitute. A separate **manual-biomes** GitHub Actions workflow uploads the genuine screenshots+manifest (and failure JSON on error).

**Do not mark M2 live accepted unless:** (1) exact-head root native/full 20-script CI PASS, (2) separate real-four-biome Chromium workflow PASS, (3) independently inspect all 12 manifest-linked image hashes/dimensions/visual framing and verify no shader errors/context loss, (4) profile save/reload/import old-world safety PASS, (5) iPhone Gate A controls/performance still subject to creator physical device review. All four biomes actually published, fully naturally discoverable and finished to visual taste belong to future M3–M8 creator-approved milestones.

## Non-negotiable fences and followups

- This PR must target the **M2 bridge branch**, NOT production main; it is a separately reviewed candidate. PRs #172, #231, #238 and all cave, object, block-pack and builder owner branches are preserved unchanged. No merge, deploy, original save mutation or v0.11 unlock.
- The minimap's old terrain-height color sampler may not yet distinguish newly raised biome terrain; preserve fog-of-war and upper-right map reservation. M5 handles biome-aware map under source-exact review.
- The existing v0.10 device vault and mirror remain gated for profiled worlds; profile-safe WORLD EXPORT is the independent backup route until a new device-backup schema is approved.
- Real-device 60 FPS and artwork acceptance cannot be certified from Chromium SwiftShader. Record iPhone landscape playtest separately.
- M2 must not claim any biome is active in public Pages; only a separately authorized future M8 release may publish.
