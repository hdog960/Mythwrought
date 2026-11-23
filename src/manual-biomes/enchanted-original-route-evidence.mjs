// Detached Phase 2 original-M7 RESEARCH audit. Every path is first replayed
// with the genuine unmodified original stepPlayer. This only describes source
// ownership, terrain heights and signed 16-block chunk seams of that walk.
// It never synthesizes a column, edits a voxel, or authorizes cave acceptance.
import {BLOCK,chunkCoord,terrainHeight} from '../voxel.mjs';
import {M7_ENVIRONMENT_GENERATOR} from '../environment-ground.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {originalM7PedestrianCap} from './enchanted-original-pedestrian-search.mjs';
import {originalM7PhysicalGroundCap} from './enchanted-original-standing-diagnostic.mjs';
import {originalM7PhysicsRouteReplay,ENCHANTED_PHYSICS_ROUTE_LIMITS}
  from './enchanted-original-physics-route.mjs';

export function auditOriginalM7PhysicallyWalkedSource(world,path,{edgeTicks=48}={}){
  if(world?.profile?.generator!==M7_ENVIRONMENT_GENERATOR||
     !Number.isInteger(world.seed)||world.seed!==(world.seed|0)||
     !Array.isArray(path)||path.length<2||
     path.length>ENCHANTED_PHYSICS_ROUTE_LIMITS.depth+1||
     !Number.isInteger(edgeTicks)||edgeTicks<1||
     edgeTicks>ENCHANTED_PHYSICS_ROUTE_LIMITS.edgeTicks)
    throw Error('Invalid original M7 physical walk audit');
  // Physics replay is the only acceptance authority. We cannot upgrade
  // geometric source cells into a real walk by inspecting them alone.
  const physics=originalM7PhysicsRouteReplay(world,path,
    {groundMode:'physical',edgeTicks});
  if(!physics.ok)return {ok:false,physics};
  const cells=[];
  for(const p of path){
    if(!Number.isSafeInteger(p?.x)||!Number.isSafeInteger(p?.z)||
       !Number.isFinite(p?.feet))
      throw Error('Invalid original M7 walk waypoint');
    const cap=originalM7PhysicalGroundCap(world,p.x,p.z);
    if(!cap||Math.abs(cap.feet-p.feet)>1e-5)
      throw Error('Original M7 source changed during physical audit');
    const overlay=world._columnPlan(p.x,p.z);
    if(!(overlay instanceof Map))
      throw Error('Noncanonical original M7 environmental overlay');
    const source=overlay.size?'authored-overlay':'legacy-ground';
    if(overlay.size){
      // A nonempty environmental map must always use the unchanged strict
      // older source admission. Never fall through rejected authored ground.
      const strict=originalM7PedestrianCap(world,p.x,p.z);
      if(!strict||strict.surface!==cap.surface)
        throw Error('Original M7 authored overlay bypass');
    }else{
      // A zero-write overlay MUST still have real world source terrain.
      // Original physical cap already checked landmark/cave AIR, original
      // body collision and support; this is a second ownership invariant.
      if(cap.surface!==terrainHeight(p.x,p.z,world.seed)||
         world._environmentBaseline(p.x,cap.surface,p.z)===BLOCK.AIR||
         world.get(p.x,cap.surface,p.z)===BLOCK.AIR)
        throw Error('Original M7 missing physical legacy source');
    }
    cells.push(Object.freeze({
      x:p.x,z:p.z,surface:cap.surface,feet:cap.feet,source,
      biome:v6BiomeAt(p.x,p.z,world.seed)?.name??'plains',
      chunkX:chunkCoord(p.x),chunkZ:chunkCoord(p.z),
      material:world.get(p.x,cap.surface,p.z),
      caveAtSupport:world.environmentCaves?.get(p.x,cap.surface,p.z)??null
    }));
  }
  let chunkSeams=0,heightChanges=0,sourceTransitions=0,biomeTransitions=0;
  for(let i=1;i<cells.length;i++){
    const a=cells[i-1],b=cells[i];
    if(a.chunkX!==b.chunkX||a.chunkZ!==b.chunkZ)chunkSeams++;
    if(a.surface!==b.surface)heightChanges++;
    if(a.source!==b.source)sourceTransitions++;
    if(a.biome!==b.biome)biomeTransitions++;
  }
  const overlayCells=cells.filter(c=>c.source==='authored-overlay').length;
  const legacyCells=cells.length-overlayCells;
  return {
    ok:true,physics,cells,
    metrics:Object.freeze({legs:physics.legs,
      overlayCells,legacyCells,sourceTransitions,chunkSeams,
      heightChanges,biomeTransitions,
      start:[cells[0].x,cells[0].z],
      end:[cells.at(-1).x,cells.at(-1).z],
      netDisplacement:Math.hypot(cells.at(-1).x-cells[0].x,
        cells.at(-1).z-cells[0].z),
      // Local support-cell cave data is NOT evidence of a traversed mouth.
      caveSupportOverrideCells:cells.filter(c=>c.caveAtSupport!==null).length
    })
  };
}
