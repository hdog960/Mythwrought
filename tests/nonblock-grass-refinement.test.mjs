import assert from 'node:assert/strict';
import test from 'node:test';
import {makeSaltgrass,validateSaltgrass} from '../src/nonblock-environments24/saltgrass.mjs';
import {makeSnowgrass,validateSnowgrass} from '../src/nonblock-environments24/snowgrass.mjs';
import {describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';

for(const [make,validate,limit] of [
  [makeSaltgrass,validateSaltgrass,88],[makeSnowgrass,validateSnowgrass,80]
]){
  test(make.name+' produces exclusive grounded faces and readable surface pigments',()=>{
    const shapes=new Set();
    for(const variant of [0,1,2,3]){
      const seed=179,anchor=[0,10,512],source=make({seed,anchor,variant});
      const {sceneId,mesh}=source;
      const stage=describeCandidateObject(seed,{sceneId,anchor,variant});
      assert.equal(validate(source),true);
      assert.equal(stage.instanceKey,source.instanceKey);
      assert.equal(stage.colliders.length,0);
      assert.equal(mesh.materials?.length,mesh.triangleCount);
      assert.equal(new Set(mesh.materials).size,4);
      assert.ok(mesh.materials.every(tag=>stage.palette[tag]?.length===3));
      assert.ok(mesh.triangleCount<=limit);
      const y=mesh.positions.filter((_,index)=>index%3===1);
      assert.equal(Math.min(...y),0);
      assert.ok(Math.max(...y)<.60);
      const faces=new Set();
      for(let index=0;index<mesh.positions.length;index+=9){
        const points=[0,3,6].map(offset=>mesh.positions.slice(index+offset,index+offset+3));
        faces.add(points.map(point=>point.join(',')).sort().join('|'));
        const [a,b]=points.slice(1).map(point=>point.map((value,axis)=>value-points[0][axis]));
        assert.ok(Math.hypot(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])>1e-8);
        for(const point of points)assert.ok(source.selectionAabbs.some(({min,max})=>
          point.every((value,axis)=>value>=min[axis]&&value<=max[axis])));
      }
      assert.equal(faces.size,mesh.triangleCount);
      shapes.add(mesh.positions.join(','));
    }
    assert.equal(shapes.size,4);
  });
}
