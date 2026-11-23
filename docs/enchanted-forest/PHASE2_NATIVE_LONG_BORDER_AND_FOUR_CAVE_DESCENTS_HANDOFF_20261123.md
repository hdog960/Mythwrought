# MYTHWROUGHT Enchanted Forest Phase 2 — Exact Native Long Border, Authored Cave Mouth and Player Descent Handoff

**2026-11-23. Research-only ISOLATED original-source engineering. Not production-integrated; not a generator-version release, historical save migration, completed deep-network cave traversal, WebGL2/mobile test or deployment.**

## Immutable refs and working lineage

- Required parent handoff was read first from `docs/enchanted-forest/PHASE2_LONG_ORIGINAL_M7_WALK_SOURCE_GATE_20261123.md` at exact entry HEAD `cf7f881cb54634194d035b8bb8d108ce48c0c492` (Git blob `6e08ed6a00fe4221897b3ddc0fbafc6e3f3ba215`).
- Original requested branch `research/enchanted-p2-long-real-m7-walk-20261123` verified **identical** to that entry HEAD, and left unchanged.
- Work continued only in NEW isolated child branch `research/enchanted-p2-authored-mouth-gates-20261123`, created directly from `cf7f881cb54634194d035b8bb8d108ce48c0c492`.
- Protected production main `7016e14cd6289f45eaf7fc6a79a362b47996df65` and protected parent `dev/enchanted-forest-overhaul-20261121-phase0` `db8cad02387050579c75cbdcdea3e94a9f6d6bee` were checked identical to their required exact refs and were **not moved or modified**.
- The historical physical ground, collision and route source files are unchanged: `enchanted-original-pedestrian-search.mjs` blob `49fa84146656d895638126c7766675188a13fa80`, `enchanted-original-standing-diagnostic.mjs` `f9c9b7fc300cf9ea3a04d2cf54fecb3ce1ee8fb7`, `enchanted-original-physics-route.mjs` `21f368cc0532a124e7d2ba0f3e55548386c2682f`, and original long route evidence module `enchanted-original-route-evidence.mjs` `9511e0a3709812f24f26edeb011fb105ec44a434`.
- The existing long-border source-native test `enchanted-original-long-walk-source-real-m7.test.mjs` is unchanged Git blob `8aff5b319d19b8022d21a6c240ee5b674b4a7491`.

## Added original-source engineering and exact Git blobs

| Path | Git blob | Role |
|---|---|---|
| `src/manual-biomes/enchanted-original-authored-mouth-audit.mjs` | `5c6f56e022e860d0b06cfc3ae0664a3b6cf3a2c6` | Read real 4 named original M7 `environmentCaves.entranceSites` mouths, authored cave floor/AIR, genuine body/probe; refuse near-AIR false cave claims; read-only short original `stepPlayer` doorway witnesses |
| `tests/manual-biomes/enchanted-original-authored-mouth-real-m7.test.mjs` | `16c33994464462531c8a2e58a46dd01496618a85` | 2 new native cave source/doorway test functions |
| `src/manual-biomes/enchanted-original-physics-tick-trace.mjs` | `470cb8968cd40ed336e98e67840f19198fcf8a7a` | Every real 25ms original `stepPlayer` tick with inherited velocity/gravity, exact independent accepted replay parity, actual player signed chunk seam and vertical positions |
| `tests/manual-biomes/enchanted-original-physics-tick-trace-real-m7.test.mjs` | `5e095725916ed5c0c38ca8894b0520c8f6df9034` | 2 new native tick-level seam/edit-veto functions |
| `src/manual-biomes/enchanted-original-cave-descent-evidence.mjs` | `7fe76ca6ede339e6f36c595bbd7018c6d2f5892a` | Recover genuine named original entrance directions from immutable author anchors + mouth `approachSteps`; validate each source-owned floor/AIR against real world; walk original player outside→mouth→6 inner ramp steps with gravity and actual floor contact |
| `tests/manual-biomes/enchanted-original-cave-descent-real-m7.test.mjs` | `5327e42521c859c6dd9ee211c5e6c3ae5f4f755c` | 3 new native original/candidate source, real continuous descent and mined support veto functions |
| `.github/workflows/enchanted-phase2-authored-mouth-native.yml` | `f84527c853cfc277210c685fc4f05e0979604339` | Changed-only Node22 native 4-case evidence; publishes isolated commit status + exact run URL |
| `.github/workflows/enchanted-phase2-descent-native.yml` | `c36b3eedcb6391d39485e39a60d213b6bf3d48e8` | Changed-only native 3-case real authored descent evidence, status + URL |
| `.github/workflows/enchanted-phase2-long-walk-evidence-native.yml` | `f4ab41b8e6ad7c0a98de7297a6eb0eb7e27babca` | Changed-only native execution of the PREVIOUS unverified but unchanged two-test long border source, status + URL |

