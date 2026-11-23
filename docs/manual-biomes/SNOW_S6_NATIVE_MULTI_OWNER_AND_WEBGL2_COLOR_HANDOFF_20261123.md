# Snow S6 exact original-owner conifer and real WebGL2 winter research — 2026-11-23

## Protected state, authoring and isolated ancestry

- Protected production `main`: `7016e14cd6289f45eaf7fc6a79a362b47996df65` — do not move.
- Protected OPEN DRAFT PR #358: `59e449be7e73b25f259c4c72855cfb638a056517` — do not change/merge.
- Verified previous Snow S6 handoff base `research/snow-s6-pristine-new-world-design-isolated-20261123` at `0bba4b81bfb4641898a81f4fb620a505721bea16`.
- Native owner branch `research/snow-s6-four-chunk-owner-physics-isolated-20261123`: native tested HEAD `fe4020a2696259a7af433553b575a202582c159b`. The first research commit `e4c8dc923b39bf0a04a5f83c3f8f380a7707fb7b` created workflow YAML with an invalid inline `with` map, so Actions #45209276320 created no jobs and failed; the follow-up `fe4020...` changed ONLY workflow YAML maps, without weakening tests or changing source/test bytes.
- True browser-only color research branch `research/snow-s6-webgl2-inmemory-winter-preview-isolated-20261123` forked from the tested native owner HEAD; browser implementation HEAD `65148c4474dfb96cfb884b04146cd59bf60b2934`.
- Both are **detached**. Original M7 source, physical block IDs, cave source, original shader, all existing schema-1 worlds, generator registration, public PWA and saves were not edited. No merge, deployment, branch protection bypass, CI cancellations or other owner branches touched.

## Original source conifer owner and full-player-body audit

New `src/manual-biomes/snowy-s6-cross-owner-forest-audit.mjs` reconstructs a 2x2 actual original 16×16 chunk window, including negative coordinates. Every slice from `previewSnowS3CanonicalOwnerChunk` must match the EXACT admitted full tree from its canonical owner `reviewSnowS3PlayerApprovedChunk`. It calls the original `proposedSnowTree` shape factory with the tree's documented `style` and `wind`, proving voxel-by-voxel exact provenance and rejecting duplicate/overlapping cells, cave AIR, edited cells and physical occupancy.

Critically, source-approved owner trees are checked **in aggregate**, using a read-only, deterministic staged `world.get` overlay and the original `auditSnowS3OriginalPlayerBody` against an injected authentic `voxel.collides` callback. This guards directed portal reachability after adding trees from neighboring source owners; rejected trees are NOT silently removed to fake a pass. The real saved M7 source and sampled cave/voxel cells are compared before/after. This is a bounded four-chunk test, not proof of infinite-world performance or all future neighboring-owner scenarios.

**Exact authentic original Actions #45209456512: COMPLETED SUCCESS** at HEAD `fe4020a2696259a7af433553b575a202582c159b`. The test checkout was the original full repo, Node22. Six focused synthetic M7-contract fixtures **6/6 PASS**, one full ORIGINAL two-seed M7 integration **1/1 PASS**. Native outputs:

| Original M7 seed | Distinct real source-owned physical trees | Exact original styles | Physical cells | Original body collision probes | Preserved directed portal pairs |
|---|---:|---|---:|---:|---:|
| 179 | 3 | 1 layered-spruce, 1 highland-pine, 1 compact-fir | 256 | 3,319 | 2,276 |
| 2026 | 1 | 1 layered-spruce | 108 | 935 | 992 |

Real two-seed aggregate is **4 trees, 364 physical voxels, 4,254 original body collision probes, 3,268 directed portal pairs**, fully read-only and request-order invariant. The audited 2x2 window is owner chunks (-1,32), (0,32), (-1,33), (0,33). A windswept-alpine design exists as a fourth prototype but was **not** authenticated as an actual tree within this particular window; don't manufacture a style count.

## Authentic, actual original-game Chromium WebGL2 snow color experiment

New `scripts/ci/snow-s6-original-webgl2-intercept.mjs` boots the actual full Mythwrought game via localhost on pinned Node22 and Playwright Chromium WebGL2 SwiftShader. The original page loads untouched original `src/voxel.mjs`. The candidate page uses Playwright `page.route` to intercept **exactly one browser module request** for `/src/voxel.mjs`, verifies the original HTTP source SHA256 equals the exact checked-out real repo file and substitutes a temporary *in-memory-only* renderer expression. That expression uses the already-source-tested `previewSnowS6WinterTone` and real `v6BiomeAt` for natural, unedited M7 block IDs 272, 276, 279 in the SNOW biome. All other cells, player-edited ice, non-snow biomes and all world/save data remain untouched. The candidate does NOT alter the repository's original `src/voxel.mjs` on disk.

