// AV11 bounded session pool; terminal events are proposals only.
export function createProjectilePool({capacity,makeProjectile,authorizeLaunch,readSharedFrame=null,launchNamespace=null,restored=null}){
 if(!Number.isInteger(capacity)||capacity<1||capacity>32||typeof makeProjectile!=='function'||typeof authorizeLaunch!=='function')throw Error('invalid pool');
 const entries=new Map(),used=new Set();let highest=0,closed=false,busy=false,worldClock=0,shared=null,frame=null;
 if(launchNamespace!==null&&(typeof launchNamespace!=='string'||!/^[A-Za-z0-9:._-]{1,96}$/.test(launchNamespace)))throw Error('invalid launch namespace');
 if(restored!==null){if(launchNamespace===null||restored.version!==1||restored.namespace!==launchNamespace||!Number.isSafeInteger(restored.highest)||restored.highest<0||!Number.isSafeInteger(restored.worldClock)||restored.worldClock<0||restored.worldClock%10)throw Error('invalid launch checkpoint');highest=restored.highest;worldClock=restored.worldClock;}
 function checkpoint(){if(closed||busy||entries.size||launchNamespace===null)throw Error('nonquiescent pool');return Object.freeze({version:1,namespace:launchNamespace,highest,worldClock});}
 if(readSharedFrame!==null&&typeof readSharedFrame!=='function')throw Error('invalid shared provider');
 const snapshot=()=>Object.freeze({count:entries.size,highest,closed,projectiles:Object.freeze([...entries].map(([id,p])=>Object.freeze({id,state:p.snapshot()})))});
 function launch({sequence,options}={}){
  if(closed||busy||!Number.isSafeInteger(sequence)||sequence<=highest||!options?.identity||typeof options.identity.projectileId!=='string')return false;
  busy=true;try{highest=sequence;const key=options.identity.projectileId;if(launchNamespace!==null?key!==launchNamespace+':'+sequence:used.has(key)||used.size>=4096)return false;if(launchNamespace===null)used.add(key);if(entries.size>=capacity||entries.has(key)||authorizeLaunch(options.identity,sequence)!==true||closed)return false;if(readSharedFrame){const id=options.identity;const k=['worldId','profileId','sourceId','fixture'];if(shared&&!k.every(x=>shared[x]===id[x]))return false;shared=Object.freeze(Object.fromEntries(k.map(x=>[x,id[x]])));}
 const p=makeProjectile(readSharedFrame?{...options,launchWorldMs:worldClock,readTargets:()=>{if(!frame)throw Error('missing shared frame');return frame}}:options);if(closed||p.snapshot().terminal){p.close();return false;}entries.set(key,p);return true;}catch{return false;}finally{busy=false;}
 }
 function advance(ms){
  if(closed||busy||!Number.isInteger(ms)||ms<10||ms>100||ms%10||worldClock>Number.MAX_SAFE_INTEGER-ms)return Object.freeze({ok:false,events:Object.freeze([]),snapshot:snapshot()});
  busy=true;const events=[];
  try{
   // Interleave all projectiles at fixed 10ms boundaries.
   for(let elapsed=0;elapsed<ms;elapsed+=10){
    frame=readSharedFrame&&entries.size?readSharedFrame({identity:shared,fromMs:worldClock+elapsed,toMs:worldClock+elapsed+10}):null;
    if(closed)throw Error('pool retired during frame read');
    for(const [id,p] of entries){
    const before=p.snapshot().clock;const out=p.step(10);
    if(closed)throw Error('pool retired during projectile step');
    if(out.impact)events.push(Object.freeze({id,offsetMs:elapsed+Math.max(0,out.impact.at-before),impact:out.impact}));
    if(!out.ok){throw Error('projectile authority failure');}if(out.snapshot.terminal){p.close();entries.delete(id);}
    }
   }
   worldClock+=ms;frame=null;events.sort((a,b)=>a.offsetMs-b.offsetMs||(a.id<b.id?-1:a.id>b.id?1:0));
   return Object.freeze({ok:true,events:Object.freeze(events),snapshot:snapshot()});
  }catch{closed=true;frame=null;for(const p of entries.values())p.close();entries.clear();return Object.freeze({ok:false,events:Object.freeze([]),snapshot:snapshot()});}finally{busy=false;}
 }
 return Object.freeze({launch,advance,snapshot,checkpoint,close:()=>{closed=true;for(const p of entries.values())p.close();entries.clear();return snapshot();}});
}
