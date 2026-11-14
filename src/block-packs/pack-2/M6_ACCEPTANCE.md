# MYTHWROUGHT — Pack 2 Milestone 6 final candidate acceptance review

**Review status:** `SOURCE CANDIDATE REVIEW COMPLETE; NATIVE/PRODUCTION ACCEPTANCE OPEN`  
**Pack:** 2 — Timber & Infrastructure | **Draft PR:** #114 | **Coordinated in:** Issues #109/#117  
**Latest audited integrated main:** `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84` | **Incorporation checkpoint:** 006  
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

## Required real test gates — NOT certified by the source-level checks

| Gate | Evidence required | Current status |
|---|---|---|
| Dedicated native Node | Run `node --test tests/block-packs/pack-2/*.test.mjs` from an exact-head checkout | **OPEN / unavailable locally** (GitHub DNS prevents checkout; external repo unavailable in sandbox) |
| Browser inspector | Run `node tests/block-packs/pack-2/browser-verify.mjs` with Playwright/Chromium and capture authentic screenshots for 667×375, 844×390, 932×430 | **OPEN / not executed** |
| Standard CI | Recheck exact PR head and Github Actions Node + Chromium baseline, not a previous commit | **Check on PR; root glob excludes nested Pack 2 tests** |
| Production renderer | Real WebGL2 composite with transparent water, correct back-face culling, neighboring face omission, water alpha sorting, 25 loaded chunks and iPhone landscape GPU budget | **BLOCKED on centrally approved integration** |
| Production controls & saves | Exact mobile device tests, unobstructed left/right grip rails, opt-in schema-1 state sidecar with atomic recovery, offline PWA tests | **BLOCKED, not claimed** |
| Creator visual / Gate A | Creator reviews actual in-game art and independently confirms physical iPhone controls | **NOT approved; v0.11 LOCKED** |

The optional browser verifier visits all 18 candidate mesh choices at three iPhone landscape viewport sizes and, when actually executed, can save 54 distinct candidate canvas screenshots plus authentic full-page and detailed water/open-gate/parapet screenshots. It checks a **Canvas 2D demonstration of authentic Pack 2 candidate triangle data**, not a production WebGL2 fluid simulation. Even a green optional browser inspector must not be used as proof that flowing water, collision, source updates, saved edits or integrated game controls are functional.

## How to run the pending independent acceptance checks

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
