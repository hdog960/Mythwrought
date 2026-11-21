import test from 'node:test';
import assert from 'node:assert/strict';
import {visibleResonanceSnapshot} from '../src/resonance/network36/chunk-lifecycle.mjs';
const empty=()=>({nodes:[],generators:[],devices:[],stores:[]});
test('unloaded chunks remove all source, consumers and storage without mutating original',()=>{
 const s=empty();s.nodes=[{id:'a',kind:'channel',anchor:{x:15,y:0,z:0}},{id:'b',kind:'channel',anchor:{x:16,y:0,z:0}}];
 s.generators=[{id:'g',anchor:{x:16,y:0,z:0},output:5}];
 s.devices=[{id:'d',anchor:{x:15,y:0,z:0},demand:2}];
 const r=visibleResonanceSnapshot(s,[[0,0,0]]);
 assert.deepEqual(r.nodes.map(x=>x.id),['a']);assert.deepEqual(r.excluded,['b','g']);
 assert.equal(r.devices.length,1);r.nodes[0].anchor.x=3;assert.equal(s.nodes[0].anchor.x,15);
});
test('cold reload is deterministic and supports negative chunk coordinates',()=>{
 const s=empty();s.nodes=[{id:'negative',anchor:{x:-1,y:0,z:0}}];
 assert.deepEqual(visibleResonanceSnapshot(s,[[-1,0,0]]),visibleResonanceSnapshot(s,[[-1,0,0]]));
 assert.equal(visibleResonanceSnapshot(s,[[0,0,0]]).nodes.length,0);
});
test('fails closed on invalid budgets, duplicate IDs, duplicate chunks and missing chunks',()=>{
 const s=empty();s.nodes=[{id:'x',anchor:{x:0,y:0,z:0}}];
 assert.throws(()=>visibleResonanceSnapshot(s,Array.from({length:26},(_,i)=>[i,0,0])),/budget/);
 assert.throws(()=>visibleResonanceSnapshot(s,[[0,0,0],[0,0,0]]),/duplicate/);
 assert.throws(()=>visibleResonanceSnapshot(s,[],{failOnMissing:true}),/unloaded/);
 s.devices=[{id:'x',anchor:{x:0,y:0,z:0}}];
 assert.throws(()=>visibleResonanceSnapshot(s,[[0,0,0]]),/duplicate/);
});
