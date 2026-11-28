// Lava A: isolated, bounded quench staging. No terrain or live-engine writes.
import {createLavaThermalScheduler} from './thermal-scheduler.mjs';
import {describeQuenchReceipt} from './transactions.mjs';

const int=(n,lo,hi)=>Number.isSafeInteger(n)&&n>=lo&&n<=hi;
const point=p=>Array.isArray(p)&&p.length===3&&Number.isSafeInteger(p[0])&&int(p[1],-210,256)&&Number.isSafeInteger(p[2]);
const key=p=>p.join(',');
const position=c=>[c.x,c.y,c.z];
const freezePoint=p=>Object.freeze([...p]);
function copyReceipt(r){
  if(!describeQuenchReceipt(r)||!Array.isArray(r.changed)||!r.changed.every(point))throw new TypeError('Invalid quench receipt');
  return Object.freeze({product:r.product,productInputs:Object.freeze(r.productInputs.map(c=>Object.freeze({
    x:c.x,y:c.y,z:c.z,id:c.id,units:c.units,quantities:Object.freeze({...c.quantities})
  }))),changed:Object.freeze(r.changed.map(freezePoint))});
}
function freezeSnapshot(s){
  return Object.freeze({version:s.version,cells:Object.freeze([...s.cells]),pending:Object.freeze(s.pending.map(freezePoint))});
}
function freezeThermal(s){return Object.freeze({...s,pending:Object.freeze(s.pending.map(freezePoint))});}

// createEngine(snapshot) must construct a NEW shared-core engine with the exact
// host configuration and WATER_LAVA_SETTLEMENT_RULE. Never supply a live engine.
// Host owns the exclusive edit/streaming lease and atomic whole-state adoption.
export function createLavaQuenchBatch({createEngine,isLoaded,isOpen,canQuench,
  allowQuench=false,maxPairs=32,maxReceipts=1024,thermalOptions={}}={}){
  if([createEngine,isLoaded,isOpen,canQuench].some(f=>typeof f!=='function')||typeof allowQuench!=='boolean')
    throw new TypeError('Explicit quench host and policy required');
  if(!int(maxPairs,1,256)||!int(maxReceipts,1,65536))throw new RangeError('Quench budget');
  // The host owns actual cooling eligibility; this adapter only admits tracking.
  const {maxTracked=8192,maxVisits=64,lossPerUnit=4}=thermalOptions;
  function stage({state,pairs}={}){
    if(state?.version!==1||!state.resident||!state.thermal||!Array.isArray(state.receipts)||state.receipts.length>maxReceipts)
      throw new TypeError('Invalid quench state');
    if(!Array.isArray(pairs)||pairs.length>maxPairs)throw new RangeError('Quench pair budget');
    const seen=new Set(),ordered=[];
    for(const pair of pairs){
      if(!Array.isArray(pair)||pair.length!==2||!pair.every(point)||pair[0].reduce((n,v,i)=>n+Math.abs(v-pair[1][i]),0)!==1)
        throw new TypeError('Invalid adjacent quench pair');
      const k=pair.map(key).sort().join('|');
      if(!seen.has(k)){seen.add(k);ordered.push(pair.map(freezePoint));}
    }
    const receipts=Array.from(state.receipts,copyReceipt);
    const engine=createEngine(state.resident);
    if(!engine||[engine.getCell,engine.planReaction,engine.commitReaction,engine.save].some(f=>typeof f!=='function'))
      throw new TypeError('Shared reaction executor required');
    const thermal=createLavaThermalScheduler({engine,isLoaded,isOpen,canCool:()=>false,
      maxTracked,maxVisits,lossPerUnit,snapshot:state.thermal});
    const changed=new Map(),fresh=[];
    let visited=0,denied=0,unavailable=0;
    if(allowQuench)for(const [a,b] of ordered){
      if(receipts.length===maxReceipts)break;
      visited++;
      const ca=engine.getCell(...a),cb=engine.getCell(...b);
      if(!ca||!cb||!((ca.id==='water'&&cb.id==='lava')||(ca.id==='lava'&&cb.id==='water'))){unavailable++;continue;}
      const plan=engine.planReaction(...a,...b);
      if(!plan){unavailable++;continue;}
      if(plan.routeA!=='product'||plan.routeB!=='product'||!describeQuenchReceipt(plan))throw new Error('Unexpected quench rule');
      if(canQuench(plan)!==true){denied++;continue;}
      const receipt=engine.commitReaction(plan);
      if(!receipt){unavailable++;continue;}
      // Reclaim a fully consumed cell's slot before admitting later residuals.
      // If tracking/retirement cannot be verified, abandon the private batch.
      if(plan.afterB){
        if(!thermal.track(...position(plan.afterB)))return null;
      }else if(!thermal.retireIfAbsent(...position(plan.proposal.b)))return null;
      const entry=copyReceipt(receipt);
      receipts.push(entry);fresh.push(entry);
      for(const p of entry.changed)changed.set(key(p),p);
    }
    // No receipt is silently evicted. Caller must retain/retry the unvisited suffix.
    return Object.freeze({state:Object.freeze({version:1,resident:freezeSnapshot(engine.save()),
      thermal:freezeThermal(thermal.save()),receipts:Object.freeze(receipts)}),
      visited,denied,unavailable,duplicates:pairs.length-ordered.length,
      remainingPairs:Object.freeze(ordered.slice(visited).map(p=>Object.freeze(p))),newReceipts:Object.freeze(fresh),changed:Object.freeze([...changed.values()])});
  }
  return Object.freeze({stage});
}
