# MYTHWROUGHT — Enchanted Forest Phase 2: Real M7 Climate-Transition Walks and Canonical Immutable Site Keys

**Standalone source-only experimental checkpoint — November 22, 2026. NOT a merge, browser release, physical iPhone/PWA acceptance, or versioned save migration.**

## Exact branch and protected refs

- Working isolated branch `research/enchanted-p2-physical-root-safety-20261121`, entry HEAD `4fbad96b6bfbf848348a80b612e075c8cbe6cb72`.
- Verified production `main` remained `7016e14cd6289f45eaf7fc6a79a362b47996df65`.
- Verified protected Enchanted parent `dev/enchanted-forest-overhaul-20261121-phase0` remained `db8cad02387050579c75cbdcdea3e94a9f6d6bee`.
- Previously accepted [Actions #45078536456](https://github.com/hdog960/Mythwrought/actions/runs/45078536456) exact source `f5378687bcd4d8b03fa929b5927ca8aca6902d18`, 6/6 native, 128 real source chunk AB/BA cost and cache immutable value acceptance. Original Moonwillow native/WebGL2 and GPU proofs were reused for unchanged tree geometry.
- **Exact latest fully focused native-tested source `8deb20fb127fd5d699b9b27ff3100df51902d6fc`**, [Actions #45084197618](https://github.com/hdog960/Mythwrought/actions/runs/45084197618): 3/3 PASS for corrected source cache integrity and 288-chunk original-world regression.
- The earlier [Actions #45084113198](https://github.com/hdog960/Mythwrought/actions/runs/45084113198) at source `3c24e64b1c60c68cbdca0a984021a367774c5375` had **4/5 PASS**: both new real-world tests PASSED, and existing 288-chunk/world physical-source checks PASSED; one cache-integrity test accounting assertion failed (a legitimate zero-key insert was counted as if invalid). The second job re-ran **only** the repaired cache source test (3/3), avoiding duplicated walking checks. Runtime source was unchanged between these two validations; the second run updated only test accounting and the focused workflow.

## Actual source engineering — canonical immutable biome site keys

The experimental-only bounded `EnchantedSiteBiomeCache` previously admitted misleading direct Map keys such as `179:-0,0`, `179:0,-0`, and `0179:0,0`. Those spellings represent the same numeric source location as a canonical key but occupy distinct Map entries. The earlier validation checked numeric safety but not exact key-text roundtrip, permitting spurious cache aliases and evictions through direct `set`.

Changed **only** `src/manual-biomes/enchanted-tree-site-biome-cache.mjs`:
- A direct site key must parse as int32 seed, finite safe integer x/z and re-serialize **byte-for-byte** to the exact `seed+':'+x+','+z` key that real `getOrRead` generates.
- Reject negative zero, leading zeros, out-of-range seed, unsafe coordinate and malformed keys **BEFORE** altering a genuine cache entry or incrementing an eviction count.
- Preserve existing deep-frozen V6 metadata validation, real cached `null` Plains value, 128-entry FIFO cap, seed isolation, source exceptions and conservative fail-closed behavior.
- Do not cache source terrain, protected cave AIR, landmarks, player edits, generated trees, temporary roots or collision data across chunks. The historical/default M7 never allocates this experimental memo and is untouched; candidate trees remain disabled by default and refuse historical M7 saves.

The modified focused source regression now tests nine noncanonical direct-write aliases, verifies **zero evictions for all rejected writes**, then separately accounts for the eviction caused by two legitimate cache insertions. This is a stricter, not weakened, integrity gate.

## Original-game 14-leg continuous climate-border walking

New **`tests/manual-biomes/enchanted-biome-seam-long-walk-real-m7.test.mjs`** uses genuine `v6BiomeAt`, source-correct original `FourRegionWorld`, real `_columnPlan`, authoritative `_environmentBaseline` cave/landmark AIR, unchanged `collides`, `BODY_RADIUS=.28`, `BODY_HEIGHT=1.78`, and `stepPlayer` (25ms calls). It independently locates warped V6 biome boundaries via seed-based scans, then attempts source-level natural ground corridors. It **only admits** a route after historical M7 physically walks it; new optional tree leaves cannot block an admitted original route. One continuous player object retains position, velocity and collision across 14 legs: no inter-leg teleport, synthetic flat source, player edits, or alternate physics engine.

Native run evidence:
- Biome transition bounds found: **26 for seed179, 26 for seed7919, 28 for seed-88** in bounded sampled scan lines. These counts are discovered boundary opportunities, not completed routes.
- **Four real uninterrupted 14-leg Enchanted↔Snow routes passed**, two for seed179 and two for seed7919. Both historical and experimental worlds completed each matched route in exactly **132 original physics ticks**, with the same ending feet and no candidate wall/ceiling fault. Two routes crossed an actual 16-block chunk edge; others crossed an authentic warped biome transition without a chunk edge. Source route observations included **six uphill legs** and **one downhill leg** across these routes.
- Seed -88 had scanned genuine boundaries but **no admitted 14-leg historical route under these strict sampled corridor constraints**. Do **not** claim verified walkability across every seed or climate boundary. A later route test may broaden safe search corridors, including winding paths or other climate transitions.
- Original ground source AIR/headroom and cave/landmark veto was checked at route nodes. This is not proof of exhaustive caves and landscapes across all original M7.

## Genuine user-edit isolation after old tree chunk eviction

The new focused test mined an actual optional tree leaf (source seed179, real voxel `[-20,13,-519]`, material ID **409**) using the original `FourRegionWorld.set` in a detached test-only world. It generated 76 subsequent chunks to surpass the original **64 resident tree-chunk Map** FIFO limit, verified the original tree chunk was evicted and regenerated, and confirmed:
- The actual `world.get` returned **AIR** at the edited leaf after regeneration; the original edit entry persisted.
- The site biome cache never exceeded **128 entries** and the source chunk cache never exceeded **64**.
- The opt-in experimental world still refused `save()`, while a separate historical M7 world returned unchanged schema-1 `{schema:1,seed,edits:[]}`. No actual user's save or production world was modified.

## Exact native results, cost and outstanding gaps

[Corrected focused Actions #45084197618](https://github.com/hdog960/Mythwrought/actions/runs/45084197618), exact runtime source `8deb20fb127fd5d699b9b27ff3100df51902d6fc`, **SUCCESS 3/3**:
- Native original-world 288-chunk test: **17,877 exact ordered tree voxels** across three seeds, **308 original physical cross-chunk face connections**, **six actual tree chunk FIFO rebuild proofs**, **64 peak tree-chunk Map entries**, **128 peak immutable biome site entries**, historical schema-1 saves unchanged, candidate saves refused and source protected AIR/landmark checks passed.
- The earlier 4/5 job established real 14-leg climate transition routes and AIR edit preservation against the same code change. Its incorrect cache eviction-count assertion was fixed and the affected 3-test file accepted on the subsequent source-specific run; do not label the first whole job SUCCESS.
- No evidence of performance/FPS improvement claimed from cache-key validation; original controlled caching performance from prior exact source was mixed and remains inconclusive.
- **Executed:** two focused changed-source Actions, one detected/repaired bad test assertion; only the repaired cache file was rerun. **Reused:** previous authentic walking, mesher, native GPU and original WebGL2 for unchanged code. **Avoided:** redundant broad repository suites, Chromium runs, user-PWA changes, unrelated developer CI, queue/cancellation churn.
- **Outstanding:** find longer winding historical traversable routes across more Enchanted↔Plains/Mountain/Desert/Snow biome boundaries and all seeds, verify actual long-distance live WebGL2 streaming rather than solely native planner and physics, physical iPhone 17 Pro Max installed Home Screen PWA frame p95/FPS, JS heap, GPU residency and thermals; separately authorized future new generator identity and version-safe save migration before enabling candidate trees in production.

**Conclusion:** Native original-world climate crossing and original user edit isolation now have direct demonstrated evidence, and the experimental immutable site cache rejects noncanonical alias entries without jeopardizing any old-world source. No changes to production main, parent, other developers, Codex, five automations, caves, settlements, biomes, user files or deployment.
