// REAL source adapter for the non-dispatched, opt-in Mountain V8 proposal.
// It reads the original VoxelWorld, not a synthetic height map or visual proxy.
// No M7/V7 dispatch, no sidecars, no mutations, no new-world selection.
import {VoxelWorld,terrainHeight,BLOCK} from '../voxel.mjs';
import {WORLD_MAX_Y} from '../depth.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {surveyMountainV8Column} from './mountain-v8-source-adapter.mjs';

const validSeed=s=>Number.isInteger(s)&&s===(s|0);
const validPoint=n=>Number.isSafeInteger(n);
const O=Object.freeze([[0,0],[4,0],[-4,0],[0,4],[0,-4]]);

/**
 * Samples authentic legacy world provenance for a NEVER-INTEGRATED proposal.
 * Rejects cave/landmark AIR below the surface and every source-protected
 * raised voxel. All original-world reads are read-only, no edits or saves.
 * An optional prebuilt world is accepted only when it is a clean VoxelWorld.
 */
export function surveyMountainV8OriginalWorld(x,z,seed,{world}={}){
  if(!validPoint(x)||!validPoint(z)||!validSeed(seed))return null;
  const source=world??new VoxelWorld(seed);
  if(!(source instanceof VoxelWorld)||source.seed!==seed||
     source.edits.size!==0||source.rotations.size!==0)return null;
  // Require real mountain biome membership and read-only original substrate
  // throughout the center and four real horizontal neighbor sites.
  for(const [dx,dz] of O){
    const px=x+dx,pz=z+dz;
    const climate=v6BiomeAt(px,pz,seed),old=terrainHeight(px,pz,seed);
    if(climate?.name!=='mountain'||climate.weight<.82||
       old<3||old>=WORLD_MAX_Y-2)return null;
    for(let y=old-3;y<=old-2;y++){
      const id=source.naturalAndLandmarkBlock(px,y,pz);
      if(id===BLOCK.AIR)return null; // Existing physical cave must not be buried
    }
  }
  const outcome=surveyMountainV8Column({
    x,z,seed,worldMaxY:WORLD_MAX_Y,
    biomeAt:v6BiomeAt,heightAt:terrainHeight,
    readBlock:(a,b,c)=>source.naturalAndLandmarkBlock(a,b,c),
    // Explicit protected-veto is represented by original unedited provenance:
    // source adapter accepts only GRASS/DIRT/STONE supports and empty sky.
    ids:BLOCK
  });
  if(!outcome||source.edits.size!==0||source.rotations.size!==0)return null;
  return Object.freeze({...outcome,
    originalSource:'VoxelWorld.naturalAndLandmarkBlock',
    biomeSource:'v6BiomeAt',heightSource:'terrainHeight',
    noLiveV7Dispatch:true,safeToIntegrate:false
  });
}
