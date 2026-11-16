# Mythwrought automated biome130 — complete physical builder handoff

## Authority and scope

2026-11-16 request: finish and incorporate the *automation-owned* 130-family roster
so independent settlement builders 1A–4B can use every genuinely authored block.
This integration adds no buildings, world generation, mobs, crafting, automatic
settlement placement, manual Block Pack changes, Save v2, or v0.11 unlock.

## Source of truth

- 130 distinct source-authored symbolic families `biome130:001` through
  `biome130:130`, registered at integer block IDs 256–385 exactly.
- IDs 0–8 (legacy), 9–208 (manual reservations), 209–226 (manual Pack5
  symbolic/sidecar reservation), and 255 (sentinel) are *not* changed.
- Primary live production registry:
  `src/biome130-registry.mjs` — `BIOME130_REGISTERED_IDS`,
  `BIOME130_REGISTERED_SYMBOLS`, `biome130Block(symbolOrId,rotation)`.
- Builder entry point: `src/builder-assets/biome130.mjs` —
  `resolveBiome130BuilderAsset(symbol,orientation)`,
  `planBiome130BuilderStructure(cells,{origin})`,
  `placeBiome130BuilderStructure(world,plan)`.
- The physical builder adapter returns the **same shaped AABBs, high ID,
  material colors and rotations** that the game uses, with no cube substitute
  and without touching the eight builder-owned branches.
- The 130 blocks also appear in the existing in-game scrollable automation
  palette, with five new categories for 081–130.

## Last 50 authored families

| Symbol range | Count | Source grouping | Physical role |
|---|---:|---|---|
| 081–090 | 10 | Dungeon hardware | Inert static, solid mechanism components |
| 091–100 | 10 | Architecture | Solid region-specific construction pieces |
| 101–112 | 12 | Natural stone | Source-defined rough stone solids |
| 113–121 | 9 | Raw logs | Source-derived natural trunk shapes |
| 122–130 | 9 | Natural foliage | Source-derived **non-solid** selectable leaf shapes |
| **Total** | **50** | | **All physically defined** |

Dungeon pressure plates, spikes, locks, mechanisms and hinges are **inert**
building components; registration does not create trap damage, gates or
animation behavior. Logs remain unprocessed raw timber; natural foliage does
not secretly become a new generated tree system.

## Known renderer limit (must not misrepresent acceptance)

The shared v0.10 renderer is single-pass and opaque. Natural foliage is
non-colliding, individually selectable and built from genuine source lobes,
but the requested alpha-cutout leaf appearance is presently **opaque geometry
fallback**, not transparent leaves. The translucent ice-strut asset #095
likewise uses opaque fallback rather than real 0.72 GPU blending. Builder
metadata exposes `alphaIntent`, `transparentIntent`, and
`rendererFidelity` so artists and builders cannot accidentally report
transparency as already achieved. Fixing alpha requires a separately tested,
approved renderer art pass without regressing the existing iPhone budget.

## Builder contract

Example:

```js
import {resolveBiome130BuilderAsset,planBiome130BuilderStructure}
  from '../src/builder-assets/biome130.mjs';

const oak = resolveBiome130BuilderAsset('biome130:113','north');
const leaves = resolveBiome130BuilderAsset('biome130:122','east');
const proposal = planBiome130BuilderStructure([
  {at:[0,0,0],asset:oak.symbol,orientation:'north'},
  {at:[0,1,0],asset:leaves.symbol,orientation:'east'}
],{origin:[900,16,900]});
```

The `proposal` is read-only. `placeBiome130BuilderStructure` requires the
actual game world and no occupied target cells; failures should not be
misrepresented as placed structures. Use the manual five-pack adapter for
manual assets, not this automation-owned adapter.

## Tests and gates

- `tests/biome130-full-roster-builder.test.mjs` checks the full numeric ID
  range, every source geometry and builder symbol, rotated AABBs, ID collision
  boundaries, schema-1 save/restore/removal, surface/deep mesh, and inert/non-
  solid selection/collision.
- Existing 001–080 native acceptance and full CI scripts remain applicable.
- Exact-head full GitHub Actions Node + actual Chromium WebGL2 CI must pass
  before merging/Pages publishing.
- Physical iPhone touch, visual art acceptance, renderer alpha parity, and
  city-scale multi-owner building placement remain separate open gates.
