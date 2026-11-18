// M5 hard-gate audit. This file deliberately exits NONZERO for an
// inaccessible real biome. No invented straight-line path or debug teleport.
// It replays every approved route via the production player controller.
// Failed regions are recorded independently; other gates may still pass.
import {mkdir,writeFile} from 'node:fs/promises';
import {FourRegionWorld,FOUR_REGION_GENERATOR} from
  '../../src/manual-biomes/profile-world.mjs';
import {Pack2LiveWorld} from '../../src/pack2-world.mjs';
import {loadExploration} from '../../src/exploration-map.mjs';
import {planM5NaturalOverland,replayM5PhysicalWalk,M5_OVERLAND_TARGETS}
  from '../../src/manual-biomes/overland-walk-m5.mjs';
import path from 'node:path';

const out=path.join(process.cwd(),'artifacts/manual-biomes-m5-route');
await mkdir(out,{recursive:true});
const seed=179,world=new Pack2LiveWorld(new FourRegionWorld(seed));
if(world.base.generationProfile.generator!==FOUR_REGION_GENERATOR)
  throw Error('M5 audit requires exact latest v4 immutable profile world');
const before=JSON.stringify(world.save());
const storage={state:new Map(),getItem(k){return this.state.get(k)??null;},
  setItem(k,v){this.state.set(k,v)}};
const results=[];
for(const target of M5_OVERLAND_TARGETS){
  const started=Date.now();
  const planned=planM5NaturalOverland(world,{seed,target:target.name});
  let physical=null,mapProof=null;
  if(planned.ok){
    const map=loadExploration(storage,seed);
    const seenBefore=map.seen.size;
    physical=replayM5PhysicalWalk(world,planned,{
      maxFramesPerCell:34,
      onAdvance:({x,z})=>map.reveal(x,z)
    });
    map.flush();
    mapProof={visitedTiles:map.seen.size,unvisitedAtStart:seenBefore===0,
      seedPreserved:loadExploration(storage,7).seen.size===0,
      worldSaveUnchanged:JSON.stringify(world.save())===before};
  }
  const result={name:target.name,source:target,planOk:planned.ok,
    reason:planned.reason||null,sampled:planned.sampled,visited:planned.visited,
    pathCells:planned.path?.length||0,physical,discovery:mapProof,
    minutes:(Date.now()-started)/60000};
  results.push(result);
  console.log('# M5_REAL_OVERLAND_AUDIT '+JSON.stringify(result));
}
const complete=results.every(r=>r.planOk&&r.physical?.ok&&
  r.discovery?.seedPreserved&&r.discovery?.worldSaveUnchanged);
const originalUnchanged=before===JSON.stringify(world.save());
await writeFile(path.join(out,'manifest.json'),JSON.stringify({
  kind:'mythwrought-m5-real-physical-overland-route-audit',
  seed,profile:world.base.generationProfile,
  runtime:'actual Pack2LiveWorld, real stepPlayer, no debug teleport',
  routePolicy:'bounded physical AABB source path, continuous full-step replay',
  allReached:complete,originalWorldUnchanged:originalUnchanged,
  physicalIphone:false,publicGameplay:false,results
},null,2));
if(!complete||!originalUnchanged)
  throw Error('M5 natural 4-region WALK GATE FAILED: '+
    results.filter(x=>!x.planOk||!x.physical?.ok)
      .map(x=>x.name+': '+(x.reason||x.physical?.reason)).join(' | '));
console.log('PASS M5 all four actual natural source walks, real physics and fog-safe map visits');
