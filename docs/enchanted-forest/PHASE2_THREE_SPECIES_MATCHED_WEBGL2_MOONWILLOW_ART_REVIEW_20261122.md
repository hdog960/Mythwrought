# MYTHWROUGHT — Enchanted Forest Phase 2: Current Original-Engine Tree Gallery and Moonwillow Silhouette Improvement

**Isolated experimental source acceptance checkpoint, November 22, 2026.** No production merge/deployment, save migration, PWA update, CI cancellation, or protected game/biome/other-developer changes.

## Protected refs and exact source

- Entry isolated branch: `research/enchanted-p2-physical-root-safety-20261121` HEAD `f731de7260c133907ac5618794b1323557b956a8`.
- Verified unchanged production `main`: `7016e14cd6289f45eaf7fc6a79a362b47996df65`.
- Verified unchanged protected Enchanted Forest parent: `dev/enchanted-forest-overhaul-20261121-phase0`, `db8cad02387050579c75cbdcdea3e94a9f6d6bee`.
- Original three-species current-source camera-locked visual test: [Actions #45048958889](https://github.com/hdog960/Mythwrought/actions/runs/45048958889), exact source commit **`30373a42206f6f24ea7a8fafea0b80b6c421b3bf`**, SUCCESS, job `137289621607`. Six original-engine WebGL2 captures, matched historical/candidate camera per species; no GPU upload faults, no JavaScript page exceptions, no saved-world byte changes.
- Focused Moonwillow silhouette source enhancement: **`src/manual-biomes/enchanted-tree-candidates.mjs`** Git blob **`088a2e847549cfb16ddc99a9db1ba5c4f20d4d09`**, native source and renderer accepted on exact commit **`a09746e2b236d959ac476b0a93a339fad9459950`** via [Actions #45049380480](https://github.com/hdog960/Mythwrought/actions/runs/45049380480). Native job `137290893106` and original-engine targeted browser job `137290952165` both SUCCESS.

## Why the visual milestone was justified

The last authentic broad three-species original-engine screenshots were created **before** multiple actual Phase 2 geometry and collision changes: 2x2 Giant footings, bark-first crown overlap, face-connected branches, full original 0.28 radius × 1.78 high original-body clearance, the 1024-entry experimental source cache, and source-backed multi-step M7 pedestrian paths. Old 12-image evidence cannot certify those changed silhouettes. Rather than rerun 12 images, the new isolated **child-branch-only** workflow captures **one 932×430 historic/candidate pair for each species** at physically identical original safe-spawn poses. This modifies only an ephemeral disposable localhost `profile-world.mjs` module response, not original `src/main.mjs`, on-disk profile, historical default M7 generator or any save.

Authentic first gallery results (candidate vs historical) from exact source revision:
- **Starspire:** 47,573 significantly different pixels, **11.8707%** at matched original camera. Thin pointed canopy/offset shaft visible.
- **Moonwillow:** 56,917 different pixels, **14.2023%**. Source-visible, but the viewed crown still looked visually compact/conifer-like rather than strongly hanging.
- **Ancient Giant:** 109,030 different pixels, **27.2058%**. Tall broad upper canopy rather than the close original foreground tree.
- **6 WebGL2 screenshots**, 16 original-source tree block witnesses per species, exact camera parity, zero GPU/page faults, and unchanged localStorage save bytes. Original renderer and default profile identity remained unchanged.
- Artifact ID **`14764886691`**, ZIP digest **`sha256:fcdd940f10119033494c9318b4f51353a0625315944d154f62378779f17a254a`**. Downloaded archive ZIP integrity and all six individual screenshot SHA256 manifests independently verified locally.

## Actual gameplay-source silhouette change

Review of authentic first gallery identified a **Moonwillow-specific readability weakness**, not a game crash or collision regression. Starspire reads as a spire; Giant as a high broad forest crown; Moonwillow's constrained compact canopy was insufficiently willow-like at the matched mobile camera.

Reworked only Moonwillow candidate geometry in `src/manual-biomes/enchanted-tree-candidates.mjs`:
- Added **eight uneven drooping moonleaf curtains** with deterministic 3- or 4-voxel-long tips, remaining inside existing radial envelope `±4` and with lowest authored leaf level `dy=3` over the root plane.
- Added real **four-direction 2-voxel bark bearing arms** so the hanging drapes remain visually supported by contiguous mineable branches, not diagonal-only floating bark.
- Preserves all three tree type selector thresholds, site placement and biome rolls, Ancient Giant/Starspire authored shapes, original `WORLD_MAX_Y=19`, existing `ENCHANTED_TREE_MAX_CELLS=240`, no random calls, no new block IDs, cave/landmark veto and elevated-ground leaf-pruning behavior.
- Expanded `tests/manual-biomes/enchanted-tree-structural-branches.test.mjs` with an exact unit test checking all eight drape tips, all four arm supports, geometry bounds/headroom and deterministic variants.

Native acceptance of **25/25 source-native tests PASS, zero fail** on enhanced exact source commit:
- Nine-style bark component test shows **268 connected mineable bark voxels** (prior tested variants 256), all face-connected to real trunks.
- Real original-source body collision: **1,689 original standable AABBs** preserved, including **700 uneven natural terrain cases**. Source original game reads match new canopy/terrain/cave/walking veto.
- Sampled 3 seeds × 6 chunks: **3,035 naturally authored prototype tree voxels**, **2,564 retained leaves**. Previous source-only sample (before this change) yielded **2,921 tree voxels** and **2,502 leaves**. These figures reflect the full sampled forest and should not be mistaken for unique Moonwillow-only counts.
- Original native six-chunk `meshChunk` sample: **963,360 historical bytes vs 1,038,096 candidate bytes**, ratio **1.078**. Each chunk remained below existing 8,388,608-byte upload ceiling. Source byte counts are **not** physical iPhone FPS, resident GPU/heap or PWA performance.

The visual job ran **one Moonwillow-only matched historic/candidate camera pair** after native gate passed. Same source camera `x=-46.5,z=-513.5,feet=10` as the first gallery, 932×430. New source candidate vs historical: **57,432** changed pixels (14.3308%); no GPU/page faults, save changes or camera drift. Artifact ID **`14764832749`**, ZIP digest **`sha256:c5db6d40681f1528f75021149c49f009419cab140bcaa29cfc09325b18415b69`**. ZIP integrity and screenshot manifest SHA256 verified locally.

**Direct old-candidate to revised-candidate image comparison** after hash/checksum verification, with cameras identical: **2,440 pixels / 0.6088%** changed above the RGB sum >24 threshold. This is a **modest but real** silhouette improvement. Do not claim overwhelming artistic differentiation based only on a pixel delta; future visual iteration may benefit Moonwillow.

## CI efficiency and release boundary

- **Executed:** first one-time three-species real original-engine matched-camera acceptance; then one genuinely new Moonwillow-only native 25/25 + one 932×430 browser pair after *gameplay source* changed.
- **Reused:** earlier full native 44/44, 1024-entry cache 10/10, genuine original multi-step walking/slope/footing evidence for unchanged files; did not rerun unchanged Starspire and Giant screenshots.
- **Avoided:** broad Chromium twelve-image set, full repository or unrelated biome CI, duplicate native suites, repeated GitHub queue inspections, workflow cancellations, protected branch/production changes.
- **Still pending:** physical iPhone 17 Pro Max **installed Home Screen PWA** test, original Safari browser GPU/VRAM/frame p95, real mixed-biome streaming, further long-run canopy and visual quality review, and separately approved generator/save versioning. Experimental tree source is **disabled by default and historical M7 save refuses opt-in**. No release authorization.
- Local comparison artifacts created and verified in this session: `/mnt/data/enchanted-phase2-three-species-matched-review.png` and `/mnt/data/moonwillow-three-stage-visual-review.png` (external model-review outputs, not repository source or deployed game assets).

**Engineering outcome:** Three candidate species render in the genuine original engine from matched terrain cameras; targeted Moonwillow drapes improve its authored geometry with source-native collision/GPU acceptance and updated original WebGL2 visual proof. This is source-accepted experimental work only.
