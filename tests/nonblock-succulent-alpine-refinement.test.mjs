import assert from 'node:assert/strict';
import test from 'node:test';
import {makeAgaveRosette,validateAgaveRosette} from '../src/nonblock-environments24/agave-rosette.mjs';
import {makeAlpineWildflower,validateAlpineWildflower} from '../src/nonblock-environments24/alpine-wildflower.mjs';
import {describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';

for(const [make,validate,maxTriangles] of [
  [makeAgaveRosette,validateAgaveRosette,96],[makeAlpineWildflower,validateAlpineWildflower,190]
]){
  test(make.name+' stays grounded and draws unique faceted plant surfaces',()=>{
    for(const seed of [0,179,9532])for(const variant of [0,1,2,3]){
      const anchor=[512,9,0],source=make({seed,anchor,variant}),{sceneId,mesh,selectionAabbs}=source;
      const desc=describeCandidateObject(seed,{sceneId,anchor,variant});
      assert.equal(validate(source),true);
      assert.equal(desc.instanceKey,source.instanceKey);
      assert.equal(desc.colliders.length,0);
      assert.equal(mesh.materials?.length,mesh.triangleCount);
      assert.equal(new Set(mesh.materials).size,4);
      assert.ok(mesh.materials.every(tag=>desc.palette[tag]?.length===3));
      assert.ok(mesh.triangleCount<=maxTriangles);
      const y=mesh.positions.filter((_,index)=>index%3===1);
      assert.equal(Math.min(...y),0);
      assert.ok(Math.max(...y)<.60);
      const faces=new Set();
      for(let index=0;index<mesh.positions.length;index+=9){
        const points=[0,3,6].map(offset=>mesh.positions.slice(index+offset,index+offset+3));
        const [a,b]=points.slice(1).map(point=>point.map((value,axis)=>value-points[0][axis]));
        assert.ok(Math.hypot(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])>1e-8);
        faces.add(points.map(point=>point.join(',')).sort().join('|'));
        for(const point of points)assert.ok(selectionAabbs.some(({min,max})=>
          point.every((value,axis)=>value>=min[axis]&&value<=max[axis])));
      }
      assert.equal(faces.size,mesh.triangleCount);
    }
  });
}
