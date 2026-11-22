// Detached Phase 2: read-only bridge from actual MobEngine.all() snapshots.
// This does not import, replace, call, or mutate MobEngine or PopulationManager.
// It mirrors the original PopulationManager region high-water counting rule.
import {sectionForY} from '../depth.mjs';
import {validPoint} from './world-query.mjs';
import {speciesRegistry} from './species.mjs';
import {MAX_OCCUPIED_CANDIDATES,proposeRegionalMobSpawn}
  from './ecosystem-region-proposals.mjs';

const implemented=Object.freeze(speciesRegistry.filter(
  species=>species.implementation==='preview'));
const canonical=new Set(implemented);

// A source snapshot already contains frozen original species references.
// Protected/important entities count toward global roster and occupancy but
// NOT toward the original renewable local species caps.
export function deriveRegionalMobState(entities,region,{
  isProtected=()=>false
}={}){
  if(!Array.isArray(entities)||entities.length>MAX_OCCUPIED_CANDIDATES||
     typeof isProtected!=='function'||
     !Number.isSafeInteger(region?.cx)||!Number.isSafeInteger(region?.cz)||
     !Number.isSafeInteger(region?.section)||
     Math.abs(region.cx)>=2**22||Math.abs(region.cz)>=2**22||
     !Number.isFinite(region?.feet)||
     sectionForY(Math.floor(region.feet))!==region.section)
    throw new TypeError('Invalid original MobEngine regional roster snapshot');
  const name=[region.cx,region.cz,region.section].join(',');
  const counts=new Map(implemented.map(species=>[species.id,0]));
  const occupied=[];
  const ids=new Set();
  for(const entity of entities){
    if(typeof entity?.id!=='string'||!entity.id||
       ids.has(entity.id)||!canonical.has(entity.species)||
       !validPoint(entity.position)||
       (entity.homeChunk!==null&&typeof entity.homeChunk!=='string')||
       typeof entity.important!=='boolean')
      throw new TypeError('Invalid original mob roster entry');
    ids.add(entity.id);
    occupied.push(Object.freeze([...entity.position]));
    if(entity.homeChunk!==name||entity.important)continue;
    const protectedStatus=isProtected(entity);
    if(typeof protectedStatus!=='boolean')
      throw new TypeError('Invalid original mob protection status');
    if(!protectedStatus)
      counts.set(entity.species.id,counts.get(entity.species.id)+1);
  }
  // Map is a NEW scratch object, never a reference to engine state. Callers
  // should pass it directly to the detached evaluator, not cache or mutate it.
  return Object.freeze({
    regionName:name,
    localCounts:counts,
    occupiedPositions:Object.freeze(occupied),
    rosterAvailable:entities.length<MAX_OCCUPIED_CANDIDATES
  });
}

// Single-call adapter for future original-source tests: consumes one supplied
// engine.all() snapshot, derives ORIGINAL population semantics and produces a
// proposed position only. No game execution, persistence, or direct spawning.
export function proposeMobFromRosterSnapshot({
  entities,isProtected,region,...options
}={}){
  const state=deriveRegionalMobState(entities,region,{isProtected});
  return proposeRegionalMobSpawn({
    ...options,region,
    localCounts:state.localCounts,
    occupiedPositions:state.occupiedPositions,
    rosterAvailable:state.rosterAvailable
  });
}
