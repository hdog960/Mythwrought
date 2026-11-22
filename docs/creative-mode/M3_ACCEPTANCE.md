# Roadmap 9 — M3 detached registered-placeables inventory acceptance

**Prerequisite:** M2 PR #186 HEAD ff76b17e0b121c2807ec7d1360f61cfbb1528c4e passed exact-head GitHub Actions #43773766316, including the full 20-script WebGL2 gate. PR remained draft, 18/18 paths Creative-owned, and main unchanged.

## M3 feature-local implementation

- Pure inventory-model.mjs uses M0 validateRegisteredPlaceables as its only eligibility guard. Stable typed IDs, duplicate rejection (not silent deduplication), category/name/ID search, dynamic categories, selected-slot hotbar and safe replacement of vanished IDs. The future provenance-gated readLiveRegisteredPort is NOT attached.
- inventory-fixture.mjs generates **1,632 synthetic contract rows** across five categories. They structurally meet the test ABI but **are not live, registered Mythwrought assets or placeable game blocks**; display labels and assignment messages explicitly say mock, not live and not placeable.
- The isolated preview retains M1 sample inventory and M2 flight. The additional REGISTRY LAB view uses a fixed-height, two-column virtual scroller with bounded overscan rather than 1,632 DOM nodes. Filter, scroll, touchscreen assignment and hotbar selection are functional in Chromium. Protected two-thumb rails and the upper-right minimap reservation stay untouched.

## Focused evidence

Node 22: node --test tests/creative-mode-m0.test.mjs tests/creative-mode-m1.test.mjs tests/creative-mode-m2.test.mjs tests/creative-mode-m3.test.mjs. Prior local M3 acceptance: 39/39 tests including a 5,600-row filter/virtualization performance sanity check. Chromium (feature-only page via Playwright + system Chromium, no live game): original M1 220 browser assertions, M2 160 assertions, M3 198 assertions across six landscape widths 568x320 to 1180x520. M3 includes actual touchscreen.tap interaction. These are independent local test results; **the new exact-head GitHub CI must be verified separately after commit**. Screenshots generated locally and not included in PR.

## Restrictions and next gate

No production registry, shared source, world edits, saves, builders, manual block packs, automated biome130, five automations, main, deployment or v0.11 changes. The runtime authority and real edit transaction remain unavailable. The shape/provenance guards are contracts, not proof of current authoritative runtime registration. Physical-iPhone testing is **not claimed**. M4 may begin only after M3 exact-head CI is fully green and exclusive ownership verified, as a detached bounded editing transaction candidate pending runtime integration approval.
