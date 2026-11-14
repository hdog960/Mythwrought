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
