import test from 'node:test';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createResonanceSources} from '../../../src/liquids/liquid-resonance/physics/finite-sources.mjs';
import {RESONANCE_ID as id,ENERGY_KEY as key,RESONANCE_DEFINITION} from '../../../src/liquids/liquid-resonance/physics/definition.mjs';
if(!process.env.LIQUID_ENGINE_MODULE)throw Error('Set LIQUID_ENGINE_MODULE to pinned Water A engine.mjs');
const {createLiquidEngine}=await import(pathToFileURL(resolve(process.env.LIQUID_ENGINE_MODULE)).href);
const source=(x,units=7,energy=19)=>({point:[x,0,0],rate:2,target:8,
  store:{version:1,id,storeId:'s'+x,anchor:'a'+x,capacity:8,units,energy,revision:0}});
const core=(extra={})=>createLiquidEngine({definitions:[RESONANCE_DEFINITION],
  isLoaded:()=>true,isOpen:()=>true,...extra});
const options=(engine,sources,extra={})=>({engine,sources,authorize:()=>true,...extra});
const zero={visited:1,units:0,energy:0,changed:[]};
const totals=(e,s)=>[...e.save().cells,...s.save().stores].reduce(([u,n],c)=>[u+c.units,n+(c.energy??c.quantities?.[key]??0)],[0,0]);
const clone=x=>JSON.parse(JSON.stringify(x));

test('actual core: unloaded and blocked outlets preserve inventory and pending queue',()=>{
  let loaded=false,open=false;
  const e=core({isLoaded:()=>loaded,isOpen:()=>open}),s=createResonanceSources(options(e,[source(0)]));
  const before=s.save(),empty=e.save();
  assert.deepEqual(s.step(),zero);loaded=true;assert.deepEqual(s.step(),zero);
  assert.deepEqual(s.save(),before);assert.deepEqual(e.save(),empty);
  open=true;assert.deepEqual(s.step(),{visited:1,units:2,energy:5,changed:[[0,0,0]]});
  loaded=false;const after=s.save(),resident=e.save();
  assert.deepEqual(s.step(),zero);assert.deepEqual(s.save(),after);assert.deepEqual(e.save(),resident);
  loaded=true;assert.equal(s.step().units,2);assert.deepEqual(totals(e,s),[7,19]);
});
test('actual core: resident cap rejects empty outlet but permits existing compatible cell',()=>{
  const e=core({maxCells:1});assert.equal(e.insert(10,0,0,id,1,{[key]:3}),true);
  const s=createResonanceSources(options(e,[source(0),source(10)],{maxVisits:1}));
  const before=s.save();assert.deepEqual(s.step(),zero);
  assert.deepEqual(s.save().stores,before.stores);assert.equal(s.save().cursor,1);
  assert.equal(s.step().units,2);assert.equal(e.getCell(0,0,0),null);
  assert.deepEqual(totals(e,s),[15,41]);assert.equal(e.save().cells.length,1);
});
test('actual core: parked scheduler cannot inject; rebind preserves stock and exact cursor',()=>{
  const old=core(),sources=[source(0),source(10)],s=createResonanceSources(options(old,sources,{maxVisits:1}));
  s.step();const oldState=old.save(),stock=s.save(),token=s.park();
  assert.deepEqual(token.snapshot,stock);assert.ok(Object.isFrozen(token)&&Object.isFrozen(token.snapshot.stores));
  assert.equal(s.park(),null);assert.throws(()=>s.step(),/parked/);
  const next=core({snapshot:clone(oldState)});
  assert.equal(s.resume(clone(token),{engine:next,authorize:()=>true}),false);
  assert.throws(()=>s.resume(token,{engine:next}),TypeError);
  assert.throws(()=>s.step(),/parked/);assert.deepEqual(s.save(),stock);
  assert.equal(s.resume(token,{engine:next,authorize:()=>true}),true);
  assert.equal(s.resume(token,{engine:old,authorize:()=>true}),false);
  assert.deepEqual(s.step(),{visited:1,units:2,energy:5,changed:[[10,0,0]]});
  assert.deepEqual(old.save(),oldState);assert.deepEqual(totals(next,s),[14,38]);
  assert.equal(s.save().cursor,0);
});
test('actual core: separate instances and subsequent parking reject old tokens',()=>{
  const e=core(),a=createResonanceSources(options(e,[source(0)])),b=createResonanceSources(options(core(),[source(1)]));
  const first=a.park(),other=b.park();
  assert.equal(a.resume(other,{engine:e,authorize:()=>true}),false);
  assert.equal(a.resume(first,{engine:e,authorize:()=>true}),true);
  const second=a.park();assert.notEqual(first,second);
  assert.equal(a.resume(first,{engine:e,authorize:()=>true}),false);
  assert.equal(a.resume(second,{engine:e,authorize:()=>false}),true);
  assert.deepEqual(a.step(),zero);assert.equal(e.save().cells.length,0);
});
test('actual core: interrupted prefix survives parking and resumes at failing outlet',()=>{
  const e=core(),sources=[source(0),source(10)];let s;
  s=createResonanceSources(options(e,sources,{authorize:d=>{if(d.point[0]===10)s.park();return true;}}));
  assert.throws(()=>s.step(),error=>{
    assert.match(error.cause.message,/Cannot park during source step/);
    assert.deepEqual(error.partial,{visited:1,units:2,energy:5,changed:[[0,0,0]]});return true;
  });
  const token=s.park(),next=core({snapshot:clone(e.save())});
  assert.equal(s.resume(token,{engine:next,authorize:()=>true}),true);
  assert.equal(s.step().units,4);assert.deepEqual(totals(next,s),[14,38]);
  assert.equal(next.getCell(0,0,0).units,4);assert.equal(next.getCell(10,0,0).units,2);
});
test('sparse descriptors fail at admission, never after a successful prefix',()=>{
  const e=core(),sparse=[source(0),,source(2)];
  assert.throws(()=>createResonanceSources(options(e,sparse)),TypeError);
  const sources=[source(0)];sources[Symbol.iterator]=function*(){while(true)yield source(0);};
  const s=createResonanceSources(options(e,sources,{maxSources:1}));
  assert.equal(s.step().units,2);assert.deepEqual(totals(e,s),[7,19]);
});
