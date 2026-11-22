# MYTHWROUGHT — Enchanted Forest Phase 2: Genuine Mixed-Hill Routes & 1024-Entry Source Cache

**Isolated engineering checkpoint — November 22, 2026. NOT merged, deployed, PWA tested, or eligible to overwrite historical M7 saves.**

## Source and protected branch identity

- Working branch: `research/enchanted-p2-physical-root-safety-20261121`, entry HEAD `2e3ba889480383fa287bda8f4bf3d41db8d7d940`.
- Protected production `main` remains `7016e14cd6289f45eaf7fc6a79a362b47996df65` at verification.
- Protected Enchanted Forest parent `dev/enchanted-forest-overhaul-20261121-phase0` remains `db8cad02387050579c75cbdcdea3e94a9f6d6bee` at verification.
- Last accepted original native source baseline: Actions `#45044463467`, exact commit `15f7521f92954d1861163d2a295712c8483b5975`, 44/44 PASS. Source from that checkpoint was reused unchanged where appropriate; no broad rerun.

## Actual engineering and validation

### One authentic path combining up, down, and diagonal movement

Changed `tests/manual-biomes/enchanted-tree-multistep-diagonal-real-m7.test.mjs` to require an **uninterrupted four-leg** original `stepPlayer` walking loop with **both an ascent and descent in the SAME physical player trajectory**, plus **two diagonal legs**. It uses genuine historical and opted-in `FourRegionWorld`, original source `collides`, actual cave/landmark/terrain, a single player state retaining momentum between legs and no teleport/reset. Each selected circuit must be traversable in historical M7; experimental leaves cannot make it impassable. Real solid mineable bark remains intentionally impassable. Each circuit returns to its starting x/z in one continuous walk.

