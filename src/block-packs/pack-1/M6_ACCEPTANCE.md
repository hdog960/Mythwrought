# Mythwrought — Pack 1 / Milestone 6 acceptance handoff

STATUS: SOURCE CANDIDATE ONLY. Final acceptance NOT APPROVED; creator integration, art, and physical iPhone approvals remain outstanding. Gate A OPEN, v0.11 LOCKED.

## Repository grounding and ownership

- Main at Milestone 6 opening: f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84, manual incorporation checkpoint 006.
- Issue 109: https://github.com/hdog960/Mythwrought/issues/109 ; automated 130-family exclusive coordination Issue 117: https://github.com/hdog960/Mythwrought/issues/117
- Draft PR 113: https://github.com/hdog960/Mythwrought/pull/113
- All 21 Stone & Nature roster families are source-authored with 30 unique persistent candidate IDs 9–38. Main BLOCK IDs 0–8 remain unchanged; ID 255 reserved.
- All changed files owned strictly by src/block-packs/pack-1/ and tests/block-packs/pack-1/. Never update production registry, shaders, geometry engine, world generation, save fixtures, root CI, other manual packs or automations here.

## Milestone 6 evidence matrix

| Requirement | Evidence/status |
|---|---|
| All 21 roster families | SOURCE CANDIDATE, 21/21 |
| All 30 IDs 9–38 unique | VERIFIED in exact-source V8 audit |
| Existing 5 authored suites | 65/65 Node-style test bodies pass exact-source V8 shim; NOT real Node |
| New unified 30-ID acceptance suite | 10/10 Node-style test bodies pass exact-source V8 shim; NOT real Node |
| Independent ray/stone occupancy regression | 6/6 extra authored test bodies pass V8; 22,932 independent rays + 8,232 stone-pick checks; NOT real Node |
| Generic :00 targeting + :12 surface meshing | 120/120 combinations (30 candidate IDs × 4 rotations) pass exact unmerged source V8 audit |
| Opt-in surface-mesh prototype budget | 12–532 triangles per candidate/rotation; NOT measured WebGL GPU workload |
| Previous PR exact-head baseline CI | SUCCESS, run 43635324085 on head 462f4c6c1e5bcb683515c93efad3301d3591f610, genuine baseline Node and Chromium smoke |
| Pack-specific genuine Node on exact branch | NOT RUN |
| Authentic Pack 1 gallery Chromium run | NOT RUN |
| Authentic candidate gallery screenshots | NOT CAPTURED |
| Offline gallery fixture interactions | NOT RUN; separate from production PWA offline reload |
| Real production registration/mesh/target/save compatibility | BLOCKED BY SHARED ENGINE, outside Pack 1 ownership |
| Physical iPhone and creator artwork/controls approval | NOT RUN / NOT GRANTED |
| Merge / Pages deploy / world placement | NONE; forbidden in this milestone |

CI detail: the project's root npm test command covers tests/*.test.mjs, not nested Pack 1 tests. The existing green GitHub job proves the baseline code and browser smoke, not any Pack 1 candidate shape. Its screenshots are unchanged playable-world captures, NOT asset gallery proof.

## Real dedicated Node command, not yet executed

After checking out the exact PR branch, run from repository root:

    node --test tests/block-packs/pack-1/core-masonry.test.mjs tests/block-packs/pack-1/stone-shapes.test.mjs tests/block-packs/pack-1/garden-components.test.mjs tests/block-packs/pack-1/physical-foliage.test.mjs tests/block-packs/pack-1/floral-forms.test.mjs tests/block-packs/pack-1/all-families.test.mjs tests/block-packs/pack-1/raycast-regression.test.mjs tests/block-packs/pack-1/gallery-count.test.mjs

