import test from 'node:test';
import assert from 'node:assert/strict';
import {createDurableIntentWitness} from '../../src/auto-integration-support/durable-intent-bridge.mjs';
test('unknown history fails closed even with empty edit map',()=>{
 const w=createDurableIntentWitness();
 assert.equal(w.hasDurableEditIntent(1,2,3),true);
 assert.equal(w.historyComplete,false);
});
test('restored-to-natural block remains touched after value equality',()=>{
 const w=createDurableIntentWitness({historyComplete:true,touchedCells:[{x:5,y:2,z:9}]});
 assert.equal(w.hasDurableEditIntent(5,2,9),true);
 assert.equal(w.hasDurableEditIntent(5,2,10),false);
});
test('unsafe coordinates fail closed and inputs are validated',()=>{
 const w=createDurableIntentWitness({historyComplete:true});
 assert.equal(w.hasDurableEditIntent(Number.MAX_SAFE_INTEGER+1,0,0),true);
 assert.throws(()=>createDurableIntentWitness({historyComplete:true,touchedCells:[{x:1.5,y:0,z:0}]}),TypeError);
});
test('deduplicates touched coordinates without mutating input',()=>{
 const cells=[{x:-210,y:0,z:4},{x:-210,y:0,z:4}];
 const w=createDurableIntentWitness({historyComplete:true,touchedCells:cells});
 assert.equal(w.touchedCount,1);
 assert.deepEqual(w.touchedFixture(),[[-210,0,4]]);
 assert.equal(cells.length,2);
});

test('touched fixture uses numeric tuple order at safe integer extremes',()=>{
 const cells=[
  {x:10,y:0,z:0},{x:2,y:0,z:0},{x:-2,y:0,z:0},
  {x:-10,y:0,z:0},{x:Number.MAX_SAFE_INTEGER,y:0,z:0},
  {x:Number.MIN_SAFE_INTEGER,y:0,z:0},
  {x:2,y:10,z:0},{x:2,y:2,z:0},
  {x:2,y:2,z:10},{x:2,y:2,z:2}
 ];
 const before=structuredClone(cells);
 const a=createDurableIntentWitness({historyComplete:true,touchedCells:cells});
 const b=createDurableIntentWitness({historyComplete:true,touchedCells:[...cells].reverse()});
 const expected=[
  [Number.MIN_SAFE_INTEGER,0,0],[-10,0,0],[-2,0,0],
  [2,0,0],[2,2,0],[2,2,2],[2,2,10],[2,10,0],
  [10,0,0],[Number.MAX_SAFE_INTEGER,0,0]
 ];
 assert.deepEqual(a.touchedFixture(),expected);
 assert.deepEqual(b.touchedFixture(),expected);
 assert.deepEqual(cells,before);
 for (const c of cells) assert.equal(a.hasDurableEditIntent(c.x,c.y,c.z),true);
 assert.equal(a.hasDurableEditIntent(3,0,0),false);
});
