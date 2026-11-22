// Test against EXACT unchanged gameplay source checked out at ../baseline.
// Genuine meshChunk(World) using both original and isolated candidate engines.
import test from 'node:test';
import assert from 'node:assert/strict';
import {meshChunk as candidateMesh} from '../src/voxel.mjs';
import {meshChunk as originalMesh} from '../../baseline/src/voxel.mjs';
import {FourRegionWorld as CandidateWorld,fourRegionProfile as candidateProfile,
 M7_ENVIRONMENT_GENERATOR as gen}
  from '../src/manual-biomes/profile-world.mjs';
import {FourRegionWorld as OriginalWorld,fourRegionProfile as originalProfile}
  from '../../baseline/src/manual-biomes/profile-world.mjs';
import {desertSeamVertexTint} from '../src/manual-biomes/desert-seam-vertex-tint.mjs';
const locations=[[179,-786,-1774],[2026,-2848,-774]];
test('pure RGB edge blend has no layout or uncontacted vertex effects',()=>{
 const base=[.55,.40,.26];
 assert.equal(desertSeamVertexTint(base,0,0,{east:true,west:false,south:false,north:false}),base);
 const changed=desertSeamVertexTint(base,1,0,{east:true,west:false,south:false,north:false});
 assert.ok(changed[0]<base[0]&&changed[2]>base[2]);
 assert.deepEqual(desertSeamVertexTint(base,0,1,{east:false,west:false,south:false,north:false}),base);
});
test('exact source original-world mesh parity except bounded natural terrain RGB',()=>{
 let changedTotal=0;
 for(const [seed,x,z] of locations){
  const old=new OriginalWorld(seed,originalProfile(seed,gen));
  const next=new CandidateWorld(seed,candidateProfile(seed,gen));
  const cx=Math.floor(x/16),cz=Math.floor(z/16);
  const a=originalMesh(old,cx,cz),b=candidateMesh(next,cx,cz);
  assert.equal(a.length,b.length,'Vertex budget and geometry must match');
  assert.equal(a.length%9,0);
  let changedRgb=0,unmodified=0,maxDelta=0;
  for(let i=0;i<a.length;i+=9){
   for(const offset of [0,1,2,6,7,8])
     assert.equal(a[i+offset],b[i+offset],
       'Position/UV/material identity not allowed to change');
   if(a[i+3]!==b[i+3]||a[i+4]!==b[i+4]||a[i+5]!==b[i+5]){
    changedRgb++;
    maxDelta=Math.max(maxDelta,
      Math.abs(a[i+3]-b[i+3]),Math.abs(a[i+4]-b[i+4]),Math.abs(a[i+5]-b[i+5]));
    assert.equal(a[i+8],40,'Only existing Desert terrain material may change RGB');
   }else unmodified++;
  }
  changedTotal+=changedRgb;
  assert.deepEqual(next.save().edits,[]);
  assert.deepEqual(old.save().edits,[]);
  assert.ok(maxDelta<.25,'Limit visual color amplitude');
  console.log('DESERT_VERTEX_ORIGINAL_MESH '+JSON.stringify({
   seed,cx,cz,vertices:a.length/9,originalBytes:a.byteLength,
   candidateBytes:b.byteLength,changedRgb,unmodified,maxDelta,
   noGeometryOrUvChanges:true,edits:0}));
 }
 assert.ok(changedTotal>0,'Actual terrain seam must show vertex RGB changes');
});
