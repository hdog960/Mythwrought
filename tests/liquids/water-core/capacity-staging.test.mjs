import test from 'node:test';
import assert from 'node:assert/strict';
import {createLiquidEngine} from '../../../src/liquids/core/engine.mjs';
import {createLiquidOwnerHandoff} from '../../../src/liquids/core/owner-handoff.mjs';
import {createLiquidPersistence} from '../../../src/liquids/core/persistence.mjs';
import {createWaterPhaseTransitions} from '../../../src/liquids/water/physics/phase.mjs';
import {createLiquidWorkBudget} from '../../../src/liquids/core/work-budget.mjs';
import {physicalRegionAt} from '../../../src/world-height.mjs';
const definitions=[{id:'water',gravityLimit:8,lateralLimit:4},{id:'lava',gravityLimit:2,lateralLimit:1}];
const config={definitions,maxCells:2,maxVisits:4,isLoaded:()=>true,isOpen:()=>true};
const total=state=>state.cells.reduce((n,c)=>n+c.units,0);

test('owner detach preserves both dormant queues and releases capacity without a global wake',()=>{
  let loaded=true;const owner=physicalRegionAt(100,0,0);
  const isOwnerLoaded=o=>o.key!==owner.key||loaded;
  const isLoaded=(...p)=>isOwnerLoaded(physicalRegionAt(...p));
  const cfg={...config,isLoaded},e=createLiquidEngine(cfg);
  e.insert(0,0,0,'lava',8,{heat:47});e.insert(100,0,0,'lava',8,{heat:29});e.tick();
  const h=createLiquidOwnerHandoff({...cfg,isOwnerLoaded});
  const state={version:1,resident:e.save(),parked:[]};loaded=false;
  const r=h.stage({state,owner,mode:'detach'});assert.ok(r);
  assert.deepEqual(r.state.resident.capacityBlocked,[[0,0,0]]);
  assert.deepEqual(r.state.parked[0].snapshot.capacityBlocked,[[100,0,0]]);
  assert.deepEqual(h.validate(r.state),r.state);assert.equal(r.boundaryWoken,0);
  const next=createLiquidEngine({...cfg,snapshot:r.state.resident});assert.equal(next.tick(1).moved,2);
  assert.equal(total(next.save())+total(r.state.parked[0].snapshot),16);
  assert.equal(next.save().cells.reduce((n,c)=>n+(c.quantities.heat??0),0),47);
  loaded=true;
  const attached=h.stage({state:r.state,owner,mode:'attach'});assert.ok(attached);
  assert.deepEqual(attached.state.resident.capacityBlocked,[[0,0,0]]);
  assert.deepEqual(attached.state.resident.pending,[[100,0,0]]);assert.equal(attached.state.parked.length,0);
});

test('owner face wake promotes a dormant retained cell exactly once',()=>{
  let loaded=true;const owner=physicalRegionAt(16,0,0),cfg={...config,isLoaded:(...p)=>physicalRegionAt(...p).key!==owner.key||loaded};
  const e=createLiquidEngine(cfg);e.insert(15,0,0,'lava',8);e.insert(16,0,0,'lava',8);e.tick();
  const h=createLiquidOwnerHandoff({...cfg,isOwnerLoaded:o=>o.key!==owner.key||loaded});loaded=false;
  const r=h.stage({state:{version:1,resident:e.save(),parked:[]},owner,mode:'detach'});
  assert.equal(r.boundaryWoken,1);assert.deepEqual(r.state.resident.pending,[[15,0,0]]);
  assert.equal(r.state.resident.capacityBlocked,undefined);
});

test('phase staging preserves unrelated dormant work; frozen water frees a slot',()=>{
  const e=createLiquidEngine({...config,isOpen:(x,y,z)=>y===0||x===0&&y===-1});
  e.insert(0,0,0,'lava',8,{heat:13});e.insert(100,0,0,'water',8,{trace:9});e.tick();
  const p=createWaterPhaseTransitions({...config,temperatureAt:()=>-1,canFreeze:()=>true,canThaw:()=>false,allowFreeze:true});
  const r=p.stage({state:{version:1,resident:e.save(),frozen:[]},x:100,y:0,z:0,mode:'freeze'});assert.ok(r);
  assert.deepEqual(r.state.resident.capacityBlocked,[[0,0,0]]);assert.equal(r.state.frozen[0].quantities.trace,9);
  assert.ok(Object.isFrozen(r.state.resident.capacityBlocked[0]));
  const next=createLiquidEngine({...config,snapshot:r.state.resident});assert.equal(next.tick(1).moved,2);
  assert.equal(total(next.save())+r.state.frozen[0].units,16);
});

test('sidecar round trip retains both retry queues and rejects overlapping work',()=>{
  const e=createLiquidEngine(config);e.insert(0,0,0,'lava',8);e.insert(100,0,0,'lava',8);e.tick();
  const p=createLiquidPersistence({worldId:'fixture',policyId:'cap-retry-v1',...config});
  const state=p.migrateEngineSnapshot(e.save());
  assert.deepEqual(p.decode(p.encode(state)),state);assert.deepEqual(state.resident.capacityBlocked,[[0,0,0],[100,0,0]]);
  assert.throws(()=>p.encode({...state,resident:{...state.resident,pending:[[0,0,0]]}}));
  assert.throws(()=>p.encode({...state,resident:{...state.resident,capacityBlocked:null}}));
  const old=p.migrateEngineSnapshot({version:1,cells:[],pending:[]});assert.equal(old.resident.capacityBlocked,undefined);
  const detached={...state,resident:{version:1,cells:[state.resident.cells[0]],pending:[],capacityBlocked:[[0,0,0]]},
    parked:[{owner:physicalRegionAt(100,0,0),snapshot:{version:1,cells:[state.resident.cells[1]],pending:[],capacityBlocked:[[100,0,0]]}}]};
  assert.deepEqual(p.decode(p.encode(detached)),detached);
  assert.throws(()=>p.encode({...detached,parked:[{...detached.parked[0],snapshot:{...detached.parked[0].snapshot,capacityBlocked:[[0,0,0]]}}]}));
});

test('work admission counts retries under the same downstream dirty reservation',()=>{
  const e=createLiquidEngine(config);e.insert(0,0,0,'lava',8);e.insert(100,0,0,'lava',8);e.tick();e.extract(100,0,0,8);
  const b=createLiquidWorkBudget({engine:e,maxVisitsPerStep:4,maxChangedPerStep:24});const before=e.save();
  assert.equal(b.step({availableChanged:5}).status,'deferred');assert.deepEqual(e.save(),before);
  const r=b.step({availableChanged:6});assert.equal(r.visited,1);assert.equal(r.moved,2);assert.equal(r.changed.length,2);
});
