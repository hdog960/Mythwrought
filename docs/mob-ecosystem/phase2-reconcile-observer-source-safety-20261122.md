# Living Ecosystem — original reconcile observer mutation guard
Date: 2026-11-22
Status: DETACHED SOURCE RESEARCH ONLY; no branch refs pushed, no live gameplay integration.

## Exact source defect

Prior detached original-source inspector `src/mobs/ecosystem-reconcile-readiness.mjs` used the caller's MUTABLE `observer` array to classify each original `MobEngine` entity before invoking `world.residentAt`. That callback, or `isProtected`/world revision callbacks, could rewrite observer coordinates without changing `world.revision()` or `MobEngine.all()` roster. The old inspector then reported `ready:true` from an outdated near/far evaluation, even though the now-current observer position required original manager dormancy/away-state reconciliation.

Authentic source-backed RED proof: exact original `MobEngine` class (Git blob `57721eb659b154ad93fd45182cc2bc70eb961d9c`) admitted an idle deer at [9,4,8]. Observer began [8,4,8], world residentAt callback moved caller observer to [100,4,8] while always returning true, source world revision stayed 0 and original engine roster stayed unchanged. Previous inspector Git blob `2f8be4afcbc60a2a75baf7d0b4e8c8c110be8b6f` incorrectly returned `ready:true`; deer was 91 blocks away from current observer. This was a controlled V8 evaluation of authentic original engine source, NOT original game/M7 generated terrain.

## Read-only source repair

First detached commit `654d0f5bdd622be39bf1ac374fee97b59178c94d` adds `src/mobs/ecosystem-reconcile-observer.mjs` and independent focused native tests. It snapshots a source-valid bounded original 3D observer, returns frozen private-WeakSet-branded read-only ticket, detects changed caller coordinates or forged tickets, and conservatively treats signed-zero changes as mutated. It does not move any mob, mutate world/save or implement `PopulationManager.#away`. A write then undo (ABA) between observations remains undetectable, just like the prior regional-input fence.

Second detached commit `7189351ea97189dec17d878d7640f682160de8d7` wires this immutable observer into `inspectOriginalReconcileReadiness`: takes snapshot BEFORE any source world revision/residency/protection callback, checks unchanged after initial revision read, uses ONLY the frozen 3D point for each 18-block distance test, and checks unchanged after authoritative world revision and full original MobEngine roster-integrity checks. It adds three authored original-reconcile native repository regression tests (residentAt callback, isProtected callback, world revision callback before residentAt) and one global source preflight regression test requiring same certified global clock reuse after a refusal. These four newly authored original-repo native tests are NOT yet executed.

## Tests actually executed

- Genuine local Node v22.16.0 `node --test`: **7/7 PASS** on exact standalone observer helper and independent tests. Exact local executed Git blobs verified against detached Git tree:
  - helper `1f97465f6ec296f88cb70c6854348d9a600a6f99`
  - test `8d4abec49131258efbb702518643572b4f60703d`
  Cases: source-compatible frozen observer; all axes; signed zero; invalid, out-of-bounds and nonfinite positions; forged token; getter changing coordinates during capture; documented ABA limitation.
- Controlled exact source V8: **8/8 PASS** with the unchanged original `MobEngine`, exact roster-integrity source, prior and fixed reconcile inspector, and latest exact observer helper. Old source RED false-safe reproduced; new source GREEN refusal of mutated residency, isProtected, world revision observer; baseline healthy awake, correct nearby dormant wake veto, far-away six-second private ledger HOLD, existing world edit/MobEngine mutation veto. Controlled original-like world callbacks, not genuine generated M7 terrain.
- Existing full native MYTHWROUGHT import graph and current 3-seed/21-site genuine original M7 source test remain UNRUN; full original checkout currently unavailable to local native test runner (github.com DNS restriction); no new original-world eligible-position totals or actual natural-birth measurements claimed.
- No GitHub Actions, Chromium/WebGL2 reruns, queue polling, duplicate original terrain generation, CI cancellation, branch push, merge, deployment, force push, production main/PR ref update or cross-lane edit.

## Mandatory integration/release HOLD

This research checks mutation and source-observer consistency; original `PopulationManager` retains sole actual responsibility for 18-block wake/dormancy and private six-second `#away` tracking/removal. It is NOT an authoritative live player-position ownership protocol, and must not be used to claim full source population equivalence. The original live edit revision must be authoritative (constant revision is not), original M7 caves, Schema-1 and Pack 2 saves, iPhone WebGL2/performance, installed Home Screen offline PWA must pass independent release gates. Historic old protected-head root Actions #44972148082 reported native 1760/1760 and original WebGL2 PASS, but overall root FAILED the separate staged offline PWA worker-version acceptance; this mandatory blocker was not waived. Old-head 161/504 original versus 227/504 M7-compatible physically eligible placements are CANDIDATES, not births. Historical seed179 original natural births 18/1308 attempts, mountain/enchanted 240/0 each, not new detached proof.

Production main `7016e14cd6289f45eaf7fc6a79a362b47996df65`, protected open draft PR #380 `508209c5473d3d78668dd394eb6bcdf9e6bcff84`, all original live ecology/world/saves/PWA, Codex, builders, other dev lanes, settlements and five hourly automations preserved.
