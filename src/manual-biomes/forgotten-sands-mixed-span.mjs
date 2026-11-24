// Offline source-native mixed-size 111-span research. Nothing is placed.
// A single original column census is shared across all mixed-size layouts.
import {defineP0Footprint,inspectP0GroundColumn,beginP0GroundSurvey,createP0FootprintIndex} from './forgotten-sands-grounded-probe.mjs';
import {FourRegionWorld,M7_ENVIRONMENT_GENERATOR} from './profile-world.mjs';
const W=127,KEEP=12,patterns=[[31,31,23],[31,23,31],[23,31,31],[31,23,23],[23,31,23],[23,23,31],[31,23,15],[31,15,23],[23,31,15],[23,15,31],[15,31,23],[15,23,31],[31,15,15],[15,31,15],[15,15,31],[23,23,15],[23,15,23],[15,23,23],[23,15,15],[15,23,15],[15,15,23]];
const rank=(a,b)=>b.area-a.area||a.relief-b.relief||a.maxCap-b.maxCap||a.balance-b.balance||a.axis.localeCompare(b.axis)||a.z-b.z||a.x-b.x;
export function beginP0MixedSpanWindow(world,window,{reserved}={}){
  if(!(world instanceof FourRegionWorld)||world.generationProfile.generator!==M7_ENVIRONMENT_GENERATOR||
    window.seed!==world.seed||![window.x,window.z].every(Number.isSafeInteger)||typeof reserved!=='function')throw Error('Invalid mixed span source');
  const x0=window.x-63,z0=window.z-63,caps=new Uint8Array(W*W),sq=new Uint8Array(W*W);
  const cache=new Map(),candidates=[];let columns=0,layoutCursor=0,layouts=0,eligible=0,done=null;
  // A layout is one pattern, axis, starting coordinate and gap split.
  // Yield at most 32 starting coordinates per step. Gap split loop <=48.
  const total=2*17*W*patterns.length;
  function square(x,z,n){
    if(x<0||z<0||x+n>W||z+n>W||sq[(z+n-1)*W+x+n-1]<n)return null;
    const key=[x,z,n].join(',');if(cache.has(key))return cache.get(key);
    let min=255,max=0;
    for(let b=z;b<z+n;b++)for(let a=x;a<x+n;a++){const c=caps[b*W+a];min=Math.min(min,c);max=Math.max(max,c);}
    const r=max-min<=8?{min,max}:null;cache.set(key,r);return r;
  }
  function consider(i){
    const pattern=patterns[i%patterns.length];i=Math.floor(i/patterns.length);
    const along=i%17;i=Math.floor(i/17);const cross=i%W,axis=Math.floor(i/W)===0?'x':'z';
    const gaps=111-pattern.reduce((a,b)=>a+b,0);
    const first=pattern[0],last=pattern[2];
    const anchor=(a,n)=>axis==='x'?[a,cross-(n-1)/2]:[cross-(n-1)/2,a];
    const [ax,az]=anchor(along,first),[cx,cz]=anchor(along+111-last,last);
    const a=square(ax,az,first),c=square(cx,cz,last);
    if(!a||!c)return;
    for(let gap=9;gap<=gaps-9;gap++){
      layouts++;
      const mid=pattern[1],[bx,bz]=anchor(along+first+gap,mid),b=square(bx,bz,mid);
      if(!b)continue;
      const min=Math.min(a.min,b.min,c.min),max=Math.max(a.max,b.max,c.max);
      if(max-min>8)continue;eligible++;
      const modules=[[ax,az,first],[bx,bz,mid],[cx,cz,last]].map(([x,z,size])=>Object.freeze({seed:world.seed,
        x:x0+x+(size-1)/2,z:z0+z+(size-1)/2,size,height:size===31?28:size===23?20:15}));
      const area=pattern.reduce((n,s)=>n+s*s,0);
      const r=Object.freeze({seed:world.seed,x:modules[0].x,z:modules[0].z,axis,span:111,area,relief:max-min,maxCap:max,
        gaps:Object.freeze([gap,gaps-gap]),balance:Math.abs(2*gap-gaps),modules:Object.freeze(modules)});
      candidates.push(r);candidates.sort(rank);if(candidates.length>KEEP)candidates.pop();
    }
  }
  return Object.freeze({step(limit=32){
    if(!Number.isInteger(limit)||limit<1||limit>32)throw Error('Invalid mixed span budget');
    if(done)return done;
    if(columns<W*W){
      const end=Math.min(W*W,columns+limit);
      for(;columns<end;columns++){
        const x=columns%W,z=Math.floor(columns/W),px=x+x0,pz=z+z0;
        const r=inspectP0GroundColumn(world,defineP0Footprint({seed:world.seed,x:px,z:pz}),px,pz,reserved);
        if(r.ok){caps[columns]=r.cap;sq[columns]=1+Math.min(x?sq[columns-1]:0,z?sq[columns-W]:0,x&&z?sq[columns-W-1]:0);}
      }
    }else{
      const end=Math.min(total,layoutCursor+limit);
      for(;layoutCursor<end;layoutCursor++)consider(layoutCursor);
    }
    if(columns===W*W&&layoutCursor===total)return done=Object.freeze({done:true,columns,layoutCursor,layouts,eligible,
      cachedSquares:cache.size,scratchBytes:caps.byteLength+sq.byteLength,candidates:Object.freeze(candidates)});
    return Object.freeze({done:false,columns,layoutCursor});
  }});
}
export function verifyP0MixedSpan(world,candidate,{reserved}={}){
  if(!candidate||candidate.seed!==world.seed||candidate.span!==111||candidate.modules.length!==3||typeof reserved!=='function')throw Error('Invalid candidate');
  const modules=candidate.modules.map(defineP0Footprint);
  createP0FootprintIndex(modules,{clearance:8});
  const axis=candidate.axis;
  if(!['x','z'].includes(axis)||((axis==='x'?modules[2].maxX-modules[0].minX:modules[2].maxZ-modules[0].minZ)+1!==111))
    throw Error('Invalid span');
  const reports=[];
  for(const m of modules){const job=beginP0GroundSurvey(world,m,{reserved,maxRelief:8});let r;do{r=job.step();}while(r.accepted===null);
    if(!r.accepted)return Object.freeze({accepted:false,reason:r.reason});reports.push(r);}
  const min=Math.min(...reports.map(r=>r.minCap)),max=Math.max(...reports.map(r=>r.maxCap));
  if(max-min>8)return Object.freeze({accepted:false,reason:'combined-relief'});
  return Object.freeze({accepted:true,span:111,continuousFoundation:false,connectedWalkway:false,placementAuthority:false,modules:Object.freeze(modules),min,max,
    proposedBlock(x,y,z){for(const r of reports){const p=r.proposedBlock(x,y,z);if(p!==null)return p;}return null;}});
}
