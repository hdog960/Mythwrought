import test from 'node:test';
import assert from 'node:assert/strict';
import {createNonblockInteractiveSession} from '../src/nonblock-scene48/interactive-session.mjs';
import {prepareBreakableObjectDraws} from '../src/nonblock-scene48/breakable-draw-preparation.mjs';
import {stagePreparedBreakableDraws} from '../src/nonblock-scene48/gpu-instance-staging.mjs';
const sceneId='scene48:low-grass';
const placements=[{sceneId,anchor:[0,0,0]},{sceneId,anchor:[2,0,0]}];
function fixture(){
 const session=createNonblockInteractiveSession({seed:45,placements});
 return prepareBreakableObjectDraws(session,{position:[0,0,0]});
}
test('unique geometry is counted once for shared exact-mesh instance batches',()=>{
 const prepared=fixture();
 const staged=stagePreparedBreakableDraws(prepared);
 const expected=staged.batches.reduce((sum,b)=>sum+b.mesh.positions.byteLength+b.mesh.materials.byteLength,0);
 assert.equal(staged.geometryBytes,expected);
 assert.equal(staged.totalBytes,staged.geometryBytes+staged.bytes);
 assert.equal(staged.instances,2);
 assert.equal(staged.uniqueMeshes,staged.batches.length);
});
test('geometry upload cap fails closed without weakening instance cap',()=>{
 const prepared=fixture();
 const actual=stagePreparedBreakableDraws(prepared);
 assert.throws(()=>stagePreparedBreakableDraws(prepared,{maxGeometryBytes:actual.geometryBytes-1}),RangeError);
 assert.throws(()=>stagePreparedBreakableDraws(prepared,{maxBytes:12}),RangeError);
});
test('rejects malformed geometry and nonfinite vertices before staging',()=>{
 const prepared=fixture(),draw=prepared.draws[0];
 assert.throws(()=>stagePreparedBreakableDraws({...prepared,draws:[{...draw,mesh:{positions:new Float32Array(8),materials:new Uint8Array(1)}}],stats:{selected:draw.instances.length}}),TypeError);
 const badPositions=new Float32Array(draw.mesh.positions);badPositions[0]=NaN;
 assert.throws(()=>stagePreparedBreakableDraws({...prepared,draws:[{...draw,mesh:{positions:badPositions,materials:draw.mesh.materials}}],stats:{selected:draw.instances.length}}),TypeError);
});
