// Lava A: bounded coordination of the existing single-vent policy.
import {createLavaVent,visitLavaVent} from './definition.mjs';
const int=(v,lo,hi)=>Number.isSafeInteger(v)&&v>=lo&&v<=hi;
export function createLavaVents({engine,vents=[],allowRenewable=false,
  maxVents=128,maxVisits=16,maxUnitsPerStep=16,snapshot=null}={}){
  if(typeof engine?.getCell!=='function'||typeof engine?.insert!=='function')throw new TypeError('Liquid engine required');
  if(typeof allowRenewable!=='boolean'||!int(maxVents,1,4096)||!int(maxVisits,1,4096)||!int(maxUnitsPerStep,1,32768))throw new RangeError('Vent budget');
  if(!Array.isArray(vents)||vents.length>maxVents)throw new RangeError('Vent count');
  const ids=new Set(),positions=new Set();
  const config=Array.from(vents,v=>{
    if(!v||typeof v.id!=='string'||!/^[a-z][a-z0-9-]{0,63}$/.test(v.id)||ids.has(v.id)||v.emitted!==undefined)throw new TypeError('Vent descriptor');
    const initial=createLavaVent(v),p=[initial.x,initial.y,initial.z].join(',');
    if(positions.has(p)||initial.renewable&&!allowRenewable)throw new TypeError('Duplicate position or renewable policy disabled');
    ids.add(v.id);positions.add(p);
    return Object.freeze({id:v.id,initial});
  });
  const signature=JSON.stringify({allowRenewable,maxVents,maxVisits,maxUnitsPerStep,config});
  const states=config.map(v=>v.initial);
  let cursor=0,busy=false;
  if(snapshot!==null){
    if(snapshot?.version!==1||snapshot.signature!==signature||!int(snapshot.cursor,0,Math.max(0,states.length-1))||!Array.isArray(snapshot.emitted)||snapshot.emitted.length!==states.length)throw new TypeError('Vent snapshot');
    cursor=snapshot.cursor;
    for(let i=0;i<states.length;i++){
      const s=states[i],n=snapshot.emitted[i];
      if(!int(n,0,s.renewable?Number.MAX_SAFE_INTEGER:s.remaining))throw new RangeError('Vent emission ledger');
      states[i]=createLavaVent({...s,emitted:n,remaining:s.renewable?null:s.remaining-n});
    }
  }
  function save(){
    if(busy)throw new Error('Active vent step');
    return {version:1,signature,cursor,emitted:states.map(s=>s.emitted)};
  }
  function step(){
    if(busy)throw new Error('Reentrant vent step');
    busy=true;
    let visited=0,finiteUnits=0,renewableUnits=0,heat=0;
    const changed=[];
    const result=()=>Object.freeze({visited,finiteUnits,renewableUnits,inserted:finiteUnits+renewableUnits,heat,changed:Object.freeze(changed)});
    try{
      while(visited<Math.min(maxVisits,states.length)&&finiteUnits+renewableUnits<maxUnitsPerStep){
        const i=cursor,s=states[i],rate=Math.min(s.rate,maxUnitsPerStep-finiteUnits-renewableUnits);
        // Reuse the single-vent policy, restoring its configured rate after this limited visit.
        const r=visitLavaVent(engine,{...s,rate});
        states[i]=createLavaVent({...r.state,rate:s.rate});
        if(r.inserted){
          if(s.renewable)renewableUnits+=r.inserted;else finiteUnits+=r.inserted;
          heat+=r.inserted*s.heatPerUnit;
          changed.push(Object.freeze([s.x,s.y,s.z]));
        }
        cursor=(cursor+1)%states.length;visited++;
      }
      return result();
    }catch(cause){
      // Earlier successful insertions cannot be rolled back. Expose their ledger and dirty cells.
      // Core v1 insert invokes host callbacks before any mutation; the failing visit is unspent.
      const error=new Error('Lava vent step interrupted',{cause});
      error.partial=result();throw error;
    }finally{busy=false;}
  }
  return Object.freeze({step,save});
}