[Focused Actions #45046269665](https://github.com/hdog960/Mythwrought/actions/runs/45046269665) at exact commit `de46342b1975af1079015b54d35327c408898a2d`: **9/9 targeted native tests PASS**, 0 fail. Real mixed-loop witnesses:
- Starspire, start `(-46,-533)`, four direction vectors `[1,0],[1,1],[-1,0],[-1,-1]`, genuine surface height deltas `[-1,0,0,+1]`, **48** original physics ticks, candidate exactly equal.
- Moonwillow, start `(-44,-500)`, vectors `[0,1],[-1,1],[0,-1],[1,-1]`, surface deltas `[0,-1,0,+1]`, **51** ticks, candidate equal.
- Ancient Giant, start `(12,-533)`, vectors `[-1,0],[1,-1],[1,0],[-1,1]`, surface deltas `[0,-1,0,+1]`, **50** ticks, candidate equal.

**3/3 source-authentic mixed-height circuits passed** (12 connected legs, six diagonal legs), while previous nine 3-leg continuous routes and earlier 48 individual one-step uphill/downhill routes remain valid on unchanged original physics. No synthetic player movement or invented pedestrian distances.

### Measure real dense-cache eviction pressure, not fake iPhone FPS

The previous experimental cache was a synchronous original-source `Map` capped at 2,048 entries. Added test-only `onCandidateCacheSummary` counts for exact cache hits/misses (no normal-gameplay counter increments) and real source test diagnostics for per-chunk callbacks and measured Node runner time. At original 2,048 entry default, 48 real source chunks (three seeds 179, 7919 and -88; 4×4 chunks each):
- **8,474** unchanged authored tree voxels, actual original M7 cave/landmark/world-reader parity.
- **100,423 source callbacks**, **1,312 cache hits**, **14,172 FIFO evictions**, peak occupancy **2,048 entries**.
- Runner **p95 chunk plan 60.042 ms on first experiment**, not a trustworthy isolated device frame-time number. A later identical test recorded p95 32.665 ms, demonstrating native runner variability. Whole Node process heap sampling cannot isolate source-cache heap or prove iPhone memory.
- No persistent worlds, other biomes or generator versions altered.

The significant source-read-to-hit ratio suggests the full 2,048-entry default holds many once-read keys. Instead of guessing, a **five-capacity real original M7 source test** was added to compare bounded FIFO settings `[128,256,512,1024,2048]` on nine dense original M7 chunks across all three seeds. Each produced **exactly the same 1,681 tree voxels**, real source and saved-world protections.

[Focused Actions #45046418529](https://github.com/hdog960/Mythwrought/actions/runs/45046418529), source `9b4885b01552061bc389380f85e73688616c0d71`, **10/10 targeted native tests PASS**. Observed real source callbacks:
- 128 entries: **34,011** reads.
- 256 entries: **29,678** reads.
- 512 entries: **23,652** reads.
- **1,024 entries: 23,389 reads**, only **231 extra (+1.00%)** vs the former full-capacity baseline.
- 2,048 entries: **23,158 reads**.

**Source decision:** Set the **normal experimental default** to 1,024 entries, retaining a strict class hard maximum of 2,048 entries only for explicitly bounded diagnostic configurations. `src/manual-biomes/enchanted-tree-source-cache.mjs` exports both caps; `environment-v7.mjs` uses the smaller default and accepts an opt-in diagnostic capacity override. Historical M7 generation remains unchanged; the temporary cache is created/destroyed with one source chunk build and is not written to saves. `tests/manual-biomes/enchanted-tree-source-cost.test.mjs` now enforces at most +5% original-reader calls against the exact former 2,048-entry 36-pass baseline rather than a timing-based pass/fail rule.

### Final accepted source after reducing default occupancy

[Focused native Actions #45046552068](https://github.com/hdog960/Mythwrought/actions/runs/45046552068), exact tested source **`86701f9bbd258c0c4525b8ae3d870a8ff677b689`**, job `137282319702`: **SUCCESS, 10/10 tests PASS, 0 fail**. This is the acceptance source revision for the 1,024-entry decision.

- On the **identical 36-pass original M7** 3 seeds × 6 chunks × cold/warm source load: **79,788** real callbacks vs previous **79,456** at default 2,048 (just **332 extra / 0.42%**). Still **23.36% fewer** than the older 104,112-read pre-root-cache revision. Same **2,921 tree voxels**, including all 12 Ancient Giants and source 62 connected chunk seam pairs.
- Across **48 actual dense chunk plans**, **8,474** genuine tree voxels, full original-source and historical save parity. The cache now peaks at **1,024 entries**, and measured callbacks grew only **100,423 → 100,923 (+0.50%)** compared to the older 2,048-entry default. FIFO eviction count grew **14,172 → 52,254** as expected from reduced capacity; the authentic ground source always regenerates evicted data. This increase is an explicitly reported tradeoff, not hidden as a zero-cost change.
- The 48-chunk current Node runner sample recorded ~**33.767 ms p95 per source chunk plan**, versus ~32.665 ms on an earlier run. Timing is not controlled for process/cache warmth or system load and is **not evidence of an iPhone FPS/p95 improvement or regression**.
- Whole-process heap-used observation was **123,631,232 bytes** during test, including all native test data and terrain caches. This is **NOT the source-cache memory allocation**, and the entry ceiling **does not constitute a strict bytes/heap budget**. Actual iPhone JavaScript heap, rendering, resident GPU buffers and thermal behavior remain unmeasured.
- The original `FourRegionWorld.save()` remains **fail-closed** for opted-in experimental trees, while ordinary historical M7 schema-1 saves retain their identity. No editor/dev/physics/UI/biome/mob automation lane modified.

## Global anti-clogging policy and remaining gates

Three **different meaningful** focused source validation points were exercised in this session: 9/9 for new real four-leg routes + dense native profiling, 10/10 for authentic five-capacity comparisons, and final 10/10 on the changed default. No full repository suite, repeated 44-test suite, browser/WebGL2 screenshot job, unnecessary queue audit, CI cancellation, shared infrastructure modification, merge, deployment or PWA update.

Remaining priority: original-game WebGL2 acceptance of modified connected tree silhouette/walking clearance at actual locations, more real mixed-height continuous route seeds and forest biomes, source-cache memory in **bytes** and controlled per-chunk CPU on iPhone Safari and installed Home Screen PWA, original GPU/streaming p95, and a separately reviewed versioned generator/save migration before ever changing historical M7 worlds. All five automations, other developers, protected source refs, settlement lane, Codex, caves, biomes and original saves remain protected.

**Native engineering accepted for experimental source only; NOT production acceptance.**
