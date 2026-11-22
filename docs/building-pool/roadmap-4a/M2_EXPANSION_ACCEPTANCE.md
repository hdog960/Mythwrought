# Builder 4A — M2 next regional civic/guild expansion (independent lane)

Six fully authored additional region/size slots build upon the **original source-exact PR #123 30** and the earlier **eight** original M2 designs, without changing their source bytes or metadata. Expected catalog at this draft: **44/315 authored**, **271 still to author**, **0 creator approved/0 world integrated**.

## Original coordinate-authored additions
| ID | Architectural distinction | Voxel cells | Navigation cells | Actual rooms |
|---|---|---:|---:|---:|
| `r4:civic-hall:temperate:medium:02` | Tri-axial council, ballot apse, records wing | 2235 | 524 | 3 |
| `r4:civic-hall:snow:small:02` | Snow two-nave petition chambers | 1408 | 297 | 3 |
| `r4:civic-hall:enchanted-forest:small:02` | Branching witness/archive pavilions | 1415 | 292 | 3 |
| `r4:guildhall:temperate:medium:01` | Three-pronged trades, workshop, ledger court | 1872 | 401 | 3 |
| `r4:guildhall:snow:medium:01` | Four-vault winter guild, sealed tool room | 1914 | 422 | 4 |
| `r4:guildhall:mountain:medium:01` | Mountain two-terrace craft guild and long spine | 2173 | 465 | 4 |

**Source-authored six-design total:** 11,017 discrete occupied voxels, 2,401 traversable coordinates, 20 genuinely positioned functional rooms. Combined 44-design catalog passes the local source/schema rotation-neutral **and D4 reflection-invariant full-cell fingerprint audit**; native exact-head verification is **pending**. These are independent wing/room/facade coordinates, not mirrored, recolored or random seeds. Each source compiler produces genuine floor/walls, six outward-facing source-author windows, 2-high clear entry and partition doors, local beam/purlin support and pitched roof candidate roles.

The source shape ABI audit reads merged manual-five-pack resolver read-only. `pack1:002`, `pack2:015`, `pack3:023`, `pack3:025`, `pack3:026`, and `pack4:030` are symbolic typed references, not proof of final wall/window/roof physical fits. Pack state and orientation, multi-cell AABB occupancy, mount support, persistence and real world-height remain unresolved; no numeric IDs are invented.

## Exact-source visual review gate
`tests/building-pool/roadmap-4a/m2-expansion-webgl2-cdp-gallery.mjs` produces **36** independent real Chromium software-WebGL2 screenshots (6 sources × exterior/cutaway × 667×375, 844×390, 932×430) with source Git-blob pin `07e37a38b87caf4173eb72bda40c824b0e5b104f`, true WebGL2 GL error checks, screenshot PNG hashes and saved JSON artifacts. Until the precise new PR HEAD Actions run succeeds and gallery images are inspected, new visual acceptance is **NOT complete**. The original inherited 180 and earlier 12+12+24 diagnostic views remain untouched. These are candidate partial-family/proxy previews, not the finished physical-family game renderer or actual iPhone.

No edits to original PR #123, sibling builders, automated biome130, 5 manual packs, world placement, schema-1 saves, engine/UI/PWA, Gate A or locked v0.11. Only Builder 4A src/tests/docs paths. Draft PR unmerged and undeployed.

## Evidence-based 4A M2 technical acceptance update (2026-11-16 UTC)
- Exact PR head `736665160a2fb9353507108666cd8d4e04a59f18`: [Actions #43778525869](https://github.com/hdog960/Mythwrought/actions/runs/43778525869) **SUCCESS**: **12/12** root CI contracts, **735/735** game native Node tests, **90/90** 4A-owned source/ABI/uniqueness tests (zero fail/skip), standard Chromium landscape/WebGL2 smoke PASS.
- Real software-Chromium WebGL2 independent source galleries: **180 inherited M1 + 12 first M2 + 12 additional M2 + 24 regional M2 + 36 new expansion = 264/264 PNGs**, per-gallery screenshot SHA uniqueness and GL/context proof. New expansion source JS SHA256 `91e2333712cecbbfd2e011ce64b20dec80f370a883b925061f1ab7d8094f1e4a`, authored generator Git blob `07e37a38b87caf4173eb72bda40c824b0e5b104f`, max 6 GL draw calls / 78,444 triangles (candidate proxy, NOT live game). Artifact [#14186634896](https://github.com/hdog960/Mythwrought/actions/runs/43778525869/artifacts/14186634896) includes actual PNGs and results JSON.
- Reviewer inspected contact sheets of all 36 new captured images at **667×375**, **844×390**, **932×430**. Roof/wing shapes and room cutaways visible, no blanks or obvious clipping. Presentation remains basic candidate partial-box and full-cell proxy geometry, **NOT creator-approved premium art or production physical-family assets**.
- Full **D4 rotation/reflection/translation-independent** occupied-cell geometry signatures: **44 distinct** of 44. Six new designs total 11,017 occupied voxel coordinates, 2,401 navigable floor points and 20 rooms; full authored 44 (22 civic, seven guildhall, 15 castle), **271 remain**, **zero creator accepted or deployed**. The new source generator and original 38-generator bytes are unchanged by this final manifest/log-only update.
- Open physical-family blockers: ambiguous Pack numeric/visible/collision shape selection, roof/window mount and support, glass transparency, occupancy and world-height compatibility, schema-1 saved-state orientation, true game performance and actual iPhone input/appearance. Notwithstanding source morphology/CI checks, none of these buildings has been world-placed.
- This final manifest/log annotation revision requires its **own** exact PR-head CI and must not be mistaken for acceptance of a future SHA until Actions completes.
