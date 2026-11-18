# Builder 1A M0 — isolated setup and exact-source inheritance ledger

**Status:** M0 scaffold committed; legacy coordinate migration and M0 physical parity remain **OPEN**. This is a DRAFT-only theoretical building lane. No gameplay/asset registration, merge or deployment.

## Verified prerequisite and base
- PR [#178](https://github.com/hdog960/Mythwrought/pull/178) merged by creator authorization as `e6bd7c173a4531ba7efc153e5f2eb89870c3b9db`. Infrastructure exact candidate head `7f7431f97a137c89d900735758b3cd2d183ea47b` passed Actions [#43762245025](https://github.com/hdog960/Mythwrought/actions/runs/43762245025), full 20-script gate.
- Branch fork: verified `main` at `e6bd7c173a4531ba7efc153e5f2eb89870c3b9db`. Last documented integration checkpoint is **009**. Neither this document nor infrastructure merge grants actual physical-iPhone approval.
- Original [PR #121](https://github.com/hdog960/Mythwrought/pull/121) remains draft, unmerged and read only; head `88a9e410a0eda7cf961cb6b624241666eb3a48a1`.
- Sibling originals #122/#123/#124 remain draft/unmerged. Eight-lane roster assigns 1A houses/taverns/inns only; 1B owns stables, so no stable code or IDs are inherited into 1A.

## Planned vs actually committed
| Category | Quota | Legacy identified | Geometry migrated | New geometry committed | Creator-accepted | Integrated |
|---|---:|---:|---:|---:|---:|---:|
| Houses | 300 | 15 | 0 | 0 | 0 | 0 |
| Taverns | 75 | 15 | 0 | 0 | 0 | 0 |
| Inns | 75 | 0 | 0 | 0 | 0 | 0 |
| **Total** | **450** | **30** | **0** | **0** | **0** | **0** |

There are 420 genuinely new designs to author, plus 30 legacy geometries to import and prove equivalent. The 450 manifest slots are **not** 450 authored buildings. Exact original identity pattern: `r1:<category>:<biome>:<size>:<ordinal>`, where old source uses small 001, medium 002 and large 003 for each of the house/tavern × 5-biome cells.

## Immutable original candidate provenance for M1
- Original design module `src/building-pool/roadmap-1/m1-designs.mjs`: blob `f9d45b0b17cbc217fd24cba5f684eb54aa572cd5`.
- Original constructor `src/building-pool/roadmap-1/m1-buildings.mjs`: blob `7187753ae344217d7fa81da296b9122b68f3ca97`.
- Original schema `src/building-pool/roadmap-1/schema.mjs`: blob `ea1cb53b48dd7f4c51c8da69bf59531d1226aad2`.
- **M1 MUST** extract only house/tavern geometries, not 1B stables; validate each of 30 individual 3D placement, room, walkable, portal and dependency records against the unchanged original head; record original-ID → owned-module → structural fingerprint; replay isolated native Node tests. Do not call a module blob SHA a per-building structural fingerprint.
- Preserve the three real daylight-aperture holes (forest medium House, small Tavern and 1B-owned Stable) in their respective owners. 1A only imports its two. Existing source flags roof load, weather sealing, glass rotation, physical roof geometry and user visual approval as unresolved.

## Integration boundaries
- Merged manual five-pack source exposes 96 family symbols/106 physical variants via `src/builder-assets/manual-five-pack.mjs`. That bridge is not a world writer. Do not assume legacy symbolic occupancy fits current AABBs; reconcile variant/orientation/state/support and cell reservations later.
- Automated biome130 remains independently owned; unresolved `biome130:NNN` refs cannot be treated as live. Never assign new persistent numeric IDs or alter schema-1.
- Only `src/building-pool/roadmap-1a/`, `tests/building-pool/roadmap-1a/` and `docs/building-pool/roadmap-1a/` may change. Do not update shared runtime, other lanes, five automations, original PRs, CI, or main.

## Acceptance gates still open
1. Review the new exact-head CI focused lane checks. Native tests written in 1A must run in actual Node; prior original 85/85 cannot be claimed as 1A passes.
2. M1 original geometry migration and 30/30 per-building parity; genuine authored footprint/room/circulation/support integrity.
3. True Chromium exterior/cutaway review at 667×375, 844×390 and 932×430. Distinguish Canvas2D from proxy WebGL2, physical mesh WebGL2 and live-game WebGL2.
4. Creator artwork review, iPhone hardware acceptance, future asset fill-in and centralized builder integration. All remain separate and unapproved.

**Next authorized development:** migrate the 30 exact legacy 1A geometries, validate current manual block bridge, and author an Inn exemplar; keep every PR draft.
