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
