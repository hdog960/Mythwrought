import test from 'node:test';
import assert from 'node:assert/strict';
import {describeFitting,FITTINGS} from '../src/nonblock-fittings36/fittings-phase1.mjs';
import {compileFittingGpuPayload} from '../src/nonblock-fittings36/gpu-upload-payload.mjs';
const mounts={ground:{below:true},ceiling:{above:true},wall:{behind:true},corner:{corner:true}};
const make=(sceneId,orientation,anchor)=>describeFitting({sceneId,seed:179,anchor,variant:1,orientation,mount:mounts[FITTINGS[sceneId].attachment]});
test('all five families emit finite bounded WebGL2 upload buffers',()=>{
 const objects=Object.keys(FITTINGS).map((s,i)=>make(s,0,[i*5,0,0]));
 const result=compileFittingGpuPayload(objects);
 assert.equal(result.objectCount,5);assert.equal(result.payloads.length,5);
 assert.equal(result.uploadBytes,result.payloads.reduce((n,p)=>n+p.bytes,0));
 for(const p of result.payloads){
  assert.equal(p.vertexData.length,p.triangleCount*12);
  assert.equal(p.transforms.length,p.instanceCount*16);
  assert.ok([...p.vertexData,...p.transforms].every(Number.isFinite));
  assert.equal(p.instanceKeys.length,p.instanceCount);
 }
});
test('GPU matrices reproduce source world-space triangles for four orientations',()=>{
 for(const sceneId of Object.keys(FITTINGS)){
  const objects=[0,1,2,3].map(r=>make(sceneId,r,[r*5,2,7]));
  const payload=compileFittingGpuPayload(objects).payloads[0];
  assert.equal(payload.instanceCount,4);
  // Packet instances are sorted by stable instanceKey, not caller array order.
  // Anchor 10 sorts before anchor 5 lexically; always resolve by identity.
  assert.deepEqual([...payload.instanceKeys].sort(),payload.instanceKeys);
  for(const object of objects){
   const i=payload.instanceKeys.indexOf(object.instanceKey);
   assert.ok(i>=0,'missing '+object.instanceKey);
   const m=payload.transforms.subarray(i*16,(i+1)*16),p=payload.vertexData;
   const world=object.render.mesh.positions;
   for(let v=0;v<world.length/3;v++){
    const x=p[v*4],y=p[v*4+1],z=p[v*4+2];
    const actual=[m[0]*x+m[8]*z+m[12],y+m[13],m[2]*x+m[10]*z+m[14]];
    for(let k=0;k<3;k++)assert.ok(Math.abs(actual[k]-world[v*3+k])<0.000003,sceneId+' rotation '+object.orientation+' vertex '+v);
   }
  }
 }
});
test('upload budget fails closed without partial result',()=>{
 const objects=[make('scene36:signpost',0,[0,0,0])];
 assert.throws(()=>compileFittingGpuPayload(objects,{maxUploadBytes:1}),/budget exceeded/);
 assert.throws(()=>compileFittingGpuPayload(objects,{maxUploadBytes:0}),/invalid GPU upload budget/);
});
test('source mutation after compile cannot modify prepared upload data',()=>{
 const o=make('scene36:rope-coil',0,[0,0,0]);
 const payload=compileFittingGpuPayload([o]).payloads[0],before=payload.vertexData[0];
 o.render.localMesh.positions[0]+=1;
 assert.equal(payload.vertexData[0],before);
});
