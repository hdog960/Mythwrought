# MYTHWROUGHT — Pack 2 Milestone 6 final candidate acceptance review

**Review status:** `SOURCE + ISOLATED NATIVE NODE + ORIGINAL CHROMIUM GALLERY PASS; FULL-GIT/PRODUCTION ACCEPTANCE OPEN`  
**Pack:** 2 — Timber & Infrastructure | **Draft PR:** #114 | **Coordinated in:** Issues #109/#117  
**Latest audited integrated main:** `ac263720b60641c65b02330348dd76d0ef9cb75e` | **Incorporation checkpoint:** 008  
**Ownership:** `src/block-packs/pack-2/`, `tests/block-packs/pack-2/` only  
**Persistent candidate ID allocation:** exactly IDs 59–76, 18 unique families. No shared engine, renderer, world generation, CI, unrelated packs, deployment or main changes. Existing IDs 0–8 frozen; cache sentinel 255 reserved.

> This is a *source-level, candidate-only* review—not authorization to merge or a claim that the assets are in the playable game. Gate A remains OPEN, v0.11 LOCKED.

## Physical candidate family matrix

| Roster | ID | Candidate | Distinct physical/visual profile | Current source status |
|---:|---:|---|---|---|
| 13 | 59 | Planed honey-oak planks | Dressed course seams, full physical cube | Source candidate |
| 14 | 60 | Peeled ash logs | Rounded intersecting cross-section, end grain, directional long fibers | Source candidate |
| 15 | 61 | Ironbound dark timber beams | Long narrow shaft with physical iron collars | Source candidate |
| 22 | 62 | Load-bearing support posts | Vertical shaft with distinct broad cap/foot | Source candidate |
| 16 | 63 | Half-slabs | True upper/lower half-height volumes | Source candidate |
| 17 | 64 | Timber stairs | Two-step occupied profile with four turns | Source candidate |
| 18 | 65 | Split-rail fences | Two rails, slim posts and actual air gaps | Source candidate |
| 19 | 66 | Hinged fence gates | Open and closed *different physical hitboxes* | Engine hinge handler pending |
| 20 | 67 | Timber doors | Swung vertical leaf physically changes occupied shape | Engine hinge handler pending |
| 21 | 68 | Timber trapdoors | Horizontal-to-vertical physical panel, upper/lower mounting | Engine hinge handler pending |
| 39 | 69 | River gravel | Raised independent shingle tops over physical aggregate base | Gravity engine pending |
| 40 | 70 | Packed dirt paths | Shallow depressed ruts and raised shoulders | Source candidate |
| 41 | 71 | Laid walking cobblestones | Low walkable mortar-backed stones; not Pack 1 masonry full cube | Source candidate |
| 42 | 72 | Suncompass decorative paving | Raised central blue inlay and independently placed pavement stones | Source candidate |
| 43 | 73 | Reinforced bridge guardrail | Distinct riveted braced structure, through/terminal endplate | Source candidate |
| 44 | 74 | Solid limestone parapet | Protective solid mass and true open drain-slot variant | Source candidate |
| 46 | 75 | Elevated larch boardwalk | Five raised slats with physical gaps and lower joists | Source candidate |
| 45 | 76 | Clear-rill water volume | Non-solid sloped fluid prism, exact transparent surface targeting | **BLOCKED: fluid engine/render/save** |

All 18 are *candidate source definitions* with independent IDs and meaningful occupied geometry; none is a merged production registry entry or generated placement.

## Milestone 6 independently executed source checks

1. **Cross-family uniqueness and numeric safety:** 18 distinct provisional IDs in 59–76; no 0–8, 255, Pack 1's 9–58, Pack 3's 109–158, Pack 4's 159–208, or :12 symbolic biome130 namespaces. Existing main still rejects candidate IDs.
2. **Full-state mesh and face direction:** 121 combinations across all 18 candidates evaluated against **25,742 triangles**. Before M6, the entirety of the original timber and joinery meshes had inward-facing triangle winding opposite their outward normals. The bug was corrected exclusively in `definitions.mjs` and `joinery.mjs`. **Post-fix: 0 inverted or degenerate triangle/normal pairs** among all tested candidate states. No state exceeds 740 triangles in this isolated preview set.
3. **Physical occupancy:** AABB-backed materials and joinery retain real selected/collidable volumes, including hollow/gapped components. Water ID 76 deliberately uses zero solid boxes and a genuine, sloped passable prism with an exact triangle raycast.
4. **Candidate controls/snapshots:** 18 candidate selections/place/remove and representative variants (upper/lower, rotation, gate state, infrastructure variant, water source/level/flow) can be serialized/recovered via an *isolated fixture-only* envelope; the mix of five-, six- and seven-field rows remains unchanged.
5. **Dedicated test source:** all 88 authored test bodies evaluated in an isolated V8 JavaScript harness with portable assertion wrappers and passed: 12 foundation, 15 joinery, 14 ground, 17 infrastructure, 21 water, **9 new acceptance**. **This is not native Node `node:test`**. The updated `acceptance.test.mjs` contains exhaustive mesh winding verification to prevent regression.
6. **Cross-pack/source ownership:** issue #109 and #117 plus contemporaneous draft packs 1/3/4 re-audited; PR #114's diff contains only Pack 2 files. No matching new ID, merging or player-save modification observed.

