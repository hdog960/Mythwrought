import assert from 'node:assert/strict';
import test from 'node:test';
import {describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';

for(const sceneId of ['scene48:bracken-fern','scene48:clustered-toadstools']){
  test(sceneId+' uses grounded, genuinely different source variants',()=>{
    const anchor=[10,9,7];
    const variations=[];
    for(const variant of [0,1,2,3]){
      const object=describeCandidateObject(179,{sceneId,anchor,variant});
      const {positions,materials,palette,instanceKey}=object;
      assert.equal(instanceKey,'nb1:'+encodeURIComponent(sceneId)+':179:10,9,7:'+variant);
      assert.equal(object.colliders.length,0);
      assert.equal(positions.length,materials.length*9);
      assert.ok(materials.length<210);
      assert.ok(new Set(materials).size>=3);
      assert.ok(materials.every(id=>palette[id]?.length===3));
      const levels=positions.filter((_,i)=>i%3===1);
      assert.ok(Math.min(...levels)>=9&&Math.min(...levels)<=9.015);
      for(let i=0;i<positions.length;i+=9){
        const a=positions.subarray(i,i+3),b=positions.subarray(i+3,i+6),c=positions.subarray(i+6,i+9);
        const u=b.map((value,k)=>value-a[k]),v=c.map((value,k)=>value-a[k]);
        assert.ok(Math.hypot(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0])>1e-8);
      }
      variations.push(positions.join(','));
    }
    assert.equal(new Set(variations).size,4);
  });
}
