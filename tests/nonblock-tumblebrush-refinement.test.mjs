import assert from 'node:assert/strict';
import test from 'node:test';
import {makeTumblebrush,validateTumblebrush} from '../src/nonblock-environments24/tumblebrush.mjs';
import {describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';

test('tumblebrush variants form a bounded root-to-crown twig lattice',()=>{
  const variants=[];
  for(const variant of [0,1,2,3]){
    const options={seed:179,anchor:[512,9,0],variant};
    const source=makeTumblebrush(options);
    assert.equal(validateTumblebrush(source),true);
    const {mesh,sceneId}=source;
    const staged=describeCandidateObject(options.seed,{sceneId,anchor:options.anchor,variant});
    assert.equal(staged.instanceKey,source.instanceKey);
    assert.equal(staged.colliders.length,0);
    assert.equal(mesh.materials.length,mesh.triangleCount);
    assert.ok(mesh.materials.every(value=>staged.palette[value]?.length===3));
    assert.ok(mesh.triangleCount<=132);
    const span=Array.from({length:3},(_,axis)=>{
      const component=mesh.positions.filter((_,i)=>i%3===axis);
      return [Math.min(...component),Math.max(...component)];
    });
    assert.ok(span[1][0]<.045&&span[1][0]>=0,'Twig lattice must attach at the ground');
    const height=span[1][1]-span[1][0];
    for(const [min,max] of [span[0],span[2]])assert.ok((max-min)/height>.60&&(max-min)/height<1.55);
    for(let i=0;i<mesh.positions.length;i+=9){
      const [x,y,z,bx,by,bz,cx,cy,cz]=mesh.positions.slice(i,i+9);
      const a=[bx-x,by-y,bz-z],b=[cx-x,cy-y,cz-z];
      assert.ok(Math.hypot(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])>1e-8);
    }
    variants.push(mesh.positions.join(','));
  }
  assert.equal(new Set(variants).size,4);
});
