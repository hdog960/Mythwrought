# Pack 4 — Milestone 5 acceptance dossier

> **UNMERGED CANDIDATE — NOT IN LIVE GAME.** This is a final review
> checklist, not a creator art/control approval, merge permission or
> live-game certification. v0.10 Gate A open; v0.11 locked.

## Current state
- Project: `hdog960/Mythwrought`, GitHub Pages game unchanged.
- Exclusive draft: [PR #115](https://github.com/hdog960/Mythwrought/pull/115).
- Authoritative exact HEAD: **use PR #115 head SHA**, not a cached release
  checkpoint; final HEAD changes as the acceptance dossier is committed.
- Base integrated main `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`
  and last creator integration checkpoint **006**.
- Issue [#109](https://github.com/hdog960/Mythwrought/issues/109)
  manual exclusive ID band 159–208 and Issue
  [#117](https://github.com/hdog960/Mythwrought/issues/117) separate
  symbolic 130-biome catalog examined. Other draft packs use IDs
  9–38 (#113), 59–76 (#114), 109–125 (#112), no collisions.
- 22 authored physical candidate families, 23 persistent candidate IDs
  **159–181**, remaining Pack 4 IDs **182–208 unassigned**.
  Live IDs 0–8 / sentinel 255 remain protected.
- All changed files are within `src/block-packs/pack-4/` and
  `tests/block-packs/pack-4/`; nothing was merged into main or placed.

## Family acceptance matrix

| Roster | Asset family | Candidate ID | Independent physical source | Acceptance |
|---:|---|---:|---|---|
| 30 | Clear glass | 159 | Thin transparent plane, selection/collision slab | Candidate; gallery unverified |
| 31 | Stained glass | 160–161 | Two leaded patterns and material shapes | Candidate; alpha depth integration blocked |
| 32 | Wooden window frames | 162 | Open carved oak frame and mullions | Candidate; selection integration blocked |
| 33 | Wooden shutters | 163 | Separate slatted leaves, wall support | Candidate; state/placement integration blocked |
| 34 | Iron bars | 164 | Four rods, gaps and lateral braces | Candidate; collision integration blocked |
| 35 | Lantern blocks | 165 | Floor copper lantern, independently bounded | Candidate; functional lighting blocked |
| 36 | Wall lanterns | 166 | Wall sconce and raised bracket | Candidate; functional lighting blocked |
| 37 | Crystal lanterns | 167 | Caged physical crystal, not CRYSTAL ID 5 | Candidate; functional lighting blocked |
| 38 | Torches | 168 | Wall torch and separate noncolliding flame | Candidate; functional lighting blocked |
| 56 | Barrels | 169 | Tapered staves, hoops, lid and bung | Candidate; not a container |
| 57 | Crates | 170 | Independent planks and corner braces | Candidate; not a container |
| 58 | Benches | 171 | Open leg gaps and raised back | Candidate; no sitting interaction |
| 59 | Tables | 172 | Open underframe and separate legs | Candidate; no interaction |
| 60 | Wooden signs | 173 | Narrow post and framed signboard | Candidate; no text editor |
| 61 | Hanging banners | 174 | Ceiling-hung cloth, split swallowtail | Candidate; no wind simulation |
| 62 | Market canopy blocks | 175 | Single cloth panel with ribs/rope | Candidate; NOT a stall |
| 63 | Chimney blocks | 176 | Hollow open vertical flue, quoin and rim | Candidate; no smoke engine |
| 64 | Fireplace blocks | 177 | Open-front dry hearth and grate | Candidate; no fire/heat engine |
| 65 | Well rim blocks | 178 | True L-shaped quarter rim | Candidate; NOT a complete well |
| 66 | Well roof blocks | 179 | Wall-corbel/copper eave, not generic shingles | Candidate; roof assembly unimplemented |
| 67 | Well pulley blocks | 180 | Physical static ring/spokes/axle | Candidate; no rope mechanics |
| 68 | Fountain blocks | 181 | One dry carved basin and spout | Candidate; no water engine |

## Evidence actually established
1. **161/161** authored JavaScript test bodies passed when evaluating
   exact branch sources under a V8 compatibility harness. This includes
   23 candidate definitions, IDs/manifest, four orientations, accurate
   multi-box geometry, fixed supports, ray targeting, partial collisions,
   deterministic fixture-only saving/removal, preview vertex bounds, all-asset mobile mesh budgets,
   transparent triangle ordering and cross-family differences.
   This is **NOT the Node built-in test runner**.
2. **5/5 native Node 22 tests passed** for the isolated
   `preview-utils.mjs` translucent sort utility. The exact local
   source blob SHA `dbb9a47a6474fbc3461e006530d6dbaffbea42b2`
   and exact test blob SHA
   `a469b2f1a1648b1f18b51291b3ab0103701321b7`
   matched the GitHub blobs before native execution.
3. Prior pre-M5 candidate GitHub Actions baseline [run
   #43634712543](https://github.com/hdog960/Mythwrought/actions/runs/43634712543)
   must be checked separately. It covers the unchanged game's
   standard Node/Chromium suite but **does not run Pack 4's nested
   `tests/block-packs/pack-4/*.test.mjs`**.
4. Candidate reviewer gallery now uses a single reused WebGL2
   context, deletes temporary GPU buffers/programs/VAOs, sorts
   translucent triangles back-to-front for the fixed preview
   camera, and displays one-cell models at a non-clipping scale.
   A dedicated genuine Chromium script checks all 23 canvas
   fingerprints/rotation and requests screenshot artifacts
   in three landscape viewports **667×375, 844×390, 932×430**.
   This browser script has **NOT** successfully completed.

## Mandatory unpassed final acceptance gates
- [ ] Checkout exact review HEAD and run **real native Node** across
  the full suite:
  `node --test tests/block-packs/pack-4/*.test.mjs`.
  Local runner cannot obtain the remote checkout due blocked GitHub DNS.
  The native subset above does not certify the whole pack.
- [ ] Run `node tests/block-packs/pack-4/gallery-browser.mjs`
  with free `playwright` and genuine Chromium on a host that permits
  local HTTP navigation. Chromium here returned
  `net::ERR_BLOCKED_BY_ADMINISTRATOR` even for simple data URLs.
- [ ] Inspect authentic **UNMERGED CANDIDATE — NOT IN LIVE GAME**
  screenshot results for all 23 IDs, rotated variants, physically
  empty pane/frame/well/flue spaces, alpha layering and original art
  parity at three phone landscape widths. Do not substitute
  generated concept art or a static mocked gallery for this check.
- [ ] Reconcile manually with unmerged :12 general shape contract
  [#108](https://github.com/hdog960/Mythwrought/pull/108)
  and unmerged :00 collision/selection/save contract
  [#106](https://github.com/hdog960/Mythwrought/pull/106).
- [ ] Demonstrate **real engine** independent cell targeting,
  accurate partial collisions, support-on-neighbor validation,
  four-way rotation, transparent depth pass, bounded lighting
  budget if ever implemented, and backward-safe schema-1 saving.
  This pack only provides isolated fixture tests; it never edits
  the production player save or registry.
- [ ] Creator reviews art in actual iPhone landscape and explicitly
  approves Gate A. Physical iPhone testing has not been performed
  by this session.

## How to reproduce independently

From an authorized checkout at the exact PR HEAD:

```sh
node --test tests/block-packs/pack-4/*.test.mjs
npm install --no-save --no-audit --no-fund playwright@1.58.2
npx playwright install chromium
node tests/block-packs/pack-4/gallery-browser.mjs
```

The installed root CI currently runs `node --test tests/*.test.mjs`
and does not include the nested Pack 4 tests. Do **not** edit shared
workflows from the Pack 4 lane; report this to the integration owner.

No creator authorization to integrate has been given. **The next task
is to resolve the true native/visual test blockers and present the
result for manual, creator-controlled integration—not to start another
set of blocks or auto-merge.**

## Additional M5 QA evidence
- **Four new cross-family mesh-budget cases PASS in the V8 source harness**, raising the total to **161/161 V8 checks**. Per candidate the peak original preview is 1,224 vertices, below 1,300; cumulative 23 candidate shapes total 14,436 vertices, below 16,000 (only one is uploaded to shared WebGL2 at a time). Each of 23 meshes remains deterministic and finite across four 90-degree rotations. This does not prove actual GPU performance or production world mesh integration.
- **Fixed a false-positive browser visual assertion**: nonblack GL clear pixels previously counted as nonblank rendered geometry. Now the 23-card browser acceptance script requires genuine foreground RGB contrast against each canvas corner, distinct image hashes, and a changed rotation image. The browser remains blocked by environment policy; these corrected assertions are authored, **not passed in Chromium**.
- Final artifacts still require exact HEAD full native Node tests, genuine WebGL2 screenshots and creator approval. `M5` remains **NOT ACCEPTED**.


### Shared :00/:12 source compatibility review — November 14, 2026
- **Real Pack 4-only defect fixed:** crate candidate **170** had **34 selectable AABB volumes**, exceeding the unmerged :00 [PR #106](https://github.com/hdog960/Mythwrought/pull/106) `validateShape` maximum of **32**. Eight ornamental corner ferrules/front battens now have `selection:false`; original visuals **34 rendered sub-parts** and **1,224 preview vertices** are preserved while selection/collision use **26** bounding boxes. It remains a single independent targetable crate.
- New isolated `src/block-packs/pack-4/interaction-handoff.mjs` exports `pack4ShapeHandoff`, `pack4SidecarHandoff`, and `pack4ReviewSidecar`. It generates candidate-only `{boxes}` descriptors within the exact :00 shape cap and converts fixture `{id,rotation}` to staged `{blockId,turns}` sidecar entries. It **does not import, activate or modify any shared module**, registry, game save or renderer.
- **161/161 exact current Pack 4 test bodies PASS in V8 compatibility evaluation**, adding five tests for the 32-AABB limit, crate render-versus-selection count, hollow structures, real sidecar field formats and malformed-state rejection. **Not native Node.**
- Evaluated the **actual unmerged :00 source at head `2054e00ead30736726d53d5aed8a1f9dc4e080a0`**, including `validateShape`, `raycastShapes`, `canPlaceShape`, `rotateShape`, `inspectBodyFit` and `makeOrientationSidecar`. Across all **23 IDs × four orientations**, every collision and selection descriptor, empty placement, precise selected-box raycast, interior-body collision, rotation parity and real sidecar snapshot passed: **644/644 independent cross-source V8 probes**. This is **not integrated gameplay or native Node testing**.
- Reviewed actual :12 [PR #108](https://github.com/hdog960/Mythwrought/pull/108) head `31be6f32adcfbb461b7a57e7db2e1567f8c1891a`. Its opt-in boundary-only `prototypeSurfaceMesh` tessellates unions more heavily than the Pack 4 preview meshes; sample **fireplace 177 produced 8,336 boundary-mesh vertices** and **pulley 180 produced 8,136**, compared with Pack 4's self-contained preview limits of 1,500 vertices per candidate. This is a **mobile-mesh integration budget warning**, not a runtime acceptance pass or a reason to edit shared mesher sources.
- Existing live world still has only persistent IDs **0–8**. Pack 4 candidate IDs **159–181** remain **not registered**; no creator integration permission. M5 is still OPEN pending full native exact-HEAD Node suite, authentic Chromium WebGL2 gallery/screenshots and explicit art/physical iPhone Gate A approval.
