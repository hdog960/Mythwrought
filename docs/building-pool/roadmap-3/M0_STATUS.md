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
