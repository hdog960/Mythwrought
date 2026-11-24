// Research only: fixed-window native M7 clearance census. No placement
// authority or automatic biome/world changes. Each step owns at most 32 columns.
import {defineP0Footprint,inspectP0GroundColumn,beginP0GroundSurvey} from './forgotten-sands-grounded-probe.mjs';
import {FourRegionWorld,M7_ENVIRONMENT_GENERATOR} from './profile-world.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
const W=127,MAX=32;
export function p0SearchWindows(seed){
  if(!Number.isSafeInteger(seed)||seed!==(seed|0))throw Error('Invalid seed');
  const result=[];
  // The original guaranteed east-of-spawn Desert tile and six neighboring
  // macrotiles; tile identity is sourced, not assumed.
  for(const [tx,tz] of [[512,0],[1024,0],[512,512],[512,-512],[1024,512],[1024,-512],[1536,0]]){
    if(v6BiomeAt(tx,tz,seed)?.name!=='desert')continue;
    for(const dz of [-120,0,120])for(const dx of [-120,0,120])
      result.push(Object.freeze({seed,x:tx+dx,z:tz+dz,size:W}));
  }
  return Object.freeze(result);
}
export function beginP0ClearanceWindow(world,window,{reserved}={}){
  if(!(world instanceof FourRegionWorld)||world.generationProfile.generator!==M7_ENVIRONMENT_GENERATOR||
    world.seed!==window.seed||window.size!==W||typeof reserved!=='function'||
    ![window.x,window.z].every(Number.isSafeInteger))throw Error('Invalid M7 clearance window');
  const x0=window.x-63,z0=window.z-63,total=W*W;
  // inspectP0GroundColumn only accepts a <=111 footprint; use a legal
  // per-column 15-wide envelope, never generate or admit any actual cells.
  const runs=new Uint8Array(W*2),counts=Object.create(null);
  let cursor=0,best=0,bestAt=null,finished=null;
  const candidates={63:[],111:[]};
  return Object.freeze({
    step(limit=MAX){
      if(!Number.isInteger(limit)||limit<1||limit>MAX)throw Error('Clearance step budget');
      if(finished)return finished;
      const start=cursor;
      while(cursor<total&&cursor-start<limit){
        const i=cursor++,ix=i%W,iz=Math.floor(i/W),x=x0+ix,z=z0+iz;
        const row=iz%2,prev=1-row,off=row*W+ix;
        const col=inspectP0GroundColumn(world,defineP0Footprint({seed:world.seed,x,z}),x,z,reserved);
        const n=col.ok?1+Math.min(ix?runs[off-1]:0,iz?runs[prev*W+ix]:0,ix&&iz?runs[prev*W+ix-1]:0):0;
        runs[off]=n;counts[col.ok?'clear':col.reason]=(counts[col.ok?'clear':col.reason]??0)+1;
        if(n>best){best=n;bestAt=[x,z];}
        for(const size of [63,111])if(n>=size&&candidates[size].length<8){
          const r=(size-1)/2;
          candidates[size].push(Object.freeze({seed:world.seed,x:x-r,z:z-r,size,height:size===63?54:90}));
        }
      }
      if(cursor===total)return finished=Object.freeze({done:true,columns:cursor,bestSquare:best,bestAt,
        scratchBytes:runs.byteLength,counts:Object.freeze({...counts}),candidates:Object.freeze({
          63:Object.freeze(candidates[63]),111:Object.freeze(candidates[111])})});
      return Object.freeze({done:false,columns:cursor});
    }
  });
}
