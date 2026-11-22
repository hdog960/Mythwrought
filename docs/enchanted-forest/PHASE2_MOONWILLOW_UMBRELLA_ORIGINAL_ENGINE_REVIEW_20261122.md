# MYTHWROUGHT — Enchanted Forest Phase 2: Authentic Moonwillow Umbrella Silhouette Review

**Source-only experimental branch acceptance — November 22, 2026.** This is **NOT** production readiness, a PWA deployment, or a new historical M7 generator/save revision.

## Protected refs and exact source

- Working branch `research/enchanted-p2-physical-root-safety-20261121` entry HEAD `98b83b68e4534f989c23225be2b2d79982e74714`.
- Production `main` verified unchanged `7016e14cd6289f45eaf7fc6a79a362b47996df65`; protected parent `dev/enchanted-forest-overhaul-20261121-phase0` verified unchanged `db8cad02387050579c75cbdcdea3e94a9f6d6bee`.
- The prior Moonwillow art review is `docs/enchanted-forest/PHASE2_THREE_SPECIES_MATCHED_WEBGL2_MOONWILLOW_ART_REVIEW_20261122.md`, last native- and WebGL2-tested source commit `a09746e2b236d959ac476b0a93a339fad9459950`, successful Actions `#45049380480`.
- New Moonwillow source `src/manual-biomes/enchanted-tree-candidates.mjs` Git blob **`c0045f41b4058896946fab18296dbd1e053bcbba`**; one source-only source commit `c179d96dcbf42c83e13b2d9a8d2525f968f0df98`.
- **Exact tested source HEAD `c3182a9d92d5abefbfff9cdf53ad396bed783497`**, via targeted [Actions #45055218381](https://github.com/hdog960/Mythwrought/actions/runs/45055218381); jobs `137308825613` (native) and `137308939921` (original-game WebGL2) both **SUCCESS**.

## Original-engine visual evidence, not guessed aesthetic success

Authenticated previous 932×430 Moonwillow candidate rendered in the original game from the real original M7 source camera at `x=-46.5,z=-513.5,feet=10`. In that screenshot, the dense conical crown and compact curtains were still visually conifer-like. This was a real art readability weakness, not a GPU crash or missing physics.

The new version changes **only Moonwillow candidate voxels**:
1. A broad horizontally overhanging moonlit **umbrella** at `dy=trunk`, with an **airy sparse underside** at `dy=trunk-1` and a narrow top rim at `dy=trunk+1`. Compared with an old tiered pyramid, this deliberately emphasizes width instead of height.
2. **Twelve** spatially separate deterministic drooping moonleaf curtains (the prior candidate had eight) of three/four block lengths; bottom leaves remain at least three voxels above original level root ground.
3. Existing four physical two-block mineable bark arms, bent central shaft and original `G.aetherBark` collision/selection identity retained; a source-only BFS regression confirms **all voxels**, not just bark, are face-connected to the original root across five Moonwillow style rolls.
4. Same `ENCHANTED_TREE_MAX_RADIUS=4`, `WORLD_MAX_Y=19`, `ENCHANTED_TREE_MAX_CELLS=240`; new tighter Moonwillow test requires no more than **135 authored cells**, full integer coordinates, 12 genuine hanging tips and floor/headroom checks. No new block IDs, climate rolls, other tree species, player/physics/voxel engines, original caves/landmarks, M7 generator/save identity, UI, PWA or other development lanes changed.
5. Actual M7 3×3 baseline surface clearance still removes leaves that would occupy the original 0.28-radius, 1.78-height player's first two walking-air voxels on real slopes. No edits to source terrain, cave AIR or landmarks.

### Real native source acceptance

Focused source-native job `137308825613` ran the **affected original Moonwillow geometry, walking-clearance, true M7 real-world and prior Phase2 native tests only**. **28/28 PASS, 0 fail**. The original test logs showed:
- `9` style variants' genuine structural bark face-connected, **268 mineable bark voxels**, no floating bark.
- Three-seed original-source sample: **2,966** authored candidate tree voxels, **2,495** naturally authored leaves; previously accepted sample before this umbrella revision had **3,035** tree voxels / **2,564** leaves. Do not equate fewer source voxels with lower GPU surface area.
- Original real `collides` / `stepPlayer` headroom unchanged: **1,689** previous M7 standable edge/corner poses remain walkable, including **700** at uneven-height original M7 ground; real three tree site scan **168/167/163** standable cells (Starspire/Moonwillow/Giant).
- Source-only native original mesher six-chunk aggregate: historic **963,360 bytes** vs new experimental **1,060,344 bytes** (ratio **1.101**), all six individual chunk uploads below the unchanged **8,388,608-byte** limit. Compared with the prior Moonwillow revision candidate aggregate **1,038,096**, this is an additional **22,248 bytes**, about **2.14%**. The umbrella exposed more mesh surface although it authored fewer total voxels. **No iPhone frame time, GPU resident memory or thermal result claimed.**
- Prior source-only 1,024-entry default candidate cache, original three-seed giant footing/cave and chunk seam evidence remain reused for unchanged source. No blanket assertion that all previous measured exact values necessarily remain unchanged by the new Moonwillow geometry.

### Real original-game WebGL2 acceptance

The isolated original-engine job `137308939921` reused the accepted one-species matched-cam script, with disposable localhost replacement of the *response* to `profile-world.mjs`; it did **not** mutate original source files, main game logic, historical M7 default, persistent saves, or installed Home Screen shortcut. Only **one matched historical/candidate Moonwillow pair** at **932×430**, original camera `x=-46.5,z=-513.5,feet=10`, original engine renderer and block-ID witnesses. No GPU upload faults, page exceptions or original save-byte changes.

- Current candidate vs historical: **58,352 visibly changed pixels, 14.5603%** of the full view, zero source/witness/camera mismatches.
- Original Actions artifact `14767362127`, ZIP digest **`sha256:3dc2c31528db77d762ad097ccadec8ad16d11dff733443b85d61722a799508d7`**. Downloaded artifact ZIP CRC and both screenshot PNG SHA256 hashes **independently verified in the local runtime**.
- Direct new candidate vs **previous Moonwillow candidate**, using the identical physical camera and RGB sum >24 pixel threshold: **6,001 changed pixels / 1.4974%** of frame. This is materially stronger than the previous 2,440-pixel / 0.6088% art tweak but is **not a claim of massive appearance change**. Full actual-game screenshot montage (created outside the repo for inspection) at `/mnt/data/enchanted-moonwillow-umbrella-three-stage-comparison.png`.
- **Visual reviewer conclusion:** the upper canopy is visibly wider, flatter and more draped. It is less pine-like, but the near-facing curtain remains fairly boxy/blocklike in the matched camera. Preserve this as a measurable silhouette improvement and source acceptance **without calling it final artistic completion**. Do not blur screenshot parity with new device FPS.

## CI efficiency and remaining release gates

- **Executed:** one genuinely changed-source focused native **28/28** plus one Moonwillow-only original-engine WebGL2 matched pair on the same exact source. Current all-three-species unchanged broad gallery and any other unchanged code suites were not repeated.
- **Reused:** previously successful native cache 10/10, connected original bark, Giant source/cave and original engine Starspire/Giant visual evidence where their relevant code remained exactly unchanged.
- **Avoided:** duplicate full repo CI, twelve-screenshot browser reruns, repeated Actions queue audits, CI cancellations, workflow edits outside the branch and any production merge/deploy.
- **Outstanding:** improve the still solid-looking visible Moonwillow curtain if warranted by future visual review; analyze original mesher exposed faces/performance versus the +10.1% six-chunk aggregate; actual physical iPhone 17 Pro Max **installed Home Screen PWA** (streaming, GPU, FPS/p95, memory, thermal) once source is versioned for safe rollout; future separately reviewed new generator identity and version-safe saves. **Experimental trees remain opt-in and unsaveable under historical M7**.
- Main, parent, five automations, Codex, settlements, caves, other biomes, original player saves and deployment/production remain untouched. No approvals implied.

**Conclusion: new Moonwillow horizontal umbrella silhouette is accepted as a real visual improvement on the isolated source, with clearly bounded costs and remaining visual/release issues.**
