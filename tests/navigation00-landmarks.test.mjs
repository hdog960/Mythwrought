import test from 'node:test';
import assert from 'node:assert/strict';
import {createObservedLandmarks} from '../src/navigation00/observed-landmarks.mjs';
const discovery=()=>({seen:new Set(['0,0','-1,-1']),has(x,z){return this.seen.has(`${Math.floor(x/4)},${Math.floor(z/4)}`);}});
test('only witnessed terrain can be recorded; hidden positions never exposed',()=>{
 const d=discovery(),m=createObservedLandmarks({discovery:d});
 assert.equal(m.observe({id:'ridge',x:0,z:0,label:'Ridge'}),true);
 assert.equal(m.observe({id:'unseen',x:80,z:80,label:'Unknown'}),false);
 assert.equal(m.observe({id:'negative',x:-1,z:-1,label:'Cavern'}),true);
 assert.equal(m.visible().length,2);
 d.seen.delete('-1,-1');assert.deepEqual(m.visible().map(p=>p.id),['ridge']);
 assert.equal(m.size,2);assert.equal(m.remove('negative'),true);
});
test('rejects untrusted labels, invalid coordinates, and unbounded records',()=>{
 const m=createObservedLandmarks({discovery:discovery(),maxEntries:1});
 assert.equal(m.observe({id:'x',x:0,z:0,label:'<script>'}),false);
 assert.equal(m.observe({id:'x',x:NaN,z:0,label:'X'}),false);
 assert.equal(m.observe({id:'x',x:0,z:0,label:'X'}),true);
 assert.equal(m.observe({id:'y',x:0,z:0,label:'Y'}),false);
 assert.equal(m.observe({id:'x',x:0,z:0,label:'Updated'}),true);
 assert.equal(m.visible()[0].label,'Updated');
});
test('catalog has no persistence and cannot mutate discovery',()=>{
 const d=discovery(),before=[...d.seen];const m=createObservedLandmarks({discovery:d});
 m.observe({id:'a',x:0,z:0,label:'A'});m.remove('a');
 assert.deepEqual([...d.seen],before);
 assert.throws(()=>createObservedLandmarks({discovery:d,maxEntries:999}));
});
