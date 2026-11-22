// Detached Phase 2 research only: propose a candidate, never create a mob or edit a world.
// Strict original residency, population, rarity, physics, habitat, occupancy and per-tick budget.
import {sectionForY} from '../depth.mjs';
import {validPoint} from './world-query.mjs';
import {eligibleHabitatPool,deterministicHabitatRoll,planHabitatCandidate}
  from './ecosystem-habitat.mjs';
import {proposeTerrainAwarePosition} from './ecosystem-terrain-placement.mjs';

export const MAX_PROPOSALS_PER_TICK=6; // Original PopulationManager.MAX_TESTS
export const MAX_OCCUPIED_CANDIDATES=32; // Original live MobEngine maxEntities
export const MIN_OCCUPANCY_SEPARATION=1.2; // Original PopulationManager
const RARITY_SALT=0x3c91c7f5;

function validRegion(region){
  return Number.isSafeInteger(region?.cx)&&Number.isSafeInteger(region?.cz)&&
    Number.isSafeInteger(region?.section)&&
    Math.abs(region.cx)<2**22&&Math.abs(region.cz)<2**22&&
    Number.isFinite(region.feet)&&
    sectionForY(Math.floor(region.feet))===region.section;
}
function report(attempts,serial,rejected,proposal=null){
  return Object.freeze({
    attempts,nextSerial:serial,
    rejected:Object.freeze({...rejected}),
    proposal:proposal?Object.freeze({...proposal}):null
  });
}

// A safe research observation, not a replacement for the live spawn manager.
// The host must supply complete real local species counts and all nearby occupants.
// Never infer missing counts as zero. No runtime or save mutation is possible.
export function proposeRegionalMobSpawn({
  world,seed,region,observer,biome,light,kind='surface',
  localCounts,occupiedPositions,rosterAvailable,startSerial=0
}={}){
  if(typeof world?.residentAt!=='function'||typeof world?.volume!=='function'||
     typeof world?.grounded!=='function'||typeof world?.environment!=='function'||
     !Number.isSafeInteger(seed)||!validRegion(region)||!validPoint(observer)||
     !Number.isFinite(light)||light<0||light>1||
     !['surface','cave'].includes(kind)||
     (kind==='surface')!==(region.section===0)||
     !(localCounts instanceof Map)||!Array.isArray(occupiedPositions)||
     occupiedPositions.length>MAX_OCCUPIED_CANDIDATES||
     !occupiedPositions.every(validPoint)||
     typeof rosterAvailable!=='boolean'||
     !Number.isSafeInteger(startSerial)||startSerial<0||
     startSerial>Number.MAX_SAFE_INTEGER-MAX_PROPOSALS_PER_TICK)
    throw new TypeError('Invalid original-game regional mob proposal state');

  const pool=eligibleHabitatPool({biome,light,feet:region.feet});
  if(pool.some(species=>!localCounts.has(species.id)||
    !Number.isSafeInteger(localCounts.get(species.id))||
    localCounts.get(species.id)<0))
    throw new TypeError('Missing or invalid original local population counts');

  const rejected={rarity:0,population:0,unloaded:0,physicalHabitat:0,occupied:0,eligible:0};
  if(!rosterAvailable||pool.length===0)
    return report(0,startSerial,rejected);
  let serial=startSerial;
  const {cx,cz,section,feet}=region;
  for(let attempt=1;attempt<=MAX_PROPOSALS_PER_TICK;attempt++){
    const next=++serial;
    const candidate=planHabitatCandidate(pool,{seed,cx,cz,section,serial:next});
    const species=candidate.species;
    // Separate deterministic rarity draw: weighting alone is insufficient.
    const rarity=deterministicHabitatRoll(seed^RARITY_SALT,cx,cz,section,next);
    if(rarity>species.population.rarity){rejected.rarity++;continue;}
    if(localCounts.get(species.id)>=species.population.localLimit){
      rejected.population++;continue;
    }
    // Source 3D section residency is required BEFORE expensive vertical scans.
    if(world.residentAt([candidate.x,feet,candidate.z])!==true){
      rejected.unloaded++;continue;
    }
    const placed=proposeTerrainAwarePosition(world,{
      species,x:candidate.x,z:candidate.z,feet,section,observer,kind
    });
    if(!placed){rejected.physicalHabitat++;continue;}
    if(occupiedPositions.some(p=>Math.hypot(
      placed.point[0]-p[0],placed.point[1]-p[1],placed.point[2]-p[2]
    )<MIN_OCCUPANCY_SEPARATION)){
      rejected.occupied++;continue;
    }
    rejected.eligible++;
    return report(attempt,serial,rejected,{
      species,point:placed.point,section,sourceSerial:next,
      offset:placed.offset,windowsTried:placed.windowsTried,kind
    });
  }
  return report(MAX_PROPOSALS_PER_TICK,serial,rejected);
}