### Milestone 6 verification follow-up (same-day, 2026-11-14)

- Authored a ninth cross-family regression in `tests/block-packs/pack-2/acceptance.test.mjs` exercising **900 exact fluid top-surface rays across all 36 canonical source/level/flow states**. Every triangle hit matched the independently computed local surface height within tolerance in the V8 source harness.
- **88/88 checked-in test functions** now pass in that same isolated V8 assertion harness, including all earlier six suites. This is **NOT native Node**.
- Strengthened `tests/block-packs/pack-2/browser-verify.mjs`: genuine Playwright (when run) now selects and renders **all 18 candidate IDs**, tests state changes and fluid opacity, checks for unexpected page horizontal overflow, and saves full-page water plus focused real-canvas water, open gate and drain-slot parapet screenshots at **667×375, 844×390, 932×430** if screenshot output is enabled. The script is committed but has **NOT** run; screenshots are **not** claimed as delivered.
- Rechecked local capability: Node v22 and Chromium are installed, but there is no exact-head repository checkout, `github.com` / `raw.githubusercontent.com` DNS fails and the Node Playwright package is not installed. No genuine native/Chromium pass can be claimed on the restricted local runtime.
- This follow-up leaves source candidates, collision, fluid simulation, worldgen and main untouched. The exact new PR head and standard root CI must be checked against the latest commit.

## Milestone 6 technical acceptance follow-up — 2026-11-14

