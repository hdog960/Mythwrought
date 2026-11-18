import test from 'node:test';
import assert from 'node:assert/strict';
import {SCENE_FAMILIES,createSceneMesh} from '../src/nonblock-scene48/flora-phase1.mjs';
import {createNonblockInteractiveSession} from '../src/nonblock-scene48/interactive-session.mjs';

for(const id of ['scene48:clover-clump','scene48:meadow-sedge']){
 test(id+' has nondegenerate original bounded triangles',()=>{
  assert.ok(SCENE_FAMILIES[id]);
  const mesh=createSceneMesh(id,43,2,0,4).mesh;
  assert.ok(mesh.triangleCount>=14&&mesh.triangleCount<=160);
  assert.equal(mesh.positions.length,mesh.triangleCount*9);
  assert.equal(mesh.materials.length,mesh.triangleCount);
  for(let i=0;i<mesh.positions.length;i+=9){
   const p=mesh.positions;
   const a=[p[i+3]-p[i],p[i+4]-p[i+1],p[i+5]-p[i+2]];
   const b=[p[i+6]-p[i],p[i+7]-p[i+1],p[i+8]-p[i+2]];
   assert.ok(Math.hypot(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])>1e-8);
  }
 });
 test(id+' opt-in pick break and reload retain tombstone',()=>{
  const seed=73,placements=[{sceneId:id,anchor:[2,0,4]}];
  const s=createNonblockInteractiveSession({seed,placements});
  const o=s.objects[0],box=o.selectionAabbs[0];
  assert.equal(o.collisionIntent,'pass-through');
  assert.equal(o.breakIntent.action,'remove-object');
  const ray=[box.min[0]-1,(box.min[1]+box.max[1])/2,(box.min[2]+box.max[2])/2];
  assert.equal(s.target(ray,[1,0,0])?.instanceKey,o.instanceKey);
  assert.equal(s.breakAt(ray,[1,0,0]).removed,true);
  assert.equal(s.visible().length,0);
  const restored=createNonblockInteractiveSession({seed,placements,sidecarSnapshot:s.snapshot()});
  assert.equal(restored.visible().length,0);
 });
}
