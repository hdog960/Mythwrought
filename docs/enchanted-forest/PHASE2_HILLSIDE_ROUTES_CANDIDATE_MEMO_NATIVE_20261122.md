# MYTHWROUGHT — Enchanted Forest Phase 2: Authentic Hillside Routes and Chunk-Local Candidate Source Memo

Date: November 22, 2026. **Source-development checkpoint, not release or physical iPhone acceptance.**

## Protected refs and exact validation

- Entry isolated child branch `research/enchanted-p2-physical-root-safety-20261121`: `49fb64375707b10f414c223c8858ca2415185f15`.
- Protected Enchanted Forest parent `dev/enchanted-forest-overhaul-20261121-phase0`: `db8cad02387050579c75cbdcdea3e94a9f6d6bee`, unchanged at session verification.
- Protected production main: `7016e14cd6289f45eaf7fc6a79a362b47996df65`, unchanged at session verification.
- **One** targeted native [GitHub Actions #45041987785](https://github.com/hdog960/Mythwrought/actions/runs/45041987785), job `137268247789`, **tested source `159ced121bb2492777945f6a0666f1e41bbf76a8` SUCCESS, 39/39 actual Node 22 tests PASS, 0 FAIL.**
- Prior exact-source [#45038344114](https://github.com/hdog960/Mythwrought/actions/runs/45038344114) 38/38 PASS valid at previous `bf138762b4dada28039972bd1146b379d3ee722f`; reused only for unchanged source evidence. No broad CI, Chromium or PWA browser test was repeated.

## Concrete engine-source improvement

The experimental tree planner in `src/manual-biomes/environment-v7.mjs` formerly repeated authentic original M7 baseline reads separately for root grounding, four-footing authenticity, tree AIR collision preflight and 3x3 leaf/headroom removal. Its previously implemented short-lived per-chunk cache covered only leaf clearance, causing redundant original cave/landmark and terrain cell lookups across nearby sites.

The new `candidateReadCell` is a **lazily allocated, transient cache inside one `environmentalTreesForChunk` call**. The exact same immutable original `readCell` results are shared by candidate root preflight, neighboring four-root source checks, branch/canopy collision preflight and the existing 3x3 player-width canopy clearance. It:
- does not exist for the default historical M7 tree generator path;
- is never retained by `FourRegionWorld`, never persisted in saves and never crosses a chunk planning call, seed or world;
- cannot introduce a new tree or change any source terrain, cave AIR, landmark block, ice/snow conifer, settlement, height ceiling or user edit;
- preserves existing original `BODY_RADIUS=.28`, `BODY_HEIGHT=1.78`, `STEP_HEIGHT=1.01` engine physics without modifying the unrelated movement lane;
- reuses results only while the original candidate chunk plan is constructed, not across edits or world mutations.

`tests/manual-biomes/enchanted-tree-source-cost.test.mjs` requires authentic original `FourRegionWorld` source cell parity with the prior original reader and compares the **identical three seeds × six chunks × two cold/warm passes (36 chunk generations)** with the immediately prior exact-source measurement. `tests/manual-biomes/enchanted-tree-hillside-routes-real-m7.test.mjs` compares original `stepPlayer` walking on **genuine** (not synthetic) one-block high M7 slopes between the unchanged historic M7 and opted-in Phase 2 candidate for the same seed, at actual cave/landmark-supported ground and clear full-body AABBs. Deliberately solid mineable trunks are excluded from 'should be walkable' assertions.

## Authentic current-source results

- **39/39 native tests PASS**, including all previous tree generator, native mesh, chunk-seam, cave/root, original collision, experimental save-fail-closed and source parity checks.
- **48 authentic original-game stepPlayer hillside traversals PASS** at seed 179: **24 one-block uphill, 24 one-block downhill**; 8 each direction around **each** tree species source site Starspire (-38,-525), Moonwillow (-36,-499), Ancient Giant (20,-525). Physically traversable historical routes remain traversable in the candidate. Original one-block step-up records genuine `stepped:true`; same horizontal progress and feet within 0.12 original units in both worlds.
- Current 3-seed real Giant census **12 eligible**: seed 179=5, 7919=1, seed -88=6; **48 fully grounded Ancient Giant root cells** and no Y19 ceiling breach. Source chunk checks **2,921 actual tree voxels**, **465 border voxels**, **62 continuous cross-chunk pairs** with original source world reader parity. Nine stylized tall trees retain source face-connected structural bark.
- Existing one-body-width standing acceptance **1,689 genuine previous-historic walkable AABB edge/corner positions**, **700 on unequal neighboring source ground elevations**, all collision-free under opted-in prototype except deliberately solid trunks. Source leaves sampled: **2,502** across three seeds.
- Six original real `meshChunk` GPU-size sample: historical **963,360** bytes vs prototype **1,012,392**, ~5.1% increase in this aggregate; all six chunk uploads remain below **8,388,608 bytes each**. This is **not** measured iPhone draw performance.

## Authentic source performance

Same original M7 3 seeds × 6 chunks × cold/warm loops at Node 22 on Actions:
- Previous source commit `bf138762b4dada28039972bd1146b379d3ee722f`: **104,112** source callback reads.
- New source commit `159ced121bb2492777945f6a0666f1e41bbf76a8`: **79,456** source callback reads.
- **24,656 fewer authentic M7 baseline callbacks, a measured 23.68% reduction**, without changing any 2,921 retained sampled experimental tree voxels or native collision acceptance.
- Seed 179: **13,073** reads per pass, cold **255.106 ms**, warm **91.967 ms**.
- Seed 7919: **12,774** reads per pass, cold **136.445 ms**, warm **53.698 ms**.
- Seed -88: **13,881** reads per pass, cold **267.557 ms**, warm **100.818 ms**.

Timings are **Ubuntu Node 22 runner CPU**, with cold/warm cache variability; not iPhone FPS, frame p95, battery, thermal, browser GPU or production streaming estimates. Source-read reduction is the repeatable observed win. Source cache has chunk-local lifetime; its **maximum peak occupancy/memory has not yet been instrumented**, and a stricter bounded-memory test should precede mobile release certification.

## CI efficiency and hard boundaries

- Executed: one current-source targeted Node native suite **39/39 PASS**.
- Reused: previous source-native and original-engine visual proofs only for their exact previous unchanged code.
- Avoided: redundant entire repo CI, Chromium/multi-viewport recordings, queue congestion audits, other developer runs, and job cancellations.
- Outstanding: expanded route seeds/steeper and diagonal hillside routes, native cache high-density/peak memory and real chunk-generation time sample, new-source WebGL2 visual proof of headroom and changed branches at a meaningful milestone, physical iPhone installed Home Screen PWA frame p95 and resident GPU/memory acceptance, required versioned generator/save migration before any default M7 usage, release-level safety/integration validation.
- Experimental trees **remain opt-in, and `save()` still fails closed under the historical M7 generator identity**. No merges, deployments, protected parent/main edits, PWA updates, CI cancellations, or changes to automations, settlements, other developers or their work.
