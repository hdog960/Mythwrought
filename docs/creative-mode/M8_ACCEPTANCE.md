# Mythwrought — Roadmap 9 M8 detached acceptance audit

**Scope:** documentary evidence, regression gates and integration-readiness handoff **only**. No production enablement, code attachment, merge, deployment, builder or asset registration, save migration, v0.11 unlock, or physical-iPhone test. Gate A remains v0.10. All M0–M7 candidate behavior stays detached.

## Entry gate, exact verified sources

- **PR:** [#186](https://github.com/hdog960/Mythwrought/pull/186), branch `creative-mode-roadmap9-m0-20261115`, **draft / open / unmerged** at entry.
- **Exact M7 PR head:** `74c75e548b31406ccd68a1c8d07c1215ab4cb24e`.
- **M7 CI:** [GitHub Actions #43791656990](https://github.com/hdog960/Mythwrought/actions/runs/43791656990), **completed: success**, including source CI and full 20-script WebGL2 gate. This is a GitHub Actions result, not a device test or full production integration test.
- **Main:** `e6bd7c173a4531ba7efc153e5f2eb89870c3b9db`; unchanged at entry. Branch is separate and does not publish to GitHub Pages.
- **PR changed files:** 59/59 exclusively `src/creative-mode/**`, `tests/creative-mode/**`, `tests/creative-mode-mN.test.mjs`, `docs/creative-mode/**`. No shared engine, CI, PWA, registry, physics, input, terrain, minimap, builder, block pack, automation, save schema or live branch changed by this feature PR.
- **Source provenance:** the GitHub tree for exact M7 head is `643821527c38ce73ada7118f70c7cf332c72c547`; 50 inherited source/test files have **50/50 matching exact Git blob SHA-1 values** in the feature-only M8 baseline manifest. Existing M0–M7 files are not changed in M8. Nine existing feature documents remain owned and preserved.

## Executed M0–M7 local regression evidence

Node.js 22.16.0: `node --test tests/creative-mode-m0.test.mjs ... tests/creative-mode-m7.test.mjs` (eight explicit bridge filenames): **128 passed / 0 failed**. M8 adds 15 separate native tests, so combined M0–M8 local count is **143 passed / 0 failed**. The M8 baseline test compares source bytes using the Git blob hashing format and checks the earlier 50 known files remain byte-identical.

Playwright under real headless system Chromium (actual DOM, simulated touch, CSS bounds and interaction; feature-only modules embedded as `data:` URLs):

| Lane | Passed Chromium assertions | Purpose |
| --- | ---: | --- |
| M1 | 220 | Explore/Creative UX, hotbar, grip rails, compact layout, map reservation, portrait |
| M2 | 160 | Four speed profiles, flight input, hover, safe region/landing fixture |
| M3 | 198 | 1,632 synthetic items, search, category+hotbar sync, virtual rows, touchscreen |
| M4 | 253 | Detached safe placement/removal, multi-cell shape and rotation, layout |
| M5 | 385 | Undo/redo, revisions, backup/corruption/quota simulation, memory-only saves |
| M6 | 475 | Fill, replace, line and plane, preview/commit, bounded edits, undo |
| M7 | 229 | Read-only search/filter/virtualization, mock approval and missing-dependency exclusion, source thumbnail |
| **Inherited total** | **1,920** | Seven suites independently completed, six landscape sizes; portrait checks in inherited suites |
| **M8 offline supplement** | **116** | Chromium with `offline=True` and all external requests aborted: six M7 layouts, two M5 memory-history layouts |
| **Total local Chromium** | **2,036** | Browser assertions from independently completed scripts; not a hardware result |

**Audit note:** A prior local M3 zip contained seven stale source/test blobs and yielded only 186 assertions. The M8 audit reconciled **all seven** to exact GitHub M7-head blob SHA-1; the exact source M3 browser suite then passed **198 assertions**. Do not use the stale 1,908 local snapshot total; 1,920 is the corrected exact-source inherited total.

Viewport set: **568×320, 667×375, 844×390, 932×430, 956×440, 1180×520** CSS pixels. Portrait rotation UI also checked where applicable. Screen captures are under `artifacts/creative-mode/` in the local testing environment, notably `m8-offline-blueprints-568x320.png`, `m8-offline-blueprints-956x440.png`, and `m8-offline-history-956x440.png`. They show actual source HTML/CSS/JS in Chromium. Screenshots are supporting evidence, not proof of physical-iPhone quality or real in-game WebGL2 performance.

## Acceptance verdict

**M0–M7 detached candidates: PASS for isolated regression and ownership. M8 documentation/handoff: candidate ready for exact-head CI review. Production integration: NOT APPROVED / NOT READY.** The release remains unchanged. A green M8 CI only accepts documentation/feature tests; it does not authorize merge or live-world attachment. New PR-head CI must be verified separately after this M8 commit.

Feature-specific findings:

1. **Controls/UI:** M1/M2 landscape rail separation and upper-right map reservation validated in Chromium. They are not connected to production `src/input.mjs`, camera or minimap; no hardware iPhone gesture/latency evidence.
2. **Flight:** M2 simulates four speed profiles, readiness and bounded prefetch (2 requests per frame, 6 pending). The simulated callbacks are **not** streaming/physics/collision authority; no real chunk loads, camera integration or 60 FPS guarantee.
3. **Inventory:** M3 requires the M0 registered-placeables guard and rejects ineligible/duplicated IDs; the **1,632 items are synthetic fixtures**, not current game assets. Source metadata/provenance strings alone are not trust or integration evidence. No block packs or biome130 candidates are registered here.
4. **Edits:** M4 and M6 plan atomic transactions in detached state; max 24 batch actions, shape/collision/support checks, 216 selection-cell cap and chunk-edge refresh **plans**. No production placement, actual mesh rebuilds or edit event transaction hookup.
5. **Undo/save:** M5 has deterministic in-memory schema-1-compatible envelopes, bounded 64-entry history, revision checks, primary/backup recovery tests and failure simulation. This **does not write, exercise or validate Mythwrought's actual schema-1 journaling, existing saves, or shaped-asset sidecars**. Its checksum detects accidental corruption; it does not authenticate third-party data.
6. **Blueprints:** M7 structurally screens up to 4,096 records and caps previews to 96 coordinate markers and list windows to 20 rows. All 300 supplied records are test fixtures (297 structurally accepted, 3 intentionally excluded). **Zero real blueprints are authenticated as creator-approved or dependency-resolved by this feature**, and there are no place/import/save actions in M7.
7. **Offline:** M8 confirms only that detached HTML/CSS/JS and memory-only interactions can run with Chromium network disabled when pre-injected. It **does not** verify installed PWA launch, service-worker caching/version upgrade, browser storage durability, reboot, or offline reload on an actual iPhone.

## Open blockers and non-negotiable conditions

- **B0 — Creator authorization:** Explicit separate approval for integration and eventual merge/deploy; v0.11 remains locked. M8 does not waive art/control Gate A.
- **B1 — Trusted runtime adapters:** Approved read-only and transactional ports from current `main` for controls/camera, live registered placeables, chunk readiness and prioritized bounded prefetch, physical support/collision/mesh refresh. Never trust an arbitrary `provenance` string from synthetic data.
- **B2 — Save ownership:** Single authoritative schema-1 and shaped-asset persistence path with ordered atomic batches, crash/quota/restart recovery, rollback, compatibility with existing iPhone worlds, no parallel Creative-only save bypass.
- **B3 — Real-world interaction/performance:** Physical construction and undo working in production WebGL2, chunk seams, context loss, latency/FPS under stress, safe landing, edge cases for object footprints and permissions.
- **B4 — Live iPhone/PWA:** Actual physical iPhone testing, landscape controls, soft-keyboard, safe-area notch/Home indicator, portrait rotation, installed Home Screen, offline restart, and manual creator acceptance.
- **B5 — Building blueprint authority:** Approved, merged, dependency-complete structure registry (currently **none proven**), block-family ABI resolution and provenance attestation. M7 remains empty for real structures until that separate evidence exists.

See [M8_INTEGRATION_HANDOFF.md](M8_INTEGRATION_HANDOFF.md) for owner-by-owner authorization gates and read-only source references. This feature PR intentionally remains **draft, unmerged, undeployed**; the eight builder PRs, five manual packs, biome130 lane, five automations and other protected development areas are out of scope.
