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
const session=()=>createNonblockInteractiveSession({seed:17,placements});
const draw=s=>prepareBreakableObjectDraws(s,{position:[0,1,0]},{radius:20,maxInstances:4,maxTriangles:100000});

test('all four independently shaped families submit without undefined-key regression',()=>{
 const s=session(),result=draw(s);
 assert.equal(result.stats.selected,4);
 assert.equal(result.draws.length,4);
 assert.deepEqual(result.draws.flatMap(d=>d.instances.map(i=>i.instanceKey)).sort(),s.visible().map(o=>o.instanceKey).sort());
 assert.equal(result.stats.triangles,s.visible().reduce((n,o)=>n+o.render.triangleCount,0));
});
test('bounded draw selection is deterministic regardless of placement order',()=>{
 const a=session();
 const b=createNonblockInteractiveSession({seed:17,placements:[...placements].reverse()});
 const options={radius:20,maxInstances:2,maxTriangles:100000};
 const keys=s=>prepareBreakableObjectDraws(s,{position:[0,1,0]},options).draws.flatMap(d=>d.instances.map(i=>i.instanceKey));
 assert.deepEqual(keys(a),keys(b));
 assert.equal(keys(a).length,2);
});
test('break and restored tombstone suppress draw without touching other objects',()=>{
 const s=session(),first=s.visible()[0];
 const bounds=first.selectionAabbs[0];
 const rayOrigin=[(bounds.min[0]+bounds.max[0])/2,(bounds.min[1]+bounds.max[1])/2,bounds.min[2]-2];
 const hit=s.breakAt(rayOrigin,[0,0,1],6);
 assert.equal(hit.removed,true);
 assert.equal(draw(s).stats.selected,3);
 const reloaded=createNonblockInteractiveSession({seed:17,placements,sidecarSnapshot:s.snapshot()});
 assert.equal(draw(reloaded).stats.selected,3);
 assert.equal(reloaded.visible().some(o=>o.instanceKey===hit.instanceKey),false);
});
test('malformed selection bounds fail closed before draw submission',()=>{
 const s=session(),bad=s.visible()[0];
 const forged={...bad,selectionAabbs:[{min:[0,0,0],max:[Infinity,1,1]}]};
 const fake={contract:s.contract,visible:()=>[forged]};
 assert.throws(()=>draw(fake),/selection bounds/);
});