- **Verified exact prior PR HEAD** `8da5931d5e82b0fbcb2f557d897382846aa3a969`: standard GitHub Actions [#43639594993](https://github.com/hdog960/Mythwrought/actions/runs/43639594993) **SUCCESS** (root Node tests and real Chromium landscape WebGL2 baseline). This workflow's `npm test` glob `tests/*.test.mjs` excludes every nested Pack 2 test file, and its browser smoke does not visit Pack 2 preview. Do **not** infer candidate acceptance.
- Reconfirmed main `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`, incorporation checkpoint 006, Issues #109 and #117, competing manual pack ownership, and draft PR #114. No ID range overlaps; source files owned solely by Pack 2.
- Local exact-checkout attempt remains **BLOCKED**: Node 22.16.0, Chromium 144 and the Python Playwright package are present, but GitHub DNS/network access prevents obtaining the full exact PR files; no complete checkout was available. Node Playwright is not installed locally. Accordingly, neither `node --test tests/block-packs/pack-2/*.test.mjs` nor the dedicated browser inspector was executed.
- **Expanded the committed optional Chromium test**: all 18 candidate meshes must render with **distinct geometry-only pixel hashes** and nonempty painted regions at 667×375, 844×390 and 932×430. When screenshots are enabled, it now writes **54 individual asset gallery canvases** (18 × 3) plus original water, open-gate, drain-slot and full-page views. The script's JavaScript syntax was checked; **no actual screenshots were captured**.
- The last isolated, source-level results remain **88/88 checked-in test bodies passed under V8**, including 121 full-state mesh/normal configurations (25,742 triangles, zero inverted or degenerate after Pack 2-only winding fix) and 900 water surface-ray comparison samples. Those checks are **not native Node or browser evidence**.
- Exact new commit root CI must be checked independently once reported; source candidate review is complete, but full native/visual/production acceptance and creator Gate A approval remain **OPEN**.

### Pack 2 Python Chromium browser fallback, 2026-11-14

- Added **`tests/block-packs/pack-2/gallery-browser.py`** as a free Python Playwright renderer of **exact checked-in** candidate modules, bypassing local HTTP/file navigation and Node Playwright dependencies. It reads the five source modules, fixture and existing gallery from an exact working-tree checkout; rewrites the original ES-module imports into in-memory `data:text/javascript;base64` URLs. No asset definitions, colors, mesh geometry or fixture rules are synthesized or modified.
- Once run on real candidate sources, it exercises all **18 candidate asset IDs 59–76 at each 667×375, 844×390 and 932×430 viewport**, checks nonempty and 18 unique geometry-only pixel hashes per viewport, validates infrastructure state/rotation, water translucent pixels, and all 18 fixture placement/save round trips, monitors page errors and horizontal overflow, and optionally saves **54 authentic candidate canvas screenshots** plus water, gate and parapet detail and full-page shots.
- **Genuine Chromium 144 bootstrap proof only:** the local Python Playwright runtime launched headless Chromium and successfully loaded both a `data:` ES module and a nested `data:` module importing another in-memory module. This confirms the proposed loader mechanism, **not** Pack 2's asset imagery, gallery execution or screenshot acceptance.
- Local `git clone`, HTTPS fetch and direct GitHub IP connection remain inaccessible; exact Pack 2 source could not be materialized to the browser container. **Native Node and real candidate-gallery acceptance remain UNRUN**, with zero claimed screenshots. Running the new fallback requires an exact GitHub checkout or an authorized source handoff, not a new paid provider.
- Earlier exact-head standard CI [run #43641062727](https://github.com/hdog960/Mythwrought/actions/runs/43641062727) **SUCCESS**; its root tests and real Chromium baseline still exclude Pack 2. New exact-head CI must be verified independently after this commit.

Run from an exact source checkout with installed Python Playwright and free Chromium:

```sh
python3 tests/block-packs/pack-2/gallery-browser.py --screenshots /tmp/pack2-gallery
```

## Session 10 — verified local Chromium launcher and exact-head QA command (2026-11-14)

- [x] Rechecked production main `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`, integration checkpoint **006**, Issues #109/#117 and the latest draft ownership heads for Packs 1, 3, 4 and 5. Pack 2's provisional IDs **59–76** remain unique, and all changed files remain under Pack 2's exclusive directories. Draft PR #114 stays open/unmerged.
- [x] Found a **genuine local browser-tooling defect**: Python Playwright's default Chromium binary was not installed, even though free `/usr/bin/chromium` is present. An actual headless Chromium session using `executable_path='/usr/bin/chromium'` successfully imported a `data:text/javascript` module via a live HTML page and returned its expected value. This validates **the launch and inline-module technique**, NOT actual Pack 2 gallery rendering.
- [x] Corrected `tests/block-packs/pack-2/gallery-browser.py` within exclusive Pack 2 ownership: use a configured `MYTHWROUGHT_PACK2_CHROMIUM` executable, then Playwright's installed browser, then free system Chromium. Missing binaries now cause explicit failure, not a misleading success. Added optional `--expected-head` and clean-worktree enforcement so real screenshots cannot be misattributed to a stale or modified checkout.
- [x] Committed `tests/block-packs/pack-2/run-acceptance.sh`: a one-command **opt-in exact-head acceptance harness** that refuses dirty/mismatched Pack 2 sources, runs all six direct native Node suites (not the root glob), and invokes the Python Playwright gallery for 54 real candidate captures (18 IDs × 3 viewports) plus detailed screenshots. It uses **only free Node, Python Playwright and Chromium** and does not merge, deploy or edit production files.
- [x] Re-ran **all 88 checked-in test functions** from the current exact branch modules in the isolated V8 harness (12 timber + 15 joinery + 14 ground + 17 infrastructure + 21 water + 9 acceptance): **88 passed / 0 failures**. The direct Node runner and Chromium candidate gallery **have NOT run**, because exact GitHub source could not be placed in this sandbox (GitHub DNS/TCP blocked and no repo checkout). That distinction remains a hard acceptance gate.
- [x] Previous exact-head standard baseline CI `e028682cb0310c48120b73207f14c9201c30c200` [run #43642512460](https://github.com/hdog960/Mythwrought/actions/runs/43642512460) **SUCCESS**, but does not execute nested Pack 2 tests. Later heads must have their own CI result.
- [ ] No authentic Pack 2 screenshot pixels, native `node:test` results, integrated WebGL2 water, schema-1 persistence validation, FPS results or physical iPhone control certification. **M6 candidate source review complete; native/browser/production acceptance OPEN.**

**Direct once-checkout-exists command** (from exact clean PR HEAD, free tooling only):

```sh
MYTHWROUGHT_PACK2_EXPECT_HEAD="$(git rev-parse HEAD)" \
MYTHWROUGHT_PACK2_SCREENSHOTS=/tmp/mythwrought-pack2-qa \
bash tests/block-packs/pack-2/run-acceptance.sh
```

The command does not approve incorporation: Gate A and v0.11 remain locked behind creator approval and production integration checks.

## Session 11 — checkpoint 007 automation-only incorporation and compatibility audit (2026-11-14)

- [x] **Main advanced during this Pack 2 session:** new main `caf47776b723a36684edc1a72749e49268ccc688`, checkpoint **007**; diff from previous checkpoint 006 is automation-owned integration of opt-in shape APIs, 130-family symbolic biome catalog, cave/structure/tree prototypes and their tests. Checkpoint document **explicitly excluded manual Packs 1–5 and all independent building roadmaps**. The Pack 2 draft remains unmerged and its current branch is **two main commits behind**; no automatic rebase/merge performed.
- [x] Rechecked Issue #109, Issue #117 and current draft ownership/heads for Pack 1 #113, Pack 3 #112, Pack 4 #115, Pack 5 #119; **all 18 Pack 2 IDs 59–76 remain unique and isolated**. Live `VoxelWorld.set` still rejects IDs above 8.
- [x] Executed the *actual newly integrated main source* `validateShape`, `raycastShapes`, `canPlaceShape`, `prototypeSurfaceMesh` against **85 Pack 2 solid geometry states** in standalone V8: **85/85** shape validation, **85/85** genuine shared ray hits, **85/85** free-vs-overlap placement decisions, **85/85** surface prototype meshes. Maximum shared prototype geometry **380 triangles**. This is direct source interface evaluation in V8, **not native Node, live WebGL2 or the production renderer**.
- [x] Verified checkpoint-007 orientation sidecar accepts representative candidate rotations when the supplied block-reader matches the ID. **Water ID 76 correctly fails the shared solid-`{boxes}` validator**, since it has zero solid collision boxes and requires its own fluid-prism raycast, transparent pass and simulation hooks; do not replace it with a fake cube.
- [x] **Python browser runner defect corrected:** system Chromium fallback used when Playwright's bundled browser is missing. A real Chromium 144 launch plus nested inline `data:text/javascript` module import passed on a small tooling-only page, **not on Pack 2 asset geometry**.
- [x] Added `--expected-head` and clean Pack 2 tree verification in the Python runner, plus committed one-command `tests/block-packs/pack-2/run-acceptance.sh` covering six direct native Node suites and 54 original candidate captures when a real checkout is available.
- [x] **88/88** existing Pack 2 test bodies still pass the source-level V8 harness. Prior checkpoint 006 exact-head standard CI run [#43642512460](https://github.com/hdog960/Mythwrought/actions/runs/43642512460) **SUCCESS**. The latest candidate-head CI must be checked against its own SHA.
- [ ] Native direct Node execution, exact Pack 2 candidate Chromium preview screenshots, screenshot visual review, production fluid/render/save integration and physical iPhone controls **remain unverified** due local exact-checkout access restriction. This is **NOT** final certification.

## Session 12 — full-roster uniqueness regression and exact-source test review (2026-11-14)

- [x] Latest main `caf47776b723a36684edc1a72749e49268ccc688`, integration checkpoint **007**, Issues #109/#117, and the manual Pack 1/3/4/5 draft PRs were reverified. Draft Pack 2 PR #114 remains unmerged and all changed files are Pack 2-exclusive; no numeric ID overlap with the other packs.
- [x] Added a tenth `acceptance.test.mjs` case: sample every one of the **18 distinct asset IDs 59–76**, retain each authored candidate's actual typed mesh positions, color palette and optional alpha values, and assert **18 unique full mesh/material signatures**. This is a full-data exact-equality check, not a name-only or potentially-colliding pixel-hash check.
- [x] Re-executed the committed test bodies using fetched Pack 2 source in standalone V8 with a portable assertion shim: **89/89 passed** — 12 timber, 15 joinery, 14 paving, 17 infrastructure, 21 water, **10 M6**. Separate mesh signature audit produced **18/18 distinct pairs of geometry and palette**. These checks do NOT constitute actual `node:test` or browser screenshot execution.
- [ ] **Native Node six-suite command and actual Python Playwright asset gallery remain unexecuted.** The local runtime has Node 22, Python Playwright and Chromium, but its GitHub DNS/network cannot obtain an exact complete repository checkout; the partial transfer staging directory was not a verified source tree and was deliberately not used for certification. No 54-canvas screenshot artifact exists from this session.
- [ ] Production WebGL2 alpha sorting, water flow/buoyancy, schema-1 state restoration, mobile iPhone controls and creator Gate A approval remain separate blocked integration/acceptance requirements. No merge/deploy/other-pack/shared-engine/world-gen edit made.

## Session 13 — genuine water-only Node and Chromium evidence (2026-11-14)

**Important scope distinction:** This session obtained genuine direct native and browser execution of **one physically authored water module**. This is useful partial acceptance, **not** the six checked-in Pack 2 suites or the 18-candidate gallery. All previous whole-pack native/browser/production gates remain OPEN.

- [x] Retrieved `src/block-packs/pack-2/water.mjs` from the exact PR branch via the authorized GitHub connector, reconstructed its original bytes in the restricted local container, and verified them with `git hash-object` against GitHub blob SHA **`180510e7b603e5daf104963b115895819fd23d39`**. Local Node source was therefore byte-identical to this committed module, not a mock or a reimplementation.
- [x] **Genuine Node v22.16.0, eight local ad-hoc smoke tests: 8 PASS / 0 FAIL**, importing that original water module. Covered candidate ID 76, all 36 canonical states, **900 physical surface-triangle rays** against analytically expected water heights, transparent typed mesh attributes for every state, non-solid `boxes:[]` collision, physical narrow-phase side/profile selection, invalid source-state rejection and positive outward triangle winding. These tests were created as temporary local QA, **not** committed as replacements for `water.test.mjs` or any of the six checked-in suites.
- [x] **Genuine headless system Chromium 144 through Python Playwright:** six actual screenshots captured using the exact water module's `waterPreviewMesh` at **667×375**, **844×390**, **932×430**, showing both `level=0, flow=still` and `level=4, flow=east`. The local temporary Canvas2D smoke harness rendered the original triangles and alpha attributes; all six executions reported 18 triangles, 12 physical boundary triangles, positive translucent pixel coverage and no JavaScript page errors. Representative screenshots visually inspected for visible full-height source geometry, shallower flowing volume and lack of clipping after the review camera was adjusted.
- [x] Generated a user-visible contact sheet `Pack2_M6_Water_Chromium_Contact_Sheet.png` and ZIP `Pack2_M6_Water_Chromium_Proof.zip` containing the six authentic PNGs plus JSON smoke metrics. These are conversation artifacts, **not committed or deployed game files**.
- [x] Pack-wide **89/89** checked-in test bodies still passed isolated V8 evaluation; the new tenth M6 test verifies **18/18 unique exact geometry/material mesh signatures**. Native water smoke does not certify the other 17 candidates.
- [ ] The **six complete committed native Node suites**, **all 18 candidate meshes in the committed Python gallery runner**, **54 authentic Pack 2 gallery screenshots**, production WebGL2 water alpha/neighbor handling, actual liquid simulation, schema-1 persistence and physical iPhone Gate A art/control approval remain **NOT VERIFIED**. The local container still lacks a faithful complete GitHub checkout; no native whole-pack certification is implied.

## Session 14 — all six real Node suites and all 18 Chromium candidates VERIFIED (2026-11-14)

**Evidence provenance:** Pack 2 source, fixture, six committed tests, preview and the committed Python gallery runner were reconstructed into a local staging folder from approved GitHub connector content. All **14 relevant staged source/test/gallery files** were independently checked with `git hash-object` and matched the **exact blobs on PR #114 head `89cbec3fa17ee233aa91e9abefd8af12ea2e4203`**. No Pack 2 production module, test body, or gallery runner was rewritten for acceptance. The folder is **NOT a complete Git checkout**, so its `git_head` is null and `exact_head_verified` is false: this limitation is intentionally preserved rather than inventing Git HEAD proof.

### Genuine Node v22.16.0 — six committed nested suites

Ran all six original `node --test` suites together in the local verified-source tree:

| Committed suite | Native test pass |
|---|---:|
| `pack-2.test.mjs` — foundation | 12/12 |
| `joinery.test.mjs` | 15/15 |
| `ground.test.mjs` | 14/14 |
| `infrastructure.test.mjs` | 17/17 |
| `water.test.mjs` | 21/21 |
| `acceptance.test.mjs` | 10/10 |
| **TOTAL** | **89/89 passed, 0 failed, 0 skipped** |

The full native Node run was **repeated**, with 89/89 passing again; the final log is locally preserved as `node-all-six-verified-pack2.log` and included in the user-facing screenshot proof ZIP.

**Important production-boundary qualification:** The Pack 2 modules and test bodies are exact GitHub blobs, but the reconstructed tree contains a **local, explicitly marked, test-only stand-in for `src/voxel.mjs`**. That facade is used *solely* where the first five suites check the legacy enum 0–8, rejection of provisional ID 76, and rejection of Pack 2 fixture envelopes. It is **NOT** the production `VoxelWorld` module, and the 10 cross-family M6 tests do not import it. This is genuine native **candidate-suite execution**, not full-production-engine or schema-1-save integration certification. The faithful production `VoxelWorld` import/interaction should be checked on a real full repo checkout before merging.

### Genuine Chromium — all 18 mesh candidates, three landscapes

Executed the **original committed** `tests/block-packs/pack-2/gallery-browser.py` again with Python Playwright + real system Chromium against exact-blob Pack 2 source:

| CSS landscape viewport | Assets rendered | Unique geometry image hashes | Fixture save round trip | Water translucent pixels | JavaScript errors |
|---|---:|---:|---|---:|---:|
| 667×375 | 18/18 | 18/18 | PASS (18 rows) | 77,199 | 0 |
| 844×390 | 18/18 | 18/18 | PASS (18 rows) | 77,199 | 0 |
| 932×430 | 18/18 | 18/18 | PASS (18 rows) | 77,199 | 0 |

- **66 authentic PNG screenshots** captured: **54 individually rendered physical candidate canvases (IDs 59–76 × 3 viewports)**, plus **12** water/full-page/open-gate/drain-slot-parapet detail images. All three complete 18-asset contact sheets were visually inspected; every preview has clearly distinguishable 3D geometry with no obvious cropping/clipping. Separate open-gate and real parapet drain-slot captures inspected.
- The gallery independently confirmed no empty candidate, no duplicate *rendered* geometry image hash in a given viewport, actual water alpha, page layout within the viewport width, and deterministic fixture-only state snapshots after placing all 18 IDs. `gallery-recheck.log` captured the repeated genuine browser PASS result; screenshot proof ZIP and three contact sheets are available in the conversation.
- **This is a genuine Canvas 2D rendering of original physical triangle preview meshes**, **not** the playable game's WebGL2 renderer, production fluid physics, Safari or a real iPhone test. The browser runner did not verify a Git checkout HEAD because the local source tree is non-git; Git blob matching establishes the provenance of the candidate source files instead.

### Remaining gates (unchanged authorization boundary)

- [ ] Full checkout containing the **real** production `src/voxel.mjs` and its imports: repeat native six suites and true integrated browser/WebGL2/offline checks without a boundary facade.
- [ ] Register provisional Pack 2 IDs 59–76 only in an independently creator-authorized shared-engine integration, validate collision/hinge/gravel gravity, fluid alpha sorting, water source propagation and schema-1 backward-safe state sidecar; **none of those gameplay systems were changed or validated here**.
- [ ] Physical iPhone controls and creator visual/art Gate A approval remain OPEN; v0.11 LOCKED.
- [ ] No merge, Pages deployment, world-placement, other-manual-pack edits, or shared CI/code changes are authorized by this acceptance proof.

## Session 15 — strict real-VoxelWorld boundary gate (2026-11-14)

**Goal:** Prevent previously accepted *candidate-only* results from being incorrectly reported as genuine production-world integration. Prior 18/18 authored families, 89/89 real native candidate suites (with disclosed local legacy facade), and 66 authentic original Chromium preview PNGs remain preserved.

- [x] Reverified exact integrated `main` `ac263720b60641c65b02330348dd76d0ef9cb75e`, **checkpoint 008**, Issues #109/#117, draft Pack PRs 1/3/4/5 and Pack 2 draft #114. All changed PR paths remain exclusively Pack 2. Prior head `8fb1a189c20b22144d2e501fde76500385ee44ba` standard GitHub [Actions #43652373432](https://github.com/hdog960/Mythwrought/actions/runs/43652373432) **SUCCESS** for root baseline Node/Chromium, which excludes nested Pack 2 suites.
- [x] Inspected real checkpoint-008 `src/voxel.mjs` **Git blob `5f11cec27b907cf446dda556905a1a386717c07e`** and traced its actual `VoxelWorld` import closure through terrain, cave, landmark, grove, and district modules. Actual production source exports `WORLD_MIN_Y=-3`, `WORLD_MAX_Y=19`, and IDs 0–8 only; its `set` rejects candidates 59–76 and its schema-1 `restore` validates entries.
- [x] New **Pack 2-exclusive** `tests/block-packs/pack-2/production-boundary.test.mjs` adds **six strict opt-in real-production Node cases**: detect genuine `VoxelWorld` class/methods/constants rather than a facade, reject all 18 provisional IDs without modifying legacy saves, round-trip a legitimate schema-1 edit, reject malformed/candidate-containing saves, reject fixture-only metadata envelopes, and reject invalid coordinates/types. No shared code is changed. `run-acceptance.sh` now executes the original six suites **then this seventh real-production boundary suite**, refusing to proceed to gallery output if it fails.
- [x] The exact new test file (`git hash-object` matched its GitHub blob `44112edcfd83bb924ec4591c7429dee2705e48cd`) passed native Node syntax checking. A **genuine Node negative control** against the known temporary local test-only `src/voxel.mjs` facade **failed immediately as designed**, because the facade does not export `WORLD_MAX_Y`. This **is not a production pass**; it demonstrates the new gate cannot be green through the previous facade.
- [x] Direct **standalone V8 source-level execution** of the exact live `VoxelWorld` class with import declarations omitted checked **5/5 safe legacy boundaries** (actual exported ID set/height constants, all 18 ID rejections without save mutation, malformed schema-1 restoration rejection, invalid coordinate/type rejection, empty valid schema-1 save round-trip). Only dependency-free paths were invoked. This is **not native Node execution or the complete dependency graph** and must not be counted in the original 89/89.
- [x] Re-ran the previous original six suites on the verified isolated source staging with its **explicit local legacy facade** using actual Node v22.16.0: **89/89 PASS; 0 skips**. This preserves earlier candidate evidence; it does **not** resolve production-world certification.
- [ ] **New seventh production-boundary suite is UNVERIFIED against real imports.** This runtime still cannot clone GitHub because DNS/network is blocked; the complete set of real world generation dependencies is not present in the local Node checkout. Do not substitute a facade or remove the import to manufacture a green result.
- [ ] Production voxel registration, complete WebGL2 alpha/fluids, schema-1 metadata sidecar/offline save rollback, actual physical iPhone art/controls and creator Gate A approval remain **not authorized/not certified**. v0.11 stays LOCKED.

**Next clean checkout command:** `bash tests/block-packs/pack-2/run-acceptance.sh` with the expected actual PR HEAD and clean Pack 2-owned paths. The runner is now **fail-closed** if the real production `VoxelWorld` graph is unavailable.

## Session 16 — exact Git sources evaluated with real checkpoint-008 VoxelWorld (2026-11-14)

- Audited integrated `main` `ac263720b60641c65b02330348dd76d0ef9cb75e` (checkpoint **008**), coordination Issues #109/#117, draft PR #114 at `b43e079e7c0fcfd7168f8eb9dfd8a2ce42f87f3e`, all manual Pack 1/3/4/5 heads, the separate biome130 candidate and four building-roadmap draft heads. The 18 Pack 2 candidate IDs 59–76 remain unregistered and disjoint; 21 PR paths remain Pack 2-owned.
- Retrieved the **actual production `src/voxel.mjs` and its complete 16 additional transitive production modules**, pinned to checkpoint-008 `main`. Retrieved the committed Pack 2 JavaScript modules and all seven original test sources from the draft PR. Independently reconstructed and matched **14/14 Pack 2 `.mjs` file SHA-1 Git blob hashes** to the exact branch Git tree. No production `VoxelWorld` substitute/facade was used for this evaluation.
- Executed **all 95 checked-in test callbacks** in a V8 in-memory module/test harness against those real source definitions: **89/89 original six-suite candidate tests PASS**, **6/6 newly authored production-boundary tests PASS**, 0 callback failures. The checks include rejecting IDs 59–76, legacy schema-1 edit round-trips, malformed save and preview-envelope rejection, and candidate geometry/fixture regressions. The original six test file bodies were not edited.
- **Evidence classification:** genuine real-source **V8 evaluation only** with a compatibility test/assertion harness — **NOT native Node `node --test`**, **NOT a full Git checkout**, and **NOT production WebGL2, schema migration, actual fluid propagation, offline PWA, physical iPhone or creator Gate A acceptance**. The previous separate **89/89 genuine Node tests** remain explicitly qualified by their local legacy `VoxelWorld` facade; the previous **66 real Chromium Canvas 2D candidate screenshots** remain preserved, not recertified as WebGL2.
- The opt-in `run-acceptance.sh` already includes the real-production seventh suite. The remaining next step is to obtain a permitted **full real source checkout** and execute all seven tests in native Node plus the authentic Chromium gallery; standard root CI still excludes Pack 2's nested suites. No registration, merge, deployment, save alteration, shared system or v0.11 work is authorized.

## Required real test gates — NOT certified by the source-level checks

| Gate | Evidence required | Current status |
|---|---|---|
| Dedicated native Node | Run all six exact committed Pack 2 suites | **89/89 genuine Node PASS against exact Pack 2 blobs in staged local folder**; **full-git/production-VoxelWorld rerun OPEN**, test-only legacy facade explicitly disclosed |
| Browser inspector | Run committed Python `gallery-browser.py` with authentic Chromium screenshots at 667×375, 844×390, 932×430 | **PASS: 18×3 candidate renders + 12 detail images = 66 real PNGs**; 18 distinct image hashes per viewport, water alpha, fixture restore, 0 JS errors; **git-head-full-checkout / production WebGL2 OPEN** |
| Standard CI | Recheck exact PR head and Github Actions Node + Chromium baseline, not a previous commit | **Check on PR; root glob excludes nested Pack 2 tests** |
| Production renderer | Real WebGL2 composite with transparent water, correct back-face culling, neighboring face omission, water alpha sorting, 25 loaded chunks and iPhone landscape GPU budget | **BLOCKED on centrally approved integration** |
| Production controls & saves | Exact mobile device tests, unobstructed left/right grip rails, opt-in schema-1 state sidecar with atomic recovery, offline PWA tests | **BLOCKED, not claimed** |
| Creator visual / Gate A | Creator reviews actual in-game art and independently confirms physical iPhone controls | **NOT approved; v0.11 LOCKED** |

The optional browser verifier visits all 18 candidate mesh choices at three iPhone landscape viewport sizes and, when actually executed, can save 54 distinct candidate canvas screenshots plus authentic full-page and detailed water/open-gate/parapet screenshots. It checks a **Canvas 2D demonstration of authentic Pack 2 candidate triangle data**, not a production WebGL2 fluid simulation. Even a green optional browser inspector must not be used as proof that flowing water, collision, source updates, saved edits or integrated game controls are functional.

## How to repeat the now-passing isolated acceptance checks on a full Git checkout

From an exact checkout of [draft PR #114](https://github.com/hdog960/Mythwrought/pull/114):

```bash
node --test tests/block-packs/pack-2/*.test.mjs
MYTHWROUGHT_PACK2_SCREENSHOTS=/tmp/pack2-qa node tests/block-packs/pack-2/browser-verify.mjs
```

The Playwright browser script requires the existing free Playwright Chromium dependency; do not silently add an external paid testing platform. Screenshot output is allowed only if from a real browser; do not synthesize screenshots or call illustrated concepts acceptance evidence.

## Final manual-incorporation handoff — no activation in this branch

The central integrator (separately creator-authorized) must validate:
- Explicit candidate ID registration 59–76, material palettes and physical shape interfaces without changing legacy IDs, sentinel 255 or seed.
- :00 shared exact shape targeting/collision and safe atomic placement, player obstruction checks for rotating/open hinged parts.
- :12 shared physical mesh and transparent water rendering pipeline with face culling/backface direction, flow UV, alpha-sort/depth-write policy, shorelines and underwater fog. Keep water non-solid and ray-targetable.
- An explicit backward-safe **schema-1 compatible per-cell metadata sidecar** (or another validated approach) for orientation/variant/open plus water level/flow/source; corrupt state must reject before mutating world, and rollback must preserve old saves and offline user edits.
- Gravel falls only if :00 introduces support physics; water actually flows only if the shared fluid simulation is implemented and authorized. This PR does not implement either.
- Integration and deployment to GitHub Pages *only* after manual creator command and exact-head green Node/Chromium/mobile/offline checks, plus art/control approval to move Gate A.

**Disposition:** Milestones 0–5 source authored. Milestone 6 source geometry defects fixed and reviewed; **acceptance gates remain open** until genuine native and production validations are available. **Do not merge PR #114 or deploy these assets automatically.**
