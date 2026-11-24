// New outer-ring windows, ranked by actual source cap admission on a
// staggered lattice. Old searches were confined to macrotiles -5..5.
// The full unchanged relief survey is still required for every candidate.
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {defineP0Footprint,inspectP0GroundColumn} from './forgotten-sands-grounded-probe.mjs';
export function p0OuterCapWindows(world,{reserved,limit=16}={}){
  if(typeof reserved!=='function'||!Number.isInteger(limit)||limit<1||limit>20)throw Error('Invalid outer search');
  const seed=world.seed,ranked=[];let samples=0,tiles=0;
  for(let tz=-9;tz<=9;tz++)for(let tx=-9;tx<=9;tx++){
    if(Math.max(Math.abs(tx),Math.abs(tz))<=5)continue;
    if(v6BiomeAt(tx*512,tz*512,seed)?.name!=='desert')continue;tiles++;
    for(const [dx,dz] of [[-112,-48],[48,-112],[112,48],[-48,112],[0,0]]){
      const x=tx*512+dx,z=tz*512+dz;let clear=0,min=255,max=0;
      for(const oz of [-48,-24,0,24,48])for(const ox of [-48,-24,0,24,48]){
        const px=x+ox,pz=z+oz,r=inspectP0GroundColumn(world,defineP0Footprint({seed,x:px,z:pz}),px,pz,reserved);samples++;
        if(r.ok){clear++;min=Math.min(min,r.cap);max=Math.max(max,r.cap);}
      }
      if(clear>=18)ranked.push({seed,x,z,size:127,clear,relief:max-min,tx,tz});
    }
  }
  // Rank by admitted sampled caps, then relief. Limit two per macrotile.
  ranked.sort((a,b)=>b.clear-a.clear||a.relief-b.relief||a.tx*a.tx+a.tz*a.tz-b.tx*b.tx-b.tz*b.tz||a.z-b.z||a.x-b.x);
  const counts=new Map(),windows=[];
  for(const r of ranked){const k=r.tx+','+r.tz,n=counts.get(k)??0;if(n>=2)continue;
    windows.push(Object.freeze(r));counts.set(k,n+1);if(windows.length===limit)break;}
  return Object.freeze({samples,tiles,windows:Object.freeze(windows)});
}
