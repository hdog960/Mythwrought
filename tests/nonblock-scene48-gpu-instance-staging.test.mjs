import test from 'node:test';
import assert from 'node:assert/strict';
import {createNonblockInteractiveSession} from '../src/nonblock-scene48/interactive-session.mjs';
import {prepareBreakableObjectDraws} from '../src/nonblock-scene48/breakable-draw-preparation.mjs';
import {stagePreparedBreakableDraws} from '../src/nonblock-scene48/gpu-instance-staging.mjs';
const placements=[{sceneId:'scene48:low-grass',anchor:[0,0,0]},{sceneId:'scene48:short-fern',anchor:[2,0,0]}];
test('staging preserves exact visible instance census and typed anchors',()=>{
 const session=createNonblockInteractiveSession({seed:31,placements});
 const prepared=prepareBreakableObjectDraws(session,{position:[0,0,0]});
 const staged=stagePreparedBreakableDraws(prepared);
 assert.equal(staged.instances,2);assert.equal(staged.bytes,24);
 assert.ok(staged.batches.every(b=>b.offsets instanceof Float32Array));
 assert.deepEqual(staged.batches.flatMap(b=>Array.from(b.offsets)),[0,0,0,2,0,0]);
});
test('tombstones eliminate staged GPU instances on reload',()=>{
 const session=createNonblockInteractiveSession({seed:31,placements});
 const first=session.objects[0];
 session.breakAt([first.anchor[0],first.selectionAabbs[0].max[1]+1,first.anchor[2]],[0,-1,0]);
 const reloaded=createNonblockInteractiveSession({seed:31,placements,sidecarSnapshot:session.snapshot()});
 const staged=stagePreparedBreakableDraws(prepareBreakableObjectDraws(reloaded,{position:[0,0,0]}));
 assert.equal(staged.instances,1);assert.equal(staged.bytes,12);
});
test('staging rejects byte overflow and malformed instance coordinates',()=>{
 const session=createNonblockInteractiveSession({seed:31,placements});
 const prepared=prepareBreakableObjectDraws(session,{position:[0,0,0]});
 assert.throws(()=>stagePreparedBreakableDraws(prepared,{maxBytes:12}),RangeError);
 assert.throws(()=>stagePreparedBreakableDraws({...prepared,stats:{selected:3}}),TypeError);
});
