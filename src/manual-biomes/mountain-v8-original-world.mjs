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
export function surveyMountainV8OriginalWorld(x,z,seed,{world,onVeto}={}){
  if(!validPoint(x)||!validPoint(z)||!validSeed(seed)||
     (onVeto!==undefined&&typeof onVeto!=='function'))return null;
  const veto=(reason,px=x,pz=z,y=null)=>{
    onVeto?.(Object.freeze({reason,x:px,z:pz,y}));
    return null;
  };
  const source=world??new VoxelWorld(seed);
  if(source.constructor!==VoxelWorld||source.seed!==seed||
     source.edits.size!==0||source.rotations.size!==0)
    return veto('invalid-original-world');
  // Require real mountain biome membership and read-only original substrate
  // throughout the center and four real horizontal neighbor sites.
  for(const [dx,dz] of O){
    const px=x+dx,pz=z+dz;
    const climate=v6BiomeAt(px,pz,seed),old=terrainHeight(px,pz,seed);
    if(climate?.name!=='mountain'||climate.weight<.82)
      return veto('biome-boundary',px,pz);
    if(!Number.isSafeInteger(old)||old<3||old>=WORLD_MAX_Y-2)
      return veto('height-unavailable',px,pz);
    for(let y=old-3;y<=old-2;y++){
      const id=source.naturalAndLandmarkBlock(px,y,pz);
      if(id!==BLOCK.DIRT&&id!==BLOCK.STONE)
        return veto(id===BLOCK.AIR?'cave-air':'foreign-substrate',px,pz,y);
      // Original cave AIR, minerals, landmarks and foreign solids veto uplift
    }
  }
  let innerVeto=null;
  const outcome=surveyMountainV8Column({
    x,z,seed,worldMaxY:WORLD_MAX_Y,
    biomeAt:v6BiomeAt,heightAt:terrainHeight,
    readBlock:(a,b,c)=>source.naturalAndLandmarkBlock(a,b,c),
    // Explicit protected-veto is represented by original unedited provenance:
    // source adapter accepts only GRASS/DIRT/STONE supports and empty sky.
    ids:BLOCK,
    onVeto:issue=>{innerVeto=issue;}
  });
  if(!outcome)return veto(innerVeto?.reason??'proposal-unavailable',
    innerVeto?.x??x,innerVeto?.z??z,innerVeto?.y??null);
  if(source.edits.size!==0||source.rotations.size!==0)
    return veto('original-world-mutated');
  return Object.freeze({...outcome,
    originalSource:'VoxelWorld.naturalAndLandmarkBlock',
    biomeSource:'v6BiomeAt',heightSource:'terrainHeight',
    noLiveV7Dispatch:true,safeToIntegrate:false
  });
}
