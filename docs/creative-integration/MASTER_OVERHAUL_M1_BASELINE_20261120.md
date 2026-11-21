# Creative overhaul — M1 verified production baseline (2026-11-20)

Development branch: `feature/creative-inventory-menu-current-world-20261120` (from production `8de40ca8451b6268cfdfefaa5d9a66b72caca799`). This branch MUST remain a draft PR until creator approval.

## Actual release foundation
- Released main includes the five-system RC11: V6 balanced five-biome generation, cave runtime, S0–S6 three-moon sky, 40 live mobs and REC.
- Current player startup uses `src/main.mjs`: selected seed defaults to 179 and legacy seeds can still open. **This is incompatible with the requested current-only world policy.**
- Verified current released new-world generator: `M6_BALANCED_GENERATOR = 'mythwrought-five-surface-regions-v6'`. Explicit new worlds currently call `planM2WorldChoice(..., M2_WORLD_MODE.CREATE_BALANCED_V6, {confirmed:true})`, `openM2World` and `saveM2World`.
- World data remains schema-1 canonical edits (original `worldSlotKey(seed)`) with integrity journal and previous-good backup; biome identity is a separate verified profile. Pack 2, Pack 1/4, Pack 3, Pack 5, sky, cave and creatures have independent save/read paths. **Do not overwrite, migrate by relabeling or delete these.**
- `src/creative-integration/registry-snapshot.mjs` is a read-only G1 snapshot from `BUILD_MATERIALS`: 5 core building IDs, 130 registered biome IDs and Pack 2 entries except fluid lacking certified selection adapter. This is NOT a complete placement registry.
- Existing real placement surfaces also include manually registered Pack 1/4 assets, Pack 3 geometry and an opt-in Pack 5 layer. Each needs its owning adapter and lossless save.
- `src/mobs/species.mjs` registers exactly **40 live species (20 passive, 20 hostile)**. `src/mobs/live-game.mjs` hosts the real `MobEngine` and checksummed roster. Spawn items must use this host, not a preview substitute.
- Creative G2 flight already supports physical landing, two-thumb vertical controls, readied GPU sections and profile `travel:15`. Its current menu exposes four profiles; creator requires a single actual speed 15 beside REC.
- Main menu is `#help` and contains vital dormant backing controls: pack palettes, world generation selectors, save/import/export, vault, mirror, accessibility/performance preferences, diagnostics and app updater. Do not delete DOM nodes until their listeners and replacements are proven.
- Existing Home Screen identity: `manifest.webmanifest`, app icon, `sw-m5.js`, `GAME_RELEASE` and release-pinned resource URLs. Do not modify cache/version identity before full release approval.

## Integration sequence and safeguards
1. Build a production-owned **complete item authority** with source-specific place/place-remove adapters (block IDs, manually shaped IDs, stateful Pack2, Pack5) and explicit omission reasons. Validate collision/ID ownership; no candidate-only assets.
2. Introduce an isolated player menu while retaining existing hidden dev UI until all internal adapters are replaced. Player menu only: Copy Test Code, Day/Night, New World. Keep opt-in accessibility/storage recovery available via a safe route without cluttering the three-action menu.
3. Expose Creative toggle adjacent to REC, require actual flight speed=15, and build thumb-safe searchable inventory/hotbar. Preserve MINE/PLACE outside flight and vertical UP/DOWN in flight.
4. Derive spawn tokens from `speciesRegistry` (not a duplicated list), validate physical clearance/resident chunks and population budgets, require real `MobEngine` plus saved roster continuity.
5. Make V6 current-generation authority explicit and versioned independently from game release, schema-1, catalog and mobs. New world uses fresh protected seed and never an obsolete selector. Existing unversioned/legacy worlds are preserved in place and prevented from silently entering current-only play; recover through safe export/archival without deletion. Offline means newest accepted release **installed** on device.
6. Validate actual 667x375, 844x390, 932x430, 956x440 gameplay; WebGL2, iOS landscape layout, true edit/save/reload, REC, offline same-install updates. Confirm exact-head Actions and genuine artifacts.

### Initial risks — not yet closed
- Existing auto-open of legacy seed 179.
- Existing global menu bound to hidden controls.
- G1 inventory registry excludes Pack 1/3/4/5 and physical Pack2 water.
- Mob engine spawn defaults to transient behavior; deliberate Creative mobs need verified persistence policy.
- Full WebGL2 and iPhone acceptance not yet run for this branch.

All work is isolated; no production merge or deployment. This is an audit/checkpoint, **not** evidence that M1–M6 are complete.
