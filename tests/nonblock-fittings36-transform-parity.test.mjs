import test from 'node:test';
import assert from 'node:assert/strict';
import {describeFitting,FITTINGS} from '../src/nonblock-fittings36/fittings-phase1.mjs';
import {planFittingBatches} from '../src/nonblock-fittings36/mobile-batch-plan.mjs';

const mounts={ground:{below:true},ceiling:{above:true},wall:{behind:true},corner:{corner:true}};
const rotate=(x,z,r)=>r===0?[x,z]:r===1?[-z,x]:r===2?[-x,-z]:[z,-x];

test('all five families preserve exact local-to-world triangle parity for four rotations',()=>{
 for(const [sceneId,family] of Object.entries(FITTINGS)){
  for(let orientation=0;orientation<4;orientation++){
   const anchor=[19,-7,23];
   const o=describeFitting({sceneId,seed:179,anchor,variant:2,orientation,mount:mounts[family.attachment]});
   const local=o.render.localMesh.positions,world=o.render.mesh.positions;
   assert.equal(local.length,world.length);
   assert.equal(o.render.localMesh.triangleCount,o.render.triangleCount);
   assert.deepEqual(o.render.transform,{translation:anchor,quarterTurnsY:orientation});
   for(let i=0;i<local.length;i+=3){
    const [x,z]=rotate(local[i],local[i+2],orientation);
    assert.ok(Math.abs(world[i]-(anchor[0]+x))<0.00002,`${sceneId} r${orientation} x vertex ${i}`);
    assert.ok(Math.abs(world[i+1]-(anchor[1]+local[i+1]))<0.00002,`${sceneId} r${orientation} y vertex ${i}`);
    assert.ok(Math.abs(world[i+2]-(anchor[2]+z))<0.00002,`${sceneId} r${orientation} z vertex ${i}`);
   }
  }
 }
});

test('rotated instances share canonical mesh without merging incompatible families',()=>{
 const objects=[0,1,2,3].map((orientation)=>describeFitting({
  sceneId:'scene36:signpost',seed:179,anchor:[orientation*5,0,0],
  variant:1,orientation,mount:{below:true}
 }));
 const plan=planFittingBatches(objects);
 assert.equal(plan.objectCount,4);
 assert.equal(plan.batches.length,1);
 assert.equal(plan.batches[0].instanceKeys.length,4);
 assert.equal(plan.totalTriangles,objects.reduce((n,o)=>n+o.render.triangleCount,0));
 assert.equal(new Set(objects.map(o=>o.instanceKey)).size,4);
});
