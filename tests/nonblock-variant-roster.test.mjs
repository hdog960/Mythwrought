import assert from 'node:assert/strict';
import test from 'node:test';
import {createHash} from 'node:crypto';
import {candidateFamilies} from '../src/nonblock/candidate-families.mjs';
import {describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';

test('each advertised scenery variant has distinct nondegenerate source geometry',()=>{
  for(const [sceneId,family] of candidateFamilies){
    const shapes=new Set();
    const count=(family.variantMax??3)+1;
    for(let variant=0;variant<count;variant++){
      const {positions}=describeCandidateObject(179,{sceneId,anchor:[10,9,7],variant});
      const shape=Buffer.from(positions.buffer,positions.byteOffset,positions.byteLength);
      shapes.add(createHash('sha256').update(shape).digest('hex'));
      for(let i=0;i<positions.length;i+=9){
        const [x,y,z,bx,by,bz,cx,cy,cz]=positions.subarray(i,i+9);
        const a=[bx-x,by-y,bz-z],b=[cx-x,cy-y,cz-z];
        assert.ok(Math.hypot(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])>=1e-8,
          `${sceneId} variant ${variant} contains a degenerate triangle`);
      }
    }
    assert.equal(shapes.size,count,`${sceneId} repeats a source geometry variant`);
  }
});
