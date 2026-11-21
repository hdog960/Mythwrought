// Standalone development-only natural spawn evidence probe.
// This intentionally does not patch or import into the released runtime.
// Results describe the ORIGINAL six-candidate global-roster selection.
import {CHUNK_SIZE} from '../voxel.mjs';
import {sectionForY} from '../depth.mjs';
import {supportedPosition} from './movement.mjs';
import {spawnEligible} from './ecology.mjs';
import {distanceTo} from './behavior.mjs';

export const REJECTION_KINDS=Object.freeze([
  'rarity','population','unloaded','unsupported-terrain','wrong-section',
  'too-close','too-distant','hazard','biome','light','depth',
  'clearance','occupied','eligible'
]);

// Identical seeded mixing expression to the unmodified production ecology.
export function baselineRandom(seed,cx,cz,section,sequence){
  let n=seed^Math.imul(cx,0x9e3779b9)^Math.imul(cz,0x85ebca6b)^
    Math.imul(section,0xc2b2ae35)^Math.imul(sequence,0x27d4eb2d);
  n=Math.imul(n^(n>>>16),0x7feb352d);
  n=Math.imul(n^(n>>>15),0x846ca68b);
  return (n^(n>>>16))>>>0;
}

export function classifySpawnCandidate(world,species,point,observer){
  const dist=distanceTo(point,observer);
  if(dist<5)return 'too-close';
  if(dist>26)return 'too-distant';
  const env=world.environment(point);
  if(env.hazard)return 'hazard';
  if(!species.habitat.biomes.includes(env.biome))return 'biome';
  if(!Number.isFinite(env.light)||
    env.light<species.habitat.light[0]||env.light>species.habitat.light[1])
    return 'light';
  if(point[1]<species.habitat.depth[0]||point[1]>species.habitat.depth[1])
    return 'depth';
  return spawnEligible(world,species,point,observer)?'eligible':'clearance';
}

/**
 * Inspects at most six real world-query candidates with the original
 * algorithm. No entity creation, world mutation, save data, console logging
 * or service-worker modification. Counters are snapshots, not live gameplay.
 * Pass localCounts and occupants when reproducing an occupied region.
 */
export function probeOriginalSpawnRegion(world,species,{
  seed,cx,cz,section,feet,observer,attempts=6,serial=0,occupants=[],localCounts={}
}={}){
  if(!world||typeof world.volume!=='function'||
      !Array.isArray(species)||!species.length||!Array.isArray(observer)||
      observer.length!==3||!observer.every(Number.isFinite)||
      ![seed,cx,cz,section,serial].every(Number.isSafeInteger)||
      !Number.isFinite(feet)||!Number.isInteger(attempts)||
      attempts<1||attempts>6||!Array.isArray(occupants)||
      !localCounts||typeof localCounts!=='object'||Array.isArray(localCounts)||
      !Object.values(localCounts).every(v=>Number.isSafeInteger(v)&&v>=0)||
      sectionForY(Math.floor(feet))!==section)
    throw new TypeError('Invalid natural spawn probe input');
  const counts=Object.fromEntries(REJECTION_KINDS.map(name=>[name,0]));
  const chosen=[];
  for(let i=1;i<=attempts;i++){
    const random=baselineRandom(seed,cx,cz,section,serial+i);
    const creature=species[random%species.length];
    const x=cx*CHUNK_SIZE+(random&15)+.5;
    const z=cz*CHUNK_SIZE+((random>>>4)&15)+.5;
    let reason;
    if((localCounts[creature.id]??0)>=creature.population.localLimit)reason='population';
    else if((random>>>16)/65536>creature.population.rarity)reason='rarity';
    else{
      const point=supportedPosition(world,x,z,feet+1,feet-1.5,creature.body);
      if(!point){
        reason=world.volume([x,feet+1,z],creature.body)==='unknown'?
          'unloaded':'unsupported-terrain';
      }else if(sectionForY(Math.floor(point[1]))!==section)reason='wrong-section';
      else{
        reason=classifySpawnCandidate(world,creature,point,observer);
        if(reason==='eligible'&&occupants.some(m=>distanceTo(m.position,point)<1.2))
          reason='occupied';
      }
    }
    counts[reason]++;
    chosen.push(Object.freeze({species:creature.id,reason,x,z}));
  }
  return Object.freeze({attempts,eligible:counts.eligible,
    rejected:attempts-counts.eligible,
    reasons:Object.freeze(counts),choices:Object.freeze(chosen)});
}
