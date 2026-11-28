import test from 'node:test';
import assert from 'node:assert/strict';
import {auditGrantDropout} from '../src/resonance/devices48/grant-dropout-interlock-v1.mjs';
const o={deviceId:'lift',requiredUnits:3};
const f=(tick,delivered)=>({tick,grants:[{id:'lift',delivered}]});
test('safe stop and recovery from insufficient grant',()=>{
 const r=auditGrantDropout([f(1,3),f(2,1),f(3,3)],o);
 assert.deepEqual(r.transitions.map(x=>x.enabled),[true,false,true]);
 assert.deepEqual(r.transitions.map(x=>x.changed),[true,true,true]);
 assert.equal(r.authoritative,false);assert.equal(r.mayMovePlayer,false);
 assert.ok(Object.isFrozen(r.transitions));assert.ok(Object.isFrozen(r.transitions[0]));
});
test('missing tick fails closed for that observation, recovers on next consecutive tick',()=>{
 const r=auditGrantDropout([f(1,3),f(4,3),f(5,3)],o);
 assert.deepEqual(r.transitions.map(x=>x.enabled),[true,false,true]);
 assert.equal(r.transitions[1].reason,'unobserved-tick-gap');
});
test('absent device grant is zero',()=>assert.equal(auditGrantDropout([{tick:1,grants:[]}],o).transitions[0].delivered,0));
test('input order does not affect result',()=>{
 const a={tick:1,grants:[{id:'other',delivered:5},{id:'lift',delivered:3}]};
 assert.deepEqual(auditGrantDropout([a],o),auditGrantDropout([{...a,grants:a.grants.slice().reverse()}],o));
});
for(const [name,frames,opts] of [
 ['empty',[],o],['reversed',[f(2,3),f(1,3)],o],['duplicate ticks',[f(1,3),f(1,3)],o],
 ['negative tick',[f(-1,3)],o],['fractional tick',[f(1.5,3)],o],
 ['negative delivery',[f(1,-1)],o],['fractional delivery',[f(1,1.5)],o],
 ['duplicate ids',[{tick:1,grants:[{id:'lift',delivered:1},{id:'lift',delivered:2}]}],o],
 ['bad device id',[f(1,3)],{...o,deviceId:'BAD!'}],
 ['zero demand',[f(1,3)],{...o,requiredUnits:0}],
 ['oversized demand',[f(1,3)],{...o,requiredUnits:65}],
 ['bad gap',[f(1,3)],{...o,maxTickGap:0}],
 ['oversized frame history',Array.from({length:33},(_,i)=>f(i,3)),o],
 ['oversized grant',[f(1,65)],o],
 ['oversized grant list',[{tick:1,grants:Array.from({length:17},(_,i)=>({id:'d'+i,delivered:1}))}],o],
]) test('reject '+name,()=>assert.throws(()=>auditGrantDropout(frames,opts)));
