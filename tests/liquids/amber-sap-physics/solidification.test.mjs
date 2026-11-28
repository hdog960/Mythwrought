import test from 'node:test';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {createSapCuring} from '../../../src/liquids/amber-sap/physics/curing.mjs';
import {createSapSolidification} from '../../../src/liquids/amber-sap/physics/solidification.mjs';
if(!process.env.LIQUID_ENGINE_MODULE)throw Error('Pinned Water A engine required');
const {createLiquidEngine}=await import(pathToFileURL(resolve(process.env.LIQUID_ENGINE_MODULE)).href);
const sap={id:'amber-sap',gravityLimit:1,lateralLimit:1};
const water={id:'water',gravityLimit:8,lateralLimit:4};
const empty=()=>({version:1,cells:[]});
const full=(x,y=0,z=0)=>({x,y,z,id:'amber-sap',units:8,quantities:{}});
function fixture(over={}){
  let loaded=true,open=true,eligible=true,permitted=true;
  const config={definitions:[sap,water],isLoaded:()=>loaded,isOpen:()=>open,maxCells:16,maxVisits:4};
  const engine=createLiquidEngine(config);
  const options={isLoaded:config.isLoaded,isOpen:config.isOpen,canCure:()=>eligible,enabled:true,dwellVisits:2};
  const curing=createSapCuring({engine,...options});
  engine.insert(0,0,0,'amber-sap',8);engine.insert(1,0,0,'amber-sap',8);
  engine.insert(4,0,0,'water',3,{trace:17});
  curing.track(0,0,0);curing.track(1,0,0);curing.step();
  const proposal=curing.step().proposals[0];
  const adapter=createSapSolidification({createLiquidEngine,...config,canPlaceAmber:()=>permitted,enabled:true,...over});
  const request={engine,curing,proposal,solid:empty(),revision:7};
  return {engine,curing,proposal,adapter,request,config,options,
    set:(k,v)=>{if(k==='loaded')loaded=v;if(k==='open')open=v;if(k==='eligible')eligible=v;if(k==='permitted')permitted=v;}};
}
const total=(s)=>s.cells.reduce((n,c)=>n+c.units,0);
const snapshot=f=>JSON.stringify([f.engine.save(),f.curing.save(),f.request.solid]);
test('stages eight units, preserves other liquid and dwell, and never changes the live state',()=>{
  const f=fixture(),before=snapshot(f),r=f.adapter.stage(f.request);
  assert.equal(snapshot(f),before);assert.deepEqual(r.placement,{x:0,y:0,z:0,product:'amber',solidUnits:8});
  assert.deepEqual(r.changed,[[0,0,0]]);assert.deepEqual([r.expectedRevision,r.nextRevision],[7,8]);
  assert.deepEqual(r.solid.cells,[full(0)]);assert.equal(total(r.resident)+total(r.solid),19);
  assert.deepEqual(r.resident.cells.find(c=>c.id==='water').quantities,{trace:17});
  assert.deepEqual(r.curing.pending,[[1,0,0,2]]);assert.ok(Object.isFrozen(r.solid.cells[0]));
  assert.ok(Object.isFrozen(r.resident.pending[0]));assert.ok(Object.isFrozen(r.curing.pending[0]));
  assert.ok(!r.resident.pending.some(p=>p.join(',')==='0,0,0'));
});
test('staged adoption and paired restore preserve mass and refuse stale live tokens',()=>{
  const f=fixture(),r=f.adapter.stage(f.request);
  const saved=JSON.parse(JSON.stringify(r));
  const engine=createLiquidEngine({...f.config,snapshot:saved.resident});
  const curing=createSapCuring({engine,...f.options,snapshot:saved.curing});
  assert.equal(engine.getCell(0,0,0),null);assert.equal(f.adapter.stage({...f.request,engine,curing,solid:saved.solid,revision:8}),null);
  const proposal=curing.step().proposals[0];assert.equal(proposal.expected.x,1);
  const r2=f.adapter.stage({engine,curing,proposal,solid:saved.solid,revision:8});
  assert.deepEqual(r2.solid.cells,[full(0),full(1)]);assert.equal(total(r2.resident)+total(r2.solid),19);
  assert.deepEqual(r2.curing.pending,[]);
});
test('disabled or denied, unavailable and protected placement all leave live state untouched',()=>{
  const off=fixture({enabled:false});assert.equal(off.adapter.stage(off.request),null);
  for(const k of ['loaded','open','eligible','permitted']){
    const f=fixture();f.set(k,false);const before=snapshot(f);assert.equal(f.adapter.stage(f.request),null);assert.equal(snapshot(f),before);
  }
});
test('forged, invalidated and changed cell identities are rejected',()=>{
  const f=fixture(),before=snapshot(f);
  assert.equal(f.adapter.stage({...f.request,proposal:{...f.proposal}}),null);assert.equal(snapshot(f),before);
  f.curing.invalidate(0,0,0);assert.equal(f.adapter.stage(f.request),null);
  const g=fixture();g.engine.extract(0,0,0,8);g.engine.insert(0,0,0,'amber-sap',8);
  assert.equal(g.adapter.stage(g.request),null);
});
test('ledger caps, duplicates, malformed material and overlap fail closed',()=>{
  const f=fixture({maxSolidCells:1});const before=snapshot(f);
  assert.equal(f.adapter.stage({...f.request,solid:{version:1,cells:[full(9)]}}),null);
  for(const solid of [{version:2,cells:[]},{version:1,cells:[full(0)]},{version:1,cells:[{...full(9),units:7}]},
    {version:1,cells:[{...full(9),quantities:{trace:1}}]},{version:1,cells:[full(9,257)]},
    {version:1,cells:[{...full(9),id:'water'}]}])assert.throws(()=>f.adapter.stage({...f.request,solid}),TypeError);
  const g=fixture();assert.throws(()=>g.adapter.stage({...g.request,solid:{version:1,cells:[full(9),full(9)]}}),TypeError);
  assert.equal(snapshot(f),before);
});
test('existing solid ledger does not count as liquid or grant new material',()=>{
  const f=fixture(),solid={version:1,cells:[full(9,-210)]},before=JSON.stringify(solid);
  const r=f.adapter.stage({...f.request,solid});assert.equal(JSON.stringify(solid),before);
  assert.equal(total(r.resident)+total(r.solid),27);assert.deepEqual(r.solid.cells,[full(9,-210),full(0)]);
});
test('callback fault and revision overflow reject before live mutation',()=>{
  const f=fixture({canPlaceAmber:()=>{throw Error('host fault');}}),before=snapshot(f);
  assert.throws(()=>f.adapter.stage(f.request),/host fault/);assert.equal(snapshot(f),before);
  assert.throws(()=>f.adapter.stage({...f.request,revision:Number.MAX_SAFE_INTEGER}),TypeError);
});
test('upper and lower physical bounds stage the exact voxel',()=>{
  for(const y of [-210,256]){
    const config={definitions:[sap],isLoaded:()=>true,isOpen:()=>true};const engine=createLiquidEngine(config);
    engine.insert(-16,y,16,'amber-sap',8);
    const curing=createSapCuring({engine,...config,canCure:()=>true,enabled:true,dwellVisits:1});
    curing.track(-16,y,16);const proposal=curing.step().proposals[0];
    const a=createSapSolidification({createLiquidEngine,...config,canPlaceAmber:()=>true,enabled:true});
    const r=a.stage({engine,curing,proposal,solid:empty(),revision:0});assert.deepEqual(r.solid.cells,[full(-16,y,16)]);
    assert.equal(total(r.resident),0);assert.equal(total(r.solid),8);
  }
});
