import test from 'node:test';
import assert from 'node:assert/strict';
import {createNonblockInteractiveSession} from '../src/nonblock-scene48/interactive-session.mjs';
import {prepareBreakableObjectDraws} from '../src/nonblock-scene48/breakable-draw-preparation.mjs';
const placements=[
 {sceneId:'scene48:low-grass',anchor:[0,0,0]},
 {sceneId:'scene48:short-fern',anchor:[2,0,0]},
 {sceneId:'scene48:button-mushroom',anchor:[4,0,0]},
 {sceneId:'scene48:clover-patch',anchor:[6,0,0]}
];
const prep=s=>prepareBreakableObjectDraws(s,{position:[0,0,0]});
test('all four distinct flora groups enter bounded opt-in draw path',()=>{
 const s=createNonblockInteractiveSession({seed:17,placements});
 const result=prep(s);
 assert.equal(result.stats.selected,4);
 assert.equal(result.draws.reduce((n,d)=>n+d.instances.length,0),4);
 assert.equal(new Set(result.draws.map(d=>d.sceneId)).size,4);
 assert.ok(result.draws.every(d=>d.mesh.positions instanceof Float32Array));
});
test('breaking an object removes its draw submission and remains removed on reload',()=>{
 const s=createNonblockInteractiveSession({seed:17,placements});
 const removed=s.breakAt([-2,.2,0],[1,0,0]);
 assert.equal(removed.removed,true);
 assert.equal(prep(s).stats.selected,3);
 assert.ok(prep(s).draws.every(d=>d.instances.every(i=>i.instanceKey!==removed.instanceKey)));
 const reloaded=createNonblockInteractiveSession({seed:17,placements,sidecarSnapshot:s.snapshot()});
 assert.equal(prep(reloaded).stats.selected,3);
});
test('density, distance and triangle caps are explicit and fail closed',()=>{
 const s=createNonblockInteractiveSession({seed:17,placements});
 assert.equal(prepareBreakableObjectDraws(s,{position:[0,0,0]},{maxInstances:1}).stats.selected,1);
 assert.equal(prepareBreakableObjectDraws(s,{position:[1000,0,0]},{radius:1}).stats.selected,0);
 assert.throws(()=>prepareBreakableObjectDraws(s,{position:[0,0,0]},{maxInstances:2049}),/limits/);
 assert.throws(()=>prepareBreakableObjectDraws(s,{position:[NaN,0,0]}),/camera/);
});
