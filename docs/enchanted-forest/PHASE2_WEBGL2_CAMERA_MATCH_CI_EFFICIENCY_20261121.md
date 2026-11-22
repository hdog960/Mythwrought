# MYTHWROUGHT — Enchanted Forest Phase 2 Visual Evidence, Camera-Match Correction and CI Efficiency

Date: 2026-11-21 local (GitHub UTC 2026-11-22). Protected standalone enchanted-forest branch. **No merge, deploy, CI cancellations, builder/other-biome/automations changes, schema/save migrations or historical M7 generator upgrades.**

## Verified GitHub refs

- Production `main` reverified: `7016e14cd6289f45eaf7fc6a79a362b47996df65`.
- User-requested branch checkpoint `a14825bd28689730ded65e9f0e17e82d888b0e98` reverified unchanged before changes in this continuation.
- Historical gameplay defaults still select original M7 trees; experimental Starspire, Moonwillow and Ancient Giant remain explicitly opt-in in source and fail closed on save.

## Completed existing full test proof — AUTHENTIC

**Existing original game renderer [run #44972193017](https://github.com/hdog960/Mythwrought/actions/runs/44972193017), job `137054188962`, exact HEAD `69a1e3bcbe199ee222736bab9119eadf278dfd1a`, SUCCESS.** Full logs reviewed. Browser is real game `index.html` and WebGL2 renderer, but experimental tree generation is enabled only by a **single temporary localhost test-server replacement** of `profile-world.mjs` module response, not by production gameplay source. Not an unchanged browser build or physical iPhone acceptance.

- Original runtime `src/main.mjs` blob `9a33a51e602236b66ed0a3146895e760d478d803`. Normal enchanted tree source blob `f35c10bab419a9fb83816520050a5f1dda13b51d`; tree candidate blob `86b91fe467107b0fa28c4770c265caaf0044c731`; profile source blob `f3251b9d6904fed5986fc2560ed46df6927c0a1b`.
- Single-response temporary instrumented-profile SHA256 `de669d85f553dd4746909ce282c65415b2a47e425e1d86c6532d8f578b11183a`; official repo source not modified by the test runner.
- 12 genuine WebGL2 PNGs: 3 species × historical/prototype × 932×430/844×390. All captures checked 24 real source tree block witnesses, `0` page JS errors, `0` GPU upload faults, unchanged local save bytes, 25 resident chunks, original renderer.
- Downloaded original GitHub [artifact #14733783796](https://github.com/hdog960/Mythwrought/actions/runs/44972193017/artifacts/14733783796): independently recomputed ZIP SHA256 **`e1c0b2ba9b0164907bdabc383a741bdbee5b30e99708dd317d759c717e3ef847`**, matches GitHub digest. All **13 archive entries** passed ZIP CRC. Each of 12 original PNGs passed individual SHA256, internal PNG chunk CRC, exact IHDR 932×430 / 844×390 and IEND/no trailing data.
- Source-derived image changes at 932×430: Starspire 11.866%, Moonwillow 14.218%, Ancient Giant 45.440% of pixel locations exceeded RGB delta threshold; these are only measured image differences, not a subjective quality score.

## Genuine visual comparison defect discovered by artifact review

**Ancient Giant historical and prototype camera heights were not comparable** even though the source test asserted a common requested X/Z. `findSafeSpawn` chose:
- Ancient Giant historical `{x:9.5,z:-539.5,feet:15}`.
- Ancient Giant prototype `{x:9.5,z:-539.5,feet:9}`.
- This happened in both viewports. The 45.44% pixel-change metric blends a six-block camera-altitude shift with tree geometry and cannot serve as a same-camera visual-difference acceptance proof.

**Starspire and Moonwillow** camera x/z/feet matched between historical and prototype in both viewports and remain legitimate comparable original-engine captures. Visually, Starspire is thin/tapered, Moonwillow has draped outer foliage, and the Giant prototype shows a taller denser multi-trunk stand; subjective full acceptance of the Giant needs matching pose. The original browser job passed its programmed assertions because it did not require camera height equality. We will not weaken those assertions, fabricate consistency, or claim this objective comparison is valid.

## Focused correction, NOT duplicate comprehensive testing

New isolated `scripts/ci/enchanted-trees-phase2-giant-camera.mjs` and `.github/workflows/enchanted-forest-phase2-giant-camera.yml` test **ONLY Ancient Giant at 932×430** in historical vs test-instrumented original gameplay renderer:
1. Scans physically safe source-backed camera anchors with original `findSafeSpawn` for historical and prototype `FourRegionWorld`, and chooses a deterministic candidate with **identical actual x, z, feet** below canopy; confirms the actual browser `teleport` returns the identical pose in both worlds.
2. Uses actual seed 179 Ancient Giant source site `(20,6,-525)` and 24 verified source-specific mineable voxel witnesses.
3. Requires loaded original game source/WebGL2, zero page/GPU faults, unchanged saved-world bytes, original renderer, matching camera height and a real image delta without replacing any source or player files.
4. Authenticates original vs temporary module-response hash, original script source, physical candidate and PNG SHA/dimensions, and publishes an authentic artifact or failure diagnostic.
5. The original full 12-capture script/source remains intact. Do **not** rerun full expensive WebGL2 against unchanged SHA to repair this single Giant camera issue.

Focused run **[#44980183092](https://github.com/hdog960/Mythwrought/actions/runs/44980183092)**, source commit `d98f00b83fbcc025c2240566b7a5b1683ac36448`, job `137078768051` was **QUEUED** at time of initial report. *No matched-camera visual acceptance is claimed until its full authentic evidence passes.*

## Previous exact-source evidence reused, tests avoided

- Original exact-source native [run #44965659979](https://github.com/hdog960/Mythwrought/actions/runs/44965659979), 34/34 focused/compatibility native tests passed, three-seed source census **12 Ancient Giants, 85 Starspires, 77 Moonwillows** eligible among 174 sites, hard Y19 0 breaches, six-chunk native mesh source sample 963,360 vs 1,010,664 bytes (+4.9%, original per-chunk 8 MiB cap unchanged). Artifact `14731942147` verified SHA256 `1c2dda95724bb9877562b464b88715fd215df2dcfcd6bd077e4d22befd7d847a`.
- Accepted Phase 1 ground and cave audits reused from exact unchanged source: `44962042593` native 46/46, `44962003550` original-game WebGL2, four original PNGs (unmodified browser, no tree test instrumentation).
- **Avoided** duplicate 34 native tests, the entire twelve-image WebGL2 suite, Starspire/Moonwillow rerenders, unrelated whole-repository suites and unnecessary other-biome workflows. One new pair only for the genuine, local visual proof gap.
- Repository Actions queue at audit: **24 queued workflows, 15 in progress**; avoid more speculative Actions while capacity is shared.

## Outstanding essential acceptance

- Focused camera-locked Ancient Giant `#44980183092` result and genuine binary artifacts (read failure logs if run fails; do not infer).
- Native iPhone Home Screen PWA (real iPhone 17 Pro Max) camera/streaming/framerate p95, real walk/collision, long-duration GPU and battery evaluation, and full source-compatible generator version migration for future release.
- No source gameplay tree-shape repair justified solely by camera mismatch. Existing old saved M7 worlds are not automatically upgraded. No merge/deploy.
