import test from 'node:test';
import assert from 'node:assert/strict';
import {preflightGateActorSweep as check} from '../src/resonance/devices48/gate-actor-sweep-v1.mjs';
const box=(min,max)=>({min,max});
const actor=(id,min,max)=>({id,bounds:box(min,max)});
const fixture=()=>({previous:{worldId:'world_a',tick:7,actors:[]},current:{worldId:'world_a',tick:8,actors:[]},
 intents:[{id:'gate_a',requestedOpen:true,movementAuthorized:false,collisionCleared:false,authority:'candidate-only'}],
 paths:[{id:'gate_a',swept:[box([4,0,0],[6,3,2])]}],obstacles:[]});
test('empty path stays candidate only',()=>{const r=check(fixture());assert.equal(r.results[0].candidatePathClear,true);assert.equal(r.results[0].movementAuthorized,false)});
test('crossing between clear endpoints blocks',()=>{const f=fixture();f.previous.actors=[actor('hero',[0,0,0],[1,2,1])];f.current.actors=[actor('hero',[9,0,0],[10,2,1])];const r=check(f);assert.equal(r.results[0].candidatePathClear,false);assert.deepEqual(r.results[0].blockers,['sweep:actor:hero'])});
test('off-path movement remains clear',()=>{const f=fixture();f.previous.actors=[actor('hero',[0,0,4],[1,2,5])];f.current.actors=[actor('hero',[9,0,4],[10,2,5])];assert.equal(check(f).results[0].candidatePathClear,true)});
test('departed actor remains blocked',()=>{const f=fixture();f.previous.actors=[actor('hero',[4,0,0],[5,2,1])];assert.equal(check(f).results[0].candidatePathClear,false)});
test('large displacement fails closed',()=>{const f=fixture();f.previous.actors=[actor('hero',[-20,0,0],[-19,2,1])];f.current.actors=[actor('hero',[20,0,0],[21,2,1])];assert.throws(()=>check(f),/envelope/)});
test('duplicates and skipped ticks rejected',()=>{const f=fixture();f.current.tick=10;assert.throws(()=>check(f));const g=fixture();g.previous.actors=[actor('hero',[0,0,0],[1,2,1]),actor('hero',[1,0,0],[2,2,1])];assert.throws(()=>check(g))});
test('actor order does not change output',()=>{const f=fixture();f.previous.actors=[actor('z',[0,0,0],[1,2,1]),actor('a',[8,0,0],[9,2,1])];f.current.actors=[actor('z',[9,0,0],[10,2,1]),actor('a',[8,0,0],[9,2,1])];const g=structuredClone(f);g.previous.actors.reverse();g.current.actors.reverse();assert.deepEqual(check(f),check(g))});
