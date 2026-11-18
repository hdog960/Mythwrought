import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareSceneDraws,validateSceneDraw} from '../src/nonblock-scene48/draw-preparation.mjs';
const grass='scene48:low-grass',fern='scene48:short-fern',flower='scene48:single-wildflower',mushroom='scene48:button-mushroom';
const anchor=(id,x,z,seed=17)=>({id,x,y:2,z,seed});
test('packed scene instances retain family geometry, anchors and finite 8-float records',()=>{
 const input=[anchor(grass,1,1),anchor(grass,2,1),anchor(fern,3,1),anchor(flower,4,1),anchor(mushroom,5,1)];
 const snapshot=structuredClone(input),result=prepareSceneDraws(input,{position:[0,2,0]});
 assert.deepEqual(input,snapshot);assert.equal(result.stats.selected,5);assert.equal(result.draws.length,4);
 for(const draw of result.draws){assert.equal(validateSceneDraw(draw),true);assert.equal(draw.instanceData.length,draw.count*8);assert.ok(draw.triangleCount>0);}
 assert.equal(result.draws[0].count,2);
});
test('bounded radius and deterministic near-first cap preserve reproducible results across input order',()=>{
 const input=[anchor(grass,2,0),anchor(fern,1,0),anchor(flower,80,0),anchor(mushroom,3,0)];
 const a=prepareSceneDraws(input,{position:[0,2,0]},{radius:5,maxInstances:2});
 const b=prepareSceneDraws([...input].reverse(),{position:[0,2,0]},{radius:5,maxInstances:2});
 assert.deepEqual(a,b);assert.equal(a.stats.selected,2);assert.equal(a.stats.culled,1);assert.equal(a.stats.budgetDropped,1);
 assert.deepEqual(a.draws.map(v=>v.id),[fern,grass]);
});
test('all invalid coordinates, families, budgets and camera vectors fail closed',()=>{
 assert.throws(()=>prepareSceneDraws([anchor(grass,0.5,1)],{position:[0,2,0]}),TypeError);
 assert.throws(()=>prepareSceneDraws([anchor('block:1',0,1)],{position:[0,2,0]}),TypeError);
 assert.throws(()=>prepareSceneDraws([],{position:[0,NaN,0]}),TypeError);
 assert.throws(()=>prepareSceneDraws([],{position:[0,2,0]},{maxInstances:0}),RangeError);
 assert.throws(()=>prepareSceneDraws([],{position:[0,2,0]},{radius:-1}),RangeError);
});
