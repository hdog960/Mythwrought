# Mythwrought Cave Roadmap #240 — C7 release gate / C8 iPhone acceptance

**Status:** DRAFT ONLY. No production merge or Pages deployment authorized. This is a checklist for the actual cave integration, not evidence that the currently installed Home Screen app has the new caves.

**Verified exact-head starting point (2026-11-18):** integration PR #243 `53fbfe883f8fd4e17b7f4d3184f75150250ab168`, production main `e9223217ef1e91d282900c3fc13a21eeda316b63`. Eight workflows SUCCESS, including 12/12 CI contracts, 1,272/1,272 repository native tests, 20 real WebGL2 scripts, four-seed physical cave tests, real original-game 12 PNGs, source-authored 21 PNGs, and real **offline** original-game Chromium with 219 files cached, the real original WebGL2 renderer and saved Cave World loaded after network disconnect. All screenshots are Chromium, **not hardware iPhone**. Subsequent branch commits require their own exact-head verification.

## Source and safety gates before even considering production

1. Recheck the **current main SHA, 74-path PR diff, ownership, intact historical source PRs and builders**, and compare the deployed Pages JS to the intended merged SHA. No stale file on a protected builder lane.
2. Verify isolated full CI, four-seed producer/native/true physics walk, actual `index.html` WebGL2 captures, 10× depth, manual packs, Pack3 compatibility, and offline workflow **all at one frozen exact HEAD**. Inspect job logs and artifact SHA-256 manifest, not a prior HEAD or screenshots alone.
3. Preserve old main schema-1, ordinary seeded saves and backup/journal bytes. Only **explicit CREATE/LOAD CAVE WORLD** may allocate cave-specific `mythwrought-caves-v1-seed-N` localStorage records; untouched normal worlds must remain absent if absent before cave selection. Damaged primary/journal must fail closed and preserve raw bytes for export.
4. Refuse a Cave World seed that contains **any canonical, Pack2, Pack1/4, Pack3, or Pack5 saved data**. Normal-world vault, mirror and shaped-builder import/restore must not write into a Cave World profile. In new Cave World the supported editing contract is ordinary voxel mining/placing only until shaped overlays gain their own separately tested cave-specific storage.
5. **Versioned/cache-integrity candidate requires exact-head verification:** staging proposed worker now uses a unique source-snapshot revision derived from integration HEAD `08e11c402ca5a2da23790f8fe8eeab46bdf6bae1`, validates Git blob hashes for **217/219 static assets** before marking the offline cache ready (excluding its own worker and manifest to avoid circular content hashes), and retains a previous-good complete cache for safe update fallback. Its sourceHead names the frozen source *snapshot* being verified—not the later integration commit containing only manifest/worker/test changes. Before a production merge, re-freeze all public source assets at the actually approved source candidate, regenerate both worker revision and all content identities, and verify online-to-offline plus interrupted-update rollback at that exact release HEAD.
6. No Game Gate v0.11 unlock, new mobs/crafting, automated task rewrites, builder merges, or independent non-block integration changes as part of cave release. An unavailable or conflicting cave must be discussed and either fixed or creator-approved as a named exception.

## C3–C6 physical gameplay checklist

- Four surface-entry routes are independently discoverable with original topography protected. Confirm a real player reaches all four rather than relying only on per-location camera teleport.
- Walk from the surface to the lowest spiral and return using `stepPlayer` (already proven in staging: **849-point route, 1,696 walking legs, 29,416 real physics frames, lowest Y≈−208**), plus branch corridors for each of four lateral vaults at −30, −75, −130 and −185.
- Enter Windcut and Hollowbend upper networks; identify the archived :36 named side chambers and Bedrock Whisper without deleting or silently merging source locations.
- Historic PR #147 East Gallery may be relocated only in the explicit new cave profile where its old site would seal the older South Gallery. Preserve the original 35-cell chamber geometry, old North/South/West corridors, seeded legacy landmarks and player edits.
- Mine/place at representative deep levels, save, reload, walk again and check real deep surface/section mesh, raycast, collision, orientation and supported floor.
- Record real Chromium **software** renderer frame intervals and pixel/mesh counts at 667×375, 844×390 and 932×430. These frame observations are **not physical Safari frame-rate certification**. Verify the unchanged two-thumb MOVE/LOOK rails, MINE/PLACE/JUMP and map remain accessible, no clipped controls.

