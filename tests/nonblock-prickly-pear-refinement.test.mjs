import assert from 'node:assert/strict';
import test from 'node:test';
import {makePricklyPear,validatePricklyPear} from '../src/nonblock-environments24/prickly-pear-cactus.mjs';
import {describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';

test('prickly pear branches from the ground through overlapping, faceted pads',()=>{
  const parent=[null,0,0,1,2];
  for(const seed of [0,179,91303])for(const variant of [0,1,2,3]){
    const options={seed,anchor:[512,9,0],variant};
    const source=makePricklyPear(options);
    const {mesh,selectionAabbs}=source;
    const staged=describeCandidateObject(seed,{sceneId:source.sceneId,anchor:options.anchor,variant});
    assert.equal(validatePricklyPear(source),true);
    assert.equal(staged.instanceKey,source.instanceKey);
    assert.equal(staged.colliders.length,2+variant);
    assert.equal(mesh.triangleCount,32*(2+variant));
    assert.equal(mesh.materials?.length,mesh.triangleCount);
    assert.ok(mesh.materials.every(tag=>staged.palette[tag]?.length===3));
    assert.equal(Math.min(...mesh.positions.filter((_,index)=>index%3===1)),0);
    for(let pad=1;pad<selectionAabbs.length;pad++){
      const child=selectionAabbs[pad],root=selectionAabbs[parent[pad]];
      for(let axis=0;axis<3;axis++){
        const overlap=Math.min(child.max[axis],root.max[axis])-Math.max(child.min[axis],root.min[axis]);
        assert.ok(overlap>.02,'Each pad must overlap its parent along every axis');
      }
    }
    for(let i=0;i<mesh.positions.length;i+=9){
      const points=[0,3,6].map(offset=>mesh.positions.slice(i+offset,i+offset+3));
      const [a,b]=points.slice(1).map(point=>point.map((value,axis)=>value-points[0][axis]));
      assert.ok(Math.hypot(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])>1e-8);
    }
  }
});
