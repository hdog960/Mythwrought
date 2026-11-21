# Settlement citizens

## C0 repository audit

The draft starts from main at `7016e14cd6289f45eaf7fc6a79a362b47996df65`, verified against GitHub on November 21, 2026. Open work includes Creative and menu PR #292, deep-mining PR #294, builder lanes, and hourly automation candidates. Citizen work belongs in the citizen draft and its standalone fixtures.

| Existing owner | Candidate citizen interface |
| --- | --- |
| `src/mobs/live-game.mjs`, `src/mobs/engine.mjs`, `src/mobs/host-view.mjs` | Observe live hostile entities through an adapter. Keep the 40-creature roster and its spawn logic in the mob system. |
| `src/mobs/world-query.mjs`, `src/mobs/movement.mjs`, `src/mobs/navigation.mjs` | Start with existing residency, collision, supported position, and bounded local navigation. Citizen roles own home bounds and destination selection. |
| `src/mobs/combat.mjs` | Evaluate the existing damage and cooldown contracts for the five designated defenders and test with genuine roster creatures. |
| `src/mobs/live-render.mjs` | Reuse established mesh batching and resource lifetime patterns. Citizen rigs and outfit geometry belong to the citizen renderer. |
| `src/world-clock.mjs`, `src/main.mjs` | Accept time through a read-only input when a service needs it. Keep player clock, controls, recorder, and production boot path with their current owners. |
| `src/persistence.mjs`, `src/mobs/roster-persistence.mjs` | Use an independent versioned citizen sidecar and test corruption and stable identity. Schema-1 terrain files stay with the existing save pipeline. |
| Building and future settlement projects | Pass IDs, safe positions, bounds, workplace anchors, and configured population. Building geometry, procedural settlement layouts, and population policy stay with their respective projects. |

## Implementation order

1. Define citizen identity, race, profession, biome, style and workplace contracts. Enumerate and validate the 82 profession rows independently of the renderer.
2. Build shared articulated meshes, biome and settlement clothing treatments, and reusable animations. Inspect rendered variants across all eight occupation groups and the ordinary roster.
3. Connect bounded roaming and workplace selection to actual collision and residency. Then integrate fear and the five defenders against genuine creature entities.
4. Implement each profession's available actions and offline interactions. Record missing gameplay services against named dependencies.
5. Add settlement population and persistent state adapters, a separate interactive test harness, renderer captures, and population performance benchmarks. Run the fixed regression gates before handing the draft off.

## Progress ledger

| Area | Current evidence |
| --- | --- |
| Repository foundation | Main and open work audited. Citizen worktree based on the verified main commit. |
| Data architecture | Six races, 82 careers, five biome inputs, three settlement styles, immutable identity records, and compatible workplace assignment. Targeted tests validate all 4,920 working appearance inputs. |
| Visuals | 4,920 / 4,920 working, 50 / 50 ordinary, 6 / 6 races rendered in the shared rig, 8 / 8 rendered and inspected visual groups. |
| AI and persistence | Bounded roaming, workplace navigation, all five defender reactions, civilian fear, and verified citizen sidecar recovery pass voxel and mob tests. The standalone fixture repeats the key behavior in Chromium. |
| Professions | 82 / 82 reach a compatible work marker and have an offline interaction in automated tests. Transactional services are gated on authoritative gameplay backends. The mayor and astronomer supply contextual information. |
| Quality | 114 targeted tests, 4,970 distinct render hashes, 15 fixture configurations, and four population stress tiers verified locally. Latest full hosted regression and physical iPhone measurements are separate acceptance checks. |

Race display names Thornkin, Asteri, and Glassborn are provisional. Actual population sizes, race frequencies, worker ratios, and natural settlement generation are deferred.


## C2 rig evidence

The draft-only preview runs from `/citizen-preview/` under an ordinary static development server. It opens with six blacksmiths in a walking cycle so proportions, limb pivots, and tool attachment can be compared. The view also supports individual races, biome, settlement style, appearance variant, and pose selection.

- [Six races walking at 844×390](evidence/rig-walk-844.png)
- [Six races walking at 1280×640](evidence/rig-walk-1280.png)
- [Glassborn in snow with city styling at 844×390](evidence/rig-glassborn-snow-city-844.png)
- [Browser report with pixel coverage, draw counts, and mesh bytes](evidence/rig-report.json)

Run `python -m http.server 4197 --bind 127.0.0.1` from the draft checkout. With the repository's pinned Playwright and PNGJS test tools available, run `node scripts/ci/citizen-rig-webgl2.mjs` in another terminal. The rig evidence covers base races and shared motion. Occupation-specific outfit waves and ordinary appearance counts require their own rendered checks.


## C3 V1 agriculture and food

All 720 planned village-style base combinations rendered on the shared WebGL2 rig. Pixel hashes are unique across the entire wave, and the test verifies that no capture is empty. Mesh tests also distinguish the 12 held tools by geometry. The contact sheet shows each occupation with an example of village, town or city styling. The 12-mesh verification cache peaked at 725,760 bytes in Chromium. This test measures asset caching in the preview and supplies no physical iPhone frame-rate result.

- [Twelve occupation contact sheet](evidence/agriculture-contact-sheet.png)
- [All 720 race, biome, and variation render records](evidence/agriculture-render-manifest.json)

Run `node scripts/ci/citizen-catalog-webgl2.mjs agriculture` with the same development server and pinned browser tools.

## C3 V2 resources and craftsmanship

The 13 occupations have original hand-held tools or articles and their own workwear. All 780 village-style base combinations rendered with unique pixel hashes and nonempty coverage. The 12-mesh cache peaked at 710,208 bytes in the verification fixture. V1 was rerun after sharing the tailoring code, and its contact sheet and render manifest matched byte for byte.

