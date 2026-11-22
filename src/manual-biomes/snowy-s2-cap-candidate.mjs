// SNOW S2 PHYSICAL CAP PROPOSAL — DETACHED, NOT AN ACTIVE WORLD GENERATOR.
// Produces a single-cell, source-backed opt-in proposal; it never writes,
// edits, changes profile identities, affects old saves, or paints a shader.
// Requires a separately reviewed new generation-profile ID before activation.
import {BLOCK,terrainHeight,worldKey} from '../voxel.mjs';
import {WORLD_MAX_Y} from '../depth.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {M7_ENVIRONMENT_GENERATOR} from '../environment-ground.mjs';

export const SNOW_S2_PHYSICAL_CAP=272; // existing registered compact snow voxel
export function proposedSnowS2Cap(world,x,z){
  if(!world||![x,z].every(Number.isSafeInteger)||
      !Number.isInteger(world.seed)||
      world.generationProfile?.generator!==M7_ENVIRONMENT_GENERATOR||
      typeof world._columnPlan!=='function'||
      typeof world._environmentBaseline!=='function'||
      typeof world.get!=='function'||!(world.edits instanceof Map))
    return null;
  const biome=v6BiomeAt(x,z,world.seed);
  if(biome?.name!=='snow'||biome.weight<.8)return null;
  // The existing, accepted M7 column plan remains authoritative. Never
  // reshape a legitimate snow hill, an authored shoulder or a biome border.
  if(world._columnPlan(x,z).size!==0)return null;
  const y=terrainHeight(x,z,world.seed),at=worldKey(x,y,z);
  if(y<2||y>=WORLD_MAX_Y||world.edits.has(at)||
      world._environmentBaseline(x,y,z)!==BLOCK.GRASS||
      world.get(x,y,z)!==BLOCK.GRASS||
      world.environmentCaves?.get(x,y,z)!==undefined)return null;
  // Do not replace unsupported caps, exposed cave mouths, edit-created
  // surfaces or anything belonging to an old landmark/canopy.
  const support=world._environmentBaseline(x,y-1,z);
  if(![BLOCK.DIRT,BLOCK.STONE,BLOCK.GRASS].includes(support)||
      world.get(x,y-1,z)!==support)return null;
  for(let above=y+1;above<=WORLD_MAX_Y;above++){
    if(world._environmentBaseline(x,above,z)!==BLOCK.AIR||
        world.get(x,above,z)!==BLOCK.AIR)return null;
  }
  // Exactly one physical block, never a column fill: any original AIR at
  // y-2 or deeper, WOOD, LEAVES, STONE, cave or landform stays byte-identical.
  return Object.freeze({x,y,z,from:BLOCK.GRASS,to:SNOW_S2_PHYSICAL_CAP,
    kind:'detached-snow-s2-supported-grass-cap'});
}
