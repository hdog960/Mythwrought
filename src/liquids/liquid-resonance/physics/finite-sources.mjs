// Finite, scheduler-owned reservoirs only; no existing machine or player stores.
import {RESONANCE_ID,ENERGY_KEY,ENERGY_SCALE,restoreResonanceStore,readResonanceCell,
  planResonanceInjection} from './definition.mjs';
const int=(n,a,b)=>Number.isSafeInteger(n)&&n>=a&&n<=b;
const freeze=Object.freeze;

export function createResonanceSources({engine,sources=[],authorize,
  maxSources=128,maxVisits=16,maxUnitsPerStep=32,snapshot=null}={}) {
  if(typeof engine?.getCell!=='function'||typeof engine?.insert!=='function'||typeof authorize!=='function')
    throw new TypeError('Explicit core and containment authorization required');
  if(!int(maxSources,1,4096)||!int(maxVisits,1,4096)||!int(maxUnitsPerStep,1,32768)||
    !Array.isArray(sources)||sources.length>maxSources) throw new RangeError('Invalid source budget');
  const ids=new Set(),anchors=new Set(),outlets=new Set();
  const config=freeze(sources.map(d=>{
    if(!d||!Array.isArray(d.point)||d.point.length!==3||!Number.isSafeInteger(d.point[0])||
      !int(d.point[1],-210,256)||!Number.isSafeInteger(d.point[2])||!int(d.rate,1,8)||!int(d.target,1,8))
      throw new TypeError('Invalid outlet descriptor');
    const store=restoreResonanceStore(d.store),point=freeze([...d.point]),k=point.join(',');
    if(ids.has(store.storeId)||anchors.has(store.anchor)||outlets.has(k)) throw new TypeError('Duplicate reservoir ownership');
    ids.add(store.storeId);anchors.add(store.anchor);outlets.add(k);
    return freeze({point,rate:d.rate,target:d.target,store});
  }));
  const signature=JSON.stringify({maxSources,maxVisits,maxUnitsPerStep,config});
  const stores=config.map(d=>d.store);
  let cursor=0,active=false;
  if(snapshot!==null){
    if(snapshot?.version!==1||snapshot.signature!==signature||!int(snapshot.cursor,0,Math.max(0,config.length-1))||
      !Array.isArray(snapshot.stores)||snapshot.stores.length!==stores.length) throw new TypeError('Invalid reservoir snapshot');
    for(let i=0;i<stores.length;i++){
      const initial=stores[i],s=restoreResonanceStore(snapshot.stores[i]);
      const spent=initial.units-s.units,energySpent=initial.energy-s.energy,visits=s.revision-initial.revision;
      if(s.storeId!==initial.storeId||s.anchor!==initial.anchor||s.capacity!==initial.capacity||
        spent<0||energySpent<0||energySpent>spent*ENERGY_SCALE||visits<Math.ceil(spent/config[i].rate)||visits>spent||
        (!spent&&energySpent!==0)) throw new TypeError('Reservoir snapshot violates finite accounting');
      stores[i]=s;
    }
    cursor=snapshot.cursor;
  }
  function save(){
    if(active)throw new Error('Cannot save during source step');
    return {version:1,signature,cursor,stores:[...stores]};
  }
  // Host must exclusively own these stores, persist the core and this snapshot
  // atomically, and supply pure stable authorization (source owner, load,
  // containment, outlet permission). Never mount a second scheduler for a store.
  // getCell/authorize must be read-only. insert must be synchronous and atomic:
  // false or a throw must leave the failing insertion unapplied, as in core v1.
  // No callbacks occur between true and the internal prevalidated store debit.
  // A commit-then-throw adapter violates this contract and needs host recovery,
  // not a blind retry. Already acknowledged successful inserts are not rolled back.
  // On failure error.partial is the immutable completed-prefix ledger, with the
  // same shape as a normal result; error.cause is the original thrown value.
  // visited counts completed visits only. The cursor stays at the failing outlet,
  // so the next step resumes there with a new bounded budget. Consume partial's
  // dirty/accounting handoff once; never replay it as a set of new insertions.
  function step(){
    if(active)throw new Error('Reentrant source step');
    active=true;
    let visited=0,units=0,energy=0;
    const changed=[];
    const result=()=>freeze({visited,units,energy,changed:freeze(changed)});
    try{
      while(visited<Math.min(maxVisits,config.length)&&units<maxUnitsPerStep){
        const i=cursor,d=config[i],s=stores[i],p=d.point;
        if(s.units>0&&authorize(d,s)===true){
          const raw=engine.getCell(...p);
          if(raw===null||raw?.id===RESONANCE_ID){
            const c=raw===null?null:readResonanceCell(raw);
            if(c&&(c.x!==p[0]||c.y!==p[1]||c.z!==p[2]))throw new Error('Outlet identity mismatch');
            const plan=planResonanceInjection(s,{permitted:true,loaded:true,contained:true,anchor:s.anchor,
              availableCapacity:Math.max(0,d.target-(c?.units??0)),requested:Math.min(d.rate,maxUnitsPerStep-units),maxPerVisit:d.rate});
            if(plan&&engine.insert(...p,RESONANCE_ID,plan.output.units,plan.output.quantities)===true){
              stores[i]=plan.nextStore;
              units+=plan.output.units;energy+=plan.output.quantities[ENERGY_KEY]??0;changed.push(p);
            }
          }
        }
        cursor=(cursor+1)%config.length;visited++;
      }
      return result();
    }catch(cause){
      // Wrap rather than modify cause: callbacks may throw frozen errors or values.
      const error=new Error('Liquid Resonance source step interrupted',{cause});
      error.partial=result();
      throw error;
    }finally{active=false;}
  }
  return freeze({step,save});
}
