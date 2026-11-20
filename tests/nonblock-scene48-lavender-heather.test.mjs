import test from 'node:test';
import assert from 'node:assert/strict';
import {SCENE_FAMILIES,createSceneMesh} from '../src/nonblock-scene48/flora-phase1.mjs';
import {describeNonblockObject,createNonblockSidecar,pickNonblockRay} from '../src/nonblock-scene48/nonblock-object-v1.mjs';

for (const id of ['scene48:lavender-spike','scene48:heather-sprig']) {
 test(id+' has finite nondegenerate original triangles and bounded mesh',()=>{
  assert.ok(SCENE_FAMILIES[id]);
  const {mesh}=createSceneMesh(id,13,1,0,2);
  assert.ok(mesh.triangleCount>10&&mesh.triangleCount<160);
  assert.equal(mesh.positions.length,mesh.triangleCount*9);
  assert.equal(mesh.materials.length,mesh.triangleCount);
  for(const n of mesh.positions)assert.ok(Number.isFinite(n));
  for(let i=0;i<mesh.positions.length;i+=9){
   const p=mesh.positions;
   const ax=p[i+3]-p[i],ay=p[i+4]-p[i+1],az=p[i+5]-p[i+2];
   const bx=p[i+6]-p[i],by=p[i+7]-p[i+1],bz=p[i+8]-p[i+2];
   assert.ok(Math.hypot(ay*bz-az*by,az*bx-ax*bz,ax*by-ay*bx)>1e-8);
  }
 });
 test(id+' is pickable, breakable and remains removed on tombstone restore',()=>{
  const seed=32,anchor=[1,0,2];
  const obj=describeNonblockObject({sceneId:id,seed,anchor});
  assert.equal(obj.collisionIntent,'pass-through');
  assert.equal(obj.breakIntent.action,'remove-object');
  assert.equal(obj.persistence.defaultRespawn,'never-until-explicit-reset');
  assert.ok(obj.selectionAabbs.length);
  const box=obj.selectionAabbs[0],cy=(box.min[1]+box.max[1])/2,cz=(box.min[2]+box.max[2])/2;
  assert.equal(pickNonblockRay([obj],[box.min[0]-1,cy,cz],[1,0,0],6)?.instanceKey,obj.instanceKey);
  const sidecar=createNonblockSidecar(seed);
  sidecar.breakObject(obj);
  assert.equal(sidecar.visible([obj]).length,0);
  const restored=createNonblockSidecar(seed);
  restored.restore(sidecar.snapshot());
  assert.equal(restored.visible([obj]).length,0);
 });
}
