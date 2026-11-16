# Mythwrought Roadmap 9 — M7 detached accepted-blueprint browser

**Scope:** M7 only; read-only catalogue preview. **Entry evidence:** PR #186 M6 commit `7556e582cebbc93139db2bd86376966d0b420040`, successful exact-head GitHub Actions #43788430943 including the full 20-script WebGL2 gate. `main` remained `e6bd7c173a4531ba7efc153e5f2eb89870c3b9db`; all 50 changed files were Creative Mode-owned. Draft PR, no merge, no deployment.

## M7-only added files

- `src/creative-mode/blueprint-browser.mjs`: pure, fail-closed feed/record validator, eligibility and exclusion checks, capped source-data thumbnail preview, searchable/filterable/virtualized read-only list.
- `src/creative-mode/blueprint-fixture.mjs`: 300-structure **synthetic-only**, nonauthoritative test feed, including a deliberate draft, an unapproved candidate and one unresolved dependency. Test scale can grow to 4000.
- `src/creative-mode/blueprint-preview.html`, `.css`, `.mjs`: detached browser with keyboard/touch search, biome/type/size filtering, virtualized scroll, selection, source-mark thumbnail and reserved upper-right minimap zone; protected left/right thumb rails. **No place, import, save, or other write controls.**
- `tests/creative-mode/blueprint-browser.test.mjs`, `tests/creative-mode/blueprint-browser.py`, `tests/creative-mode-m7.test.mjs`: focused native, real Chromium and root-glob bridge tests.
- This acceptance document.

## Authoritative eligibility contract, without claiming authority

`inspectBlueprintAdapter()` requires a `listReadyBlueprints()` function, `accepted-blueprint-registry` provenance and world schema 1, but returns `runtimeIntegrated:false` even when a mock passes. `screenBlueprintSnapshot()` requires matching versioned ABI, feed provenance, safe revision and at most 4,096 records. **Feed fields themselves cannot authenticate creator approval.** A future runtime adapter must be explicitly authorized and independently attest source provenance before any user-facing production catalogue is enabled. No adapter is currently installed.

Candidates are excluded if draft/unmerged, lacking explicit creator acceptance, missing required metadata, missing/unresolved physical dependencies, not coordinate-authored with a SHA-256-shaped fingerprint, or exceeding the 96-voxel preview cap; duplicate well-formed identities reject the **entire** feed. These checks are defensive structural eligibility screens, **not** verification that the game really contains or has approved any building. The source-test fixture deliberately labels the 297 passing synthetic entries **fixture matches** and all thumbnails **not live**. Real accepted blueprint count is unverified; the feature makes no actual building available.

Query/search, five biome filters, seven categories and three size classes are bounded. Virtualized list materializes at most 20 DOM rows; thumbnails are drawn from at most 96 explicitly supplied coordinate markers and perform no network fetch. No import from any builder PR, manual Block Pack, automated biome130 library, game registry or saves.

## Local verification and screenshot evidence

- Node 22.16.0: `node --test tests/creative-mode-m{0..7}.test.mjs` (expanded explicitly in CI environments) — **128/128 passing native tests**, 11 new M7 and 117 inherited.
- Genuine system Chromium/Playwright `python3 tests/creative-mode/blueprint-browser.py`: **229 passing assertions** across 568×320, 667×375, 844×390, 932×430, 956×440, 1180×520 and portrait, including real scroll, search, touch-capable selection, all filters, duplicate exclusion, 20-row cap, no world writes, and non-overlapping upper-right map reservation.
- Each earlier browser suite rerun separately: M1 220, M2 160, M3 198, M4 253, M5 385, M6 475 — **1,691 regression assertions passed**. Total **1,920** local Chromium assertions including M7. The combined single-process run was not required; suites completed independently.
- Screenshot evidence in local `artifacts/creative-mode/m7-blueprints-568x320.png` and `m7-blueprints-956x440.png` captured from actual feature HTML/CSS/JS in Chromium. This is **not physical-iPhone testing or live-game WebGL2 proof**.

## Open gates

No production blueprint feed or creator approval API exists in this feature branch; no building was registered, placed, deployed, imported, edited or saved. Real dependency audits and true Creator acceptance cannot be inferred from mock approval fields. Original M0–M6 source, M4/M5 safety contracts and all protected paths remain untouched. Future M8 acceptance is evidence/handoff-only and remains gated on **this M7 commit's exact-head GitHub Actions CI**. No edits to main, eight builders, five automations, manual Block Packs, biome130, shared runtime/input/physics/saves or locked v0.11.
