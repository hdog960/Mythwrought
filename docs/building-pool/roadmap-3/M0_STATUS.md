# Roadmap 3 — M0 accepted; M1 source review in progress

- [x] Read main, integration checkpoints 006/007, Issues #109/#117, all manual pack manifests, biome130 and open PR ownership.
- [x] Exclusive ownership under `src/building-pool/roadmap-3/`, `tests/building-pool/roadmap-3/`, `docs/building-pool/roadmap-3/`; draft [PR #122](https://github.com/hdog960/Mythwrought/pull/122) never merged or deployed.
- [x] Validated 705 exact design identities (225 M2, 240 M3, 240 M4).
- [x] M0 foundation: physical voxel coordinate contract, named symbolic future families, navigation and collision clearance rules, geometry uniqueness and deterministic serialization.
- [x] M0 authored native Node 22.16.0 checks **11/11 PASS**, source matched exact remote GitHub blob SHAs.
- [x] M0 exact-head [GitHub Actions #43643210989](https://github.com/hdog960/Mythwrought/actions/runs/43643210989) **SUCCESS** at commit `4aa9e5e8bf641b58421d370a11e42d9ddbc70008`; baseline browser checks passed.
- [x] M1: **30/30 representative source-authored theoretical structures**, 15 blacksmiths + 15 watchtowers in five biomes and three sizes. **70,921 conceptual physical voxel-coordinate slots**, no live registration.
- [x] M1 local source-exact native Node **33/33 PASS** across four nested suites; new exact-head GitHub CI still requires independent review.
- [ ] M1: genuine WebGL2 source-served candidate screenshots for 667×375, 844×390 and 932×430, and actual engine collision/shape integration, remain **NOT VERIFIED**. Local Chromium minimal navigation failed with `net::ERR_BLOCKED_BY_ADMINISTRATOR`.
- [ ] Creator art acceptance, physical iPhone testing and incorporation are NOT AUTHORIZED / NOT RUN.
- [ ] M2/M3/M4 remaining designs and M5 final acceptance not started.

Current roadmap authored count **30/705**, not 705. Test fixtures are not counted. All new work is candidate source only; v0.10 Gate A OPEN and v0.11 LOCKED.

### M1 geometry QA revision
- [x] Replaced thick solid blacksmith roofs with shells, end gables and supporting rafters; connected static chimney location to forge void.
- [x] Added watchtower stair support piers and upper construction supports across the five regions.
- [x] Updated 30-design source-driven manifest to **70,921** structural coordinate slots.
- [x] Added candidate exterior/cutaway WebGL2 source and 180-image optional three-viewport browser runner (not executed), plus three pure Node diagnostic mesh acceptance tests.
- [x] Native Node **33/33** on exact locally checked source; all browser screenshots and creator acceptance remain OPEN.
- [ ] Generic PR-head CI final status must be rechecked on latest branch head. It does not run nested suites.

### Follow-up exact-source geometry QA
- [x] Fixed 6 inward-wound diagnostic cube faces; now outward CCW and normal back-face culling.
- [x] Added 2 structural preview-winding Node cases; **33/33 native Node 22.16.0 PASS** with zero skips.
- [x] Isolated optional browser runner now rejects blank framebuffers, GPU errors, unexpected identity and browser page exceptions.
- [ ] Real Chromium/WebGL2 candidate screenshots remain blocked by `net::ERR_BLOCKED_BY_ADMINISTRATOR` even for a trivial data page. No screenshots accepted.
- [ ] Latest exact PR-head GitHub Actions #43649109500 was queued; status/visual evidence not certified.

## Latest M1 integrity audit — disconnected roof and chimney repairs (2026-11-14)

**Authoritative current source-based count: 30/705 designs, 71,293 physical coordinate slots.** The earlier 70,921 count was a valid historical pre-repair figure; 372 genuinely authored support cells were added (12 chimney corbels + 360 roof-joining risers). Existing 30 IDs, exterior volumes, navigation and 705-slot allocation are unchanged. No future symbolic asset is claimed integrated, and no engine/system/world placement is authorized.

The previous 33/33 tests missed 6-neighbor structural continuity. An independent exact-grid audit exposed **12 floating three-cell chimney assemblies** (desert, snow, enchanted forest and mountain blacksmiths, all sizes) and **3 snow watchtowers with multiple isolated overhead roof tiers**. The repaired designs use one lateral chimney bearing corbel while keeping the forge shaft coordinate empty; snow-tower stepped upper roofs use sparse bearing risers rather than solid roof infill. Corrected snow towers are each one face-connected assembly, as are all 30 structures. Their unintegrated symbolic roof and chimney physical profile/ventilation remains uncertified.

- **36/36 native Node 22.16.0 tests PASSED, zero skips**, on local files matching committed Git blob SHAs. Three new strict connectivity tests independently flood all structural cells; removing the corbels or snow roof risers triggers failures and reproduces the disconnected masses. Tests still cover two-wide walking circulation, roof shell profiles, flue coordinates, M1 manifest serialization, uniqueness and diagnostic mesh bounds/winding.
- Latest isolated manifest `M1_MANIFEST.json` totals **71,293** occupied coordinate slots and preserves all 30 design IDs; no persistent IDs were assigned.
- **Genuine browser attempt:** A local HTTP server served the actual `tests/building-pool/roadmap-3/preview.html`. Chromium/Playwright attempted **667×375, 844×390, 932×430** individually and received `Page.goto: net::ERR_BLOCKED_BY_ADMINISTRATOR` at every size. **Zero genuine WebGL2 screenshots** captured or inspected. No screenshot exists to certify visual M1 acceptance. Previously inspected static coordinate projections are explicitly nonbrowser diagnostics.
- GitHub workflow run #43649194504 at the preceding PR head was still **queued** when checked. The newest M1 commit requires separate exact-head Actions verification. Existing root CI does not execute the nested 36-case Roadmap 3 suite. Never treat generic green Node/Chromium baseline CI as candidate M1 acceptance.

**Next M1 gates:** genuine source-loaded WebGL2 exterior/cutaway gallery evidence for all 30 designs at three sizes, inspection and Roadmap 3-only visual repairs as warranted, and future engine-shape collision/selection/integration checks only in an authorized centralized integration. Continue M1 review; v0.10 Gate A remains OPEN, v0.11 LOCKED.
