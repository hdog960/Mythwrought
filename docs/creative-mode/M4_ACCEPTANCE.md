# Roadmap 9 — M4 standalone safe building transaction evidence

**Scope:** exclusively owned `src/creative-mode/**`, `tests/creative-mode/**`, `tests/creative-mode-m4.test.mjs`, and `docs/creative-mode/**`. This is a standalone transaction **planner**, not production registration, placement, physics, mesh upload, live world mutation, chunk prefetch, save writing, or undo execution. v0.10 Gate A only; v0.11 stays locked.

## M4 detached contract

* Pure `build-model.mjs` uses ABI `mythwrought.creative.build-plan.v1` and M0 `validateRegisteredPlaceables`, with M3 typed stable IDs.
* Inputs: validated block/object records with explicit authored shape offsets, all required `isRegionReady`, `canEdit`, `canOccupy`, `canSupport` adapter callbacks, and an immutable synthetic build state.
* Block is a 1-cell footprint; shaped objects require 2–16 unique, 6-connected authored offsets with anchor (0,0,0), nonnegative `dy` and four tested D4 quarter rotations. The preview uses **two obviously synthetic** records, not production geometry.
* Every placement checks bounds, all occupied cells, region readiness, edit permission, shape collision, and bottom-foot support; removals act on entire multiblock objects and refuse to destabilize existing supported placements. Opaque adapter exceptions fail closed.
* **Atomic** batches: 1–24 requested operations, using staged state only. A failed step returns the identical original state, and there is no partial commit. Occupancy capped at 512 cells per detached test world. Revisioned returns are immutable candidate plans.
* Refresh plans are deterministic de-duplicated chunk keys, including orthogonal/diagonal neighbors of any touched chunk edge (negative coordinates covered), capped at 48. These are *suggested keys*, not a mesh refresh or world streaming request.
* Undo `inverseActions` are candidates in reverse order with source/expected revision preconditions. **No undo execution or persistence:** that's later scope. Direct runtime invocation of these mock callbacks is not proof of authoritative integration.

## Tests and device evidence

Run `node --test tests/creative-mode-m0.test.mjs tests/creative-mode-m1.test.mjs tests/creative-mode-m2.test.mjs tests/creative-mode-m3.test.mjs tests/creative-mode-m4.test.mjs` using Node 22.

Run `python3 tests/creative-mode/build-browser.py` for actual system Chromium (uses data URI injection because sandbox disallows localhost browser navigation): six landscape viewport sizes 568×320, 667×375, 844×390, 932×430, 956×440, 1180×520, plus 390×844 portrait. Browser test exercises the separate `src/creative-mode/build-preview.html` and scripts, physical DOM bounds, finger-safe rails, minimap reservation, placement and collision, four-cell object, rotation, removal, floating-block rejection, atomic batch failures and undo preview. Screenshot artifacts: `artifacts/creative-mode/m4-building-568x320.png` and `artifacts/creative-mode/m4-building-956x440.png` (local-only evidence, not PR source).

Retest M1–M3 Chrome suites unchanged: `python3 tests/creative-mode/preview-browser.py`, `python3 tests/creative-mode/flight-browser.py`, `python3 tests/creative-mode/inventory-browser.py`.

## Unresolved before production

No authoritative actual game/placeable adapter, source-authentic producer shape AABB, world collision and support validator, streaming/chunk refresh hooks, physics, save compatibility, verified production undo, M1 HUD integration, offline/physical-iPhone acceptance. A green Node/browser fixture result **does not** authorize merge, deployment or runtime enablement.

M5 next, after exact-head CI is green: separate save/undo/recovery candidate, using the approved schema-1 and shaped sidecar contract **without changing runtime files**. M4 remains draft and unmerged.
