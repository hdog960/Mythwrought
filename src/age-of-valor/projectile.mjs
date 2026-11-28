// AV11 host-authorized swept collision proposals, no health writes.
export function createProjectile({identity,origin,velocity,radius,range,lifeMs,gravity=0,readAuthority,traceTerrain,readTargets}){
 const finite=(x,a,b)=>typeof x==='number'&&Number.isFinite(x)&&x>=a&&x<=b, id=x=>typeof x==='string'&&/^[A-Za-z0-9:._-]{1,128}$/.test(x),vec=v=>Array.isArray(v)&&v.length===3&&v.every(x=>finite(x,-1e7,1e7)),norm=v=>Math.hypot(...v),sub=(a,b)=>a.map((x,i)=>x-b[i]),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
 const keys=['worldId','profileId','sourceId','actionId','projectileId','definitionId'];
 if(!identity||!keys.every(k=>id(identity[k]))||typeof identity.fixture!=='boolean'||!vec(origin)||!vec(velocity)||!finite(radius,0,2)||origin[1]<-210+radius||origin[1]>257-radius||!finite(norm(velocity),.01,128)||!finite(range,.01,128)||!Number.isInteger(lifeMs)||lifeMs<10||lifeMs>60000||lifeMs%10||!finite(gravity,0,64)||![readAuthority,traceTerrain,readTargets].every(f=>typeof f==='function'))throw Error('invalid projectile');
 const scope=Object.freeze({...Object.fromEntries(keys.map(k=>[k,identity[k]])),fixture:identity.fixture});
 let p=[...origin],v=[...velocity],clock=0,distance=0,terminal=null,busy=false;
 const snapshot=()=>Object.freeze({clock,position:Object.freeze([...p]),velocity:Object.freeze([...v]),distance,terminal});
 const stop=(type,extra={})=>terminal=Object.freeze({type,...scope,...extra});
 const result=(ok,reason,impact=null)=>Object.freeze({ok,reason,impact,snapshot:snapshot()});
 function step(ms){
  if(terminal||busy)return result(false,'unavailable');
  if(!Number.isInteger(ms)||ms<10||ms>100||ms%10)return result(false,'invalid-delta');
  busy=true;
  try{
   for(let i=0;i<ms/10;i++){
    const a=readAuthority();if(!a||a.active!==true||!keys.every(k=>a[k]===scope[k])||a.fixture!==scope.fixture){stop('retired');return result(false,'retired');}
    const dt=.01,delta=[v[0]*dt,v[1]*dt-.5*gravity*dt*dt,v[2]*dt],length=norm(delta),limit=Math.min(1,(range-distance)/Math.max(length,1e-12));
    const end=p.map((x,j)=>x+delta[j]*limit);
    if(!vec(end)||end[1]<-210+radius||end[1]>257-radius){stop('outside-world');return result(false,'outside-world');}
    const q=Object.freeze({...scope,from:Object.freeze([...p]),to:Object.freeze(end),radius,fromMs:clock,toMs:clock+10*limit});
    const terrain=traceTerrain(q),targets=readTargets(q);
    if(!terrain||terrain.complete!==true||!(terrain.fraction===null||finite(terrain.fraction,0,1))||!Array.isArray(targets)||targets.length>128)throw Error('incomplete collision');
    let best=null;const seen=new Set();
    for(const t of targets){
     if(!t||!id(t.id)||seen.has(t.id)||!vec(t.from)||!vec(t.to)||!finite(t.radius,.01,4)||!['alive','friendly','attackable','resident'].every(k=>typeof t[k]==='boolean'))throw Error('invalid target');
     seen.add(t.id);if(t.id===scope.sourceId||!t.alive||t.friendly||!t.attackable)continue;
     if(!t.resident||norm(sub(t.to,t.from))>2)throw Error('unresolved target');
     const rel=sub(p,t.from),motion=sub(sub(end,p),sub(t.to,t.from)),rr=radius+t.radius;
     const c=dot(rel,rel)-rr*rr,b=dot(rel,motion),aa=dot(motion,motion);let f=null;
     if(c<=0)f=0;else if(aa>1e-14&&b<0){const disc=b*b-aa*c;if(disc>=0){const root=(-b-Math.sqrt(disc))/aa;if(root>=0&&root<=1)f=root;}}
     if(f!==null&&(!best||f<best.fraction-1e-9||Math.abs(f-best.fraction)<=1e-9&&t.id<best.id))best={id:t.id,fraction:f};
    }
    const wall=terrain.fraction!==null&&(!best||terrain.fraction<=best.fraction+1e-9),f=wall?terrain.fraction:best?best.fraction:1;
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
