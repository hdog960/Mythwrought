# MYTHWROUGHT — Roadmap A3 / Read-only physical blocker classification

Scope: **Builder 3A** on isolated `roadmap-a-3a-staging-20261117`, based on protected original PR #183 at `bae0321c1089cc4a31df05634cff41790f484e92`. **345/345 original designs remain authored. 0 new design quota. 0 source geometry edits, 0 placed physical repairs, 0 merges or deployments.** Audited source contracts `legacy-physical-support-audit.mjs`, `m2-physical-fit-audit.mjs`, `m2-third-roof-bearing-options.mjs`, `m2-fourth/fifth-physical-aabb-audit.mjs` and `m3-craft-second/third-physical-aabb-audit.mjs`.

## Four distinct queues; they must not be conflated

| Queue | Count | Classification | Resolution gate |
|---|---:|---|---|
| Historic Pack4 fireplace `pack4:064` rear mounts | **15** | Actual producer support-offset mismatch for 15 original blacksmith placements, not a cosmetic absence; `missing-authored-source-support` | Plan **rear** supports only after yaw, support-offset, thermal safety and original-fingerprint-compatible independent approval; preserve original PR #122 geometry |
| Historic Pack4 chimney `pack4:063` hollow-flue cap mounts | **15** | Separate producer support-offset mismatch; never silently fill center flue with a solid block | Real cap/flashing geometry **outside** chimney smoke lumen; verify continuous empty 3D shaft, heat/weather and oriented AABBs; separate creator/structural review |
| Historic roof-bearing witness gaps | **274** | Sampled *absence of a nearby bearing witness*, not an established engineering load failure; 33 M2 fourth, 118 M2 fifth, 83 M3 second, 40 M3 third | Independently recheck roof cell, direct beam/pier support, orientation and load path for EACH sample; distinguish witness-algorithm false negative from genuine unsupported structure. No retroactive roof approval |
| M2 third-variant **unplaced** bearing-beam options | **156** | 30 original M2 third buildings; 156 separate source-derived proposed coordinates, 0 installed, 0 engineered; **NOT part of the 274 above** | Inspect each candidate for occupied cell collisions, path headroom, thermal and chimney lumen safety, producer `pack2:015` physical orientation/support and continuous load path before separate authorization |

Source-exact ledger: `legacy-physical-support-audit.test.mjs` asserts 30 missing support offsets `{pack4:063:15,pack4:064:15}`; `m2-third-roof-bearing-options.test.mjs` asserts 156 independent uninstalled proposals and no source fingerprint change. Existing fourth/fifth/second/third AABB auditors classify counts of sampled roof-bearing witnesses, producer collision boxes, actual fixture occupied offsets and nominal corridor interference separately. These checks explicitly set `structuralCapacityCertified:false`, `roofWeatherCertified:false`, `fullBlockWorldMeshRendered:false`, and `iPhoneHardwareTested:false`.

## Safety decisions

1. All 30 legacy mount mismatches are **confirmed geometry/producer support blockers**; do not treat a north-oriented one-cell proxy as proof of a mounted fixture.
2. All 274 roof witness gaps are **needs source-specific diagnosis**, not 274 proven structural defects. A near-beam heuristic does not equal a loaded roof certificate; do not add 274 blocks automatically.
3. All 156 suggestions are **unplaced options** and remain separate; a nominal empty coordinate is NOT an attachment, load, access or thermal approval.
4. Hollow flues are absolute exclusions for any supports, caps, roof beams and fixtures. Maintain two-wide/three-high circulation, stairs, fire-adjacent clearance, actual oriented Manual Five Pack `collisionBoxes`, `selectionBoxes`, `occupiedOffsets` and `supportOffsets`.
5. Preserve 345/345 source blueprint fingerprints, original PR #183, protected PR #122, 2A, 4A, all other builders, packs, world runtime, automations, schema-1 saves, physical iPhone controls and v0.11 lock. **No physical remediation is approved or applied by this audit.**

## Next acceptance milestone

Execute a read-only source-head audit test enumerating the four queues; record exact 3A staging HEAD and checks. Author per-coordinate candidate repair proposals **without** inserting cells or touching original source; request separate independent authorization before any geometry repair, merge, or physical-integration claim. Production-related heat, weather, load, saves and creator iPhone gates remain OPEN.
