const targetFrames=new WeakMap();
export function createProjectileTargetFrame({identity,fromMs,targets,complete}){
 const id=x=>typeof x==='string'&&/^[A-Za-z0-9:._-]{1,128}$/.test(x),vec=v=>Array.isArray(v)&&v.length===3&&v.every(x=>Number.isFinite(x)&&Math.abs(x)<=1e7);
 const keys=['worldId','profileId','sourceId','fixture'];
 if(!identity||!keys.slice(0,3).every(k=>id(identity[k]))||typeof identity.fixture!=='boolean'||!Number.isSafeInteger(fromMs)||fromMs<0||fromMs%10||complete!==true||!Array.isArray(targets)||targets.length>128)throw Error('incomplete shared target frame');
 const scope=Object.freeze(Object.fromEntries(keys.map(k=>[k,identity[k]]))),grid=new Map(),seen=new Set();let entries=0,queries=0,candidates=0;
 const cell=8,key=(x,y,z)=>x+','+y+','+z;
 for(const t of targets){
  if(!t||!id(t.id)||seen.has(t.id)||!vec(t.from)||!vec(t.to)||!Number.isFinite(t.radius)||t.radius<.01||t.radius>4||!['alive','friendly','attackable','resident'].every(k=>typeof t[k]==='boolean'))throw Error('invalid target');
  seen.add(t.id);
  if(t.id===scope.sourceId||!t.alive||t.friendly||!t.attackable)continue;
  if(!t.resident||Math.hypot(t.to[0]-t.from[0],t.to[1]-t.from[1],t.to[2]-t.from[2])>2)throw Error('unresolved target');
  const copy=Object.freeze({...t,from:Object.freeze([...t.from]),to:Object.freeze([...t.to])});
  const low=t.from.map((x,i)=>Math.min(x,t.to[i])-t.radius-1e-8),high=t.from.map((x,i)=>Math.max(x,t.to[i])+t.radius+1e-8),entry={copy,low,high};
  const lo=t.from.map((x,i)=>Math.floor((Math.min(x,t.to[i])-t.radius-1e-8)/cell)),hi=t.from.map((x,i)=>Math.floor((Math.max(x,t.to[i])+t.radius+1e-8)/cell));
  for(let x=lo[0];x<=hi[0];x++)for(let y=lo[1];y<=hi[1];y++)for(let z=lo[2];z<=hi[2];z++){if(++entries>3456)throw Error('grid capacity');const k=key(x,y,z);if(!grid.has(k))grid.set(k,[]);grid.get(k).push(entry);}
 }
 const frame=Object.freeze({fromMs,scope,stats:()=>Object.freeze({validated:targets.length,entries,queries,candidates})});
 targetFrames.set(frame,(q,worldFromMs)=>{
  if(worldFromMs!==fromMs||!keys.every(k=>q[k]===scope[k]))throw Error('frame mismatch');
  const lo=q.from.map((x,i)=>Math.floor((Math.min(x,q.to[i])-q.radius-1e-8)/cell)),hi=q.from.map((x,i)=>Math.floor((Math.max(x,q.to[i])+q.radius+1e-8)/cell));
  const cells=(hi[0]-lo[0]+1)*(hi[1]-lo[1]+1)*(hi[2]-lo[2]+1);
  if(cells>64)throw Error('query capacity');
  const found=new Map();queries++;const low=q.from.map((x,i)=>Math.min(x,q.to[i])-q.radius-1e-8),high=q.from.map((x,i)=>Math.max(x,q.to[i])+q.radius+1e-8);
  for(let x=lo[0];x<=hi[0];x++)for(let y=lo[1];y<=hi[1];y++)for(let z=lo[2];z<=hi[2];z++)for(const e of grid.get(key(x,y,z))??[])if(e.low[0]<=high[0]&&e.high[0]>=low[0]&&e.low[1]<=high[1]&&e.high[1]>=low[1]&&e.low[2]<=high[2]&&e.high[2]>=low[2])found.set(e.copy.id,e.copy);
  candidates+=found.size;return [...found.values()];
 });
 return frame;
}
// AV11 host-authorized swept collision proposals, no health writes.
export function createProjectile({identity,origin,velocity,radius,range,lifeMs,gravity=0,readAuthority,traceTerrain,readTargets,launchWorldMs=0}){
 const finite=(x,a,b)=>typeof x==='number'&&Number.isFinite(x)&&x>=a&&x<=b, id=x=>typeof x==='string'&&/^[A-Za-z0-9:._-]{1,128}$/.test(x),vec=v=>Array.isArray(v)&&v.length===3&&v.every(x=>finite(x,-1e7,1e7)),norm=v=>Math.hypot(...v),sub=(a,b)=>a.map((x,i)=>x-b[i]),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
 const keys=['worldId','profileId','sourceId','actionId','projectileId','definitionId'];
 if(!Number.isSafeInteger(launchWorldMs)||launchWorldMs<0||launchWorldMs%10||!identity||!keys.every(k=>id(identity[k]))||typeof identity.fixture!=='boolean'||!vec(origin)||!vec(velocity)||!finite(radius,0,2)||origin[1]<-210+radius||origin[1]>257-radius||!finite(norm(velocity),.01,128)||!finite(range,.01,128)||!Number.isInteger(lifeMs)||lifeMs<10||lifeMs>60000||lifeMs%10||!finite(gravity,0,64)||![readAuthority,traceTerrain,readTargets].every(f=>typeof f==='function'))throw Error('invalid projectile');
 const scope=Object.freeze({...Object.fromEntries(keys.map(k=>[k,identity[k]])),fixture:identity.fixture});
 let p=[...origin],v=[...velocity],clock=0,distance=0,terminal=null,busy=false;
 const snapshot=()=>Object.freeze({clock,position:Object.freeze([...p]),velocity:Object.freeze([...v]),distance,terminal});
 const stop=(type,extra={})=>terminal??=Object.freeze({type,...scope,...extra});
 const result=(ok,reason,impact=null)=>Object.freeze({ok,reason,impact,snapshot:snapshot()});
 function step(ms){
  if(terminal||busy)return result(false,'unavailable');
  if(!Number.isInteger(ms)||ms<10||ms>100||ms%10)return result(false,'invalid-delta');
  busy=true;
  try{
   for(let i=0;i<ms/10;i++){
    const a=readAuthority();if(terminal||!a||a.active!==true||!keys.every(k=>a[k]===scope[k])||a.fixture!==scope.fixture){stop('retired');return result(false,'retired');}
    const dt=.01,delta=[v[0]*dt,v[1]*dt-.5*gravity*dt*dt,v[2]*dt],length=norm(delta),limit=Math.min(1,(range-distance)/Math.max(length,1e-12));
    const end=p.map((x,j)=>x+delta[j]*limit);
    if(!vec(end)||end[1]<-210+radius||end[1]>257-radius){stop('outside-world');return result(false,'outside-world');}
    const q=Object.freeze({...scope,from:Object.freeze([...p]),to:Object.freeze(end),radius,fromMs:clock,toMs:clock+10*limit});
    const terrain=traceTerrain(q);if(terminal)return result(false,'retired');const raw=readTargets(q);if(terminal)return result(false,'retired');const frame=targetFrames.get(raw),targets=frame?frame(q,launchWorldMs+clock):raw;
    if(!terrain||terrain.complete!==true||!(terrain.fraction===null||finite(terrain.fraction,0,1))||!Array.isArray(targets)||targets.length>128)throw Error('incomplete collision');
    let best=null,minFraction=Infinity;const hits=[],seen=new Set();
    for(const t of targets){
     if(!frame){if(!t||!id(t.id)||seen.has(t.id)||!vec(t.from)||!vec(t.to)||!finite(t.radius,.01,4)||!['alive','friendly','attackable','resident'].every(k=>typeof t[k]==='boolean'))throw Error('invalid target');
     seen.add(t.id);if(t.id===scope.sourceId||!t.alive||t.friendly||!t.attackable)continue;
     if(!t.resident||norm(sub(t.to,t.from))>2)throw Error('unresolved target');}
     // A branded frame spans the full 10ms. Direct providers already receive the clipped q interval.
     const k=frame?limit:1,rel=sub(p,t.from),motion=[end[0]-p[0]-(t.to[0]-t.from[0])*k,end[1]-p[1]-(t.to[1]-t.from[1])*k,end[2]-p[2]-(t.to[2]-t.from[2])*k],rr=radius+t.radius;
     const c=dot(rel,rel)-rr*rr,b=dot(rel,motion),aa=dot(motion,motion);let f=null;
     if(c<=0)f=0;else if(aa>1e-14&&b<0){const disc=b*b-aa*c;if(disc>=0){const root=(-b-Math.sqrt(disc))/aa;if(root>=0&&root<=1)f=root;}}
     if(f!==null){minFraction=Math.min(minFraction,f);hits.push({id:t.id,fraction:f});}
    }
    for(const hit of hits)if(hit.fraction<=minFraction+1e-9&&(!best||hit.id<best.id))best=hit;
    const confirmed=readAuthority();if(terminal||!confirmed||confirmed.active!==true||!keys.every(k=>confirmed[k]===scope[k])||confirmed.fixture!==scope.fixture){stop('retired');return result(false,'retired');}
    const wall=terrain.fraction!==null&&(!best||terrain.fraction<=minFraction+1e-9),f=wall?terrain.fraction:best?best.fraction:1;
    p=p.map((x,j)=>x+delta[j]*limit*f);distance+=length*limit*f;clock+=10*limit*f;
    if(wall||best){const impact=stop(wall?'terrain-impact':'target-impact',{at:clock,position:Object.freeze([...p]),...(wall?{}:{targetId:best.id})});return result(true,impact.type,impact);}
    if(limit<1||distance>=range-1e-10){stop('range-expired');return result(true,'range-expired');}
    v[1]-=gravity*dt;if(clock>=lifeMs){stop('life-expired');return result(true,'life-expired');}
   }
   return result(true,'advanced');
  }catch{stop('authority-uncertain');return result(false,'authority-uncertain');}finally{busy=false;}
 }
 return Object.freeze({step,snapshot,close:()=>{if(!terminal)stop('retired');return snapshot();}});
}
