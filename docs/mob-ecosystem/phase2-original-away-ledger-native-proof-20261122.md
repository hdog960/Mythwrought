# MYTHWROUGHT Living Ecosystem — original six-second away-ledger acceptance contract

Date: 2026-11-22. Scope: isolated Mob Dev source-owned tests and documentation only. Release HOLD; no production gameplay modifications.

## Exact lineage and protected boundaries

Parent unreferenced detached source commit: `5d874d18dd5cfb5a0ff649e83c0238b680414091` (tree `dc01232e999cc19b3cde721da0d71ae63c66ecdd`). Protected production main `7016e14cd6289f45eaf7fc6a79a362b47996df65` and OPEN DRAFT unmerged PR #380 head `508209c5473d3d78668dd394eb6bcdf9e6bcff84` were independently verified once at session start and not updated.

Canonical original Git blobs examined and executed, with no edits to the class bodies:
- `src/mobs/ecology.mjs`: `b145ab48d5a993f0796b1b321ce2b0ba0a7e1b23` — original `PopulationManager` with private `#away`, `GRACE=6`, `INTERVAL=.5`, capped input seconds, residency and protection transitions.
- `src/mobs/engine.mjs`: `57721eb659b154ad93fd45182cc2bc70eb961d9c` — original `MobEngine`, actual spawn/transition/get/all methods.
- `src/mobs/ecosystem-reconcile-readiness.mjs`: `b2b0449be9588c2d9f5fa10a1cb2d41f85ea4f7e` — read-only original reconciliation HOLD boundary.

## Actual execution / source fidelity

The exact GitHub blob text of both original classes was loaded into controlled JavaScript V8 execution after removing only import/export syntax. Dependencies (species registry, movement callback, physical `volume/grounded/residentAt`, validPoint, sectionForY, supportedPosition) were controlled fixtures. Neither original class was modified. **10/10 controlled original-class lifecycle comparisons PASSED**: six initial cases (six-second exact limit, near reset, temporary protection and new grace, unload-while-near, zero regions due tick, one-second time clamp) and four further cases (independent multi-mob timers, protected glownewt, residency restoration, invalid time/observer). The original `MobEngine` and original private `PopulationManager.#away` logic executed synchronously in V8; no full original MYTHWROUGHT import graph, source-generated M7, or actual new natural births were run.

### Newly authored original-repository native contracts (UNRUN)

1. `tests/mob-ecosystem-original-away-ledger-contract.test.mjs` — ten Node `node:test` cases exercising real original `MobEngine` + `PopulationManager`: exact six-second time at t=6.5; near return resets grace; temporary protection clears away state; identity-protected glownewt survival; unloaded nearby expiry; residency restoration resets; zero-region reconcile; capping large seconds at one source second; invalid input; independent away timers for spatially separated creatures.
2. `tests/mob-ecosystem-original-away-reconcile-guard.test.mjs` — four Node `node:test` cases spanning the original manager and detached read-only `inspectOriginalReconcileReadiness`: far unprotected remains HOLD until original manager removes it; nearby return wakes and allows ready; identity-protected far mob stays conservatively HOLD because private away history cannot be inspected; unloaded nearby mob must remain HOLD.

Both authored files were `node --check` parsed under local Node v22.16.0 and have computed Git blob SHA-1 evidence. **They have NOT been executed against the complete MYTHWROUGHT dependency graph.** This distinction is mandatory: a V8 fixture controlled original class run cannot replace genuine original-package native CI or user iPhone original-game acceptance.

## Explicit source behavior / limitations

Original `#away` is private and cannot be reconstructed or directly read by a detached research inspector. The manager alone owns transitions, away start times, clearing upon return/protection, and removal. A read-only inspector MUST fail closed for pending `unprotected-away-ledger` or `protected-away-state`; it may report ready after real original manager actions leave no unresolved mob. Evidence is based on public engine snapshots, not a fabricated private ledger. No standalone research model may be treated as original spawning or persistence authority.

### Remaining acceptance gates

The original repository cannot be cloned here (`github.com` DNS resolution failure); connected MSI desktop is offline. **Next** obtain original source checkout and run focused `node --test tests/mob-ecosystem-original-away-ledger-contract.test.mjs tests/mob-ecosystem-original-away-reconcile-guard.test.mjs` plus previously authored source integration and direct original engine tests. Then original M7 3-seed/21-site physical biomes/caves, Schema-1+Pack2 saves, original true natural-birth counts, authoritative world edit revision and source observer, native full-repo regression, iPhone landscape WebGL2/performance, installed Home Screen offline PWA and separate required staged-worker version gate. Do not weaken required tests or call earlier old-head CI success proof of this detached commit.

Zero GitHub Actions/browser reruns, no new M7 world generation, no CI queue polling, no protected branch reference movement, merge, deployment, original MobEngine/PopulationManager production edits, or changes to other developers, builders, automations, Codex, settlements, biomes, caves, saves, PWA or workflows.
