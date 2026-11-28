// Reproducible native diagnostic, not a mobile acceptance gate.
import {performance} from 'node:perf_hooks';
import {createLiquidEngine,LIQUID_IDS} from '../../../src/liquids/core/engine.mjs';
import {createLiquidWorkBudget} from '../../../src/liquids/core/work-budget.mjs';
import assert from 'node:assert/strict';
const definitions=LIQUID_IDS.map((id,i)=>({id,gravityLimit:i===0?8:2,lateralLimit:i===0?4:1}));
const totals=e=>e.save().cells.reduce((a,c)=>[a[0]+c.units,a[1]+(c.quantities.trace??0)],[0,0]);
const ms=n=>Number(n.toFixed(3));
function run(name,count,maxCells,idAt,openAt=()=>true){
  let calls=0;const e=createLiquidEngine({definitions,maxCells,maxVisits:64,isLoaded:()=>{calls++;return true;},isOpen:(...p)=>{calls++;return openAt(...p);}});
  for(let i=0;i<count;i++)assert.ok(e.insert((i%128)*3,256-Math.floor(i/128)%16,Math.floor(i/128)*3,idAt(i),8,{trace:i+1}));
  const initial=totals(e),b=createLiquidWorkBudget({engine:e});let visited=0,moved=0,peakChanged=0,peakCalls=0;
  globalThis.gc?.();const startHeap=process.memoryUsage().heapUsed;let peakHeap=startHeap;
  const samples=[];
  for(let i=0;i<320;i++){
    calls=0;const t=performance.now();const r=b.step();samples.push(performance.now()-t);
    assert.ok(r.visited<=64&&r.changed.length<=384&&calls<=14*r.visited);
    visited+=r.visited;moved+=r.moved;peakChanged=Math.max(peakChanged,r.changed.length);peakCalls=Math.max(peakCalls,calls);
    peakHeap=Math.max(peakHeap,process.memoryUsage().heapUsed);
  }
  assert.deepEqual(totals(e),initial);const snap=e.save();assert.ok(snap.cells.length<=maxCells);
  globalThis.gc?.();const retainedHeap=process.memoryUsage().heapUsed;samples.sort((a,b)=>a-b);
  return {name,count,maxCells,steps:samples.length,visited,moved,peakChanged,peakCalls,p50ms:ms(samples[159]),p95ms:ms(samples[303]),maxMs:ms(samples.at(-1)),sampledHeapGrowthBytes:peakHeap-startHeap,postGcHeapDeltaBytes:retainedHeap-startHeap,resident:snap.cells.length,pending:snap.pending.length,snapshotChars:JSON.stringify(snap).length,volume:initial[0],trace:initial[1]};
}
// Acceptance probe for the previously observed cap-stall defect.
function capProbe(){
  let callbacks=0;
  const e=createLiquidEngine({definitions,maxCells:2,isLoaded:()=>true,isOpen:()=>{callbacks++;return true;}});
  e.insert(0,0,0,'lava',8);e.insert(100,0,0,'lava',8);e.tick();
  const blockedAtCap=e.save().capacityBlocked?.length??0;
  assert.equal(blockedAtCap,2);callbacks=0;
  const idle=e.tick();assert.equal(idle.visited,0);assert.equal(callbacks,0);
  e.extract(100,0,0,8);const resumed=e.tick(1);
  assert.equal(resumed.moved,2);assert.equal(totals(e)[0],8);
  return {blockedAtCap,idleVisitsAtCap:idle.visited,movedAfterDistantCapacityRelease:resumed.moved};
}
console.log(JSON.stringify({node:process.version,platform:process.platform,arch:process.arch,gcExposed:typeof globalThis.gc==='function',
  scenarios:[run('mixed-sparse',1024,8192,i=>LIQUID_IDS[i%5]),run('water-at-resident-cap',8192,8192,()=> 'water'),run('sealed-floor',1024,8192,()=> 'water',(x,y,z)=>y===256-(z/3)%16&&x%3===0&&z%3===0)],capProbe:capProbe()},null,2));
