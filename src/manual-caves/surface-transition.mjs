// Mythwrought Roadmap #240 C3: exact historical old :24 deep-spiral
// surface/depth seam. New cave-world profile ONLY. Original historical
// Y=-3 floor and all live seeded worlds remain unchanged and recoverable.
import {VoxelWorld,BLOCK,worldKey,collides} from '../voxel.mjs';
import {LEGACY_WORLD_MIN_Y,WORLD_MAX_Y} from '../depth.mjs';
import {deepCaveRoute} from '../deep-cave-network.mjs';
const directions=[-1,0,1];
export function planSpiralSurfaceTransition({seed=179,baseWorld=null,portals=null,
  forbiddenCells=null,approved=false}={}){
 if(approved!==true)return Object.freeze({ok:false,reason:'EXPLICIT_NEW_CAVE_PROFILE_REQUIRED'});
 if(!Number.isSafeInteger(seed)||seed!==(seed|0)||
    !(portals instanceof Map)||!(forbiddenCells instanceof Map))
  return Object.freeze({ok:false,reason:'REAL_SOURCE_AND_PORTALS_REQUIRED'});
 const base=baseWorld??new VoxelWorld(seed),route=deepCaveRoute();
 if(base.seed!==seed||typeof base.get!=='function'||
    typeof base.legacyBlockAt!=='function'||!(base.edits instanceof Map))
  return Object.freeze({ok:false,reason:'PROTECTED_BASE_REQUIRED'});
 const cells=new Map(),conflicts=[],affected=[];
 for(const p of route){
  if(p.floor+4<LEGACY_WORLD_MIN_Y)break;
  affected.push(p);
  for(const dx of directions)for(const dz of directions){
   const x=p.x+dx,z=p.z+dz;
   for(let y=Math.max(LEGACY_WORLD_MIN_Y,p.floor+1);
       y<=Math.min(WORLD_MAX_Y,p.floor+4);y++){
    const k=worldKey(x,y,z),id=BLOCK.AIR;
    if(base.edits.has(k)){
     conflicts.push({k,reason:'SAVED_PLAYER_EDIT'});continue;
    }
    const historic=base.get(x,y,z);
    if(historic!==BLOCK.AIR&&historic!==base.legacyBlockAt(x,y,z)){
     conflicts.push({k,reason:'EXISTING_LIVE_CAVE_OR_LANDMARK',id:historic});continue;
    }
    if(portals.has(k)&&portals.get(k)!==id){
     conflicts.push({k,reason:'SURFACE_PORTAL_SUPPORT_COLLISION',
       existing:portals.get(k)});continue;
    }
    if(forbiddenCells.has(k)&&forbiddenCells.get(k)!==id){
     conflicts.push({k,reason:'OTHER_CAVE_SOURCE_OVERLAP',
       existing:forbiddenCells.get(k)});continue;
    }
    cells.set(k,id);
   }
  }
 }
 if(!affected.length||affected.length>32)
  return Object.freeze({ok:false,reason:'UNBOUNDED_SPIRAL_SURFACE_COLLAR'});
 if(conflicts.length)return Object.freeze({ok:false,
  reason:'PROTECTED_SURFACE_SOURCE_CONFLICT',conflicts:Object.freeze(conflicts.slice(0,25)),
  conflictCount:conflicts.length,sourceSteps:affected.length});
 return Object.freeze({ok:true,cells,sourceSteps:affected.length,
  sourceRoute:Object.freeze(affected),preservedLegacyWorld:true,
  runtimeRegistered:false,profile:'new-cave-world-only'});
}
export function inspectSpiralSurfaceTransition(world,plan){
 if(!plan?.ok||!world||typeof world.get!=='function')
  return Object.freeze({ok:false,reason:'CAVE_WORLD_REQUIRED'});
 const bad=[];
 for(const p of plan.sourceRoute){
  if(world.get(p.x,p.floor,p.z)===BLOCK.AIR||
     [1,2,3,4].some(h=>world.get(p.x,p.floor+h,p.z)!==BLOCK.AIR)||
     collides(world,p.x+.5,p.floor+1,p.z+.5))
   bad.push({x:p.x,z:p.z,floor:p.floor});
 }
 return Object.freeze({ok:bad.length===0,samples:plan.sourceRoute.length,bad:Object.freeze(bad)});
}
