// AV11 bounded session pool; terminal events are proposals only.
export function createProjectilePool({capacity,makeProjectile,authorizeLaunch}){
 if(!Number.isInteger(capacity)||capacity<1||capacity>32||typeof makeProjectile!=='function'||typeof authorizeLaunch!=='function')throw Error('invalid pool');
 const entries=new Map();let highest=0,closed=false,busy=false;
 const snapshot=()=>Object.freeze({count:entries.size,highest,closed,projectiles:Object.freeze([...entries].map(([id,p])=>Object.freeze({id,state:p.snapshot()})))});
 function launch({sequence,options}={}){
  if(closed||busy||!Number.isSafeInteger(sequence)||sequence<=highest||!options?.identity||typeof options.identity.projectileId!=='string')return false;
  busy=true;try{highest=sequence;const key=options.identity.projectileId;if(entries.size>=capacity||entries.has(key)||authorizeLaunch(options.identity,sequence)!==true)return false;const p=makeProjectile(options);if(p.snapshot().terminal)return false;entries.set(key,p);return true;}catch{return false;}finally{busy=false;}
 }
 function advance(ms){
  if(closed||busy||!Number.isInteger(ms)||ms<10||ms>100||ms%10)return Object.freeze({ok:false,events:Object.freeze([]),snapshot:snapshot()});
  busy=true;const events=[];
  try{
   // Interleave all projectiles at fixed 10ms boundaries.
   for(let elapsed=0;elapsed<ms;elapsed+=10)for(const [id,p] of entries){
    const before=p.snapshot().clock;const out=p.step(10);
    if(out.impact)events.push(Object.freeze({id,offsetMs:elapsed+Math.max(0,out.impact.at-before),impact:out.impact}));
    if(!out.ok||out.snapshot.terminal){p.close();entries.delete(id);}
   }
   return Object.freeze({ok:true,events:Object.freeze(events),snapshot:snapshot()});
  }catch{closed=true;for(const p of entries.values())p.close();entries.clear();return Object.freeze({ok:false,events:Object.freeze([]),snapshot:snapshot()});}finally{busy=false;}
 }
 return Object.freeze({launch,advance,snapshot,close:()=>{closed=true;for(const p of entries.values())p.close();entries.clear();return snapshot();}});
}
