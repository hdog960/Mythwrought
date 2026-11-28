import test from 'node:test';
import assert from 'node:assert/strict';
import {createLiquidEngine} from '../../../src/liquids/core/engine.mjs';
import {WATER_DEFINITION} from '../../../src/liquids/water/physics/definition.mjs';
import {createWaterPhaseTransitions} from '../../../src/liquids/water/physics/phase.mjs';

const definitions=[WATER_DEFINITION,{id:'lava',gravityLimit:1,lateralLimit:1},
  {id:'acid',gravityLimit:1,lateralLimit:1},{id:'amber-sap',gravityLimit:1,lateralLimit:0},
  {id:'liquid-resonance',gravityLimit:1,lateralLimit:1}];
const host={definitions,isLoaded:()=>true,isOpen:()=>true};
const make=(opts={})=>createLiquidEngine({...host,...opts});
const phase=(opts={})=>createWaterPhaseTransitions({...host,temperatureAt:()=>0,
  canFreeze:()=>true,canThaw:()=>true,allowFreeze:true,allowThaw:true,...opts});
const state=(e,frozen=[])=>({version:1,resident:e.save(),frozen});
const run=(p,s,mode='freeze',x=0,y=0,z=0)=>p.stage({state:s,mode,x,y,z});
const json=x=>JSON.parse(JSON.stringify(x));
const total=s=>[...s.resident.cells,...s.frozen].reduce((a,c)=>{
  a.units+=c.units;for(const [k,v] of Object.entries(c.quantities))a[k]=(a[k]??0)+v;return a;
},{units:0});

