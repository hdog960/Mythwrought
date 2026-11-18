# Mythwrought — eight-builder to three-roadmap consolidation (planning draft)
**Prepared:** 2026-11-17 CST / 2026-11-18 UTC. **Status:** proposed coordinated handoff; source/production integration NOT authorized.
This is a **documentation-only** top-level reorganization. Existing source-authored candidates, 8 original draft PRs, original legacy PRs #121–#124, v0.10 Gate A, v0.11 lock, schema-1 saves, manual Pack1–5, biome130, automations, Creative Mode, gameplay and deployment remain unchanged. No claimed live-game building placements.

## Three future owner roadmaps
1. [A — Commerce, Industry & Civic](ROADMAP_A_COMMERCE_INDUSTRY_CIVIC.md): original Builder 2A, 3A and 4A portfolios. **443** theoretical unbuilt designs + legacy 3A physical/visual remediation.
2. [B — Community & Culture](ROADMAP_B_COMMUNITY_CULTURE.md): original Builder 1B and 2B portfolios. **540** theoretical unbuilt designs.
3. [C — Living, Defense & Arcana](ROADMAP_C_LIVING_DEFENSE_ARCANA.md): original Builder 1A, 3B and 4B portfolios. **482** theoretical unbuilt designs, including five 4B schoolhouse candidates requiring new exact-head technical acceptance.

Exactly 8/8 source category portfolios are assigned once; every planned ID stays in its historical namespace and every accepted old source is immutable until separately reviewed. Do not use roadmap grouping to rename blueprint IDs or to collapse the underlying 8 source/test directories into 3 paths.

## Repository checkpoint ledger (observed during audit; HEADs can advance)
| Prior builder | Legacy draft PR | Pinned checkpoint HEAD | Authored/target | Unauthored | Current-head Actions audit |
| --- | --- | --- | ---: | ---: | --- |
| 1A Homes/Hospitality | #180 | `628134928a171d6db46d0e9d2aa68a4bf877a08e` | 265/450 | 185 | #44203020761 SUCCESS; independent focused verifier #44203086027 SUCCESS |
| 1B Regional Services | #184 | `cf4e90f9760cab2ba9e3170d24ae6f689d8d4796` | 169/435 | 266 | #44204063367 SUCCESS (full; dedicated source/gallery evidence still a distinct gate) |
| 2A Shops/Banking | #179 | `abbd43a896406c83521963a0438ae2860c196e77` | 128/420 | 292 | #44201184964 SUCCESS (full; source-specific gate distinct) |
| 2B Markets/Culture | #187 | `f54995fd818e805c2c17a7fcf6467f1e862f827b` | 146/420 | 274 | #44200070377 SUCCESS; ledger source-author count 146 |
| 3A Artisans/Resources | #183 | `bae0321c1089cc4a31df05634cff41790f484e92` | 345/345 | 0 | #44125990391 SUCCESS (full); physical art/roof debts remain |
| 3B Industry/Fortifications | #181 | `af1ba6f1259d094c4d3ed34f5ed8183fb3948424` | 205/360 | 155 | #44201462645 SUCCESS (full); five second-variation barracks present |
| 4A Government/Knowledge | #182 | `cfbe984a0c8ba69eb4dc2b247dd5a26866e77f05` | 164/315 | 151 | #44198988075 SUCCESS (full); new M3/M4 gallery acceptance separate |
| 4B Healing/Education/Arcana | #185 | `315eb1f3635aff4057542beae98dd7cf2d9da33a` | 143/285 | 142 | Previous #44203733692 FAILED only outdated M2 manifest test string (229/230 focused tests passed; 858 screenshots ran). Corrected 4B-only test assertion in this new HEAD; #44210947217 was IN PROGRESS at handoff writing. 138 source technically accepted at #44197912371; five additional schools provisional. |

