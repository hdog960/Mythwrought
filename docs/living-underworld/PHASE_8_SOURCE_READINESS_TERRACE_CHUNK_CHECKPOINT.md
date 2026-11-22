# Living Underworld Phase 8 — source-protected gallery, city-terrace and chunk risk checkpoint

## Isolation and historical state
Base child HEAD `1d14b3effa4430227ec23778c25878b35006e800`.
Protected production main `7016e14cd6289f45eaf7fc6a79a362b47996df65` and protected OPEN DRAFT PR #367 head `f7de8cfe6c4e055e94bf1ce2398ad7aa97e588e0` were left unchanged. This branch does not change a production import, world edits, cave authoring, live-world implementation, saves, other developers, hourly automations, settlements, iPhone PWA, or shared Actions workflows. Nothing was merged or deployed.

## Actual isolated engineering
1. The rare-city floor previously checked a proposed detached oval plus approach without checking every original M7 floor/support/headroom cell. `original-city-floor-provenance.mjs` now performs a complete 6-support-layer plus 9-clearance-layer old-world source survey, requires immutable geology ownership, and refuses AIR support, ore, authored walls, edited cells and landmarks. Source or column budget exhaustion refuses before calling the original M7 reader.
2. The existing compiled 16-gallery index now offers read-only `inspectCell(x,y,z,kind)`. Full city floor surveys refuse any proposed deck entering a main gallery's clearance, or proposed headroom consuming a gallery's support.
3. Original geometry seed 179 rare-city regions (2,0) and (2,1) have full-oval city pad/gallery conflicts. The full pad is NOT approved. An opt-in source-aware alternate terrace around the existing detached landing checks descending fixed radii 16,12,8,6,4. On synthetic ordinary stone, (2,0) selects radius 8, 197 columns, 2955 source-voxel checks; (2,1) radius 12, 441 columns, 6615 checks. Real old-M7 source safety and stair-ramp mutual geometry are NOT proven. Synthetic ore and natural cave AIR both force refusal.
4. `source-protected-chunk-risk.mjs` uses a single original halo source-material snapshot and the unchanged conservative chunk-face projection, but refuses requested carving of ore, authored cave cells, landmarks or edits. A blocked requested carve is counted as unsafe, never projected as successfully mined. No native GPU resources are allocated and no support-placement cost is accepted.
5. `auditOriginalMainGalleryVoxelReadiness` now samples all 16 MAIN galleries' actual old-world deck and 3-high clearance blocks separately from FUTURE cuttability. Original construction is not inferred from a safe candidate. A detected bug was corrected: block ID 0 (AIR) is cuttable geology in the original allowlist but NEVER a valid existing deck. Source-only rock = blocked headroom, all AIR = unsupported deck.
6. The original-M7 five-biome gallery runner now records real-old-world as-built deck/air readiness alongside future source-safe gallery proposals. Two additional scripts read original M7 city candidates and protected one-chunk face risk. All remain explicit opt-in commands with no write side effects.

## Executed evidence (distinguish environments)
- 27/27 focused native Node tests passed in the pre-existing reconstructed local source subset (`/mnt/data/underworld-lab`) with synthetic material callbacks. It is NOT a complete native checked-out repository.
- Seven checked exact GitHub source-function V8 cases for original-city floor ownership / chunk risk passed against the earlier isolated commit.
- Exact GitHub source-function V8 gallery-as-built audit after the AIR deck fix: 6/6 focused cases passed. Synthetic proposed as-built decks: 24,768 tested support/air source cells, rock-only headroom obstructions 18,576, all-AIR missing deck supports 6,192. These are NOT original M7 terrain measurements.
- Exact source V8 terrace cases: two synthetic stone sites accepted at radius 8 and radius 12; both injected ore and original AIR callbacks correctly refused. Both full-size oval city pads were confirmed to intersect planned horizontal gallery support/headroom.
- No fresh GitHub Actions workflows or Chromium jobs were deliberately launched. Earlier exact-parent historical tests and artifacts were not redundantly rerun.
- The 120-pair mutual gallery scan across seven deterministic geometry regions (840 checked pairs) is historical reconstructed geometry evidence, NOT original full M7 provenance.

## Outstanding gates
- Execute the NEW exact-HEAD original-source read-only commands in a complete native Node checkout:
  `node scripts/underworld/audit-m7-five-biome-gallery-source.mjs`
  `node scripts/underworld/audit-m7-original-city-terrace-source.mjs`
  `node scripts/underworld/audit-m7-five-biome-hub-chunk-risk.mjs`
- Record genuine old M7 ore/edits/landmark and as-built walking-support/headroom counts; fail closed on any rejected candidate. Do not infer a physical route from a detached future plan.
- Validate proposed terrace versus actual city access ramp AND all four vertical stair proposals; no full city floor is authorized, and no settlement may be authored by these tools.
- Gather genuine original-world source-aware chunk face bounds, support-placement costs and iPhone 17 Pro Max GPU/physics evidence before release consideration.
- Preserve genuine original-M7 constructor failures for seeds `8675309` and `13579`; they were not fixed or retested.
- Do not merge, deploy, cancel workflows, overwrite protected refs, alter other developers' work, or modify live PWA.

## Testing efficiency
Only focused regression tests should run during iteration. Reuse exact-revision verified results, avoid repeated full test or Chromium launches, and keep mandatory release and branch-protection checks unchanged.
