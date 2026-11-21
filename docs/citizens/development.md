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
| Visuals | 0 / 4,920 working, 0 / 50 ordinary, 6 / 6 races rendered in the shared rig, 0 / 8 accepted groups. |
| AI and persistence | Movement, boundaries, fear, defender combat, and sidecar save acceptance pending. |
| Professions | 0 / 82 accepted in gameplay. Service availability will be tracked per profession. |
| Quality | Shared rig verified in Chromium WebGL2 at 844×390 and 1280×640. Full citizen performance and protected-system acceptance pending. |

Race display names Thornkin, Asteri, and Glassborn are provisional. Actual population sizes, race frequencies, worker ratios, and natural settlement generation are deferred.


## C2 rig evidence

The draft-only preview runs from `/citizen-preview/` under an ordinary static development server. It opens with six blacksmiths in a walking cycle so proportions, limb pivots, and tool attachment can be compared. The view also supports individual races, biome, settlement style, appearance variant, and pose selection.

- [Six races walking at 844×390](evidence/rig-walk-844.png)
- [Six races walking at 1280×640](evidence/rig-walk-1280.png)
- [Glassborn in snow with city styling at 844×390](evidence/rig-glassborn-snow-city-844.png)
- [Browser report with pixel coverage, draw counts, and mesh bytes](evidence/rig-report.json)

Run `python -m http.server 4197 --bind 127.0.0.1` from the draft checkout. With the repository's pinned Playwright and PNGJS test tools available, run `node scripts/ci/citizen-rig-webgl2.mjs` in another terminal. The rig evidence covers base races and shared motion. Occupation-specific outfit waves and ordinary appearance counts require their own rendered checks.
