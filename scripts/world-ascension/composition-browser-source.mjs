// Served by the loopback proof alongside the unchanged release modules.
import { FourRegionWorld, fourRegionProfile } from '/src/manual-biomes/profile-world.mjs';
import { VEILREACH_GENERATOR } from '/src/environment-ground.mjs';
import { Pack2LiveWorld } from '/src/pack2-world.mjs';
import { BLOCK, terrainHeight, worldKey } from '/src/voxel.mjs';
import { LEGACY_GENERATION_MAX_Y } from '/src/world-height.mjs';
import { v6BiomeAt } from '/src/manual-biomes/v6-balanced-biomes.mjs';
import * as sands from '/regions/forgotten-sands/src/manual-biomes/forgotten-sands-restored-ground.mjs';
import * as frost from '/regions/frostbound/src/frostbound/s4-silverwood-barrens.mjs';
import * as frostProfile from '/regions/frostbound/src/manual-biomes/profile-world.mjs';
import * as ponds from '/regions/frostbound/src/frostbound/s5-frozen-pond.mjs';
import * as wilds from '/regions/enchanted-wilds/src/manual-biomes/enchanted-wilds-family-source.mjs';
import * as wildsProfile from '/regions/enchanted-wilds/src/manual-biomes/profile-world.mjs';
import * as peaks from '/regions/shattered-peaks/src/manual-biomes/shattered-peaks-strata.mjs';
import { openCompositionReader, openCompositionSurfaces } from './composition-reader.mjs';

const response = await fetch('/__wa/cuts.json');
if (!response.ok) throw Error('Missing verified cave cuts');
const cuts = new Set(await response.json());
if (cuts.size !== 20328) throw Error('Verified cave cut count changed');

export function loadCompositionFixture(seed) {
  const current = new FourRegionWorld(seed, fourRegionProfile(seed, VEILREACH_GENERATOR));
  const { pond, frozen, surfaceSources } = openCompositionSurfaces(current, terrainHeight,
    { sands, frost, frostProfile, ponds, wilds, wildsProfile, peaks });
  const { fixture } = openCompositionReader({ current, surfaceSources, pond, frozen, cuts, v6BiomeAt,
    worldKey, legacyCeiling: LEGACY_GENERATION_MAX_Y, air: BLOCK.AIR });
  return new Pack2LiveWorld(fixture);
}