- [Thirteen occupation contact sheet](evidence/craftsmanship-contact-sheet.png)
- [All 780 race, biome, and variation render records](evidence/craftsmanship-render-manifest.json)

Run `node scripts/ci/citizen-catalog-webgl2.mjs craftsmanship` against the development server.

## C3 V3 and V4 commerce and administration

Commerce and hospitality verified 660 visible WebGL2 combinations across 11 professions. The 12-mesh cache peaked at 741,312 bytes. Government and administration verified 540 visible combinations across nine professions. Its cache peaked at 694,656 bytes.

- [Commerce contact sheet](evidence/commerce-contact-sheet.png) and [660-render manifest](evidence/commerce-render-manifest.json)
- [Administration contact sheet](evidence/administration-contact-sheet.png) and [540-render manifest](evidence/administration-render-manifest.json)

Run the working visual check with `commerce` or `administration` as the wave argument.

## C3 V5–V8 and C4 ordinary citizens

| Wave | Verified pixel-distinct renders | Peak 12-mesh cache bytes | Evidence |
| --- | ---: | ---: | --- |
| Defense and transportation | 600 | 694,656 | [Contact sheet](evidence/defense-contact-sheet.png) · [Manifest](evidence/defense-render-manifest.json) |
| Healing, education and knowledge | 540 | 679,104 | [Contact sheet](evidence/knowledge-contact-sheet.png) · [Manifest](evidence/knowledge-render-manifest.json) |
| Magic and arcane | 480 | 694,656 | [Contact sheet](evidence/arcane-contact-sheet.png) · [Manifest](evidence/arcane-render-manifest.json) |
| Culture, construction and utilities | 600 | 694,656 | [Contact sheet](evidence/culture-contact-sheet.png) · [Manifest](evidence/culture-render-manifest.json) |
| Ordinary citizens | 50 | 609,120 | [Contact sheet](evidence/ordinary-contact-sheet.png) · [Manifest](evidence/ordinary-render-manifest.json) |

The 4,920 working and 50 ordinary base combinations have unique visible pixel hashes across the combined catalog. The ordinary contact sheet exercises standing and walking plus all three settlement styles across five biomes. The gallery's ordinary selection exposes ten actual catalog appearances per biome. These figures concern character visuals and do not certify workplace services or settlement population performance.

## C5 and C6 movement and creature encounters

The citizen runtime reuses the existing local navigator, voxel collision, support probes, line of sight, MobEngine damage, and MobCombat intake. It bounds wander choices to settlement regions, rates failed work approaches, pauses unloaded entities, and distinguishes deliberately displaced citizens. The baseline movement profile uses local paths up to the existing navigator's radius. Large settlements will supply intermediate anchors during integration.

Tests cover a real wall detour, work anchor loss, loaded and unloaded cells, displaced citizens, all 77 civilian careers plus ordinary citizens fleeing a real Briarlurker, and all five defenders damaging the same creature through MobEngine. Existing MobCombat also damages a guard through its normal health-target interface. Downed citizens remain incapacitated in the fixture so the settlement owner can choose a removal or recovery policy.

## C7 through C11 profession, persistence and integration evidence

The profession suite drives all 82 careers into an actual compatible work marker with the shared voxel query. It distinguishes role activity from unavailable services. The fixture verifies touchscreen inputs, offline conversation, workplace reassignment that survives reload, exact identity restoration, unchanged Schema-1 bytes, a civilian fleeing a live mob, a guard damaging a live mob, and paused simulation while unloaded. All 15 settlement style and biome combinations were opened and populated.

| Citizens | Frame p50 | Frame p95 | AI p95 | Scene draw calls |
| ---: | ---: | ---: | ---: | ---: |
| 0 | 16.7 ms | 16.7 ms | 0.1 ms | 1 |
| 1 | 16.7 ms | 16.8 ms | 0.2 ms | 2 |
| 8 | 16.7 ms | 16.7 ms | 0.4 ms | 2 |
| 24 | 16.7 ms | 16.8 ms | 0.8 ms | 2 |
| 48 | 16.7 ms | 33.3 ms | 1.6 ms | 2 |

This is a Chromium software WebGL2 run at 844×390 with repeated, instanced citizen appearances in the load fixture. The 48-citizen scene used 445,536 uploaded bytes including 416,016 bytes of terrain. Different nearby meshes add draws, and the result supplies no physical iPhone frame timing.

- [Blacksmith fixture](evidence/village-blacksmith.png)
- [Ordinary citizen fleeing](evidence/ordinary-citizen-fleeing.png)
- [Guard with a real hostile creature](evidence/guard-and-hostile.png)
- [City with 48 citizens](evidence/city-48-citizens.png)
- [Full browser and performance report](evidence/settlement-report.json)
- [Settlement adapter and service handoff](integration.md)


## Mixed population and existing game acceptance

The 932×430 city fixture spawns 24 working and 24 ordinary citizens across all six races. A worker may choose an alternate reachable station when the primary marker is too far from its home. Housing clearance includes the full citizen body. The browser test saves the group and restores all 48 exact identities in a fresh browser context. The measured scene used seven draw calls and 581,616 uploaded bytes. This was a separate Chromium run with regression work running concurrently. Its frame timings describe that run.

The original game files and installed app identity are byte-identical to the live base. In a disposable Chromium installation, all 301 files in the original PWA shell matched their verified hashes. A regular five-biome world rendered with the established 40-creature roster, changed to night, and reopened offline.

- [48 citizens across six races](evidence/city-48-mixed-citizens.png)
- [Mixed population browser and performance report](evidence/settlement-mixed-report.json)
- [Existing game offline reopening report](evidence/existing-game-offline-report.json)
