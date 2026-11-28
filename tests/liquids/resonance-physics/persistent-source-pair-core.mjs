import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createResonanceSourcePersistence} from '../../../src/liquids/liquid-resonance/physics/persistent-source-pair.mjs';
import {createResonanceSources} from '../../../src/liquids/liquid-resonance/physics/finite-sources.mjs';
import {RESONANCE_ID,RESONANCE_DEFINITION,resonanceQuantities} from '../../../src/liquids/liquid-resonance/physics/definition.mjs';

// Exact Water A 6e462fb2a00a6d6c585a5edaab6f7a8741efcd1d dependency closure.
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
const {createWaterSources}=await peer('src/liquids/water/physics/sources.mjs');
const {physicalRegionAt}=await peer('src/world-height.mjs');
const clone=x=>JSON.parse(JSON.stringify(x));
const cell=(x,y,z,units,energy)=>({x,y,z,id:RESONANCE_ID,units,quantities:resonanceQuantities(units,energy)});
const water=(x,y,z)=>({x,y,z,id:'water',units:8,quantities:{}});
const snap=(cells=[])=>({version:1,cells,pending:cells.map(c=>[c.x,c.y,c.z])});
const reservoir=(name,point,units=7,energy=19)=>({point,rate:2,target:8,store:{version:1,id:RESONANCE_ID,
  storeId:name,anchor:`anchor-${name}`,capacity:16,units,energy,revision:0}});
function fixture({sources=[reservoir('a',[0,0,0])],authorize=()=>true,engineOverrides={},codecOverrides={},stateOverrides={},region=physicalRegionAt}={}){
  const definitions=[RESONANCE_DEFINITION,{id:'water',gravityLimit:8,lateralLimit:4}];
  const engineOptions={definitions,isLoaded:()=>true,isOpen:()=>true,...engineOverrides};
  const waterSourceOptions={sources:[{id:'water-fixture',x:50,y:0,z:50,mode:'finite',rate:1,target:8,initialUnits:3}]};
  const engine=createLiquidEngine(engineOptions);
  const liquidPersistence=createLiquidPersistence({worldId:'world-fixture',policyId:'policy-fixture',definitions,waterSourceOptions,...codecOverrides});
  const sourceOptions={sources,authorize};
  const sourceSnapshot=createResonanceSources({...sourceOptions,engine}).save();
  const liquidState={version:1,worldId:'world-fixture',policyId:'policy-fixture',revision:0,resident:snap(),parked:[],frozen:[],
    products:[],waterSources:createWaterSources({...waterSourceOptions,engine}).save(),...stateOverrides};
  const bridge=createResonanceSourcePersistence({liquidPersistence,sourceOptions,engineOptions,createLiquidEngine,physicalRegionAt:region});
  return {bridge,pair:{liquidState,sourceSnapshot},liquidPersistence,engine};
}

test('actual codec: source step preserves all four resonance ledgers and unrelated water state',()=>{
  const parkedCell=cell(-1,20,0,3,7),productCell=cell(5,-210,0,1,5);
  const {bridge,pair,engine}=fixture({stateOverrides:{resident:snap([cell(0,0,0,2,3),water(5,0,0)]),
    parked:[{owner:physicalRegionAt(-1,20,0),snapshot:snap([parkedCell])}],frozen:[water(20,256,0)],
    products:[{id:'receipt-fixture',product:'test-only',productInputs:[productCell]}]}});
  const before=clone(pair);const validated=bridge.validatePair(pair);
  assert.deepEqual(validated.totals,{units:13,energy:34});
  const result=bridge.stageStep(pair,0);
  assert.deepEqual(result.totals,validated.totals);assert.equal(result.stateRevision,1);
  assert.deepEqual(result.receipt,{visited:1,units:2,energy:5,changed:[[0,0,0]]});
  assert.equal(result.pair.sourceSnapshot.stores[0].units,5);
  assert.deepEqual(result.pair.liquidState.resident.cells[0],cell(0,0,0,4,8));
  for(const k of ['parked','frozen','waterSources','products'])assert.deepEqual(result.pair.liquidState[k],pair.liquidState[k]);
  assert.deepEqual(result.pair.liquidState.resident.cells[1],water(5,0,0));
  assert.deepEqual(pair,before);assert.deepEqual(engine.save(),snap());
  assert.ok(Object.isFrozen(result.pair)&&Object.isFrozen(result.pair.sourceSnapshot.stores)&&Object.isFrozen(result.totals));
});

test('dormant empty owner and frozen outlet refuse despite permissive host at physical seams',()=>{
  let calls=0;
  const sources=[reservoir('a',[-1,20,0]),reservoir('b',[0,19,0]),reservoir('c',[0,20,0],2,0)];
  const {bridge,pair}=fixture({sources,authorize:()=>{calls++;return true;},stateOverrides:{
    parked:[{owner:physicalRegionAt(-1,20,0),snapshot:snap()}],frozen:[water(0,19,0)]}});
  const result=bridge.stageStep(pair,0);
  assert.deepEqual(result.receipt,{visited:3,units:2,energy:0,changed:[[0,20,0]]});
  assert.equal(calls,1);assert.deepEqual(result.pair.sourceSnapshot.stores.map(s=>s.units),[7,7,0]);
  assert.deepEqual(result.pair.liquidState.resident.cells,[cell(0,20,0,2,0)]);
});