Seven asset-focused modules contain 81 authored groups, plus an eighth browser-runner parser suite with five additional genuinely Node-tested groups. The seven asset suites have not been run under real Node. A passed V8 assertion shim is never enough to mark this real Node requirement passed. Capture actual process exit status and standard output before recording verified acceptance.

## Authentic Chromium gallery and screenshot runner, not yet executed

The pack-owned opt-in Playwright runner is located at tests/block-packs/pack-1/galleries-browser.mjs and uses the same free Playwright library as the existing Mythwrought browser-smoke tests. It launches a minimal local HTTP server, loads the five real pack gallery modules and captures actual browser output. Run from the genuine checked-out branch root:

    node tests/block-packs/pack-1/galleries-browser.mjs

If using the system Chromium binary, set CHROMIUM_EXECUTABLE=/usr/bin/chromium. The runner targets 667×375, 844×390, 932×430, providing 15 page-view inspections and up to 30 authentic screenshots in artifacts/pack-1/. It checks pixel-rich canvases, no horizontal overflow, real placement/removal and canonical fixture save under offline network conditions, clean console/resource loads and no user localStorage mutations.

Source-authored gallery code does NOT establish a successful run or screenshot. Inspect real captured images for silhouette distinction, texture integrity, material readability, selection gaps and mobile composition. This browser runner does NOT verify physical iPhone, production WebGL2 block registration, or the live PWA's offline reload behavior.

## Central production blockers (not editable in Pack 1)

1. Live VoxelWorld.set rejects IDs above 8. Production atlas, physical block registry and renderer registration need separate creator-authorized integration.
2. :00 shape-aware collision/targeting and :12 partial-volume surface mesher remain opt-in, not wired into the live game. Soft plants must remain ray-targetable even when passable.
3. Schema-1 edits use four values [x,y,z,id]; rotation/upper variant state is not represented. Candidate fixtures explicitly reject rotated saves to avoid lossy persistence. Historical save migration and direct engine tests are required.
4. Ivy/wisteria need actual wall attachment support and safe surface updates, rather than just a fixture wallMount boolean.
5. Production cutout transparency, fragment workload, atlas texture alignment, actual iPhone landscape dual-grip performance and creator visual approval remain unresolved.

## Exit decision

Twenty-one families authored; thirty distinct candidate IDs allocated; all stay CANDIDATE. Milestone 6 NOT ACCEPTED until genuine focused Node/Chromium, authentic screenshots, cross-engine registration/shape/save compatibility and physical iPhone creator approvals. Do not merge, deploy, generate world placements or unlock v0.11.

Future Continue Development should recheck main, checkpoint, Issues 109/117, PR 113 and its exact-head CI, then run real tests on an available checkout, repair only Pack 1, and refresh the evidence matrix.


## Independent Milestone 6 targeting fuzz audit (new)

The dedicated optional file `tests/block-packs/pack-1/raycast-regression.test.mjs` now adds **six authored Node test groups**. All six bodies pass on exact GitHub source in V8-compatible assertion/test shims, but they have NOT run under genuine Node. They compare an independent slab-ray intersection implementation to Pack 1's actual isolated fixture raycasting over **22,932** face-oriented rays across masonry, garden, foliage and floral/mushroom candidates at the available quarter-turn rotations. Stone fixtures correctly expose local occupancy `pick` instead of claiming engine-level ray support, so **8,232** direct 3D AABB occupancy probes compare that picker against independent geometric inclusion. Empty-cell phantom-hit rejection is covered.

Separately, **29,988** face-oriented rays were evaluated via V8 using exact Pack 1 source and the unmerged :00 generic raycast for the six stone shapes, with **zero** analytic expected-distance mismatches. These are valuable source audits, NOT true Node, real production collision, iPhone or browser testing.

