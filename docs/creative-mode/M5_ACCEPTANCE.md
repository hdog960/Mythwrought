# Mythwrought Creative Builder Mode — M5 detached history/save acceptance

**Gate:** only after M4 exact-head CI `#43780081301` succeeded at `63f5de0f8c2cbff72c744e0cf2bcf31e58266774`. Existing PR #186 remains draft, unmerged, undeployed. M5 adds *only* Creative Mode-owned `src/`, `tests/`, and `docs/` paths. This document is not evidence of creator approval or physical iPhone testing.

## Executable history, not a stale inverse suggestion

`src/creative-mode/history-model.mjs` implements immutable `mythwrought.creative.history.v1`. Every action requires an exact expected revision and uses the actual M4 `planBuildBatch` validation checks on forward placement and undo/redo. Undo applies the inverse in reverse order, then compares full typed-ID/shape/rotation fingerprints with the original before state. Redo validates against the recorded after-state footprint. Any changed region, collision, support or edit-permission callback denies the entire transaction without consuming history. Revision increases monotonically through edits, undo and redo; a new edit after undo clears redo. The default history holds 32 transactions, with a hard limit of 64. All buffers and history action snapshots are frozen.

## Detached save format and failure recovery

`src/creative-mode/save-compat.mjs` serializes only the isolated M4 build state and bounded M5 history into `mythwrought.creative.detached-save.v1` with `compatibleWorldSchema: 1` and `owner: 'creative-standalone-only'`. This marker is a **compatibility contract, not a production schema-1 writer**. Source never imports the real save implementation or accesses `window.localStorage`, IndexedDB or the main game. Persisting a real world, save migration, sidecars and crash consistency across production assets remain **unapproved/unimplemented**.

Snapshot serialization has fixed field ordering, typed IDs, coordinate and orientation records and a non-cryptographic 64-bit checksum for accidental damage detection. Loading does not trust the checksum alone: it replays every physical placement through the M4 adapter contract, validates full cells/shape parity, checks revision and bounded-history shapes and refuses conflicting inventory or missing region/support/edit authority.

A caller-provided **detached** store with `read/write/remove` methods keeps a `pending` staging slot, last committed `primary`, and previous verified `backup`. A damaged primary is **never rotated into backup**. Loading prefers verified primary, then recovers a verified backup; pending alone cannot masquerade as a committed save. Simulated quota failures and crashes at staging, backup, primary and cleanup test explicit recovery behavior. A cleanup failure can still leave a fully committed primary; the API reports the uncertainty rather than claiming an impossible atomic disk guarantee. The preview uses only an in-memory test store; refreshing the preview loses its data.

## Playable preview scope and evidence

`src/creative-mode/history-preview.html` + CSS + MJS is a standalone feature-only lab. It displays synthetic stone and arch, revision/undo/redo counters, real executable undo/redo, deliberate stale revision conflict, memory-only SAVE/RELOAD, corruption/backup recovery, quota simulation and a reset that does not overwrite its checkpoint. Protected two-thumb rails and the upper-right map reservation remain. No world, inventory, minimap, live data, save key or runtime input is modified.

Native verification: `node --test tests/creative-mode-m0.test.mjs tests/creative-mode-m1.test.mjs tests/creative-mode-m2.test.mjs tests/creative-mode-m3.test.mjs tests/creative-mode-m4.test.mjs tests/creative-mode-m5.test.mjs`. M5 browser verification: `python3 tests/creative-mode/history-browser.py`, testing six landscape sizes and portrait via genuine system Chromium DOM/touch-compatible navigation. All browser modules are the actual feature files in data URLs (test harness cannot reach external sites), not CSS-only mocks. Preserve and rerun M1–M4 regression scripts. CI exact-head run for the M5 commit is a *separate, mandatory* gate; report its status without claiming green prematurely.

## Integration blockers and next milestone

- M0 port contract does not yet connect to authoritative registered-placeables or a production adapter; real collision/chunk placement is unavailable.
- The detached store is memory-only; no schema-1 game save migration, crash-safe production journal, nor sidecar ownership authorization exists.
- No real terrain rollback, object deletion, mesh refresh, chunk streaming, iPhone device perf, offline save persistence or world integration is claimed.
- Next roadmap step may be optional M6 mass-building tools or M7 accepted blueprint browser after exact-head M5 CI and explicit roadmap direction; M8 needs production integration approval for actual live acceptance. Neither should overwrite the isolated base or production ownership.
