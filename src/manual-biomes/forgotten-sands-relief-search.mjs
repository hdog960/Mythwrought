// Offline research only. Original M7 column admission remains unchanged.
import {defineP0Footprint,inspectP0GroundColumn} from './forgotten-sands-grounded-probe.mjs';
import {FourRegionWorld,M7_ENVIRONMENT_GENERATOR} from './profile-world.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
const W=127,HALF=63,MAX=32,KEEP=12;
export function p0ReliefWindows(seed){
  if(!Number.isSafeInteger(seed)||seed!==(seed|0))throw Error('Invalid seed');
  const result=[[512,-120],[392,0],[512,0]];
  const tiles=[];
  for(let tz=-3;tz<=3;tz++)for(let tx=-3;tx<=4;tx++){
    if(tx===1&&tz===0)continue;
    if(v6BiomeAt(tx*512,tz*512,seed)?.name==='desert')tiles.push({tx,tz});
  }
  tiles.sort((a,b)=>a.tx*a.tx+a.tz*a.tz-b.tx*b.tx-b.tz*b.tz||a.tz-b.tz||a.tx-b.tx);
  for(const {tx,tz} of tiles.slice(0,3))
    for(const [dx,dz] of [[-76,-76],[76,-76],[-76,76],[76,76]])
      result.push([tx*512+dx,tz*512+dz]);
  return Object.freeze(result.map(([x,z])=>Object.freeze({seed,x,z,size:W})));
}
const rank=(a,b)=>a.relief-b.relief||a.maxCap-b.maxCap||a.z-b.z||a.x-b.x;
export function beginP0ReliefWindow(world,window,{reserved}={}){
  if(!(world instanceof FourRegionWorld)||world.generationProfile.generator!==M7_ENVIRONMENT_GENERATOR||
    window?.seed!==world.seed||window.size!==W||typeof reserved!=='function'||
    ![window.x,window.z].every(Number.isSafeInteger))throw Error('Invalid relief window');
  const x0=window.x-HALF,z0=window.z-HALF,total=W*W;
  const caps=new Uint8Array(total),runs=new Uint8Array(W*2);
  // One byte per column: 0=denied; actual original cap 2..17 otherwise.
  // A compact list is not needed: second pass streams all endpoints.
  const endSquares=new Uint8Array(total);
  const candidates={63:[],111:[]},clearSquares={63:0,111:0},reliefVeto={63:0,111:0},counts={};
  let cursor=0,rankCursor=0,best=0,done=null;
  function add(i,size){
    clearSquares[size]++;
    const ix=i%W,iz=Math.floor(i/W);let min=255,max=0;
    for(let z=iz-size+1;z<=iz;z++)for(let x=ix-size+1;x<=ix;x++){
      const c=caps[z*W+x];if(!c)throw Error('Clearance DP contradiction');
      min=Math.min(min,c);max=Math.max(max,c);
    }
    const relief=max-min;
    if(relief>8){reliefVeto[size]++;return;}
    const r=(size-1)/2,c=Object.freeze({seed:world.seed,x:x0+ix-r,z:z0+iz-r,size,height:size===63?54:90,
      relief,minCap:min,maxCap:max});
    const a=candidates[size];a.push(c);a.sort(rank);if(a.length>KEEP)a.pop();
  }
  return Object.freeze({
    step(limit=MAX){
      if(!Number.isInteger(limit)||limit<1||limit>MAX)throw Error('Invalid survey budget');
      if(done)return done;
      if(cursor<total){
        const start=cursor;
        while(cursor<total&&cursor-start<limit){
          const i=cursor++,ix=i%W,iz=Math.floor(i/W),x=x0+ix,z=z0+iz;
          const col=inspectP0GroundColumn(world,defineP0Footprint({seed:world.seed,x,z}),x,z,reserved);
          counts[col.ok?'clear':col.reason]=(counts[col.ok?'clear':col.reason]??0)+1;
          if(col.ok)caps[i]=col.cap;
          const row=iz%2,off=row*W+ix,prev=(1-row)*W+ix;
          const n=col.ok?1+Math.min(ix?runs[off-1]:0,iz?runs[prev]:0,ix&&iz?runs[prev-1]:0):0;
          runs[off]=n;endSquares[i]=n;best=Math.max(best,n);
        }
      }else{
        // At most 8 endpoints per call, no world reads in rank phase.
        const end=Math.min(total,rankCursor+Math.min(limit,8));
        for(;rankCursor<end;rankCursor++)for(const size of [63,111])
          if(endSquares[rankCursor]>=size)add(rankCursor,size);
      }
      if(cursor===total&&rankCursor===total)return done=Object.freeze({done:true,columns:cursor,
        rankCursor,bestSquare:best,scratchBytes:caps.byteLength+runs.byteLength+endSquares.byteLength,
        clearSquares:Object.freeze({...clearSquares}),reliefVeto:Object.freeze({...reliefVeto}),
        counts:Object.freeze({...counts}),candidates:Object.freeze({63:Object.freeze(candidates[63]),111:Object.freeze(candidates[111])})});
      return Object.freeze({done:false,columns:cursor,rankCursor});
    }
  });
}
