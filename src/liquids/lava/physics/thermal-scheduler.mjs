// Lava A only. Bounded thermal observations/proposals against shared core v1.
// Does not mutate the engine, terrain, player, or vent stock.
import {readLavaHeat,proposeLavaCooling,lavaExposure} from './definition.mjs';
const integer=(n,lo,hi)=>Number.isSafeInteger(n)&&n>=lo&&n<=hi;
const valid=(x,y,z)=>Number.isSafeInteger(x)&&integer(y,-210,256)&&Number.isSafeInteger(z);
const key=(x,y,z)=>`${x},${y},${z}`;
export function createLavaThermalScheduler({engine,isLoaded,isOpen,canCool,
  maxTracked=8192,maxVisits=64,lossPerUnit=4,snapshot=null}={}){
  if(typeof engine?.getCell!=='function'||[isLoaded,isOpen,canCool].some(f=>typeof f!=='function'))
    throw new TypeError('Explicit thermal host callbacks required');
  if(!integer(maxTracked,1,65536)||!integer(maxVisits,1,4096)||!integer(lossPerUnit,0,100))
    throw new RangeError('Invalid thermal budget');
  const pending=new Map();
  let busy=false;
  const requireIdle=()=>{if(busy)throw new Error('Reentrant thermal scheduler');};
  function track(x,y,z){
    requireIdle();
    if(!valid(x,y,z))throw new RangeError('Outside physical cell envelope');
    const k=key(x,y,z);
    if(pending.has(k))return true;
    if(pending.size>=maxTracked)return false;
    pending.set(k,Object.freeze([x,y,z]));
    return true;
  }
  if(snapshot!==null){
    if(snapshot?.version!==1||snapshot.maxTracked!==maxTracked||snapshot.maxVisits!==maxVisits||
      snapshot.lossPerUnit!==lossPerUnit||!Array.isArray(snapshot.pending)||snapshot.pending.length>maxTracked)
      throw new TypeError('Invalid thermal snapshot or changed policy');
    for(const p of snapshot.pending){
      if(!Array.isArray(p)||p.length!==3||!valid(...p)||pending.has(key(...p)))
        throw new TypeError('Invalid thermal queue entry');
      track(...p);
    }
  }
  function save(){
    requireIdle();
    return {version:1,maxTracked,maxVisits,lossPerUnit,pending:[...pending.values()].map(p=>[...p])};
  }
  function step(limit=maxVisits){
    requireIdle();
    if(!integer(limit,1,maxVisits))throw new RangeError('Thermal visit budget');
    const budget=Math.min(limit,pending.size),proposals=[],observations=[],invalid=[],updates=[];
    let deferred=0,retired=0;
    busy=true;
    try{
      // Stage at most the initial visit budget. If ANY host callback throws,
      // nothing rotates or retires: retry observes the same exact FIFO prefix.
      for(const [k,p] of pending){
        if(updates.length===budget)break;
        let keep=true;
        if(isLoaded(...p)!==true){deferred++;}
        else{
          const c=engine.getCell(...p);
          // A loaded coordinate that no longer contains lava frees a slot,
          // including a just-placed solid. Retained unloaded cells never retire.
          if(!c||c.id!=='lava'){keep=false;retired++;}
          else if(c.x!==p[0]||c.y!==p[1]||c.z!==p[2]||readLavaHeat(c)===null){
            keep=false;invalid.push(p);
          }else if(isOpen(...p)!==true){deferred++;}
          else{
            const signal=lavaExposure({cell:c,fill:c.units/8});
            observations.push(Object.freeze({expected:c,...signal}));
            if(canCool(c)===true){
              const proposal=proposeLavaCooling(c,{lossPerUnit});
              if(proposal)proposals.push(proposal);
            }else deferred++;
          }
        }
        updates.push({k,p,keep});
      }
      // No host calls in the write phase; only private queue metadata changes.
      for(const {k,p,keep} of updates){pending.delete(k);if(keep)pending.set(k,p);}
      return Object.freeze({visited:updates.length,deferred,retired,invalid:Object.freeze(invalid),
        observations:Object.freeze(observations),proposals:Object.freeze(proposals),pending:pending.size});
    }finally{busy=false;}
  }
  return Object.freeze({track,step,save});
}
