# Block Pack 2 — coordinated five-pack final integration handoff

**Status: IN PROGRESS — NOT YET READY FOR FINAL INTEGRATION.** This document is the authoritative Pack 2-owned handoff under the creator's 2026-11-15 instruction. Do not merge or deploy Pack 2 independently. Any earlier approval to work on a Pack 2-only integration meant its isolated **draft development**, not permission to ship it separately.

## Preserved work

- Creator-approved physical Pack 2 candidates: **18/18** in source-only draft [PR #114](https://github.com/hdog960/Mythwrought/pull/114), source-exact head \`4367fd471b302339480cb8e17f6172ada19b1238\`. Authored block IDs **59–76** remain provisional and unique, with different shapes for slabs/stairs, transparent passable water, timber/stone textures, directional states, hinges and true bridge rail/gate voids. Artwork approval is recorded on PR #114.
- The already-developed real playable-game adapter and independent persistence sidecar are preserved on unmerged draft [PR #146](https://github.com/hdog960/Mythwrought/pull/146). Its staged runtime includes source-exact WebGL2 chunk meshes, fluid pass, AABB collision/targeting, player placement and selection controls, hinge state, rollback, and backwards-safe schema-1 world handling.
- Source-authentic evidence predating the new builder work: **99/99 Pack 2 focused native, 425/425 root native**, **66 source-authentic gallery screenshots**, **18 real in-game WebGL2 candidate screenshots**, three landscape views, three deep-world views, and 438+ complete native tests through CI. These remain valid for their original exact heads; current-head runs must be checked separately.
- Paired headless Chromium/SwiftShader original-block versus Pack 2 benchmark [#43718813344](https://github.com/hdog960/Mythwrought/actions/runs/43718813344): no isolated systematic Pack 2 overhead established; both original and Pack 2 full-chunk remesh edits show occasional substantial stall durations. **Not a physical iPhone performance certification**.

## Deterministic builder dependency ABI

New Pack 2-exclusive interface \`src/builder-assets/pack2.mjs\` exports:

- \`PACK2_BUILDER_SYMBOLS\` — 18 symbolic roster keys \`pack2:013\` through \`pack2:022\`, and \`pack2:039\` through \`pack2:046\`; these are distinct from numeric provisional production IDs 59–76.
- \`resolvePack2BuilderAsset(symbol,orientation,configuration)\` — fail-closed physical source resolver. Supports only certified rotations (fixed north, 2-turn or 4-turn as appropriate), source-defined upper/lower stairs and slabs, gate/door/trapdoor hinge state, rail/stone drain/boardwalk variants, and genuine passable sloped water with level/flow metadata.
- \`planPack2BuilderStructure(placements,{origin,maxCells})\` — read-only deterministic construction plan with translated actual physical AABBs, fluid volumes kept separate from solid collision, strict unique-cell and state validation. It **does not** place a building, register an ID, write to saves, or alter any other pack.
- \`PACK2_BUILDER_AVAILABILITY\` marks the approved physical source as builder-usable but explicitly **not yet registered or live-placeable** in a deployed game. The planned interface aligns conceptually with the independent existing Pack 3 symbolic builder approach while making no changes to its implementation or files.
- \`tests/pack2-builder-assets.test.mjs\` contains source-exact symbol/geometry/orientation/rejection, blueprint and sidecar round-trip checks, plus a **256-cell mixed village-footprint construction stress** test. Each test verifies that original schema-1 saves remain unchanged.

## Remaining Pack 2 technical gates — do not declare ready prematurely

1. **Exact-head acceptance:** wait for production-native, true WebGL2 and depth CI including the latest builder and 256-cell stress tests; inspect failures and evidence. The earlier green runs cover earlier commits, not future work.
2. **Dense construction on a physical iPhone:** profile real 25-chunk streaming, production scene placement/rotation, independent save sidecar recovery, memory, frame p50/p95, input response and two-thumb usability with realistic mixed Pack 2 construction. The headless SwiftShader budget does **not** replace physical-device evidence.
3. **Builder usage:** verify deterministic geometry, correct orientations and support/placement checks for representative village, town and city blueprints. Only after all five packs are ready can the integrator test cross-pack dependencies, de-duplicate final IDs and build the coordinated registration/palette. No separate Pack 2 production placement is authorized.
4. **Scoped behavior policies:** water ID 76 is transparent, passable, targetable and statically placeable, but full fluid propagation and swimming are unimplemented; gravel ID 69 is physically authored but automatic falling behavior is not implemented. Record explicit integrator-owned policy or future-feature exclusions before claiming these as complete gameplay.
5. **Release preservation:** do not change other manual packs, automation lanes, unrelated building maps, existing seeds/saves, Gate A, or locked v0.11. Do not merge PR #114 or #146, flip draft to ready, or deploy outside the explicit five-pack integrator command.

**Readiness declaration:** use exactly **“BLOCK PACK 2 — READY FOR FINAL INTEGRATION.”** only after the above Pack 2 technical acceptance gates are supported by exact-head evidence and documented scoped exclusions. Such a declaration is not deployment authorization.
