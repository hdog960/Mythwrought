# Builder 1A M3 Wave8 — five new source-authored hospitality buildings

This is an isolated draft candidate extension after verified Wave7 HEAD `67e5cb28d2625a0f6441015ff33cc9e4a727fc69`. No prior source object is modified.

- Snowglass Twin Court Feast House — snow large tavern, twin open-air H side courts, seven walkable rooms, seven independent roof wings.
- Saffron Moonwater Caravan Tavern — desert large tavern, broad asymmetric U courtyard with separate edge recess, five rooms, seven roof wings.
- Thornlumen Lantern Crosshouse — enchanted-forest medium tavern, offset T rear spine, five rooms and five roof wings.
- Primrose Twin Orchard Guesthouse — temperate medium inn, original double-garden H footprint with seven guest/service rooms.
- Rimegate Lantern Courtyard Lodge — snow large inn, deep U-court with a separate windbreak recess, five rooms and seven roof wings.

New exact-source geometric preflight: 5 original 3D designs, 86,269 occupied source voxel placements, 5,299 completely absent exterior foundation columns, 29 room volumes, 9 two-cell Pack5 unresolved bed footprints. These five compiled successfully with existing unchanged Blueprint schema, but **exact-head CI, producer AABB and WebGL2 browser certification are still pending**.

New proposed theoretical pool: 260/450 = 150 houses, 61 taverns, 49 inns; 190 remain (150 additional houses, 14 taverns, 26 inns). No candidates are approved or in-game. Required: 260-ID D4/strict IoU, full producer physical audit, 1392 Chromium source-cell PNGs and 1116 producer visibleBoxes AABB PNGs at 667×375 / 844×390 / 932×430, verified manifest hashes, actual visual inspection and physical iPhone later.

No merges, main rebase, runtime, world placement, shared renderer, manual Pack source changes, other builders/automations, schema-1 saves, deployment, or v0.11 unlock.

## Initial focused CI defects and exact-source repair

Isolated draft verifier PR #219 run #44196995339 correctly exposed two unreserved old blueprint IDs in Snowglass and Thornlumen and a forbidden >0.975 snow-house U silhouette overlap in Rimegate. Wave8 preserves all previous 255 full-object sources. Repair changes only new source indices (snow large tavern 003→001; enchanted medium tavern 004→001), and adds an actual 12×16 column rear-west void to Rimegate, moving its south window to the remaining physical exterior wall at x=16. Physical schema preflight passed for all five. Source diagnostic browser timeouts were caused by non-initializing duplicate-ID gallery and must be rerun; not pre-approved. Exact HEAD rerun pending.
