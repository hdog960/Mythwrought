// New windows only; cheap original terrainHeight ranking is NOT M7
// eligibility. All retained windows still require original full survey.
import {terrainHeight} from '../voxel.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {p0ReliefWindows} from './forgotten-sands-relief-search.mjs';
import {p0SearchWindows} from './forgotten-sands-colossal-search.mjs';
export function p0AdditionalLowReliefWindows(seed,{limit=12}={}){
  if(!Number.isSafeInteger(seed)||seed!==(seed|0)||!Number.isInteger(limit)||limit<1||limit>16)
    throw Error('Invalid window ranking request');
  const previous=new Set([...p0ReliefWindows(seed),...p0SearchWindows(seed).slice(0,9)].map(w=>w.x+','+w.z));
  const candidates=[];
  for(let tz=-5;tz<=5;tz++)for(let tx=-5;tx<=5;tx++){
    const tileX=tx*512,tileZ=tz*512;
    if(v6BiomeAt(tileX,tileZ,seed)?.name!=='desert')continue;
    for(const dx of [-128,-32,64,128])for(const dz of [-128,-32,64,128]){
      const x=tileX+dx,z=tileZ+dz;
      if(previous.has(x+','+z))continue;
      let min=255,max=0,ok=true;
      for(const oz of [-60,-40,-20,0,20,40,60])for(const ox of [-60,-40,-20,0,20,40,60]){
        const b=v6BiomeAt(x+ox,z+oz,seed);
        if(b?.name!=='desert'||b.weight<.85)ok=false;
        const y=terrainHeight(x+ox,z+oz,seed);min=Math.min(min,y);max=Math.max(max,y);
      }
      if(ok)candidates.push({seed,x,z,size:127,sampledRelief:max-min,tx,tz});
    }
  }
  candidates.sort((a,b)=>a.sampledRelief-b.sampledRelief||a.tx*a.tx+a.tz*a.tz-b.tx*b.tx-b.tz*b.tz||a.z-b.z||a.x-b.x);
  const selected=[],perTile=new Map();
  for(const c of candidates){
    const k=c.tx+','+c.tz,n=perTile.get(k)??0;if(n>=2)continue;
    if(selected.some(w=>Math.abs(w.x-c.x)<100&&Math.abs(w.z-c.z)<100))continue;
    selected.push(Object.freeze(c));perTile.set(k,n+1);if(selected.length===limit)break;
  }
  return Object.freeze(selected);
}
