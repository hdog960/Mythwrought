// MYTHWROUGHT Floating Islands: genuine-source flora bridge, DETACHED.
// This imports the real authored biome130 registry, rather than assigning any
// guessed plant IDs or silently constructing fake full-cube decorations.
// The Codex sky generator/complete-surface sidecar still has to supply its
// verified identity, physical world and section revision. Not wired to main.
import {biome130Block,isBiome130BlockId} from '../biome130-registry.mjs';
import {originalSkyMaterials} from './sky-original-host.mjs';
import {createOriginalSkyFloraAuthority,planOriginalSkyEcology}
  from './sky-original-flora-authority.mjs';

export const originalSkyFloraAuthority=createOriginalSkyFloraAuthority({
  biome130Block,isBiome130BlockId,materials:originalSkyMaterials
});

export function planRealOriginalSkyFlora({physicalHost,source,seed,plan,
  maxCells=512}={}){
  if(!physicalHost||physicalHost.materials!==originalSkyMaterials)
    throw new TypeError('Original physical-block registry host required');
  return planOriginalSkyEcology({physicalHost,source,seed,plan,
    materials:originalSkyFloraAuthority,maxCells});
}