test('serialized paired restoration depletes stock exactly without replay at a stale revision',()=>{
  const {bridge,pair,liquidPersistence}=fixture({sources:[reservoir('a',[0,-210,0]),reservoir('b',[16,256,0],3,0)]});
  let current=pair;
  for(let i=0;i<12;i++){
    const result=bridge.stageStep(current,i);assert.deepEqual(result.totals,{units:10,energy:19});
    current={liquidState:liquidPersistence.decode(liquidPersistence.encode(result.pair.liquidState)),sourceSnapshot:clone(result.pair.sourceSnapshot)};
    assert.equal(bridge.stageStep(current,i),null);
  }
  assert.deepEqual(current.sourceSnapshot.stores.map(s=>[s.units,s.energy]),[[0,0],[0,0]]);
  assert.deepEqual(current.liquidState.resident.cells,[cell(0,-210,0,7,19),cell(16,256,0,3,0)]);
});

test('strict pair shape, policy identity and persisted inventory bounds reject malformed restores',()=>{
  const {bridge,pair}=fixture();
  for(const bad of [{liquidState:pair.liquidState},{...pair,sourceSnapshot:null},{...pair,extra:true},
    {...pair,liquidState:{...pair.liquidState,worldId:'wrong-world'}},
    {...pair,liquidState:{...pair.liquidState,policyId:'wrong-policy'}},
    {...pair,sourceSnapshot:{...pair.sourceSnapshot,signature:'wrong'}},
    {...pair,sourceSnapshot:{...pair.sourceSnapshot,stores:[]}},
    {...pair,sourceSnapshot:{...pair.sourceSnapshot,stores:[{...pair.sourceSnapshot.stores[0],units:8}]}},
    {...pair,sourceSnapshot:{...pair.sourceSnapshot,stores:[{...pair.sourceSnapshot.stores[0],extra:1}]}}])
    assert.throws(()=>bridge.validatePair(bad));
  assert.throws(()=>bridge.stageStep(pair,-1));
  assert.throws(()=>bridge.stageStep({...pair,liquidState:{...pair.liquidState,revision:Number.MAX_SAFE_INTEGER}},Number.MAX_SAFE_INTEGER));
});

test('lane material bounds checked in resident, dormant and unconverted product ledgers',()=>{
  const {bridge,pair}=fixture();
  const bad={...cell(-1,20,0,1,0),quantities:{'resonance-energy':1025}};
  const unknown={...bad,quantities:{charge:1}};
  for(const c of [bad,unknown])for(const state of [
    {resident:snap([c])},{parked:[{owner:physicalRegionAt(c.x,c.y,c.z),snapshot:snap([c])}]},
    {products:[{id:'test-receipt',product:'test-only',productInputs:[c]}]}])
    assert.throws(()=>bridge.validatePair({...pair,liquidState:{...pair.liquidState,...state}}));
});

test('unavailable owner, permission, terrain, foreign material and resident cap preserve reserves',()=>{
  const cases=[{region:()=>null},{authorize:()=>false},{engineOverrides:{isLoaded:()=>false}},
    {engineOverrides:{isOpen:()=>false}},{stateOverrides:{resident:snap([water(0,0,0)])}},
    {engineOverrides:{maxCells:1},codecOverrides:{maxCells:1},stateOverrides:{resident:snap([cell(8,0,0,1,0)])}}];
  for(const options of cases){const {bridge,pair}=fixture(options);const r=bridge.stageStep(pair,0);
    assert.equal(r.receipt.units,0);assert.deepEqual(r.pair.sourceSnapshot,pair.sourceSnapshot);
    assert.deepEqual(r.pair.liquidState.resident,pair.liquidState.resident);}
});

test('fault after speculative prefix discards paired state, preserves cause and safe retry',()=>{
  const original=Object.freeze({reason:'fixture fault'});let fail=true;
  const {bridge,pair}=fixture({sources:[reservoir('a',[0,0,0]),reservoir('b',[1,0,0])],
    authorize:d=>{if(fail&&d.point[0]===1)throw original;return true;}});
  const before=clone(pair);
  assert.throws(()=>bridge.stageStep(pair,0),error=>{
    assert.equal(error.cause.cause,original);assert.deepEqual(error.cause.partial,{visited:1,units:2,energy:5,changed:[[0,0,0]]});
    return true;
  });
  assert.deepEqual(pair,before);fail=false;
  const result=bridge.stageStep(pair,0);assert.equal(result.receipt.units,4);assert.deepEqual(result.totals,{units:14,energy:38});
});

test('source config pinned at construction and validation never calls live authorization',()=>{
  const source=reservoir('a',[0,0,0]);let calls=0;
  const {bridge,pair}=fixture({sources:[source],authorize:()=>{calls++;return true;}});
  source.point[0]=17;source.store.units=16;source.rate=8;
  assert.deepEqual(bridge.validatePair(pair).totals,{units:7,energy:19});
  assert.equal(bridge.stageStep(pair,1),null);assert.equal(calls,0);
  const r=bridge.stageStep(pair,0);assert.equal(calls,1);assert.deepEqual(r.receipt.changed,[[0,0,0]]);assert.equal(r.receipt.units,2);
});