**Exact Actions #45210213849: COMPLETED SUCCESS** at browser implementation HEAD `65148c4474dfb96cfb884b04146cd59bf60b2934`. Test environment: real 844x390 mobile-style Chromium WebGL2 (canvas buffer 540x335), seed 179, original profile `mythwrought-five-surface-regions-v7`, exact original glacier ice block ID276 at **(-144,8,528)**, same collision-safe camera at **(-143.5, feet17.01, 516.5)** aimed at that ice, 25 original resident chunks and zero pending chunks in both captures. Neither produced a JavaScript exception.

- Original PNG SHA256 `09bbcaecd91361c98c9a5a34893fc57b33bf52e4d2e84e8dc5aed3004dc77a26`.
- Candidate PNG SHA256 `e8c559c21f43580a5856c3bde4a1f40e336fa62d1ad69332db3f4230f30731d1`.
- Exact original HTTP source SHA256 `4943786eff97747f71c3af79bc81240116ffa0b8682ec1a989b47f8edd892ff2`; source verified as identical in both contexts. Candidate temporary browser-transformed module SHA256 `05ebb8dc01335e7ab160cb1c8e8b671425d27e7150f66183a0d1959a000f4f27`.
- Both real PNG screenshots, exact scene metadata and ROI difference report were uploaded as artifact **#14835861313**, name `snow-s6-actual-webgl2-research-65148c4474dfb96cfb884b04146cd59bf60b2934`.
- Browser script ROI x≈18..82%, y≈22..90%: 143,100 pixels, 97.08% changed by >=10 in max RGB channel. This metric alone **must NOT be represented as a universal snow improvement**; it includes pixels beyond the central snowy ground and potentially independent frame effects.
- Independent offline PIL audit of actual artifact PNG bytes used the ground-only rectangular ROI x=155..690, y=136..348 (114,168 pixels). Original mean RGB **(185.79,216.65,229.01)** vs S6 candidate **(209.92,216.51,217.53)**. Fraction with blue-red channel advantage >18 **99.80% original → 0.26% candidate**; >99.5% of candidate pixels in this ROI have max-min RGB spread <10. The right and left HUD and header had **zero changed >=10 pixels** (pixel-identical bars), while the sky/upper structures had far smaller mean channel difference (2.27). In this precise original camera, screenshot comparison therefore demonstrates an authentic snow-surface neutralization rather than broad scene desynchronization. It does NOT prove the improvement in all snow climates or viewport sizes.
- The blue-to-neutral color comparison can be viewed in the exact original/candidate pair in Actions artifact #14835861313. **These images are original game renderings, not AI art or offline synthetic terrain.**

## Remaining release gates

1. **No production renderer changes or V8 generator activation.** New-world candidate profile string remains UNREGISTERED; old M7 saves remain unmodified and cannot be silently migrated. Retained green grass preserving cave AIR, legacy wood/leaves, original rock, landmarks or saved edits is not repainted.
2. Expand original WebGL2 color comparison to seed2026 and 956x440 viewport, plus paired pixel parity for **player-placed ice vs natural ice** and side-by-side mountain, desert, snow seam, and night if source support warrants. Source screenshots are NOT iPhone hardware acceptance.
3. Original cross-owner audit covered four chunks; prove larger multi-owner edge and authentic `stepPlayer` walking for several adjacent owners without changing source. Current original collision evidence is bounded and no end-to-end generator is active.
4. Evaluate mesh cost and iPhone Home Screen performance before any new per-cell `v6BiomeAt` lookup or proposed winter tone appears in production. The in-memory browser transform is intentionally a correctness/appearance research harness, not performance-optimized game code.
5. Require real iPhone installed Home Screen PWA validation, WebGL2 GPU/memory/frame times, player collision, save/edit/restore, authored cave geology and original historical grove preservation BEFORE discussing an authorized merge/deployment.

**Handoff outcome:** Real source/native cross-owner proof and first original-game WebGL2 visual prototype are green; live game remains unchanged. Reuse exact-HEAD results, no duplicate broad CI on identical code.


## Concurrent production release drift noted AFTER Snow test acceptance

Final external GitHub verification found the expected production baseline `7016e14cd6289f45eaf7fc6a79a362b47996df65` was independently advanced by one commit to `db4bbcc32156e5df311f733bcaa53d559c17313b` **without any Snow action**. The new commit is a separate Desert Phase 3 authorized release PR #463, titled `Release: Desert V7 Phase 3 bilateral RGB and safe near-edge refresh (#463)`; it modifies original `src/voxel.mjs`, `src/manual-biomes/environment-v7.mjs`, `profile-world.mjs`, `main.mjs`, PWA files and Desert tests. This happened concurrently while this detached Snow thread ran.

**Do not revert or move the newer production main.** No change to either original Snow source/test blob or the protected OPEN DRAFT PR #358 `59e449be7e73b25f259c4c72855cfb638a056517` occurred from this lane. All Snow native/browser evidence here is valid for the EXACT isolated branch source tree prior to the Desert release commit. Before future integration or production color rendering, reconcile the newer Desert source ownership and original WebGL/PWA contracts rather than assuming the old `7016e14` source is still current. This handoff append is documentation-only, not a retest or merge.