test('default policy is inert; freeze and thaw separately enabled',()=>{
  const e=make();e.insert(0,0,0,'water',8);const s=state(e);
  assert.equal(run(createWaterPhaseTransitions({...host,temperatureAt:()=>-10,canFreeze:()=>true,canThaw:()=>true}),s),null);
  const frozen=run(phase({allowThaw:false}),s).state;
  assert.equal(run(phase({allowThaw:false,temperatureAt:()=>10}),frozen,'thaw'),null);
  assert.ok(run(phase({allowFreeze:false,temperatureAt:()=>10}),frozen,'thaw'));
});
test('whole-cell freeze and thaw conserve exact units and every quantity',()=>{
  const e=make();e.insert(0,0,0,'water',8,{energy:37,solute:13,trace:2**40});
  e.insert(1,0,0,'acid',3,{solute:11});const s=state(e),before=json(s);
  const a=run(phase(),s);assert.deepEqual(a.water,s.resident.cells[0]);
  assert.equal(a.state.resident.cells.length,1);assert.equal(a.state.frozen.length,1);
  assert.deepEqual(total(a.state),total(s));assert.deepEqual(s,before);assert.deepEqual(e.save(),before.resident);
  const b=run(phase({temperatureAt:()=>2}),json(a.state),'thaw');
  assert.deepEqual(total(b.state),total(s));assert.deepEqual(b.state.frozen,[]);
  assert.deepEqual(b.water,a.water);assert.deepEqual(b.state.resident.cells.find(c=>c.id==='water'),a.water);
  assert.deepEqual(b.changed,[[0,0,0]]);assert.ok(Object.isFrozen(b.state.frozen));
});
test('partial water and all four other liquids never freeze',()=>{
  for(const [id,units] of [['water',7],...definitions.slice(1).map(d=>[d.id,8])]){
    const e=make();e.insert(0,0,0,id,units);const s=state(e);assert.equal(run(phase(),s),null);
  }
});
test('hysteresis avoids oscillation and unknown temperature fails closed',()=>{
  const e=make();e.insert(0,0,0,'water',8);const s=state(e),f=run(phase(),s).state;
  for(const t of [1,NaN,Infinity,undefined]){
    const p=phase({temperatureAt:()=>t});assert.equal(run(p,s),null);assert.equal(run(p,f,'thaw'),null);
  }
  assert.equal(run(phase({temperatureAt:()=>-1}),f,'thaw'),null);
  assert.ok(run(phase({freezeAt:-4,thawAt:4,temperatureAt:()=>-4}),s));
  assert.throws(()=>phase({freezeAt:2,thawAt:2}),RangeError);
});
test('host permission and loaded/open staged terrain are mandatory',()=>{
  const e=make();e.insert(0,0,0,'water',8);const s=state(e),f=run(phase(),s).state;
  for(const opts of [{isLoaded:()=>false},{isOpen:()=>false},{canFreeze:()=>false},{canFreeze:()=>1}])
    assert.equal(run(phase(opts),s),null);
  for(const opts of [{isLoaded:()=>false},{isOpen:()=>false},{canThaw:()=>false},{canThaw:()=>1}])
    assert.equal(run(phase({temperatureAt:()=>4,...opts}),f,'thaw'),null);
});
test('frozen and resident capacity rejection preserves both ledgers',()=>{
  const e=make();e.insert(0,0,0,'water',8);const s=state(e);
  assert.equal(run(phase({maxFrozenCells:0}),s),null);
  const f=run(phase(),s).state,other=make({snapshot:f.resident});other.insert(1,0,0,'acid',8);
  const blocked=state(other,f.frozen),before=json(blocked);
  assert.equal(run(phase({temperatureAt:()=>4,maxCells:1}),blocked,'thaw'),null);
  assert.deepEqual(blocked,before);assert.ok(run(phase({temperatureAt:()=>4,maxCells:2}),blocked,'thaw'));
});
test('duplicate transitions on successor state cannot mint or discard water',()=>{
  const e=make();e.insert(0,0,0,'water',8);const p=phase(),a=run(p,state(e));
  assert.equal(run(p,a.state),null);
  const warm=phase({temperatureAt:()=>4}),b=run(warm,a.state,'thaw');
  assert.equal(run(warm,b.state,'thaw'),null);assert.deepEqual(total(b.state),{units:8});
});
test('malformed, duplicate and overlapping saved ledgers are rejected',()=>{
  const e=make();e.insert(0,0,0,'water',8);const s=state(e),p=phase(),f=run(p,s).state,c=f.frozen[0];
  for(const invalid of [{...f,version:2},{...f,frozen:[c,c]},state(e,[c]),
    {...f,frozen:[{...c,id:'lava'}]},{...f,frozen:[{...c,units:7}]},
    {...f,frozen:[{...c,y:257}]},{...f,frozen:[{...c,quantities:{energy:-1}}]},
    {...f,resident:{...f.resident,pending:[[0,0,0]]}}])assert.throws(()=>p.validate(invalid));
  assert.deepEqual(p.validate(json(f)),f);
});
test('freeze retires pending origin; thaw wakes physical neighbors in core order',()=>{
  const e=make();e.insert(0,0,0,'water',8);e.insert(1,0,0,'water',1);e.insert(4,0,0,'acid',1);
  const a=run(phase(),state(e));assert.deepEqual(a.state.resident.pending,[[1,0,0],[4,0,0]]);
  const b=run(phase({temperatureAt:()=>3}),a.state,'thaw');
  assert.deepEqual(b.state.resident.pending,[[1,0,0],[4,0,0],[0,0,0]]);
  const restored=make({snapshot:json(b.state.resident)});assert.deepEqual(restored.save(),b.state.resident);
});
test('entire shared vertical range, negative coordinates and deterministic restore',()=>{
  for(const y of [-210,256]){
    const e=make();e.insert(-17,y,-1,'water',8,{trace:1});const p=phase();
    const a=run(p,state(e),'freeze',-17,y,-1);assert.equal(a.water.y,y);
    const warm=phase({temperatureAt:()=>3});assert.deepEqual(run(warm,a.state,'thaw',-17,y,-1),run(warm,json(a.state),'thaw',-17,y,-1));
  }
  assert.throws(()=>run(phase(),state(make()),'freeze',0,257,0),RangeError);
});
test('host callback failure has no effect on input or live engine',()=>{
  const e=make();e.insert(0,0,0,'water',8);const s=state(e),before=json(s);
  assert.throws(()=>run(phase({canFreeze:()=>{throw Error('host fault');}}),s),/host fault/);
  assert.deepEqual(s,before);assert.deepEqual(e.save(),before.resident);
});
