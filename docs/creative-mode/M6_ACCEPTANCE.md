# Mythwrought Creative Builder Mode — M6 detached advanced tools

**Scope:** Roadmap 9, M6 only. **Entry gate:** PR #186 M5 exact head `39bfdc2cfb53cb9bcb40d56e5210270f0b340377`; successful exact-head Actions #43783269058 including full shared 20-script WebGL2 gate. At authorization, all 42 paths belonged exclusively to Creative Mode and `main` remained `e6bd7c173a4531ba7efc153e5f2eb89870c3b9db`.

**Files added, Creative-owned only:** `src/creative-mode/advanced-tools.mjs`, `src/creative-mode/tools-preview.html`, `src/creative-mode/tools-preview.css`, `src/creative-mode/tools-preview.mjs`, `tests/creative-mode/advanced-tools.test.mjs`, `tests/creative-mode/tools-browser.py`, `tests/creative-mode-m6.test.mjs`, and this acceptance note. Existing M0–M5 source, test, preview, and saved artifacts are untouched.

## Implementation and M4/M5 contracts

* `selectToolCells()` enumerates integer-only **bounded** 3D cuboids (fill/replace), explicit-axis planes, or DDA-sampled lines. A selection is no more than 216 candidate cells, 12 cells on any span; invalid and oversized requests fail closed before edits.
* `previewAdvancedTool()` converts only eligible registered-placeable IDs into immutable M4 actions. The full atomic action budget is **24**; replacement requires remove/place pairs, so at most 12 complete replacements. A shaped object whose physical footprint is only partially selected is **rejected**, rather than cut. Rotation uses only 0°, 90°, 180°, or 270° via M4 shape contract.
* **Previews do not mutate the session**: a successful preview exposes selected cells, projected placements, chunk-refresh **plans** and the expected geometry fingerprint. It never touches real GPU chunks, production blocks, inventory, saves, or the game world.
* `commitAdvancedTool()` rechecks source revision, geometry fingerprint, actions, registered-placeable eligibility and current adapter decisions, and executes exclusively through **M5 `executeHistoryBatch()` -> M4 `planBuildBatch()`**. An unexpected region, collision, support, permission, selection, or fingerprint change fails atomically. On success it creates one bounded M5 history entry that can be replayed through M5 undo/redo and then serialized only by the **detached** M5 lab.
* Read-only synthetic inventory and region/collision/support callbacks are test fixtures, **not evidence of a production registry or authority**. The preview offers a 10×10 grid, tap-first/tap-last selection, fill/replace/line/plane, synthetic stone/moss/arch, rotation, preview, commit, undo/redo and reset. The original left/right thumb-rail zones and upper-right minimap reserve remain independent.

## Local test evidence

* Node 22.16.0: `node --test tests/creative-mode-m{0,1,2,3,4,5,6}.test.mjs` — **117/117 passing native tests** (24 new M6 tests, 93 inherited tests).
* Chromium using actual rendered DOM and source-specific `data:` modules under system Chromium/Playwright: **475/475 M6 assertions** at 568×320, 667×375, 844×390, 932×430, 956×440, 1180×520 and portrait; captured `artifacts/creative-mode/m6-tools-568x320.png` and `m6-tools-956x440.png` in local evidence.
* Independently reran the original browser suites: **220 M1**, **160 M2**, **198 M3**, **253 M4**, **385 M5**, all passed. Total **1,691 browser assertions** including M6. These are Chromium software-browser results, **not physical iPhone testing**, and do not assert live-game WebGL2 integration.

## Release restrictions and future blockers

* Do not merge, deploy, register assets, change shared runtime/input/physics, save schema 1, PWA, CI, any eight builder lane, manual block packs, biome130, or five automations. Preserve Gate A and locked v0.11. Creator approval of future runtime integration remains mandatory.
* Exact-head GitHub CI for the new M6 commit must be checked independently; local tests cannot substitute for the GitHub workflow. Future steps M7/M8 may proceed only after M6 exact-head CI passes.
* Authoritative real-world material enumeration, chunk streaming/refresh execution, collision/support authority, save ownership and actual iPhone feel are **unverified**. The M6 module deliberately exposes no integration entry point or production side effects.
