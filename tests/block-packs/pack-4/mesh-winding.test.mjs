import test from 'node:test';
import assert from 'node:assert/strict';
import {PACK4_WINDOW_ASSETS,windowPreviewMesh} from '../../../src/block-packs/pack-4/windows.mjs';
import {PACK4_LIGHT_ASSETS,lightingPreviewMesh} from '../../../src/block-packs/pack-4/lighting.mjs';
import {PACK4_FURNISHING_ASSETS,furnishingPreviewMesh} from '../../../src/block-packs/pack-4/furnishings.mjs';
import {PACK4_CIVIC_ASSETS,civicPreviewMesh} from '../../../src/block-packs/pack-4/hearth-civic.mjs';

const all=[...PACK4_WINDOW_ASSETS,...PACK4_LIGHT_ASSETS,...PACK4_FURNISHING_ASSETS,...PACK4_CIVIC_ASSETS];
function mesh(id,r){
  return id<165?windowPreviewMesh(id,r):id<169?lightingPreviewMesh(id,r):
    id<176?furnishingPreviewMesh(id,r):civicPreviewMesh(id,r);
}
function dot(a,b){return a.reduce((s,v,i)=>s+v*b[i],0)}
function cross(a,b){
  return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],
    a[0]*b[1]-a[1]*b[0]];
}
function triangles(stream,stride=10){
  const result=[];
  for(let i=0;i<stream.length;i+=stride*3){
    const p=[0,1,2].map(j=>[...stream.slice(i+j*stride,i+j*stride+3)]);
    const u=p[1].map((v,j)=>v-p[0][j]),v=p[2].map((x,j)=>x-p[0][j]);
    const face=[...stream.slice(i+3,i+6)];
    result.push({signedArea:dot(cross(u,v),face),face,alpha:stream[i+9],
      alpha2:stream[i+stride+9],alpha3:stream[i+2*stride+9]});
  }
  return result;
}
test('all 23 candidates × four orientations use consistently outward-facing, nondegenerate triangles',()=>{
  let count=0;
  for(const a of all)for(let r=0;r<4;r++){
    const candidate=mesh(a.id,r);
    for(const stream of [candidate.opaque,candidate.translucent]){
      assert.equal(stream.length%30,0,'incomplete triangle on ID '+a.id);
      for(const tri of triangles(stream,candidate.stride)){
        count++;
        assert.ok(tri.signedArea>1e-8,
          'inward or degenerate triangle on ID '+a.id+' rotation '+r);
        assert.equal(dot(tri.face,tri.face),1);
      }
    }
  }
  assert.ok(count>=18000,'unexpected missing physical surfaces');
});
test('every translucent triangle carries consistent, nonzero nonopaque alpha',()=>{
  let count=0;
  for(const a of all)for(let r=0;r<4;r++){
    const candidate=mesh(a.id,r);
    for(const tri of triangles(candidate.translucent,candidate.stride)){
      count++;
      assert.ok(tri.alpha>0&&tri.alpha<1);
      assert.equal(tri.alpha,tri.alpha2);
      assert.equal(tri.alpha,tri.alpha3);
    }
  }
  assert.ok(count>300,'transparency regression: glass or lanterns missing');
});
test('all 23 candidates are visually distinct by physical attributes and geometry',()=>{
  const signatures=all.map(a=>{
    const m=mesh(a.id,0),arr=[...m.opaque,...m.translucent];
    let hash=2166136261;
    for(let i=0;i<arr.length;i++){
      const n=new Float32Array([arr[i]]);
      const words=new Uint32Array(n.buffer);
      hash=Math.imul(hash^words[0],16777619)>>>0;
    }
    return hash.toString(16).padStart(8,'0');
  });
  assert.equal(new Set(signatures).size,23,'candidate meshes share identical shapes/colors');
});
