import test from 'node:test';
import assert from 'node:assert/strict';
import {auditBinaryChunkSurface,auditDetachedChunkSurface}
 from '../src/living-underworld/chunk-exposure-audit.mjs';
test('solid and air chunks have zero interior exposed faces, with halo checked separately',()=>{
 const o={x:0,y:-64,z:0};
 for(const value of [true,false]){
  const a=auditBinaryChunkSurface({origin:o,side:8,isSolidAt:()=>value});
  assert.equal(a.ok,true);
  assert.equal(a.exposedFaceCount,0);
  assert.equal(a.airVoxelCount,value?0:512);
  assert.equal(a.sampledHaloCells,1000);
  assert.equal(a.actualGpuBuffersCreated,false);
 }
});
test('one exposed solid cube produces exactly six unmerged faces and 24 vertices',()=>{
 const a=auditBinaryChunkSurface({origin:{x:0,y:0,z:0},side:8,
  isSolidAt:(x,y,z)=>x===3&&y===3&&z===3});
 assert.equal(a.exposedFaceCount,6);
 assert.equal(a.naiveUnmergedVertices,24);
 assert.equal(a.naiveUnmergedIndices,36);
 assert.equal(a.illustrativeTotalBytes,24*32+36*2);
});
test('original source detached cave chunk audit is deterministic with zero renderer side effects',()=>{
 const o={x:112,y:-80,z:112};
 const a=auditDetachedChunkSurface(179,o,{side:8});
 assert.equal(a.ok,true);
 assert.deepEqual(a,auditDetachedChunkSurface(179,o,{side:8}));
 assert.equal(a.solidVoxelCount+a.airVoxelCount,512);
 assert.equal(a.facesByAxis.reduce((x,y)=>x+y,0),a.exposedFaceCount);
});
test('invalid dimensions, missing halo budget and unsafe seed refuse samples',()=>{
 assert.throws(()=>auditBinaryChunkSurface({origin:{x:0,y:0,z:0},
  isSolidAt:()=>true,side:25}),/Invalid/);
 const overflow=auditBinaryChunkSurface({origin:{x:0,y:0,z:0},
  side:16,isSolidAt:()=>false,maxCells:500});
 assert.equal(overflow.ok,false);
 assert.equal(overflow.reason,'HALO_SAMPLE_BUDGET');
 assert.throws(()=>auditDetachedChunkSurface(2147483648,{x:0,y:0,z:0}),/Invalid/);
});
