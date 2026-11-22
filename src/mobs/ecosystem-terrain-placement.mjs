// Isolated Phase 2 terrain-placement research, not a live ecology change.
// All results require ORIGINAL terrain physics + ORIGINAL spawnEligible.
// No world mutation, direct mob spawning, or save-sidecar access.
import {WORLD_MAX_Y,sectionForY} from '../depth.mjs';
import {validPoint} from './world-query.mjs';
import {supportedPosition} from './movement.mjs';
import {spawnEligible} from './ecology.mjs';

export const M7_SURFACE_WINDOW_OFFSETS=Object.freeze([0,2,-2,4,-4]);
const CAVE_OFFSETS=Object.freeze([0]);
const MAX_WINDOWS=5;
const EPS=1e-5;
// Original PopulationManager/ecology spawnEligible MAX_SPAWN_DISTANCE.
// A 2D distance >26 cannot become an eligible 3D distance at any height.
export const ORIGINAL_MAX_SPAWN_DISTANCE=26;
const MAX_MEMOIZED_VERTICAL_SLICES=128;

// Surface may search only five 2.5-block vertical windows in this fixed
// deterministic order. Caves preserve the production single-window behavior.
// A candidate must still be fully grounded, resident, correct biome/light,
// properly distant from observer and inside its originally approved section.
export function proposeTerrainAwarePosition(world,{
  species,x,z,feet,section,observer,kind='surface'
}={}){
  if(!world||typeof world.volume!=='function'||typeof world.grounded!=='function'||
      typeof world.environment!=='function'||!species?.body||
      ![x,z,feet,section].every(Number.isFinite)||!Number.isInteger(section)||
      !validPoint(observer)||sectionForY(Math.floor(feet))!==section||
      !['surface','cave'].includes(kind)||[x,z].some(v=>Math.abs(v)>=2**26))
    throw new TypeError('Invalid terrain-aware proposal');
  if(kind==='surface'&&section!==0)throw new TypeError('Surface proposal must use section 0');
  if(kind==='cave'&&section>=0)throw new TypeError('Cave proposal must use a deep section');
  // Guaranteed rejection under original source 3D distance contract.
  // Check BEFORE any expensive collision/shape queries (including caves).
  if(Math.hypot(x-observer[0],z-observer[2])>ORIGINAL_MAX_SPAWN_DISTANCE)
    return null;

  const offsets=kind==='surface'?M7_SURFACE_WINDOW_OFFSETS:CAVE_OFFSETS;
  // All windows share the SAME candidate center, source world and body.
  // Memoize only source-verified volume results during this SINGLE call.
  // Caching 'unknown' as 'unknown' preserves the original fail-closed rule;
  // there is no cache between attempts, edits, ticks, creatures or saves.
  const verticalSlices=new Map();
  const collision=Object.freeze({
    volume(point,body){
      if(body!==species.body||point[0]!==x||point[2]!==z)
        return world.volume(point,body);
      const y=point[1];
      if(verticalSlices.has(y))return verticalSlices.get(y);
      const value=world.volume(point,body);
      if(verticalSlices.size<MAX_MEMOIZED_VERTICAL_SLICES&&
          (value==='clear'||value==='solid'||value==='unknown'))
        verticalSlices.set(y,value);
      return value;
    },
    grounded(point,body){return world.grounded(point,body);}
  });
  let tested=0;
  for(const offset of offsets){
    if(++tested>MAX_WINDOWS)throw Error('Terrain placement window budget exceeded');
    const high=feet+1+offset,low=feet-1.5+offset;
    // Never issue an unknown/out-of-world body query. This does not grant
    // permissions to synthesize rock above or below the original world.
    if(high+species.body.height>WORLD_MAX_Y+1-EPS)continue;
    const point=supportedPosition(collision,x,z,high,low,species.body);
    if(!point||sectionForY(Math.floor(point[1]))!==section)continue;
    if(!spawnEligible(world,species,point,observer))continue;
    if(!world.grounded(point,species.body)&&
       !species.movement.capabilities.includes('swim'))continue;
    return Object.freeze({
      point:Object.freeze([...point]),offset,windowsTried:tested,
      kind,section
    });
  }
  return null;
}
