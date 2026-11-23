import test from 'node:test';
import assert from 'node:assert/strict';
import {preflightDynamicGateOccupancy as check} from '../src/resonance/devices48/gate-dynamic-occupancy-v1.mjs';
const bounds=(min,max)=>({min,max});
const intent={id:'gate_a',requestedOpen:true,movementAuthorized:false,collisionCleared:false,authority:'candidate-only'};
const actor=(id,min,max)=>({id,bounds:bounds(min,max)});
const fixture=()=>({previous:{worldId:'world_a',tick:4,actors:[]},current:{worldId:'world_a',tick:5,actors:[]},
 intents:[intent],paths:[{id:'gate_a',swept:[bounds([0,0,0],[2,3,1])]}],obstacles:[]});
test('empty consecutive snapshots never authorize physical motion',()=>{const r=check(fixture());assert.equal(r.results[0].candidatePathClear,true);assert.equal(r.results[0].movementAuthorized,false);assert.equal(r.authoritativeDelivery,false)});
test('entering actor blocks path even when previous snapshot clear',()=>{const f=fixture();f.current.actors=[actor('player',[1,0,0],[2,2,1])];const r=check(f);assert.equal(r.results[0].candidatePathClear,false);assert.deepEqual(r.results[0].blockers,['current:actor:player'])});
test('departing actor still blocks previous occupancy',()=>{const f=fixture();f.previous.actors=[actor('player',[1,0,0],[2,2,1])];assert.deepEqual(check(f).results[0].blockers,['previous:actor:player'])});
test('cross-world, skipped ticks and duplicate actor IDs fail closed',()=>{const a=fixture();a.current.worldId='world_b';assert.throws(()=>check(a));const b=fixture();b.current.tick=7;assert.throws(()=>check(b));const c=fixture();c.previous.actors=[actor('x',[0,0,0],[1,1,1]),actor('x',[2,0,0],[3,1,1])];assert.throws(()=>check(c))});
test('reversed actor ordering produces identical deterministic result',()=>{const f=fixture();f.previous.actors=[actor('z',[0,0,0],[1,1,1]),actor('a',[1,0,0],[2,1,1])];const g=fixture();g.previous.actors=[...f.previous.actors].reverse();assert.deepEqual(check(f),check(g))});
test('static obstacles block both snapshots',()=>{const f=fixture();f.obstacles=[{id:'rock',bounds:bounds([0,0,0],[1,1,1])}];assert.equal(check(f).results[0].candidatePathClear,false)});
