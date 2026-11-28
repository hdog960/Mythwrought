import test from 'node:test';
import assert from 'node:assert/strict';
import {auditGrantContinuity} from '../src/resonance/devices48/grant-continuity-admission-v1.mjs';
const opts={deviceId:'lift',requiredUnits:3};
const f=(tick,delivered)=>({tick,grants:[{id:'lift',delivered}]});
test('startup requires two consecutive sufficient grants',()=>assert.deepEqual(auditGrantContinuity([f(1,3),f(2,3)],opts).transitions.map(x=>x.enabled),[false,true]));
test('dropout immediately stops and requires requalification',()=>assert.deepEqual(auditGrantContinuity([f(1,3),f(2,3),f(3,0),f(4,3),f(5,3)],opts).transitions.map(x=>x.enabled),[false,true,false,false,true]));
test('missing ticks stop and do not permit immediate restart',()=>assert.deepEqual(auditGrantContinuity([f(1,3),f(2,3),f(5,3),f(6,3),f(7,3)],opts).transitions.map(x=>x.enabled),[false,true,false,false,true]));
test('absent grant stops',()=>assert.equal(auditGrantContinuity([f(1,3),f(2,3),{tick:3,grants:[]}],opts).transitions[2].enabled,false));
test('custom threshold 3',()=>assert.deepEqual(auditGrantContinuity([f(1,3),f(2,3),f(3,3)],{...opts,consecutiveTicks:3}).transitions.map(x=>x.enabled),[false,false,true]));
test('no authority, immutable output',()=>{const r=auditGrantContinuity([f(1,3)],opts);assert.equal(r.authoritative,false);assert.equal(r.mayMovePlayer,false);assert.ok(Object.isFrozen(r.transitions[0]));});
test('order independent',()=>{const a={tick:1,grants:[{id:'other',delivered:1},{id:'lift',delivered:3}]};assert.deepEqual(auditGrantContinuity([a],opts),auditGrantContinuity([{...a,grants:a.grants.slice().reverse()}],opts));});
for (const [name,frames,options] of [
 ['empty',[],opts],['duplicate ticks',[f(1,3),f(1,3)],opts],['reversed ticks',[f(2,3),f(1,3)],opts],
 ['negative grant',[f(1,-1)],opts],['fractional grant',[f(1,1.5)],opts],['duplicate ids',[{tick:1,grants:[{id:'lift',delivered:1},{id:'lift',delivered:3}]}],opts],
 ['invalid device',[f(1,3)],{...opts,deviceId:'BAD!'}],['zero demand',[f(1,3)],{...opts,requiredUnits:0}],
 ['invalid threshold',[f(1,3)],{...opts,consecutiveTicks:1}],['too many frames',Array.from({length:33},(_,i)=>f(i,3)),opts],
 ['too many grants',[{tick:1,grants:Array.from({length:17},(_,i)=>({id:'d'+i,delivered:1}))}],opts],
]) test('reject '+name,()=>assert.throws(()=>auditGrantContinuity(frames,options)));
