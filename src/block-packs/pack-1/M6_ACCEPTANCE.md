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

    node --test tests/block-packs/pack-1/core-masonry.test.mjs tests/block-packs/pack-1/stone-shapes.test.mjs tests/block-packs/pack-1/garden-components.test.mjs tests/block-packs/pack-1/physical-foliage.test.mjs tests/block-packs/pack-1/floral-forms.test.mjs tests/block-packs/pack-1/all-families.test.mjs

Six test modules containing 75 authored groups, including the new unified 30-ID audit. A passed V8 assertion shim is never enough to mark this real Node requirement passed. Capture actual process exit status and standard output before recording verified acceptance.

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
