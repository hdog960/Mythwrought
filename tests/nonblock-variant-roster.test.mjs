import assert from 'node:assert/strict';
import test from 'node:test';
import {createHash} from 'node:crypto';
import {candidateFamilies} from '../src/nonblock/candidate-families.mjs';
import {describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';

const samples=[
  {seed:179,anchor:[10,9,7]},
  {seed:0,anchor:[512,13,0]},
  {seed:-163,anchor:[-512,13,0]},
  {seed:132512,anchor:[9997,12,-9997]}
];

function assertFaces(positions,label){
  for(let i=0;i<positions.length;i+=9){
    const [x,y,z,bx,by,bz,cx,cy,cz]=positions.subarray(i,i+9);
    const a=[bx-x,by-y,bz-z],b=[cx-x,cy-y,cz-z];
    assert.ok(Math.hypot(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])>=1e-8,
      label+' contains a degenerate triangle');
  }
}

for(const {seed,anchor} of samples){
  test('each scenery variant is distinct and nondegenerate at seed '+seed,()=>{
    let variants=0;
    for(const [sceneId,family] of candidateFamilies){
      const shapes=new Set(),count=(family.variantMax??3)+1;
      for(let variant=0;variant<count;variant++){
        const {positions,farDetail}=describeCandidateObject(seed,{sceneId,anchor,variant});
        const shape=Buffer.from(positions.buffer,positions.byteOffset,positions.byteLength);
        shapes.add(createHash('sha256').update(shape).digest('hex'));
        assertFaces(positions,sceneId+' variant '+variant);
        if(farDetail)assertFaces(farDetail.positions,sceneId+' distant variant '+variant);
      }
      assert.equal(shapes.size,count,sceneId+' repeats a source geometry variant');
      variants+=count;
    }
    assert.equal(candidateFamilies.size,72);
    assert.equal(variants,320);
  });
}
