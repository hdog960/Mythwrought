// Rank new windows by actual original M7 surveyed caps, never bare height.
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {defineP0Footprint,inspectP0GroundColumn} from './forgotten-sands-grounded-probe.mjs';
import {p0ReliefWindows} from './forgotten-sands-relief-search.mjs';
import {p0SearchWindows} from './forgotten-sands-colossal-search.mjs';
import {p0AdditionalLowReliefWindows} from './forgotten-sands-low-relief-windows.mjs';
export function rankP0ActualCapWindows(world,{reserved,limit=10}={}){
  if(typeof reserved!=='function'||!Number.isInteger(limit)||limit<1||limit>12)throw Error('Invalid cap survey');
  const seed=world.seed,prior=new Set([...p0ReliefWindows(seed),...p0SearchWindows(seed).slice(0,9),...p0AdditionalLowReliefWindows(seed)].map(w=>w.x+','+w.z));
  const rows=[];let samples=0;
  for(let tz=-5;tz<=5;tz++)for(let tx=-5;tx<=5;tx++){
    if(v6BiomeAt(tx*512,tz*512,seed)?.name!=='desert')continue;
    for(const [dx,dz] of [[-96,-96],[96,-96],[-96,96],[96,96]]){
      const x=tx*512+dx,z=tz*512+dz;if(prior.has(x+','+z))continue;
      let min=255,max=0,clear=0;
      for(const oz of [-54,-27,0,27,54])for(const ox of [-54,-27,0,27,54]){
        const px=x+ox,pz=z+oz;
        const r=inspectP0GroundColumn(world,defineP0Footprint({seed,x:px,z:pz}),px,pz,reserved);samples++;
        if(r.ok){clear++;min=Math.min(min,r.cap);max=Math.max(max,r.cap);}
      }
      if(clear>=18)rows.push({seed,x,z,size:127,clear,sampledRelief:max-min,tx,tz});
    }
  }
  rows.sort((a,b)=>b.clear-a.clear||a.sampledRelief-b.sampledRelief||a.tx*a.tx+a.tz*a.tz-b.tx*b.tx-b.tz*b.tz||a.z-b.z||a.x-b.x);
  const windows=[],tiles=new Map();
  for(const w of rows){const k=w.tx+','+w.tz,n=tiles.get(k)??0;if(n>=2)continue;windows.push(Object.freeze(w));tiles.set(k,n+1);if(windows.length===limit)break;}
  return Object.freeze({samples,windows:Object.freeze(windows)});
}