The seven dedicated nested test files now contain **81 authored groups** (65 initial + 10 unified + 6 new). Current root GitHub Actions test wildcard does not include them. The previously verified PR exact-head default workflow [#43638833572](https://github.com/hdog960/Mythwrought/actions/runs/43638833572) succeeded; any subsequent changed branch head must be verified independently before stating its CI conclusion. Final Milestone 6 acceptance remains **OPEN**.


## Additional M6 continuation — browser acceptance harness repair and exact native Node subset

**New verified defect:** the original isolated Playwright gallery runner had two incorrect regex literals, `/^\\d+/`, with double-escaped backslashes. They matched a literal backslash and letter d, rather than decimal fixture counts, so a healthy 0->N place-all operation would always fail its acceptance gate. This was a **real bug in the Pack 1-owned acceptance runner**, not a defect in the live game or source asset geometry.

**Fixes made strictly within Pack 1 test ownership:**

1. Extracted strict `parseFixtureCount(status,label)` into `tests/block-packs/pack-1/gallery-count.mjs`; the actual browser runner now imports this tested helper and asserts the exact fixture size synchronously after the place-all click, instead of matching unrelated numerical IDs or schema version lines.
2. Added `saveWasVerified(status,successMarker)` and declared the explicit positive save marker for each of the five galleries. A “SAFE SAVE BLOCKER”, “EXPECTED BLOCKER”, or missing success marker is **now a test failure**, never counted as a successful offline fixture roundtrip.
3. Added `tests/block-packs/pack-1/gallery-count.test.mjs` with **five tests** covering five real gallery status formats, empty/placed transitions, false positives from unrelated digits, malformed inputs, and positive-save-versus-blocker behavior.

**Genuine native Node evidence:** the new parser suite ran in Node **22.16.0** in the local test environment with TAP output **5 passed / 0 failed**. Both executed files were compared byte-for-byte using Git blob hashes: helper `6e941cf73b310eb2400b274cb878e1d56d3214c9` and test `ab02c4712f525d9f964794ce0952ae581ad1b113`; these match the actual committed GitHub file blobs. This is valid genuine Node evidence **for only these five small browser-harness tests**; it is **NOT execution of the seven asset-focused test suites**.

**Chromium environment blocker independently reproduced:** the local system has Chromium installed and Python Playwright can start it, but navigating even a minimal `data:` document or a local `http://127.0.0.1` HTTP server fails with `net::ERR_BLOCKED_BY_ADMINISTRATOR`. This means the real gallery screenshots at 667×375, 844×390 and 932×430 could not be captured, and no authentic screenshot has been reviewed or fabricated. Network/DNS restrictions also prevent cloning the complete exact GitHub branch into this container. No override of sandbox browser restrictions is attempted.

**CI evidence:** the previous exact PR head `5e9c855268d7efff4cb6541b9803a304937d1f81`, GitHub Actions [#43639942311](https://github.com/hdog960/Mythwrought/actions/runs/43639942311), has completed **SUCCESS** for the configured baseline Node and Chromium smoke. These baseline tests do not include Pack 1's nested suites or candidate-gallery screenshots. Any new head after this documentation and test repair requires its own exact-head CI result.

**Milestone 6 remains OPEN** with 21 of 21 source candidate families and 30 distinct candidate IDs 9–38. There are now **eight** owned Node test modules: seven asset-focused modules with 81 test groups (exact-source V8 shim only) and one browser-runner helper module with five genuine native Node tests. No candidate is certified, live-integrated, merged, deployed or placed into worldgen. Physical iPhone art/control acceptance and backwards-compatible rotation/state-save verification remain blocked on separately authorized integration.


## M6 continuation — visual-proof runner strengthened, 2026-11-14

Main remains `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84` at incorporation **checkpoint 006**. Issues [#109](https://github.com/hdog960/Mythwrought/issues/109) and [#117](https://github.com/hdog960/Mythwrought/issues/117) are OPEN. [Draft PR #113](https://github.com/hdog960/Mythwrought/pull/113) is unmerged and entirely confined to Pack 1 source/test paths. The previous exact-head PR commit `467226cabcdd084ddc23401b668281d27c337398` completed configured GitHub Actions [#43641340996](https://github.com/hdog960/Mythwrought/actions/runs/43641340996) **SUCCESS**. Its Node/Chromium results are **baseline-only**; the configured workflow excludes nested Pack 1 tests. Any newer head requires a separate exact-head check; do not extrapolate a previous green result.

**Genuine native Node verification repeated:** `node --test tests/block-packs/pack-1/gallery-count.test.mjs` returned 5/5 PASS and 0 FAIL on locally staged GitHub-identical files with `git hash-object` IDs `6e941cf73b310eb2400b274cb878e1d56d3214c9` and `ab02c4712f525d9f964794ce0952ae581ad1b113`. This validates **only** the browser acceptance helper; it does not count as any of the seven candidate suites. Fresh exact-source V8 compatibility execution of those seven candidate modules passed **81/81** authored bodies (9+11+14+16+15+10+6). This is still **NOT native Node execution** for the 30 candidate assets.

**Concrete visual-proof acceptance improvements confined to `tests/block-packs/pack-1/galleries-browser.mjs`:**

- The previous heuristic counted any `#grid canvas`, including accessory occupancy cross-sections. It could therefore accept a broken/blank primary specimen preview. The runner now inspects the **first primary artwork canvas within each of the 30 specimen cards**. Its sample crop excludes the decorative ID text/header and checks actual colored visible pixels, substantial coverage and unique artwork hashes for every specimen per gallery.
- The runner writes `artifacts/pack-1/acceptance-report.json` **only after ALL five galleries × three mobile-landscape sizes pass**, recording the actual checked-out Git commit when available, per-specimen preview hashes, the 15 inspected viewports and names of the 30 genuine candidate/placed screenshots. No JSON or PNG is counted as evidence unless the runner actually executes and the files exist.
- An optional `PACK1_EXPECTED_HEAD` environment guard rejects a checkout that does not match a known exact commit. Early head-mismatch and artifact-directory errors now close the locally started HTTP server instead of leaking it.
- Existing strict placement-count and positive canonical save-confirmation checks remain in force, including rejection of safe-save-blocker messages. Localstorage writes, module load failures, horizontal overflow and runtime errors are also checked.

**Important visual limitation:** this runner checks the *isolated original Canvas2D asset galleries* and their physical-box-derived art; it does **not** substitute for actual production WebGL2 block placement/meshing, integrated iPhone controller-rail UI, real device frame times, or offline PWA reload.

**Local execution blockers confirmed again:** GitHub DNS/network is unavailable for `git ls-remote`, clone and raw/API HTTP, so no full exact Pack 1 asset checkout could be populated for native Node. Python Playwright launches Chromium but navigation to `data:` or `file:` pages returns `ERR_BLOCKED_BY_ADMINISTRATOR`; local HTTP navigation was independently blocked as well. No browser policy bypass was attempted. Therefore **the seven native asset suites, the candidate Chromium gallery runs at 667×375 / 844×390 / 932×430, their screenshots and review remain UNVERIFIED**. Do not reclassify any of the 30 assets as accepted or integrated.

**Exit state unchanged:** all 21 manual roster families and 30 unique IDs 9–38 stay **CANDIDATE / UNMERGED / UNDEPLOYED**; M6 OPEN, v0.11 LOCKED. Future work must first obtain an authorized full branch checkout in an environment allowing genuine Node and Chromium navigation. Recheck the newer PR exact-head workflow, run all eight nested Node suites and the gallery runner, inspect all screenshot artifacts, then request creator approval before any central-engine integration.


## Interrupted-session recovery and exact-checkout acceptance handoff — 2026-11-14

This continuation independently confirmed unchanged integrated main `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`, incorporation **checkpoint 006**, Issues #109/#117 OPEN, and draft PR #113 with **only Pack 1 paths**. The missing README handoff is now committed. All **21 roadmap families, 30 unique candidate IDs 9–38** retain status CANDIDATE; there is no production ID registration or deployment.

A new opt-in, Pack 1-owned `tests/block-packs/pack-1/run-acceptance.mjs` provides a single reproducible, **strict exact-commit** local acceptance procedure. Run from a clean checkout after reading the fresh PR head from GitHub:

```bash
PACK1_EXPECTED_HEAD=<independently_verified_40_hex_PR_head> node tests/block-packs/pack-1/run-acceptance.mjs
```

The script requires the checked-out 40-hex commit to match the supplied head and the Pack 1 source/test paths to be clean; it executes all **eight** nested native Node test modules, then invokes `galleries-browser.mjs` for five actual asset galleries × 667×375, 844×390, 932×430. Only after 15 genuine views pass, the gallery evidence contains 30 authentic PNGs, and the checkout SHA matches does it write a PASS report including PNG signatures, sizes and SHA-256 checksums. Stale PASS markers are cleared **before Node testing**, so a failure cannot reuse a prior success. This script is **SOURCE-READY, NOT A COMPLETED RUN**; no shared CI modification.

**Current real execution evidence:** Local native Node 22.16.0 repeated `gallery-count.test.mjs`: **5 PASS / 0 FAIL**. Both on-disk test/helper files matched GitHub Git-blob hashes `ab02c4712f525d9f964794ce0952ae581ad1b113` and `6e941cf73b310eb2400b274cb878e1d56d3214c9`. These five tests validate the acceptance-runner count/save logic only. **Seven candidate-specific suites containing 81 authored bodies remain V8-shim-tested, NOT genuine native-Node-tested**. The local machine still fails GitHub DNS resolution and does not have the full source checkout. Its Chromium browser navigation is blocked by administrator restrictions, so no candidate-gallery screenshot has been captured/reviewed; no bypass was attempted.

**Gate decision remains OPEN / NOT ACCEPTED.** Source candidates 9–38 must not be merged, deployed, placed in generated terrain, or registered without separate creator authorization. Production schema-1 save/rotation, generic mesh targeting, iPhone side-grip controls and art approval remain independent blockers. Recheck latest exact-head GitHub Actions run (baseline-only root workflow), and require real native Node + 15 gallery views + 30 screenshot review before upgrading any candidate evidence.


## Main advanced to automation-only checkpoint 007 during this Pack 1 session

**Fresh main checked after the initial checkpoint-006 audit:** `caf47776b723a36684edc1a72749e49268ccc688` records **incorporation checkpoint 007**, automation-only [PR #120](https://github.com/hdog960/Mythwrought/pull/120). This incorporation explicitly **excluded** manual Block Packs 1–5 and all building-pool projects. The live `src/voxel.mjs` BLOCK registry still recognizes only **0–8**; Pack 1 IDs **9–38** remain unregistered, and this draft PR remains separate. Earlier checkpoint-006 statements in this document are time-stamped historical observations, **not the latest main checkpoint**.

**Compatibility re-audit of exact checkpoint-007 integrated source:** Using current main `src/shape-prototypes.mjs` (Git blob `868bbb9372b09e321f8db38b54c4ca52fabb7bc6`) and `src/voxel-shape-interactions.mjs` (Git blob `01be82e6c308e47a35fa6588cc6ed1ebeafca307`), all **30 Pack 1 candidate IDs × 4 rotations = 120/120** unit-cell prototype mesh/shape-validation cases passed V8 execution against the exact GitHub source. The original six core masonry candidate descriptors are ordinary full cubes and were adapted with the opt-in `prototypeOnly:true` flag **only in the audit**, without changing candidate source. The other 24 shaped candidate IDs worked unchanged. Mesh output is now **12–136 prototype triangles per shape** (masonry 12, stone shapes 12–76, garden 60, foliage 36–136, flowers/mushrooms 64–96). Original candidate material and exact IDs were unchanged. This is **not genuine Node or production WebGL2 evidence**, and no screenshots were captured.

Checkpoint 007 includes opt-in :00 targeting and :12 generic shape source but **does not automatically register any of Pack 1's 30 materials**, add atlas entries, wire actual block placement or migrate schema-1 rotation saves. Maintain the existing strict M6 blockers. Any next continuation must use latest main 007 or newer and re-evaluate any subsequent automation-only checkpoint before claiming compatibility.


## M6 follow-on — exact test-count gate and stale-artifact protection (2026-11-14)

**Coordination reaffirmed:** integrated main remains `caf47776b723a36684edc1a72749e49268ccc688` (automation-only checkpoint **007**); Issues #109/#117 are OPEN. Manual Pack 1 draft PR #113 remains exclusive to `src/block-packs/pack-1/` and `tests/block-packs/pack-1/`. All **21 roster families** and **30 unique IDs 9–38** remain CANDIDATE, **0 registered in the live game**.

**Pack 1-only defects resolved in this continuation:**

1. Standalone `galleries-browser.mjs` now deletes only its known stale `acceptance-report.json` and thirty named gallery screenshot PNGs **before** starting a new test run. Without this, a failed standalone attempt could leave a previous valid-looking PASS report or image files. The parent `run-acceptance.mjs` already cleared stale reports, but a standalone gallery invocation needed the same fail-closed protection. No unrelated artifacts or user files are deleted.
2. `run-acceptance.mjs` used to rely on process exit success and a `fail 0` substring, which could miss an unexpectedly skipped/empty test suite. It now parses the real Node TAP footer and requires **at least 86 actually executed tests** (seven asset modules with 81 authored groups and the five-test gallery helper), **all passed, with zero failures, skips or TODOs**, before launching genuine Chromium. It records exact Node totals in the final provenance report. An intermediate source-edit escaping error was detected by syntax verification and repaired immediately by reconstructing from the last known good committed version; **the corrected committed script passes source syntax verification**.

**Direct checks performed:**

- Re-fetched the exact current Pack 1 candidate sources and authored test files from GitHub: **81/81 test bodies passed in V8 assertion/test shims** (M1 9, M2 11, M3 14, M4 16, M5 15, all-family 10, ray regression 6). Unique IDs confirmed 30/30, range 9–38. This is **NOT native Node**.
- Re-executed the genuinely native local `gallery-count.test.mjs` under **Node 22.16.0**: 5/5 PASS, 0 failures. The helper and test sources retained their previously independently verified Git blob hashes. This is **only the small browser helper**.
- The two updated GitHub acceptance runners were re-fetched and parsed with a V8 async-function syntax check (PASS). Their new explicit stale-evidence and 86-test fail-closed guards were inspected. Full-run and screenshot execution **NOT performed**.
- Local `git ls-remote`/clone still fails DNS resolution for github.com. The isolated local filesystem lacks a complete authenticated branch checkout. Chromium starts but navigation to even a minimal `data:` page returns `ERR_BLOCKED_BY_ADMINISTRATOR`. **No genuine asset-gallery Chromium screenshots captured**, no physical iPhone testing, no administrative-policy bypass.

**Exact-head CI:** a new root workflow run is associated with the acceptance-runner commit and should be checked by SHA before calling it green. The standard root workflow tests the current playable baseline, **not nested Pack 1 candidate suites**.

**Remaining M6 exit blockers are unchanged:** execute all eight native Node modules and 15 gallery Chromium views on an allowed clean checkout, capture and inspect **30 genuine PNGs** with the provenance manifest, and separately verify live registry/texture/partial-collision/rotation/schema-1 compatibility and creator physical-iPhone artwork/control approval. Gate A OPEN, v0.11 LOCKED. Do not merge/deploy or place these assets in worldgen without explicit authorization.
