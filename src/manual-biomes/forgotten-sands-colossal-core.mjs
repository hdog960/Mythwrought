// Exact common-core veto for 111-square searches inside a 127 window.
// Every possible 111 square contains the intersection [center-47,center+47]
// on both axes. A single original denied column there rejects every endpoint.
// Never infer clearance from absence of a sampled veto.
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {defineP0Footprint,inspectP0GroundColumn} from './forgotten-sands-grounded-probe.mjs';
const OFF=[0,-16,16,-32,32,-47,47];
export function p0NewColossalWindows(seed,{limit=256}={}){
  if(!Number.isInteger(limit)||limit<1||limit>512)throw Error('Invalid colossal window limit');
  const tiles=[];
  for(let tz=-14;tz<=14;tz++)for(let tx=-14;tx<=14;tx++){
    if(Math.max(Math.abs(tx),Math.abs(tz))<=9||v6BiomeAt(tx*512,tz*512,seed)?.name!=='desert')continue;
    tiles.push({tx,tz});
  }
  tiles.sort((a,b)=>a.tx*a.tx+a.tz*a.tz-b.tx*b.tx-b.tz*b.tz||a.tz-b.tz||a.tx-b.tx);
  const windows=[];
  for(const [dx,dz] of [[0,0],[-80,-80],[80,80],[-80,80],[80,-80],[-144,0],[144,0],[0,-144],[0,144]])
    for(const {tx,tz} of tiles){
      windows.push(Object.freeze({seed,x:tx*512+dx,z:tz*512+dz,size:127,tx,tz}));
      if(windows.length===limit)return Object.freeze(windows);
    }
  return Object.freeze(windows);
}
export function p0ColossalCoreWitness(world,window,{reserved}={}){
  if(window.seed!==world.seed||window.size!==127||typeof reserved!=='function')throw Error('Invalid colossal core witness');
  let inspected=0;
  for(const dz of OFF)for(const dx of OFF){
    const x=window.x+dx,z=window.z+dz;
    const r=inspectP0GroundColumn(world,defineP0Footprint({seed:world.seed,x,z}),x,z,reserved);inspected++;
    if(!r.ok)return Object.freeze({veto:true,inspected,witness:r,excludedEndpoints:289});
  }
  return Object.freeze({veto:false,inspected,excludedEndpoints:0});
}
