// Source-exact fail-closed acceptance tests for cave-only Chromium C6 gate.
import test from 'node:test';
import assert from 'node:assert/strict';
import {C6_STABLE_RENDERED_FRAMES,expectedDeepSceneResidency,
 assessDeepSceneFrame,verifyStableDeepSceneFrames}
 from './cave-roadmap-depth-frame-gate.mjs';

const complete=(expect,renderedFrames=105)=>({
 center:expect.expectedCenter,loadedChunks:expect.requiredChunks,
 pendingChunks:0,renderedMeshVertices:3180,renderedFrames,
 playerFeet:expect.feet-.009,webgl2:true,contextLost:false
});
test('C6 genuine deep sections derive 27 from protected production streaming contract',()=>{
 const gallery=expectedDeepSceneResidency({x:192,y:-119,z:154});
 assert.equal(gallery.requiredChunks,27);
 assert.equal(gallery.expectedCenter,'12,9|-8,-7,-9');
 assert.equal(gallery.activeSection,-8);
 const fan=expectedDeepSceneResidency({x:204,y:-124,z:136});
 assert.equal(fan.requiredChunks,27);
 assert.equal(fan.expectedCenter,'12,8|-8,-7,-9');
});
test('C6 lowest authored band derives 18, never hard-coded 27',()=>{
 const p=expectedDeepSceneResidency({x:200,y:-199,z:140});
 assert.equal(p.requiredChunks,18);
 assert.equal(p.activeSection,-13);
 assert.deepEqual(p.sections,[-13,-12]);
});
test('C6 rejects under-resident Bifurcated Gallery 10/11 of 27',()=>{
 const e=expectedDeepSceneResidency({x:192,y:-119,z:154});
 for(const n of [10,11]){
  const actual={...complete(e),loadedChunks:n};
  assert.equal(assessDeepSceneFrame(actual,e).ok,false);
  assert.match(assessDeepSceneFrame(actual,e).faults.join(','),/INCOMPLETE_RESIDENCY/);
 }
});
test('C6 rejects Bedrock Labyrinth 4/3/2 of 18 on three real screenshot sizes',()=>{
 const e=expectedDeepSceneResidency({x:200,y:-199,z:140});
 for(const n of [4,3,2]){
  assert.equal(assessDeepSceneFrame({...complete(e),loadedChunks:n},e).ok,false);
 }
});
test('C6 refuses pending meshes, old centers, teleported feet and lost WebGL2',()=>{
 const e=expectedDeepSceneResidency({x:192,y:-119,z:154});
 const wrong=[
  {...complete(e),pendingChunks:1},
  {...complete(e),center:'12,9|-9,-8,-10'},
  {...complete(e),playerFeet:0},
  {...complete(e),webgl2:false},
  {...complete(e),contextLost:true},
  {...complete(e),renderedMeshVertices:0}
 ];
 for(const bad of wrong)assert.equal(assessDeepSceneFrame(bad,e).ok,false);
});
test('C6 requires four distinct completed WebGL2 frames, not one transient good sample',()=>{
 const e=expectedDeepSceneResidency({x:204,y:-124,z:136});
 assert.equal(C6_STABLE_RENDERED_FRAMES,4);
 const good=[110,111,112,113].map(n=>complete(e,n));
 assert.equal(verifyStableDeepSceneFrames(good,e).requiredChunks,27);
 assert.throws(()=>verifyStableDeepSceneFrames(good.slice(0,3),e),/NOT_ENOUGH/);
 assert.throws(()=>verifyStableDeepSceneFrames([good[0],good[0],good[2],good[3]],e),
  /NO_FRAME_ADVANCE/);
 assert.throws(()=>verifyStableDeepSceneFrames([
  good[0],good[1],{...good[2],loadedChunks:3},good[3]],e),
  /FRAME_NOT_RESIDENT/);
});
test('C6 never accepts surface/invalid coordinates as a deep screenshot',()=>{
 assert.throws(()=>expectedDeepSceneResidency({x:0,y:5,z:0}),/NOT_A_DEEP_CAMERA/);
 assert.throws(()=>expectedDeepSceneResidency({x:0.5,y:-120,z:0}),/INVALID_SOURCE_CAMERA/);
});
