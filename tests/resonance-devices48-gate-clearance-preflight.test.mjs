import test from 'node:test';
import assert from 'node:assert/strict';
import {preflightCandidateGateClearance as preflight} from '../src/resonance/devices48/gate-clearance-preflight-v1.mjs';
const intent=id=>({id,requestedOpen:true,movementAuthorized:false,collisionCleared:false,authority:'candidate-only'});
const bounds=(min,max)=>({min,max});
const frame=()=>({worldId:'world_a',tick:2,intents:[intent('gate_a')],
 paths:[{id:'gate_a',swept:[bounds([0,0,0],[2,3,1])]}],obstacles:[],actors:[]});
test('clear candidate path never grants real movement',()=>{
 const r=preflight(frame());assert.equal(r.results[0].candidatePathClear,true);
 assert.equal(r.results[0].movementAuthorized,false);assert.equal(r.physicsBound,false);
});
test('actor and obstacle overlap blocks even with requested power',()=>{
 const f=frame();f.actors=[{id:'player',bounds:bounds([1,1,0],[2,2,1])}];
 f.obstacles=[{id:'rock',bounds:bounds([0,0,0],[1,1,1])}];
 const r=preflight(f);assert.deepEqual(r.results[0].blockers,['actor:player','obstacle:rock']);
 assert.equal(r.results[0].candidatePathClear,false);
});
test('touching boundary is not collision',()=>{
 const f=frame();f.obstacles=[{id:'rock',bounds:bounds([2,0,0],[3,3,1])}];
 assert.equal(preflight(f).results[0].candidatePathClear,true);
});
test('rejects forged authorization, missing paths and malformed bounds',()=>{
 const f=frame();f.intents[0].movementAuthorized=true;assert.throws(()=>preflight(f));
 const g=frame();g.paths=[];assert.throws(()=>preflight(g));
 const h=frame();h.paths[0].swept[0].max=[0,3,1];assert.throws(()=>preflight(h));
});
test('results sorted independent of input order',()=>{
 const f=frame();f.intents.unshift(intent('gate_z'));
 f.paths.unshift({id:'gate_z',swept:[bounds([10,0,0],[11,2,1])]});
 assert.deepEqual(preflight(f).results.map(x=>x.id),['gate_a','gate_z']);
});
