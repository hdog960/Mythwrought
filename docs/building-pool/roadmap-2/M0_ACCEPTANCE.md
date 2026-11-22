# Roadmap 2 — M0 evidence (2026-11-14)

- GitHub main verified at f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84, checkpoint 006. Pending PR #120 checkpoint 007 excluded.
- Inspected Issues #109/#117, manual candidate Pack PRs #113/#114/#112/#115/#119, biome130 PR #118. No asset integration or numeric ID allocation.
- One conceptual coordinate-authored general store, 685 occupied cells, two rooms, reachable storeroom, gabled roof, entrances, windows, fixtures. All 840 catalog slots remain PLANNED; one separate authored candidate; accepted zero.
- Genuine local Node v22.16.0 run: staged schema/foundation 7/7 PASS. First attempt had two mistaken test expectations; corrected. Exact committed GitHub CI has NOT been verified here.
- Local Chromium headless screenshot attempt at 667×375 timed out; even blank-page Chromium smoke timed out with EGL/SwANGLE GPU initialization failures. No screenshots exist, and the 844×390 and 932×430 previews were not run. WebGL2 and physical iPhone NOT certified.
- M0 remains OPEN on exact-head and visual evidence. Branch is draft/unmerged/undeployed. No game/seed/schema-1 save/control/offline/automation changes.

## Follow-up M0 verification — 2026-11-14
- Verified original M0 GitHub blob SHA for catalog, schema, store, manifest, and native test source against independently reconstructed local files. Real native Node v22.16.0 original exact-source **7/7 PASS**. Initial local 6/7 was caused solely by erroneously copying the older staged manifest; correct exact HEAD manifest SHA restored, 7/7.
- Discovered actual cross-category schema defect: globally required `storage` circulation would reject valid temples/theaters/market squares. Corrected to category-agnostic graph of room uses reachable from exterior. Added 3-cell-height entrance obstruction and window geometry checks. Expanded **9/9 native Node** tests passed locally after patch.
- Genuine Chromium screenshot attempts repeated with headless software configuration and Xvfb even on `about:blank`; timeouts persisted. No valid images obtained or inspected, and no 667×375, 844×390, 932×430 claim. Added isolated reproducible Python Playwright runner for future genuine six-image QA. The runner is NOT yet reported as successfully run.
- Rechecked five manual pack manifests and exact draft PR heads, Issues #109/#117, biome130 status, other building pool PRs, latest main checkpoint 007. All stay separate.
- Acceptance remains BLOCKED on genuine landscape screenshot inspection and final PR-head checks. Do not start M1, merge or deploy until M0 passes.

## Genuine Chromium recovery — 2026-11-14
- Direct Chromium and localhost navigation were blocked by environment graphics/network policy. The no-HTTP Playwright `gallery-offline-browser.py` reconstructs **the same exact isolated catalog/schema/voxel/gallery sources** in one inline browser script (only strips module imports/exports), loads HTML via `page.set_content` without network, and renders using actual headless Chromium Canvas2D. Not a fake screenshot, and not production WebGL2.
- First authentic 667×375, 844×390, 932×430 composites showed gallery **clipping roof/front** and viewing the wrong facade. Repaired Roadmap2-only viewer with south-facing camera, geometry-bounds-scaled framing and surface-only faces; reran all three sizes and visually inspected genuine complete storefront/cutaway images without clipping.
- All three full viewport PNGs and 6 individual-canvas PNGs captured and inspected; screenshot checksums are reproducible on the same environment. Reference viewport composites: 667×375 `b955771ad856c099`, 844×390 `28c154b45ea68b93`, 932×430 `d841744cfa699aa3` (SHA-256 prefixes; screenshot bytes may change with renderer versions).
- At local final PR-prepared source, all FIVE relevant original-head blobs and both updated schema/test source blobs were hash-verified against GitHub; native Node v22.16.0 **9/9 PASS**. After adding gallery changes, repeat exact-head CI status check; CI still independent.
- **M0 remains open until current PR HEAD CI and exact source confirmation on the committed preview.** No physical iPhone/production WebGL2 certification; no merge, deployment, or live world placement.

## Final M0 conclusion
The exact-head run #43644864326 at `71838311c39a0cf4a2fdeeeac8e5d28c317f5aed` completed SUCCESS. The 9/9 native source tests and three landscape-size standalone genuine Chromium previews were reviewed. M0 is **TECHNICALLY ACCEPTED** for isolated roadmap continuation. This is not production WebGL2, live merge or iPhone creator approval.