## C7 safe publication and rollback — NOT AUTHORIZED YET

1. Obtain explicit creator approval naming final PR #243 HEAD and acknowledging the GitHub Pages deploy from main. A green draft PR alone is **not merge permission**.
2. Immediately before merge, export ordinary-world JSON and separately verified Cave World JSON. Verify the pristine production SHA, open independent PR heads, branch-only path scope, static file/worker cache version and all green receipts.
3. Merge only the explicitly approved commit. Verify merged-main workflow, GitHub Pages deployment status and public browser-loaded `src/main.mjs`/cave modules against the intended commit. If Pages does not serve these exact files, **stop and report**; do not call it published.
4. On failure, rollback only the cave deployment using a safe revert/new corrected commit after evaluating the full current main diff. Never delete `mythwrought-caves-v1-seed-*` user keys, canonical saves, existing builder overlays or archived cave PRs. Existing cave data may become temporarily unopenable after revert; keep its bytes intact until the repaired version can restore them.
5. Workers/cache: don't simply erase browser site data or user storage. Version the cave-specific public static cache; retain the previous verified release cache until successful new offline acceptance. Service-worker changes require an online migration and actual offline reload check.

## C8 physical iPhone Home Screen acceptance (creator must perform)

Use the **installed Home Screen shortcut on an actual iPhone**, landscape. Record the device/iOS/Safari version, game SHA/build, date, viewport, storage availability, Wi-Fi/cellular connectivity, and selected Cave World seed. Do not assume screenshots from a Chromium emulator prove Safari hardware.

- [ ] Open the existing Home Screen icon while online; confirm the normal saved world still opens, saved buildings and minimap intact, MOVE/LOOK/JUMP/MINE/PLACE respond to two thumbs.
- [ ] Choose a never-used seed, explicitly **CREATE NEW CAVE WORLD**, confirm separate cave status and spawn beside a supported entrance. An existing ordinary seed or one with Pack1/4/3/5 builds must be refused without modifying any bytes.
- [ ] Walk naturally into the entrance, visit shallow and deep sections, 4 vault corridors and named cave branches, turn back and surface without debug teleport. If climbing/descending is awkward or blocked, stop and note coordinates.
- [ ] Mine and place deepstone in Cave World, SAVE, close/force-quit Home Screen app, reopen and explicitly LOAD SAVED CAVE WORLD; confirm edit restored. Then return to an ordinary seed and compare its save/builds.
- [ ] Download separate Cave World JSON; test normal-world vault/mirror/Pack5 actions are clearly blocked while in Cave World; ensure existing backup UI is still fully functional in ordinary worlds.
- [ ] Wait for **OFFLINE ASSETS VERIFIED**, disable network connections, force quit and relaunch the installed Home Screen icon offline; explicitly load Cave World, walk, mine, SAVE and reload again. If anything fails, **do not clear Safari website data**; reconnect for a safe export and report.
- [ ] Run Gate A device diagnostics after traversing real depths; capture frame p50/p95/worst, mesh upload/loaded chunk figures, WebGL context losses, orientation and touch-grip safety. Compare to the old Gate A baseline; no invented iPhone FPS claim.
- [ ] Re-enable network; verify original normal-world edit, cave-specific JSON and offline cache work without changes to separate builder saves.

**C9 remains OPEN** until all historical distinct cave features are visibly playable in the published Home Screen version, or the creator approves a precise documented exception. Keep issue #240 open until then.
