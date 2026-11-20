import test from 'node:test';
import assert from 'node:assert/strict';
import {createNonblockInteractiveSession} from '../src/nonblock-scene48/interactive-session.mjs';
import {prepareBreakableObjectDraws} from '../src/nonblock-scene48/breakable-draw-preparation.mjs';
import {stagePreparedBreakableDraws} from '../src/nonblock-scene48/gpu-instance-staging.mjs';

const placements=[
 {sceneId:'scene48:low-grass',anchor:[0,0,0]},
 {sceneId:'scene48:short-fern',anchor:[2,0,0]}
];
const fixture=()=>prepareBreakableObjectDraws(
 createNonblockInteractiveSession({seed:31,placements}),{position:[0,0,0]});
const rewrite=(prepared,fn)=>({
 ...prepared,draws:prepared.draws.map((draw,index)=>({
  ...draw,instances:draw.instances.map((instance,j)=>fn({...instance},index,j))
 }))
});

test('GPU staging rejects duplicate anchored identity across distinct mesh batches',()=>{
 const prepared=fixture();
 assert.equal(stagePreparedBreakableDraws(prepared).instances,2);
 const key=prepared.draws[0].instances[0].instanceKey;
 const duplicated=rewrite(prepared,(instance,i,j)=>i===1&&j===0?{...instance,instanceKey:key}:instance);
 assert.throws(()=>stagePreparedBreakableDraws(duplicated),/duplicate staged instance identity/);
});
test('GPU staging rejects empty instance identities rather than uploading unpickable objects',()=>{
 const prepared=fixture();
 const invalid=rewrite(prepared,(instance,i,j)=>i===0&&j===0?{...instance,instanceKey:''}:instance);
 assert.throws(()=>stagePreparedBreakableDraws(invalid),/invalid instance anchor/);
});
test('valid independent identities preserve instance and geometry byte accounting',()=>{
 const staged=stagePreparedBreakableDraws(fixture());
 assert.equal(staged.instances,2);
 assert.equal(staged.bytes,24);
 assert.ok(staged.geometryBytes>0);
 assert.equal(staged.totalBytes,staged.bytes+staged.geometryBytes);
});
