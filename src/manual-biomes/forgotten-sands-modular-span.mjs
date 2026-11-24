// Phase 0 research-only modular span; no continuous foundation, gap fill,
// production registration, live authority, or implied traversable connection.
import {FourRegionWorld,M7_ENVIRONMENT_GENERATOR} from './profile-world.mjs';
import {defineP0Footprint,beginP0GroundSurvey,createP0FootprintIndex,p0FootprintContains} from './forgotten-sands-grounded-probe.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {terrainHeight} from '../voxel.mjs';
import {p0ReliefWindows} from './forgotten-sands-relief-search.mjs';
const int=Number.isSafeInteger;
export function defineP0ModularSpan({seed,x,z,axis='x',size=31}){
  if(![seed,x,z,size].every(int)||!['x','z'].includes(axis)||![15,23,31].includes(size))
    throw Error('Invalid modular span');
  const spacing=(111-size)/2;
  const modules=[-spacing,0,spacing].map(d=>defineP0Footprint({seed,x:x+(axis==='x'?d:0),
    z:z+(axis==='z'?d:0),size,height:size===31?28:size===23?20:15}));
  const index=createP0FootprintIndex(modules,{clearance:8});
  return Object.freeze({seed,x,z,axis,size,span:111,spacing,gap:spacing-size,
    modules:Object.freeze(modules),index});
}
export function beginP0ModularSurvey(world,input,{reserved}={}){
  const spec=defineP0ModularSpan(input);
  if(!(world instanceof FourRegionWorld)||world.generationProfile.generator!==M7_ENVIRONMENT_GENERATOR||
    world.seed!==spec.seed||typeof reserved!=='function')throw Error('Expected quiet M7 snapshot');
  let active=0,job=beginP0GroundSurvey(world,spec.modules[0],{reserved}),done=null;
  const reports=[];
  return Object.freeze({
    step(options){
      if(done)return done;
      const r=job.step(options);
      if(r.accepted===false)return done=Object.freeze({accepted:false,reason:r.reason,failedModule:active,
        detail:r.detail,modulesCompleted:active,span:111});
      if(r.accepted===null)return Object.freeze({accepted:null,modulesCompleted:active,scannedColumns:r.scannedColumns});
      reports.push(r);active++;
      if(active<3){job=beginP0GroundSurvey(world,spec.modules[active],{reserved});
        return Object.freeze({accepted:null,modulesCompleted:active,scannedColumns:0});}
      const minCap=Math.min(...reports.map(p=>p.minCap)),maxCap=Math.max(...reports.map(p=>p.maxCap));
      // Even across disjoint modules keep the established 8-block relief limit.
      if(maxCap-minCap>8)return done=Object.freeze({accepted:false,reason:'excessive-combined-relief',minCap,maxCap,span:111});
      return done=Object.freeze({accepted:true,reason:'quiet disjoint module surveys only',span:111,
        continuousFoundation:false,connectedWalkway:false,placementAuthority:false,
        spec,minCap,maxCap,occupiedFootprintColumns:3*spec.size*spec.size,capStorageBytes:reports.reduce((n,p)=>n+p.capStorageBytes,0),
        proposedBlock(x,y,z){
          if(![x,y,z].every(int))return null;
          for(const p of reports)if(p0FootprintContains(p.site,x,z))return p.proposedBlock(x,y,z);
          return null;
        }});
    }
  });
}
// Deterministic cheap height sampling only ranks trial locations; does not
// replace native full eligibility. No old window is rescanned by this ranking.
export function p0ModularTrials(seed,{size=31,limit=48}={}){
  if(!int(limit)||limit<1||limit>96)throw Error('Invalid modular trial limit');
  const candidates=[],seen=new Set();
  const wins=p0ReliefWindows(seed);
  for(const w of wins)for(const dx of [-32,0,32])for(const dz of [-32,0,32])
    for(const axis of ['x','z']){
      const x=w.x+dx,z=w.z+dz,key=[x,z,axis].join(',');
      if(seen.has(key))continue;seen.add(key);
      const s=defineP0ModularSpan({seed,x,z,axis,size});
      const points=s.modules.flatMap(m=>[[m.x,m.z],[m.minX,m.minZ],[m.maxX,m.minZ],[m.minX,m.maxZ],[m.maxX,m.maxZ]]);
      if(points.some(([x,z])=>{const r=v6BiomeAt(x,z,seed);return r?.name!=='desert'||r.weight<.85;}))continue;
      const h=points.map(([x,z])=>terrainHeight(x,z,seed));
      candidates.push({seed,x,z,axis,size,sampledRelief:Math.max(...h)-Math.min(...h)});
    }
  candidates.sort((a,b)=>a.sampledRelief-b.sampledRelief||a.z-b.z||a.x-b.x||a.axis.localeCompare(b.axis));
  return Object.freeze(candidates.slice(0,limit).map(Object.freeze));
}
