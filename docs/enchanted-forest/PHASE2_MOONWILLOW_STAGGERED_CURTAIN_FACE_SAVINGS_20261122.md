# MYTHWROUGHT — Enchanted Forest Phase 2: Moonwillow Staggered Curtains and Native Mesh Savings

**Isolated experimental source milestone — November 22, 2026. NOT production, merge, PWA, save migration or physical iPhone acceptance.**

## Exact branch and protected reference evidence

- Working child `research/enchanted-p2-physical-root-safety-20261121`, entry HEAD `6ae88bba86c7b8571a3b34fefeaae949e6a54c0f`.
- Verified production `main` unchanged `7016e14cd6289f45eaf7fc6a79a362b47996df65`.
- Verified protected Enchanted parent `dev/enchanted-forest-overhaul-20261121-phase0` unchanged `db8cad02387050579c75cbdcdea3e94a9f6d6bee`.
- Last accepted umbrella source `c3182a9d92d5abefbfff9cdf53ad396bed783497`, [native + matched WebGL2 #45055218381](https://github.com/hdog960/Mythwrought/actions/runs/45055218381), authentic three-seed sampled canopy 2,966 voxels, six-chunk prototype native mesh 1,060,344 bytes versus 963,360 historical.
- **This session's latest exact native- and WebGL2-tested source HEAD is `6ab95a8b0477c47beba3b1390f67cb65b240be52`**, branch-only [Actions #45057456018](https://github.com/hdog960/Mythwrought/actions/runs/45057456018). Current Moonwillow source Git blob `69aec88ab0bb50ab4d292707baec214bd46112fb`. Both targeted original-native and original-WebGL2 jobs **SUCCESS**.

## Actual source changes, not just tests

The prior Moonwillow umbrella still looked like a solid rectangular leaf curtain at the physically matched phone landscape camera, and native original-game meshing showed +10.1% aggregate uploaded bytes. This change targets **only** the explicitly opted-in Moonwillow candidate builder in `src/manual-biomes/enchanted-tree-candidates.mjs`.

1. Keep the 4-block radial horizontal umbrella at `dy=trunk` and the rooted, face-connected four-arm physical bark structure.
2. Thin only the artificial top tuft: the prior top radius 2 (13 moonleaf cubes) becomes radius 1 (five cubes), enforced in the actual distance condition as well as the radius loop.
3. Keep **twelve distinct, fully vertical face-connected moonleaf strands**, but vary drops between 2, 3 and 4 voxels. Alternate long and short adjacent tips to introduce real gaps in the low-hanging curtain wall. Lowest authored leaf still at least `floor+3`; original game `BODY_RADIUS=.28`, `BODY_HEIGHT=1.78` walking clearance, source cave/landmark veto, original Y19 hard ceiling and `radius 4` remain unchanged.
4. Keep original Ancient Giant and Starspire style branches, climate/site rolls, root-authenticity checks, bounded 1,024-entry candidate source cache, material IDs, original M7/default save identity and production behavior unchanged. No new block IDs, external dependencies or runtime global caches.

## Corrected source-native acceptance and known failed first attempt

The **first** targeted [native attempt #45057363619](https://github.com/hdog960/Mythwrought/actions/runs/45057363619) exposed two real test problems: a residual source condition still allowed a nine-cube top tuft although the radius loop was reduced, and an older structural test still expected eight uniformly long curtains. The targeted browser job was blocked by its native prerequisite, so **no duplicate/failed WebGL2 run** occurred. Repairs tightened, not weakened, the source contract: now the top **must have at most five leaf cells**, and the structural test explicitly checks all twelve staggered drape axes and their three distinct lengths.

At current exact commit `6ab95a8b0477c47beba3b1390f67cb65b240be52`, the [focused native job #45057456018](https://github.com/hdog960/Mythwrought/actions/runs/45057456018) passed **30/30 actual Node 22 tests, zero failures**. This includes:
- Five Moonwillow representative source styles `[.63,.75,.8,.82,.99]`: **107–108 authored cells**, **260 exposed cube faces** (left-bend styles) or **264** (right-bend), down from **292/296 prior source faces** — about **11% fewer source exposed faces** across variants. All original face-neighbor topology checks remain intact, with twelve separately authored tip columns and unchanged genuinely rooted structural arms. Genuine nine-style structural bark test still counts **268 fully connected mineable bark voxels**, unchanged.
- Real original `meshChunk`, seed 7919, same six native chunks: historical **963,360 bytes** (exact preserved), previous umbrella **1,060,344**, current candidate **1,033,344 bytes**. **27,000 candidate GPU upload bytes saved (2.55% below previous candidate)**, with approximately **+7.3% vs historical** still remaining. All six individual uploads are beneath unchanged **8,388,608-byte** budget and native vertex content remains finite. This is *not* actual iPhone frame time, battery, resident GPU bytes, GPU thermal or WebGL draw call cost.
- Three original M7 seeds sampled across six source chunks each: **2,771** actual experimental tree voxels and **2,300** retained moon/aether leaves, with full authentic terrain/cave/landmark source/headroom checks. There were **1,689** genuinely historical-walkable player AABB positions including **700 uneven ground** positions, all still collision-clear with prototype leaves (solid actual bark deliberately excluded), and original `collides`/ground probe remained real. Original three authentic site neighborhoods provided 168/167/163 standable positions.
- Experimental save remains **fail-closed** under historical M7 identity, while historical M7 schema-1 save bytes and original generator stay unchanged.

## Current-source actual original engine WebGL2 and authenticated images

Dependent matched-camera original-engine job `137315791893` on **the same exact source commit** `6ab95a8b0477c47beba3b1390f67cb65b240be52` **SUCCESS**. Only one Moonwillow historical/candidate pair at 932×430; original `src/main.mjs`, original WebGL2 renderer and block-source witness checks, disposable localhost module *response* instrumenting experimental tree opt-in only. **Actual camera identical to prior umbrella** at `x=-46.5,z=-513.5,feet=10`; no original-world save-byte changes, JavaScript page errors, GPU upload faults or mismatched tree witnesses.

- New Moonwillow candidate vs historic M7 from matched physical camera: **57,779 changed pixels, 14.4174%**, source run `#45057456018`.
- Authenticated PNG artifact ID `14767648183`, ZIP SHA256 **`84bbe1c4a080ba67f5abd918f77277ce0c577f0d612ca17fc1324e1fbad8f7d8`** (independently recomputed and matched GitHub digest), ZIP CRC validated and both included PNG SHA-256 hashes matched the exact run manifest.
- **Direct prior umbrella to new staggered-curtain original-engine candidate** at identical source/camera: **2,107 visibly changed pixels, 0.5258% of frame** with RGB distance >24. Screenshot comparison outside repo: `/mnt/data/enchanted-moonwillow-staggered-before-after.png`.
- Visually the Moonwillow hanging edge is slightly more open and differentiated; overall curtain remains blocky at this camera. **Treat as a quantifiable source/GPU improvement and modest, not transformative, artistic improvement.** Preserve any remaining art-readability concern rather than declaring the biome's final art done.

## CI discipline and remaining gates

- **Executed:** one genuinely changed-source focused native gate (first revision found and then repaired two problems); one final **30/30** source-native run and exactly **one** successful current-source Moonwillow original-engine WebGL2 matched-camera pair.
- **Reused:** prior native 1,024-entry cache, original route/Giant roots, unchanged Starspire/Giant visuals, old full native proofs wherever matching sources remain unchanged.
- **Avoided:** repository-wide redundant CI, prior 12-image source comparison repeat, unchanged Starspire/Giant render captures, unrelated workflows, repeated queue congestion audits, merges, deployments or cancellations.
- **Outstanding:** physical iPhone 17 Pro Max installed Home Screen PWA acceptance, WebGL mobile FPS/p95, long-walk terrain and cave streaming, actual resident memory and thermal measurements, optional future more natural low-curtain art refinement, and **separately approved generator versioning plus safe save migration before shipping**. Experimental tree mode remains disabled by default and unsaveable under original historical M7.
- No changes to protected production `main`, protected parent, other biome developers, five hourly automations, settlements, caves, other developers' source or user worlds.

**Result:** staggered Moonwillow curtains improve measured original-engine mesh upload size and external full-cube face count while preserving original native collision and WebGL2 safety. This is source/visual milestone acceptance ONLY; the user's physical Home Screen PWA remains untested.
