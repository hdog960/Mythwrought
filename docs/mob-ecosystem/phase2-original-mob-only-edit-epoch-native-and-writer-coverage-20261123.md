# MYTHWROUGHT Living Ecosystem — Mob-only monotonic source-edit epoch, native Node acceptance, and writer coverage HOLD

2026-11-23. **New isolated source engineering; release HOLD.** No main/PR branch update, merge, deployment, GitHub Actions, alteration to other developers, Codex, settlements, builder lanes, biome/cave lanes, or five hourly automations.

## Exact ancestry / protected state

Start from the independently verified **unreferenced detached** commit `42d745c738a8af05c56a6dca0c68fe58537ec8df`, direct parent `de45beae3bfbf89359f45901e31eeb3a55e154df`, tree `7db1f96fab82420eaf46900b05d0aede9f5eeda6`. Start-of-session ref check: externally advanced production main remains `db4bbcc32156e5df311f733bcaa53d559c17313b`; OPEN DRAFT PR #380 remains `508209c5473d3d78668dd394eb6bcdf9e6bcff84`, unmerged, its PR base metadata still records historical `7016e14cd6289f45eaf7fc6a79a362b47996df65`. These refs must not be reset or changed. MSI desktop OFFLINE; direct local `git ls-remote https://github.com/hdog960/Mythwrought.git HEAD` fails GitHub DNS. The complete original checkout and actual full original import graph remain unavailable.

## Why this is needed: absence of actual world-edit version

The prior detached `src/mobs/live-game.mjs` has an opt-in `sourceRevision` argument forwarding a trusted synchronous callback into the original `createMobHostView`, but the existing main-game host supplies none. The fallback `()=>world.editRevision||0` reads zero on genuine `VoxelWorld` and `Pack2LiveWorld` as neither defines `editRevision`; **zero is not a world-edit witness**. The MobHost post-supplier fence and original `spawnEligible` source-change veto only detect edits if they receive an actual revision that advances. This work does not misrepresent their current production effectiveness.

Actual source audit with exact independently inspected production-main Git blobs:
- `src/main.mjs` `3768eb68bc2951dd7e6f41490720a9b4c6616a87` invokes original `createLiveMobSession({world,...})` without a sourceRevision callback. Gameplay editing branches include source voxel/Pack2 physical mutations, Pack5 builder placement/removal, manual shaped block place/remove, Pack3 mutate, and staged non-block scenery removal. Additional localhost-only `editBiomeCell` and `placeFixture` methods write `world.set` and fixture rollback can write a second time.
- `src/voxel.mjs` external-main blob `a475ba9c195e6dd4bc5a97284dbff5f2c37936a4`: `VoxelWorld.set` writes original `edits` and rotations, may accept environmental IDs 400–410, and does not publish a monotonic editRevision.
- `src/pack2-world.mjs` original blob `e8326c3ddb264a1e44985cd6d265ff0970b86467`: `Pack2LiveWorld.set` may alter overlay cells or delegate to `base.set`; `placePack2` delegates to `set`; `updatePack2State` directly writes a shape/water overlay state. A sole hook on `world.set` would MISS the latter when invoked directly, and Pack3/5/manual14 overlays are separate objects.

This is a **partial identified write-path inventory**, not a proven exhaustive audit. The actual historical 3-seed/21-site generated M7 native test blob `ca55529ae610637da8507f2e3d9ab6a22b8bb313` is still UNRUN and must not be declared accepted.

## Substantive new Mob-only code (no world source edits)

`src/mobs/source-edit-epoch.mjs` original **new Git blob `1da8c0b736472a521936d242ea496e2d6e662d95`** is a tiny ESM module with no imports:
- `createMobSourceEditEpoch(initialRevision=0)` validates a nonnegative safe integer and returns a frozen API `{revision,recordAcceptedEdit}`.
- `revision()` synchronously reads the current integer without world scanning, save serialization, allocations, external dependencies or mutation of terrain.
- `recordAcceptedEdit(accepted)` requires a **strict boolean**. A `false` rejected write leaves the epoch unchanged; a confirmed `true` write increments by one monotonically; overflow throws before wrapping.
- A successful change followed by a successful reversal **increments twice**, unlike comparing snapshots that could miss change-and-revert (ABA).
- The module **does not patch `world.set`**, change `VoxelWorld`, Pack2, Pak3/5, main game, native saves, chunk streamer or mob behavior. It is NOT automatically wired to any real writer. An unrecorded world change leaves this epoch unchanged by design. The API cannot certify production integrity until all relevant owners explicitly report their successful changes and the game host supplies `sourceRevision:clock.revision`. There is no automatic way to infer writer coverage merely from creating the ledger.

## Native Node evidence — real ESM, not controlled V8

New `tests/mob-ecosystem-source-edit-epoch-native.test.mjs` Git blob `3df1baa45cb79b20b56b9212aaf868e99299fa0c` is import-complete with only standard `node:test`, `node:assert/strict`, and the new module. **Real Node v22.16.0 `node --check` passed on both exact local files; real Node v22.16.0 `node --test tests/mob-ecosystem-source-edit-epoch-native.test.mjs` PASS 10/10, 0 failures.** Exact local `git hash-object` matches both created GitHub blobs byte-for-byte. The native tests check frozen API, 1000 accepted monotonic writes, rejected writes, malformed outcomes, initial epoch bounds, maximum-safe-integer overflow, explicit edit-restore being two writes, the intentionally UNCERTIFIED unreported-write case, stable synchronous callback and inability to mutate/reset a frozen API.

**Scope:** This is full native Node ESM for the **new pure helper** only, not full original-repository MobEngine/PopulationManager/M7 imports, not generated M7 terrain, browser, iPhone, native game save, PWA or original six-second #away acceptance. No preexisting 384-case synthetic original spawning suite was rerun redundantly.

## External owner-coordination prerequisites — not implemented here

1. In a later separately authorized integration, inventory every actual gameplay and fixture mutation path, including physical voxel edits, direct Pack2 state updates, Pack3, Pack5, manual14, staged environment geometry, restores and external background writes. Identify which modifications affect mob-observed geometry and which merely change unrelated UI/media.
2. Only after an **original owner returns a confirmed edit result**, report the edit epoch exactly once per source-changing operation, including accepted reversible edits; avoid double-reporting `placePack2` and delegated `set`. All sources of mob-visible terrain changes must be accounted for, including any world swap that requires a fresh epoch. Do not monkey-patch original set methods.
3. Wire `sourceRevision:epoch.revision` into the original live session at a game integration call site **only with full owner permission**; do not change main or source world owners now, and do not present an unwired ledger as authoritatively protective. Validate cache invalidation/edit-read race handling and original save backup semantics.
4. Run targeted exact-original native `node --test` for this helper and existing revision/host/spawn/collision/away tests in genuine checkout, plus actual generated 3-seed/21-site M7 natural birth/cave/Pack2 source checks. Measure actual iPhone landscape WebGL2 frame p95, installed Home Screen offline PWA and staged-worker update. Reuse exact-head CI evidence; do not launch redundant broad suites.

**RELEASE HOLD.** No claims of full original native M7 acceptance or production revision protection.
