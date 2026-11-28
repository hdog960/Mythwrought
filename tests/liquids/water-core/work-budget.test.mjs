import test from 'node:test';
import assert from 'node:assert/strict';
import {createLiquidEngine,LIQUID_IDS} from '../../../src/liquids/core/engine.mjs';
import {createLiquidWorkBudget,LIQUID_MAX_CHANGED_PER_VISIT} from '../../../src/liquids/core/work-budget.mjs';
const definitions=LIQUID_IDS.map(id=>({id,gravityLimit:8,lateralLimit:4}));
const world=(opts={})=>createLiquidEngine({definitions,isLoaded:()=>true,isOpen:()=>true,maxVisits:64,...opts});
const volume=e=>e.save().cells.reduce((n,c)=>n+c.units,0);

test('dirty backpressure performs no tick or FIFO mutation',()=>{
  const e=world();e.insert(0,0,0,'water',8);const before=e.save();
  const b=createLiquidWorkBudget({engine:e});
  for(let n=0;n<6;n++)assert.deepEqual(b.step({availableChanged:n}),{status:'deferred',visitLimit:0,visited:0,moved:0,changed:[],pending:null});
  assert.equal(b.step({requestedVisits:0}).status,'deferred');assert.deepEqual(e.save(),before);
  assert.equal(b.step({availableChanged:6}).visited,1);assert.equal(volume(e),8);
});
test('one visit really can change six coordinates, all are delivered',()=>{
  const e=world();e.insert(0,0,0,'water',8);e.insert(0,-1,0,'water',7);
  e.insert(1,0,0,'water',5);e.insert(0,0,1,'water',4);e.insert(-1,0,0,'water',3);e.insert(0,0,-1,'water',2);
  const b=createLiquidWorkBudget({engine:e,maxChangedPerStep:6});const r=b.step();
  assert.equal(r.visitLimit,1);assert.equal(r.visited,1);assert.equal(r.changed.length,LIQUID_MAX_CHANGED_PER_VISIT);
  assert.deepEqual(r.changed,[[0,0,0],[0,-1,0],[1,0,0],[0,0,1],[-1,0,0],[0,0,-1]]);
  assert.equal(volume(e),29);assert.ok(Object.isFrozen(r.changed));
});
test('admitted step exactly matches a direct tick at same visit limit',()=>{
  const e=world();for(let i=0;i<20;i++)e.insert(i*3,256,0,LIQUID_IDS[i%5],8,{trace:i+1});
  const f=world({snapshot:JSON.parse(JSON.stringify(e.save()))});const b=createLiquidWorkBudget({engine:e,maxVisitsPerStep:8,maxChangedPerStep:48});
  for(const slots of [11,48,6,17,24,47]){
    const r=b.step({availableChanged:slots});const direct=f.tick(Math.floor(slots/6));
    assert.deepEqual({visited:r.visited,moved:r.moved,changed:r.changed,pending:r.pending},direct);assert.deepEqual(e.save(),f.save());
  }
  assert.equal(volume(e),160);
});
test('host visit and dirty limits are both honored across all five identities',()=>{
  const e=world({maxCells:128});for(let i=0;i<100;i++)e.insert(i*3,0,0,LIQUID_IDS[i%5],8,{trace:i+1});
  const b=createLiquidWorkBudget({engine:e,maxVisitsPerStep:10,maxChangedPerStep:60});
  for(let i=0;i<100;i++){
    const r=b.step({requestedVisits:3,availableChanged:59});assert.ok(r.visited<=3);assert.ok(r.changed.length<=18);
  }
  assert.equal(volume(e),800);assert.equal(e.save().cells.reduce((n,c)=>n+c.quantities.trace,0),5050);
});
test('unloaded cells consume visit allowance but cannot cause hidden writes',()=>{
  let loaded=true;const e=world({isLoaded:()=>loaded});e.insert(0,0,0,'water',8);loaded=false;
  const b=createLiquidWorkBudget({engine:e});const r=b.step();assert.equal(r.visited,1);assert.deepEqual(r.changed,[]);assert.equal(r.pending,0);
  loaded=true;e.wake(0,0,0);assert.equal(b.step().moved,8);
});
test('invalid budgets fail before invoking engine and reentrant step is rejected',()=>{
  const e=world();assert.throws(()=>createLiquidWorkBudget({engine:e,maxVisitsPerStep:0}),RangeError);
  assert.throws(()=>createLiquidWorkBudget({engine:e,maxChangedPerStep:24577}),RangeError);
  const b=createLiquidWorkBudget({engine:e});assert.throws(()=>b.step({availableChanged:385}),RangeError);
  assert.throws(()=>b.step({requestedVisits:65}),RangeError);assert.throws(()=>b.step({availableChanged:NaN}),RangeError);
  let c;c=createLiquidWorkBudget({engine:{tick:()=>c.step()}});assert.throws(()=>c.step(),/Reentrant/);
});
