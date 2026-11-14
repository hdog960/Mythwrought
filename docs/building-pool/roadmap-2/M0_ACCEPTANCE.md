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
