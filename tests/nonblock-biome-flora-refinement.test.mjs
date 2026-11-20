import assert from 'node:assert/strict';
import test from 'node:test';
import {makeDesertBloom,validateDesertBloom} from '../src/nonblock-environments24/desert-bloom.mjs';
import {makeFrostFern,validateFrostFern} from '../src/nonblock-environments24/frost-fern.mjs';
import {describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';

for(const [make,validate,expectedMaterials,budget] of [
  [makeDesertBloom,validateDesertBloom,4,48],
  [makeFrostFern,validateFrostFern,3,96]
]){
  test(make.name+' uses distinct material faces and real anchored variants',()=>{
    const variants=[];
    for(const variant of [0,1,2,3]){
      const source=make({seed:179,anchor:[0,9,0],variant});
      assert.equal(validate(source),true);
      const {mesh,sceneId,instanceKey}=source;
      const object=describeCandidateObject(179,{sceneId,variant,anchor:[0,9,0]});
      assert.equal(object.instanceKey,instanceKey);
      assert.equal(object.colliders.length,0);
      assert.equal(mesh.triangleCount,mesh.materials.length);
      assert.equal(new Set(mesh.materials).size,expectedMaterials);
      assert.ok(mesh.materials.every(index=>object.palette[index]?.length===3));
      assert.ok(mesh.triangleCount<=budget);
      const [{min,max}]=source.selectionAabbs;
      for(let i=0;i<mesh.positions.length;i+=9){
        const [x,y,z,bx,by,bz,cx,cy,cz]=mesh.positions.slice(i,i+9);
        const a=[bx-x,by-y,bz-z],b=[cx-x,cy-y,cz-z];
        assert.ok(Math.hypot(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])>1e-8);
      }
      assert.ok(mesh.positions.every((value,i)=>Number.isFinite(value)&&value>=min[i%3]-1e-6&&value<=max[i%3]+1e-6));
      variants.push(mesh.positions.join(','));
    }
    assert.equal(new Set(variants).size,4);
  });
}