**Totals:** 3,030 allocated blueprints; 1,565 source-authored candidates (not creator-approved); 1,465 unauthored. Only committed branch state was inspected: no claim about uncommitted work in other chat sessions. Green full-game CI does not substitute for the lane's focused native/source screenshots or real producer/creator/iPhone acceptance.

## Relative workload—not a wall-clock promise
For initial equal-duration planning, count remaining authored designs with complexity multipliers; factor in 3A's separate remediation. These are heuristic, not measured developer throughput:
- A: 2A 292×1.15 + 4A 151×1.55 + 3A acceptance debt ~50 = **~620 effort points**.
- B: 1B 266×1.15 + 2B 274×1.30 = **~662 points**.
- C: 1A 185×1.00 + 3B 155×1.65 + 4B 142×1.75 = **~689 points**.
Mean ~657; largest variance from mean ~6%. Recalibrate after each accepted batch using real evidence/throughput; do not force weak geometry or remove acceptance tests to meet quotas. Fortifications, academies and 3A physical remediation are weighted higher than conventional houses/shops.

## Handoff sequence — **stop safely, then begin the new three**
1. **H0 audit/freeze**: owner of each original builder chat must stop authoring at the pinned SHA or name a newer HEAD, verify all committed changes, 8/8 draft/no merges/no deployments, confirm protected source fingerprints, uncommitted work handoff, and a lane-specific exact-head focused native + genuine Chromium source gallery; preserve screenshots/manifests. Current 4B new schoolhouse release is on HOLD until its corrected exact-head CI is green and screenshots independently audited. If not green, carry the last accepted 138-source checkpoint and quarantine the five new designs as provisional; never discard their committed code.
2. **H1 preserve**: retain old 8 PRs and all legacy PRs #121–#124 as historical immutable anchors, and preserve exact existing IDs/source objects. Do not close/merge, rebase, rename or delete the original branches for this doc-only phase.
3. **H2 candidate staging**, under separate creator authorization only: create an isolated nonproduction integration base of the 8 disjoint `src/building-pool/roadmap-*`, `tests/building-pool/roadmap-*` and `docs/building-pool/roadmap-*` directories. Verify independently the historical full-source fingerprints, ID counts, D4 thresholds, import paths and entire integrated native+WebGL2 suite; no runtime registration/world generation/persistence changes. Resolve main drift carefully rather than blind merge.
4. **H3 activate 3 owners**: three newly managed roadmaps may independently author only their assigned historical categories and namespaces in disjoint branches/worktrees derived from the verified staging base. Central integrator alone combines them. A single active writer per historical lane directory, even when one top-level roadmap owns multiple old lanes. Avoid concurrent writes to common manifests, shared CI or asset catalogs.
5. **H4 recurring gates**: source-authored complete ≠ technical preview accepted ≠ physical producer geometry accepted ≠ creator art accepted ≠ physical iPhone accepted ≠ integrated. Every tranche needs focused native, full D4/physical support/collision/route audits, source-exact genuine Chromium WebGL2 views at 667×375 / 844×390 / 932×430 with verified hashes/dimensions, and isolation checks. Retain 25-chunk budget, landscape two-thumb rails and schema-1 saves.
6. **H5 release decision**: authoring completion is not automatic production placement. Only the creator can separately approve controlled incorporation; do not merge/deploy/world-place/unlock v0.11 because of this proposal.

## Rebalancing rule
Re-estimate every 25–50 technically accepted new designs or after one high-complexity gate. Move **not-started categories or discrete biome×size×variant ranges** between top-level owners only through documented ownership transfer; never let two concurrent writers edit the same underlying old lane's module, quota manifest or test. Keep original namespaced IDs and previous evidence. If moving a partition is unsafe, rebalance by adjusting acceptance/review tasks rather than source code ownership.

## Explicit non-goals
No changes to main, Pages, runtime, saves, schema, manual packs, 130-block registry, automations, geometry cleanup, caves, biomes, Creative Mode, settlements, v0.11, original eight source PRs or earlier legacy PRs. No source-code incorporation from the eight PRs has occurred in this planning proposal.
