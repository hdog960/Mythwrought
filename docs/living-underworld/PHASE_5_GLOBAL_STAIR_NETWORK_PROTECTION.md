# Living Underworld Phase 5 — global pedestrian-network compatibility and fail-closed source search

**Scope:** Detached source engineering only. This phase does NOT edit original M7 caves, mutate saves, register a new generator, change main, alter other developer branches, or create a live-game staircase.

## 1. Confirmed source-level defect in earlier candidates

The Phase 3/4 checker judged each staircase separately. Because every inter-level spiral shares hub neighborhoods with its neighbors, two individually nonintersecting stairways could still try to install a solid support inside another stairway's mandatory three-block headroom. Shared support-to-support footprints are harmless, but support-to-clearance overlap blocks physical walking. The 24 original synthetic-plan regions had overlapping support footprint cells; **13/24** specifically had disallowed support-to-clearance collisions among the individually geometry-optimized four-link proposals. Earlier 4/4 independently 'safe' was NOT proof of a coherent physical walking network.

## 2. New source modules and safeguards

- `pedestrian-switchback.mjs` now accepts `quarterTurns:0..3` for each bounded rectangular spiral; `quarterTurns:0` retains the original geometry. It rotates only intermediate waypoints about the exact hub midpoint, never changes the fixed hub endpoints, protected socket termination at Y=-7, old world, or original legacy -4 socket.
- New `combined-stair-footprints.mjs` rasterizes exactly the same full three-wide support and three-high clearance cells as the existing strict stair checker, verifies cell counts match, permits benign support-to-support sharing, and **rejects ANY cross-route support-versus-clearance obstruction**. It refuses bad geometry, unexpected mismatches and total cell budget exhaustion. No world writes.
- New `source-aware-ramp-selection.mjs` selects a bounded alternate radius, corner, and quarter-turn option per deep link (and optional socket), checks strict stair geometry, exact region/world bounds, 6-face-connected **proposed** voxel AIR between every segment, and whole-network support/headroom. When source callbacks are provided it additionally audits original authored source (including explicit AIR), ore/natural geology, landmarks and edits on every candidate; it cannot accept a route using an overridable geology whitelist.
- Search bounded by default to **64 proposals per link** and **30,000 total original-source voxel checks**. The strict source audit may early-stop on its *first genuine refusal* without accepting incomplete proof. An otherwise valid route exhausting that budget is REFUSED, never reported safe. The direct source audit also refuses out-of-world bounds and any custom geology-allowlist injection.
- The protected surface-to-lowest-level `protected-walking-chain.mjs` now requires the **combined** source-audited and mutually nonblocking three deep ramps, not merely three individually accepted shapes. The already-source-vetted surface mouth is included as the fourth route for the combined compatibility audit. Authentic source provenance, non-blocking physical geometry and face-connected proposed voxel AIR are separate fields; none means live gameplay.
- `audit-m7-five-biome-walking-chain.mjs` now records combined compatibility and proposed face-connected AIR for five EXACT historical M7 safe-mouth coordinates independently verified against artifact #14733859064. The source script remains manual and **has not been executed** against real M7 in this child revision. Historic refused original-world seeds **8675309 and 13579** remain fail-closed, entirely untouched.

## 3. Real source-function trials (detached, deliberately synthetic geology)

Six planned seeds [179,-17,2026,314159,8675309,13579] × four distant 256×256 regions [[0,0],[-7,13],[300,-302],[-300,250]] (24 sample regions), all-stone callbacks as the explicit *synthetic* geological fixture:

| Metric | Previous independent spiral designs | New combined network selector |
| --- | ---: | ---: |
| Four-link individually approved regions | 24/24 | 24/24 |
| Regions with cross-route support/headroom violation | 13/24 | **0/24** |
| Links with accepted grade and global compatibility | NOT PROVEN | **96/96** |
| Summed proposed support cells | 45,866 | **42,103** |
| Distinct proposed support cells after support-sharing | not previously counted | **41,358** |

Additional theoretical support savings: **8.20%** relative to prior 45,866 cells. This is theoretical support geometry only; zero support cells placed. Real M7 ownership and physics do not follow from this fixture. Explicit original-authored AIR, existing natural cave AIR, ore, old landmarks, edits and unknown material retain their strict source refusals. A localized blocked spiral can use a different source-safe quarter-turn; an entire old ore band cannot be bypassed within the bounded/source-budget search.

The protected surface-to-deep synthetic test now verifies all four routes together, reports combined clearance compatibility, preserves the fixed original hub endpoints and includes a full proposed AIR face-connectivity check. The actual cave generator, surface landscape and saves were not touched.

## 4. Lightweight performance planning, no GPU claims

The earlier Phase 4 16-chunk source-only CPU snapshot used independently optimized (sometimes mutually conflicting) spiral layouts: 5,050 candidate solid removals, net +3,156 exposed faces, maximum positive growth 557. The **updated 16-chunk source-exact source-function run now uses collision-free selected layouts** for seeds 179,-17,2026,314159 × four depth links at region (0,0), one deterministic midpoint chunk each:

- **16/16** halo-aware candidate chunks evaluated; provisional 1,200-face growth threshold exceeded in **0/16**.
- **4,392** proposed newly carved solid cells across sampled chunks, net **+2,679** exposed cube faces; maximum single-chunk positive delta **557** faces.
- Maximum illustrative extra unmerged mesh footprint on one sampled chunk **77,980 bytes**, using explicitly hypothetical 32B vertices and 2/4B indices; NO real WebGL2 buffers, renderer timings, original-M7 carving, actual full 256³ cavern coverage, greedy meshing or iPhone FPS.
- Updated `audit-ramp-chunk-face-delta.mjs` reproduces this from a combined candidate selector as a **manual research script**. No new heavy Actions step.

## 5. Targeted validation and remaining safety gates

- New dedicated tests: `living-underworld-combined-stairs.test.mjs` and `living-underworld-source-aware-selection.test.mjs` cover historical cross-collisions, all 24 regions, 96 compatible links, zero-turn parity, 6-connected AIR, source ownership, forged assumptions, bounded work, immutable geology, old-world cave AIR, source-safe detours, and refusal on budget exhaustion.
- **12/12 tests executed and passed in an independent original-source JS function harness** on this new source tree; no native Node test-runner, full Actions, Chromium/WebGL2, screenshot or multi-viewport run was triggered. This is source-function test evidence, not an authenticated Node/GitHub CI pass.
- Existing exact-commit protected PR #367 `f7de8cfe...` root #44972360733 **PASS** and dedicated #44972360755 **56 native PASS** but required positive-seed M7 constructor failures **8675309, 13579** preserve overall **RED**. Do NOT transfer these statuses to this different child commit.
- Dedicated isolated workflow will list **27** targeted native test files plus syntax checks, with existing full 20-seed genuine original-M7 fail-closed check intact. Manual real-M7 five-biome full-depth provenance and revised 16-chunk projection are NOT added as automatically recurring CI jobs.
- **Outstanding:** actual read-only five-biome M7 full-depth source trial, real original-world AIR/ore/landmark refusal results, Node native tests on exact new HEAD, fully placed/physically walkable stairs, city-floor links, real GPU/mesh profile, true iPhone landscape Home Screen offline/PWA/performance tests, original two M7 seed constructor failures, all mandatory acceptance checks. DO NOT merge, deploy, cancel CI or modify protected unrelated lanes.