No changes to `src/voxel.mjs`, `src/physics.mjs`, cave source authoring, environmental overlays, trees, schema-1 storage, main app, renderer, PWA, settlements, other biomes, hourly automations or other developers.

## Original-source native Node 22 — accepted results with actual job logs

### 1. Named original cave mouth provenance, tick-level signed chunk physics — 4/4 PASS

[Actions #45192357135](https://github.com/hdog960/Mythwrought/actions/runs/45192357135), exact CI commit `b889844cd0134ae701ae98063540236f6d0e1c77`, successful job `137753721407`; verified job logs and isolated `enchanted-p2-authored-mouth-tick-native` success status.

Authentic original seed -88 cave mouth source, each with **genuine authored solid floor and 3 authored headroom AIR cells**, world.get parity and real collision/ground probe:
- `old-deep24`: mouth `[50,4,64]`, actual player body supported; historical physical cap feet 4.
- `switchback36`: mouth `[192,7,168]`, actual player body supported; historical cap feet 7.
- `upper24-windcut`: mouth `[64,9,-128]`, actual player body supported; prior conservative *legacy-ground* cap returns null (it does NOT represent this cave-owned raised floor).
- `upper24-hollowbend`: mouth `[-138,6,64]`, actual player body supported; historical cap feet 6.

Three mouths (old-deep24, switchback36, hollowbend) each had **2/2** authentic original `stepPlayer` 2-leg physical doorway-waypoint witnesses (six total). Windcut had zero from old legacy-floor-only cap; this is not a terrain defect.

One original seed -88 negative-X *actual player tick* trace from `[-272,-588]` across `[-273,-588]` to `[-275,-588]` completed **28 original and 28 candidate actual ticks**; true player crossed signed chunk `[-17,-37]`→`[-18,-37]` on **tick 7**, at continuous real player coordinates `[-272.03784370546094,6,-587.5]`. All 28 ticks had genuine ground contact. This particular short route had 0 feet vertical range; do not mislabel it a height-changing route. Real mined source AIR veto returned 0 accepted tick frames.

### 2. Original authored cave entrance **real outside→mouth→inner descent** — 3/3 PASS

[Actions #45193982272](https://github.com/hdog960/Mythwrought/actions/runs/45193982272), exact native CI commit `79ba44311841715cdfc5157dddb1ea478fa17072`, successful job `137759408625`; verified original GitHub logs and `enchanted-p2-authored-cave-descent-native` status.

All FOUR named caves had exact source-authored floors and original-world headroom/whole-player collision support for each of seven consecutive real ramp cells, with a separate genuine outside source support. Continuous real original and experimental `stepPlayer` walks succeeded for **all four**:
- `old-deep24`: 7 legs / 107 original ticks / 107 experimental ticks, actual player drop 3.0000.
- `switchback36`: 7 legs / 107 original / 107 experimental, actual player drop 3.0000.
- `upper24-windcut`: 7 legs / 107 original / 107 experimental, actual player drop 2.0000 relative to real outside initial feet 8 (mouth feet 9, one authentic upward step, then 3-block authored inward floor drop).
- `upper24-hollowbend`: 7 legs / 107 original / 107 experimental, actual player drop 3.0000.

These are **four genuine outside-to-inner cave entrance walking witnesses** with no teleport, ground edit, fake cave floor, authored source replacement or velocity reset. This is *not* acceptance of the complete subterranean network, a landmark-specific walk, all seeds or mobile performance. Actual `world.set` mining of an interior authored Windcut floor to AIR on a disposable M7 test world returned a fail-closed null cap and vetoed route replay.

**Authentic intermediate failures and correction:**
- [Actions #45193462694](https://github.com/hdog960/Mythwrought/actions/runs/45193462694) (native exact `d250988e2707f4c369bfc14483a03619d5e1e720`): 2/3 pass, 1 true descent failure. The *research driver* stopped input `0.24` blocks short of the next floor's center, while real original `BODY_RADIUS=0.28` still overlapped the higher ledge. Physically real floor had not been reached; neither original physics nor cave terrain was changed.
- [Actions #45193772103](https://github.com/hdog960/Mythwrought/actions/runs/45193772103) (native exact `77b3b93a6d9b7587857c08abe478f3ab6d984475`): 2/3 pass; **stricter** `0.12` horizontal release reached genuine gravity-settled lower steps. Test incorrectly demanded three-block net drop even where the legitimate outside entry was one block BELOW the mouth (Windcut).
- Final source-relative original start-to-end net feet comparison (no physics weakening) plus stricter approach passed **3/3** in #45193982272. The failures are resolved, not omitted.

### 3. Extended original seed -88 both-side Enchanted→Plains walking — 2/2 PASS

[Actions #45194212945](https://github.com/hdog960/Mythwrought/actions/runs/45194212945), exact native CI commit `82c167a06a7b30cf86c145e178e50a9c5bc2c4d5`, successful job `137760210846`; verified full native logs and `enchanted-p2-long-border-walk-native` success status.

Exact ORIGINAL long-route source/test Git blobs matched the prior `40114038a9db6d1dd79a6beb3d71017880df0572` checkpoint. The original push-run ID for that earlier commit itself was unavailable through the connector; the same original source/test bytes were **independently executed** at `82c167a...`, so this is an actual supported native acceptance, not an invented 401 result.

Four actual original-and-experimental replayed walks, **every one** with genuine authored-overlay→legacy-ground transition, 16-block chunk crossing, original height changes, Enchanted→Plains transition, original/candidate equal physics ticks, and no local cave support override:
| Side | From → to | Legs | Original / candidate physics ticks | Actual source surface-height transitions |
|---|---|---:|---:|---:|
| negative-X | `[-266,-588]` → `[-275,-588]` | 9 | 85/85 | 1 |
| negative-X | `[-266,-588]` → `[-275,-587]` | 9 | 89/89 | 1 |
| positive-X | `[252,-600]` → `[261,-598]` | 9 | 93/93 | 2 |
| positive-X | `[252,-600]` → `[262,-600]` | 10 | 94/94 | 2 |

Each of the two 16-block boundary regions was searched only once with a narrow width-2 FIFO corridor, single-arrival mode, strict original 192-visit / 512-attempt / 8192-tick maxima (native actual visits **47** negative-X, **51** positive-X; no truncation). Both original source/environmental overlay ownership and actual feet/body collision remained authoritative. Existing disposable-world mined-support replay veto also passed.

## CI budget and reusable earlier evidence

- **New final passing targeted native jobs:** #45192357135 (**4/4**), #45193982272 (**3/3**), #45194212945 (**2/2**) = **nine** added distinct native test functions green, against authenticated original repository source and exact hashes.
- **Changed-only intermediate failure diagnostics:** #45193462694 (2/3) and #45193772103 (2/3) led to source-conservative research-driver repair and exact source-relative assertion repair. None of these failures were hidden or treated as successful acceptance.
- **REUSED without rerun:** original 52 legacy-ground diagnoses, earlier ten 2–4-leg original/candidate physically crossed seed -88 borders, original Desert search default bit-exact parity, edit AIR veto, old tree GPU, original 288 chunks, bounded 128/1024 caches, Moonwillow WebGL2, original Actions #45113899041, #45114104400, #45114256380 and #45114381719.
- **AVOIDED:** broad suites, duplicate unchanged native tests, Chromium/Playwright, PNG/GPU captures, entire other-developer CI, test weakening, workflow cancellation/retargeting, merging, PWA deployment or modification.
- Only read-only GitHub Actions commit statuses were added for **this isolated child** to expose exact authenticated run/job URLs to the GitHub connector. No protected branch ref moves or production effect.

## Unresolved gates and recommended NEXT development

1. Extend true **source-authored cave descent** beyond the six interior ramp steps toward the actual old source anchor and deep network, with strict bounded runs and original/candidate continuous `stepPlayer` replay, authored AIR/floor, player-body/headroom and mined-support veto preserved. Distinguish near-surface entrance acceptance from actual full deep cave route connectivity and unreachable/edited source blockers.
2. Distinguish source-authored named landmark-specific **physical approaches** from cave mouth routes. A nearby AIR or a seeded landmark survey is not a physically walked landmark. Require exact original landmark provenance plus continuous real player movement before claiming acceptance.
3. Extend original 9–10-leg border witnesses toward 16–24-leg limits if useful, including real player per-tick vertical/ground contact across mixed overlays and **actual** surface relief, preserving original source and strict 192-visit/512-attempt/8192-physics-tick budgets. Existing four routes already prove the requested crossing/height/seam combination; do not rerun unchanged proofs.
4. Experimental trees remain disabled by default, research-only and **cannot be serialized as historical M7 schema-1**. A distinct generator-version safe migration/release approval is required before any live wiring.
5. Physical iPhone 17 Pro Max **installed Home Screen PWA** FPS, frame p95, JS heap, GPU resident bytes, thermal, offline recovery and save preservation have NOT been tested. Zero made-up metrics.
6. Continue in a new isolated child, not protected main/parent or other developer lanes. Keep global anti-clogging: verify exact refs once; reuse these exact native artifacts rather than re-running broad CI; run narrowly scoped authentic tests only for new source; never merge/deploy/cancel/alter other developers without separate authorization.

**Research conclusion:** Original seed -88 now has native-authenticated BOTH-SIDE nine-to-ten-leg Enchanted→Plains walks with actual authored-overlay/legacy-source handoff, historical height variation and real chunk seams; four named original source-owned caves have authentic outside-to-inside gravity-descending original-and-experimental player walks; and real AIR edits veto every independently tested physical support path. All work remains research-only, separate from release/integration and from user saves.
