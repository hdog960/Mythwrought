import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {stageResonanceOwnerTransition} from '../../../src/liquids/liquid-resonance/physics/paired-owner-handoff.mjs';
import {createResonanceSourcePersistence} from '../../../src/liquids/liquid-resonance/physics/persistent-source-pair.mjs';
import {createResonanceSources} from '../../../src/liquids/liquid-resonance/physics/finite-sources.mjs';
import {RESONANCE_ID,RESONANCE_DEFINITION,resonanceQuantities} from '../../../src/liquids/liquid-resonance/physics/definition.mjs';

// Water A 6e462fb2a00a6d6c585a5edaab6f7a8741efcd1d exact dependency closure.
const root=process.env.LIQUID_CORE_ROOT;
if(!root)throw new Error('Set LIQUID_CORE_ROOT to the pinned Water A checkout');
const pins={
  'src/liquids/core/engine.mjs':'b0ce6f804c111cc2a0a9cf6c835fc75fde45eaa5',
  'src/liquids/core/persistence.mjs':'8b2118d8a915497f3688093122afa3ea94aa79d1',
  'src/liquids/core/owner-handoff.mjs':'7e710dcaaec7e60236d0330be0c73310e152ce57',
  'src/liquids/water/physics/sources.mjs':'61b63656d80ea30071f75423ad69b48a1000784a',
  'src/world-height.mjs':'1f5fe4411967223bbfcb7e85a804ce34f91fbb90',
  'src/depth.mjs':'b54b7fd8c422699a328b60135178f97508e277c8',
  'src/floating-islands/sky-runtime-adapter.mjs':'bfb423288c7005a87521d4e54a1dd222de150603'
};
for(const [path,expected] of Object.entries(pins)){
  const bytes=readFileSync(resolve(root,path));
  assert.equal(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'),expected,path);
}
const peer=path=>import(pathToFileURL(resolve(root,path)).href);
const {createLiquidEngine}=await peer('src/liquids/core/engine.mjs');
const {createLiquidPersistence}=await peer('src/liquids/core/persistence.mjs');
const {createLiquidOwnerHandoff}=await peer('src/liquids/core/owner-handoff.mjs');
const {createWaterSources}=await peer('src/liquids/water/physics/sources.mjs');
const {physicalRegionAt}=await peer('src/world-height.mjs');
const clone=x=>JSON.parse(JSON.stringify(x));
const cell=(x,y,z,units,energy)=>({x,y,z,id:RESONANCE_ID,units,quantities:resonanceQuantities(units,energy)});
const water=(x,y,z)=>({x,y,z,id:'water',units:8,quantities:{}});
const snap=(cells=[],pending=[],blocked=[])=>({version:1,cells,pending,...(blocked.length?{capacityBlocked:blocked}:{})});
const target=physicalRegionAt(-1,20,0);
const pos=[-1,20,0];
function fixture({maxCells=4,stateOverrides={},sourcePoint=pos,lateralOrder='fixed',allowCell=()=>true}={}){
  const definitions=[RESONANCE_DEFINITION,{id:'water',gravityLimit:8,lateralLimit:4}];
  let ownerReady=true,closed=false,fault=null,authCalls=0;
  const isOwnerLoaded=o=>{if(fault)throw fault;return o.key===target.key?ownerReady:true;};
  const isLoaded=(x,y,z)=>isOwnerLoaded(physicalRegionAt(x,y,z));
  const isOpen=(x,y,z)=>allowCell(x,y,z)&&!(closed&&physicalRegionAt(x,y,z).key===target.key);
  const engineOptions={definitions,isLoaded,isOpen,maxCells,lateralOrder};
  const waterSourceOptions={sources:[{id:'fixture-water',x:48,y:0,z:0,mode:'finite',rate:1,target:8,initialUnits:3}]};
  const sourceOptions={sources:[{point:sourcePoint,rate:2,target:8,store:{version:1,id:RESONANCE_ID,
    storeId:'fixture-reservoir',anchor:'fixture-anchor',capacity:16,units:7,energy:19,revision:0}}],
    authorize:()=>{authCalls++;return true;}};
  const engine=createLiquidEngine(engineOptions);
  const codec=createLiquidPersistence({worldId:'fixture-world',policyId:'fixture-policy',definitions,maxCells,waterSourceOptions});
  const persistence=createResonanceSourcePersistence({liquidPersistence:codec,sourceOptions,engineOptions,createLiquidEngine,physicalRegionAt});
  const ownerHandoff=createLiquidOwnerHandoff({...engineOptions,isOwnerLoaded});
  const pair={liquidState:{version:1,worldId:'fixture-world',policyId:'fixture-policy',revision:0,
    resident:snap(),parked:[],frozen:[],products:[],waterSources:createWaterSources({...waterSourceOptions,engine}).save(),...stateOverrides},
    sourceSnapshot:createResonanceSources({...sourceOptions,engine}).save()};
  const stage=(pair,expectedRevision,mode,owner=target)=>stageResonanceOwnerTransition({persistence,ownerHandoff,pair,expectedRevision,owner,mode});
  const roundTrip=p=>({liquidState:codec.decode(codec.encode(p.liquidState)),sourceSnapshot:clone(p.sourceSnapshot)});
  return {pair,persistence,stage,roundTrip,engine,engineOptions,ready:v=>{ownerReady=v;},block:v=>{closed=v;},
    fault:v=>{fault=v;},authCalls:()=>authCalls};
}

test('paired detach, serialized restore and attach conserve all ledgers and preserve dormant FIFO',()=>{
  const a=cell(-1,20,0,4,17),b=cell(-2,20,0,1,2),c=cell(0,20,0,2,3),d=cell(32,0,0,3,5);
  const f=fixture({stateOverrides:{resident:snap([a,b,c,d],[[-2,20,0]],[pos,[0,20,0],[32,0,0]]),
    frozen:[water(5,0,0)],products:[{id:'old-receipt',product:'test-only',productInputs:[cell(10,-210,0,1,5)]}]}});
  const original=clone(f.pair);f.ready(false);
  const detach=f.stage(f.pair,0,'detach');assert.deepEqual(detach.totals,{units:18,energy:51});
  assert.equal(detach.stateRevision,1);assert.equal(detach.receipt.boundaryWoken,1);
  assert.deepEqual(detach.receipt.changed,[pos,[-2,20,0]]);
  assert.deepEqual(detach.pair.liquidState.parked,[{owner:target,snapshot:snap([a,b],[[-2,20,0]],[pos])}]);
  assert.deepEqual(detach.pair.liquidState.resident,snap([c,d],[[0,20,0]],[[32,0,0]]));
  assert.ok(Object.isFrozen(detach.pair.liquidState.parked[0].snapshot.capacityBlocked[0]));
  assert.ok(Object.isFrozen(detach.receipt.changed));assert.equal(f.authCalls(),0);
  const restored=f.roundTrip(detach.pair);
  // Capacity release must make the oldest retained dormant cell runnable,
  // without silently dropping its energy or letting the parked owner run.
  const privateEngine=createLiquidEngine({...f.engineOptions,snapshot:restored.liquidState.resident});
  const flow=privateEngine.tick(1);assert.equal(flow.visited,1);assert.equal(flow.moved,3);
  assert.equal(privateEngine.getCell(32,-1,0).quantities['resonance-energy'],5);
  assert.equal(privateEngine.getCell(-1,20,0),null);
  const idle=f.persistence.stageStep(restored,1);
  assert.equal(idle.receipt.units,0);assert.equal(f.authCalls(),0);
  assert.deepEqual(idle.pair.sourceSnapshot,original.sourceSnapshot);
  assert.deepEqual(idle.pair.liquidState.resident,detach.pair.liquidState.resident);
  f.ready(true);
  const attach=f.stage(f.roundTrip(idle.pair),2,'attach');
  assert.deepEqual(attach.totals,detach.totals);assert.equal(attach.stateRevision,3);
  assert.deepEqual(attach.pair.liquidState.parked,[]);
  assert.deepEqual(attach.pair.liquidState.resident,snap([c,d,a,b],[[0,20,0],[-2,20,0],pos],[[32,0,0]]));
  assert.equal(f.stage(attach.pair,3,'attach'),null);
  const emit=f.persistence.stageStep(f.roundTrip(attach.pair),3);
  assert.deepEqual(emit.receipt,{visited:1,units:2,energy:5,changed:[pos]});
  assert.deepEqual(emit.totals,detach.totals);assert.equal(emit.pair.sourceSnapshot.stores[0].units,5);
  assert.deepEqual(emit.pair.liquidState.resident.capacityBlocked,[[32,0,0]]);
  for(const k of ['waterSources','frozen','products'])assert.deepEqual(emit.pair.liquidState[k],original.liquidState[k]);
  assert.deepEqual(f.pair,original);assert.deepEqual(f.engine.save(),snap());
});

test('explicit empty owner survives persistence, prevents discharge, then attaches exactly once',()=>{
  const f=fixture();f.ready(false);
  const detach=f.stage(f.pair,0,'detach');assert.equal(detach.receipt.movedCells,0);
  assert.deepEqual(detach.pair.liquidState.parked,[{owner:target,snapshot:snap()}]);
  const restored=f.roundTrip(detach.pair);assert.equal(f.stage(restored,1,'detach'),null);
  const idle=f.persistence.stageStep(restored,1);assert.equal(idle.receipt.units,0);assert.equal(f.authCalls(),0);
  f.ready(true);const attach=f.stage(idle.pair,2,'attach');
  assert.equal(f.stage(attach.pair,2,'attach'),null);assert.equal(f.stage(attach.pair,3,'attach'),null);
  const emit=f.persistence.stageStep(attach.pair,3);assert.equal(emit.receipt.units,2);
  assert.deepEqual(emit.totals,{units:7,energy:19});assert.equal(f.authCalls(),1);
});

test('attach refuses cap overflow or terrain obstruction without changing source stock or queues',()=>{
  const a=cell(-1,20,0,1,1),d=cell(32,0,0,4,9);
  const overrides={resident:snap([d],[],[[32,0,0]]),parked:[{owner:target,snapshot:snap([a],[],[pos])}]};
  const full=fixture({maxCells:1,stateOverrides:overrides}),before=clone(full.pair);
  assert.equal(full.stage(full.pair,0,'attach'),null);assert.deepEqual(full.pair,before);
  const f=fixture({stateOverrides:overrides});f.block(true);
  assert.equal(f.stage(f.pair,0,'attach'),null);assert.deepEqual(f.pair,before);assert.equal(f.authCalls(),0);
  f.block(false);const r=f.stage(f.pair,0,'attach');assert.deepEqual(r.totals,{units:12,energy:29});
  assert.deepEqual(r.pair.sourceSnapshot,before.sourceSnapshot);
  assert.deepEqual(r.pair.liquidState.resident,snap([d,a],[pos],[[32,0,0]]));
});

test('stale and exhausted revisions and malformed input never call readiness or advance the pair',()=>{
  const f=fixture(),before=clone(f.pair),fault=new Error('readiness failure');f.fault(fault);
  assert.equal(f.stage(f.pair,1,'detach'),null);
  assert.throws(()=>f.stage(f.pair,-1,'detach'),TypeError);
  assert.throws(()=>f.stage(f.pair,0,'unknown'),TypeError);
  const exhausted={...f.pair,liquidState:{...f.pair.liquidState,revision:Number.MAX_SAFE_INTEGER}};
  assert.throws(()=>f.stage(exhausted,Number.MAX_SAFE_INTEGER,'detach'),RangeError);
  assert.throws(()=>f.stage({...f.pair,sourceSnapshot:null},0,'detach'),TypeError);
  assert.throws(()=>f.stage(f.pair,0,'detach'),e=>e===fault);
  assert.deepEqual(f.pair,before);assert.equal(f.authCalls(),0);
  f.fault(null);f.ready(undefined);assert.equal(f.stage(f.pair,0,'detach'),null);
  f.ready(false);assert.equal(f.stage(f.pair,0,'detach').stateRevision,1);
});

test('invalid dormant queue ownership or duplicate active/dormant entries fail before transition',()=>{
  const a=cell(-1,20,0,1,2),d=cell(32,0,0,4,9);
  for(const overrides of [
    {resident:snap([a],[pos],[pos])},
    {resident:snap([a],[],[[32,0,0]])},
    {resident:snap([d],[],[[32,0,0]]),parked:[{owner:target,snapshot:snap([a],[],[[32,0,0]])}]},
    {resident:snap([a],[],[pos]),parked:[{owner:target,snapshot:snap()}]}
  ]){
    const f=fixture({stateOverrides:overrides}),before=clone(f.pair);f.ready(false);
    assert.throws(()=>f.stage(f.pair,0,'detach'));assert.deepEqual(f.pair,before);assert.equal(f.authCalls(),0);
  }
});

test('rotating phase rows survive owner detach, persistence, attach and finite source emission',()=>{
  const a=cell(-1,20,0,4,17),b=cell(-2,20,0,1,2),c=cell(0,20,0,2,3),d=cell(32,20,0,3,5);
  const ap=[...pos,2],bp=[-2,20,0,1],cp=[0,20,0,3],dp=[32,20,0,2];
  const f=fixture({maxCells:32,lateralOrder:'rotating',allowCell:(x,y,z)=>y===20,
    stateOverrides:{resident:{...snap([a,b,c,d],[[-2,20,0]],[pos,[0,20,0],[32,20,0]]),lateralPhases:[ap,cp,bp,dp]},
      frozen:[water(5,0,0)],products:[{id:'old-receipt',product:'test-only',productInputs:[cell(10,-210,0,1,5)]}]}});
  const original=clone(f.pair);f.ready(false);
  const detach=f.stage(f.pair,0,'detach');assert.deepEqual(detach.totals,{units:18,energy:51});
  assert.deepEqual(detach.pair.liquidState.resident.lateralPhases,[cp,dp]);
  assert.deepEqual(detach.pair.liquidState.parked[0].snapshot.lateralPhases,[ap,bp]);
  assert.throws(()=>{detach.pair.liquidState.parked[0].snapshot.lateralPhases[0][3]=3;},TypeError);
  const idle=f.persistence.stageStep(f.roundTrip(detach.pair),1);
  assert.equal(idle.receipt.units,0);assert.equal(f.authCalls(),0);
  assert.deepEqual(idle.pair.liquidState, {...detach.pair.liquidState,revision:2});
  f.ready(true);
  const attach=f.stage(f.roundTrip(idle.pair),2,'attach');
  assert.deepEqual(attach.pair.liquidState.resident.lateralPhases,[cp,dp,ap,bp]);
  assert.deepEqual(attach.pair.liquidState.parked,[]);
  const emit=f.persistence.stageStep(f.roundTrip(attach.pair),3);
  assert.deepEqual(emit.receipt,{visited:1,units:2,energy:5,changed:[pos]});
  assert.deepEqual(emit.pair.liquidState.resident.lateralPhases,[cp,dp,ap,bp]);
  assert.deepEqual(emit.totals,detach.totals);
  assert.throws(()=>emit.pair.liquidState.resident.lateralPhases.push([5,20,0,1]),TypeError);
  const left=createLiquidEngine({...f.engineOptions,snapshot:emit.pair.liquidState.resident});
  const restored=f.roundTrip(emit.pair);
  const right=createLiquidEngine({...f.engineOptions,snapshot:restored.liquidState.resident});
  let moved=0;
  for(let i=0;i<40;i++){
    const step=left.tick(1);moved+=step.moved;assert.deepEqual(right.tick(1),step);
    assert.deepEqual(right.save(),left.save());
    const checked=f.persistence.validatePair({...restored,liquidState:{...restored.liquidState,resident:right.save()}});
    assert.deepEqual(checked.totals,{units:18,energy:51});
  }
  assert.ok(moved>0,'replay must exercise actual flow');
  assert.notDeepEqual(left.save().lateralPhases,emit.pair.liquidState.resident.lateralPhases);
  assert.deepEqual(f.pair,original);
});

test('invalid rotation rows in resident or parked storage fail closed before readiness or source callbacks',()=>{
  const a=cell(-1,20,0,1,2),d=cell(32,0,0,4,9);
  for(const overrides of [
    {resident:{...snap([a]),lateralPhases:[[...pos,0]]}},
    {resident:{...snap([a]),lateralPhases:[[...pos,4]]}},
    {resident:{...snap([a,d]),lateralPhases:[[...pos,1],[...pos,2]]}},
    {resident:snap([d]),parked:[{owner:target,snapshot:{...snap([a]),lateralPhases:[[32,0,0,2]]}}]}
  ]){
    const f=fixture({stateOverrides:overrides}),before=clone(f.pair);
    const sentinel=new Error('readiness must not run');f.fault(sentinel);
    assert.throws(()=>f.stage(f.pair,0,'attach'),e=>e!==sentinel);
    assert.throws(()=>f.persistence.stageStep(f.pair,0),e=>e!==sentinel);
    assert.deepEqual(f.pair,before);assert.equal(f.authCalls(),0);
  }
});
