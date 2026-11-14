# Pack 4 — Windows & Furnishings progress ledger
**UNMERGED CANDIDATE — NOT IN LIVE GAME • Gate A v0.10**

**Branch:** `pack-4-m0-m1-windows-openings-20261114`
**Base main:** `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`
**Latest creator incorporation:** checkpoint 006, game code `1006e5cd5fd44e5696943d2651e63fb30a393003`.
**Exact PR HEAD:** GitHub PR `head.sha` and PR description provide the
final immutable review SHA after the last commit. Do not embed a commit's
own SHA inside itself. New commits require updating PR handoff and re-testing.
**Ownership:** Pack 4 source/tests ONLY; ID band 159–208. Protected 0–8 / 255.

| Roster | Family | Candidate persistent IDs | Variants | State |
|---:|---|---|---|---|
| 30 | Clear glass | 159 | Clear beveled pane | Candidate built, tests authored |
| 31 | Stained glass | 160,161 | Sunfire; Moonveil | Candidate built, tests authored |
| 32 | Wooden window frames | 162 | Open carved oak sash | Candidate built, tests authored |
| 33 | Wooden shutters | 163 | Closed double-leaf oak | Candidate built, tests authored |
| 34 | Iron bars | 164 | Four-rod wrought grille | Candidate built, tests authored |
| 35 | Lantern blocks | 165 | Hearthbound iron/copper floor lantern | Candidate built, tests authored |
| 36 | Wall-mounted lanterns | 166 | Hawthorn wall sconce | Candidate built, tests authored |
| 37 | Crystal lanterns | 167 | Aetherglass caged blue crystal | Candidate built, tests authored |
| 38 | Torch blocks | 168 | Wayfarer bracket wall torch | Candidate built, tests authored |
| 56 | Barrels | — | — | Planned, M3 |
| 57 | Wooden crates | — | — | Planned, M3 |
| 58 | Wooden benches | — | — | Planned, M3 |
| 59 | Wooden tables | — | — | Planned, M3 |
| 60 | Wooden signs | — | — | Planned, M3 |
| 61 | Hanging banners | — | — | Planned, M3 |
| 62 | Market canopy blocks | — | — | Planned, M3 |
| 63 | Chimney blocks | — | — | Planned, M4 |
| 64 | Fireplace blocks | — | — | Planned, M4 |
| 65 | Well rim blocks | — | — | Planned, M4 |
| 66 | Well roof blocks | — | — | Planned, M4 |
| 67 | Well pulley blocks | — | — | Planned, M4 |
| 68 | Fountain blocks | — | — | Planned, M4 |

### Milestones
- **M0 Foundation:** base/checkpoint/Issue #109/registry and open PRs
  inspected; dedicated branch, unique namespace, explicit manifest and
  isolated test directory created. Other manual packs and automated lanes
  remain untouched.
- **M1 Windows/openings:** six visual/physical variants across five
  exclusively owned families implemented in `windows.mjs`, with actual
  partial selection/collision boxes, four-way Y rotations, transparent
  material separation and strict state serialization. **Candidate only,
  awaiting Node + browser and integration acceptance.**
- **M2 Lighting:** Four physically independent candidate families (35–38) authored in `lighting.mjs`, with distinct iron/copper/wood/crystal/fire material silhouettes, floor or wall mounting requirements, four-way orientation, partial collision/selection and strict candidate state. Light color/intensity/radius metadata is recorded, but engine emission is explicitly `engineEnabled:false`. **Candidate source implemented; live integration and visual acceptance pending.**
- **Isolated interactions:** `fixture.mjs` adds isolated place/remove, sub-box raycast, partial collision and fail-closed atomic schema-1-style fixture snapshot replay. This is NOT a production save format or a generated-world change.
- **M3** seven furniture/market families (56–62) not started.
- **M4** six hearth/civic families (63–68) not started.
- **M5** full 22-family review and manual handoff pending.

### Verification status — current candidate source
- Base/current main checked: `f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84`, checkpoint 006. Physical main block registry remains 0–8. Issue #109 still reserves Pack 4 IDs 159–208; Issue #117 gives auto :12 a **different** symbolic namespace; no cross-pack duplicates.
- Candidate IDs **159–168**, ten distinct persistent variants spanning **nine out of 22** authored roster families. IDs 169–208 available for subsequent Pack 4 entries, 255 reserved.
- **V8 compatibility harness (not Node): 59/59 exact Pack 4 test bodies passed**, across windows (29), lighting (19), isolated place/raycast/save fixture (11). Regression-detected test fixture support errors were corrected; no game engine files edited.
- **Local Node 22, 33/33 PASS on a source-derived, 0.0001-unit-quantized geometry snapshot** of the ten GitHub candidate assets. This check tests mesh-coordinate validity and material/silhouette distinctions, NOT the full GitHub checkout or native Node import of the nested Pack 4 tests.
- **Prior exact PR HEAD** `3a09f18e4338bbf61674f72dffaf7abc93c2d245`: existing GitHub Actions baseline Node and configured Chromium regression suites **SUCCESS**, run [43628322485](https://github.com/hdog960/Mythwrought/actions/runs/43628322485), before M2 was added. Must reverify new exact PR HEAD separately.
- **Pack 4 nested Node** `node --test tests/block-packs/pack-4/*.test.mjs`: NOT YET run on an actual checkout; existing root CI glob excludes nested files and shared workflow changes are prohibited.
- **Standalone Pack 4 gallery** now includes all ten original source candidates and four-way rotation selector. A source-derived local Chromium WebGL2 attempt failed/hung due EGL/SwiftShader initialization on the available headless host; **no authentic successful browser screenshot or real iPhone certification**. This is not a game defect verdict.
- **No merge/deploy/world placement.** No dynamic light simulation, open/close animation, particle fire, generation, shared registry, game save schema or controller code changed.

### Integration dependencies
- Generic shape meshes/rotated sub-boxes [#108](https://github.com/hdog960/Mythwrought/pull/108), targeting/placement/collision [#106](https://github.com/hdog960/Mythwrought/pull/106), both unmerged and separately owned.
- Central registry for candidate physical IDs, schema-1 sidecar for rotations, transparent depth ordering and renderer material contract.
- Wall/floor support validation, bounded dynamic point light engine (metadata only), original PWA/mobility/seed/save compatibility and user iPhone art approval.
- Automated :12's **130-family separate catalog** in [Issue #117](https://github.com/hdog960/Mythwrought/issues/117) is not part of Pack 4. None of its symbolic variants are reused here.

**Next task (Milestone 3):** Before allocating IDs 169+, recheck current main, Issues #109/#117, other pack manifests/PRs and exact PR #115 head. Run nested Pack 4 Node and genuine Chromium where workable, then develop the independent physical barrel, crate, bench, table, sign, banner, and canopy component families 56–62. Update this ledger and draft PR; never merge or place assembled structures.
