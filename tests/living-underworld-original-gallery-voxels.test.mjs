import test from 'node:test';
import assert from 'node:assert/strict';
import {planUnderworldRegion}
 from '../src/living-underworld/worldwide-network.mjs';
import {auditOriginalMainGalleryVoxelReadiness}
 from '../src/living-underworld/combined-stair-footprints.mjs';
const PAIRS=[0,2,4,6,8,10,12,14,17,19,21,23,26,28,30,32];
const key=(x,y,z)=>x+','+y+','+z;
function syntheticBuiltSource(seed=179,rx=0,rz=0){
 const plan=planUnderworldRegion(seed,rx,rz),deck=new Set();
 for(const index of PAIRS)for(const segment of [
  plan.capsules[index],plan.capsules[index+1]]){
  const {a,b}=segment,dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z;
  const count=Math.max(Math.abs(dx),Math.abs(dz));
  const alongX=Math.abs(dx)>=Math.abs(dz);
  for(let i=0;i<=count;i++){
   const t=i/count,x=Math.round(a.x+dx*t),
    y=Math.round(a.y+dy*t),z=Math.round(a.z+dz*t);
   for(const [ox,oz] of (alongX?[[0,-1],[0,0],[0,1]]:
    [[-1,0],[0,0],[1,0]]))
    deck.add(key(x+ox,y-1,z+oz));
  }
 }
 return (x,y,z)=>deck.has(key(x,y,z))?1:0;
}
test('a physically hypothetical built deck and air can pass the actual voxel raster',()=>{
 const r=auditOriginalMainGalleryVoxelReadiness(179,0,0,{
  materialAt:syntheticBuiltSource()
 });
 assert.equal(r.ok,true);assert.equal(r.galleriesChecked,16);
 assert.equal(r.blockedHeadroom,0);assert.equal(r.unsupportedDeck,0);
 assert.equal(r.actualPlayerCollisionAndMovementNotTested,true);
});
test('untouched original rock cannot masquerade as a carved gallery',()=>{
 const r=auditOriginalMainGalleryVoxelReadiness(179,0,0,{
  materialAt:()=>1
 });
 assert.equal(r.ok,false);assert.ok(r.blockedHeadroom>0);
 assert.equal(r.reason,'PLANNED_GALLERIES_NOT_PRESENT_IN_ORIGINAL_M7');
});
test('all-air world fails for missing walkable floor support',()=>{
 const r=auditOriginalMainGalleryVoxelReadiness(179,0,0,{
  materialAt:()=>0
 });
 assert.equal(r.ok,false);assert.ok(r.unsupportedDeck>0);
});
test('original player edits keep as-built source approval closed',()=>{
 const r=auditOriginalMainGalleryVoxelReadiness(179,0,0,{
  materialAt:syntheticBuiltSource(),editedAt:()=>true
 });
 assert.equal(r.ok,false);assert.ok(r.editedCells>0);
});
test('invalid material and query exhaustion refuse without world writes',()=>{
 const invalid=auditOriginalMainGalleryVoxelReadiness(179,0,0,{
  materialAt:()=>Number.NaN
 });
 assert.equal(invalid.reason,'INVALID_ORIGINAL_M7_MATERIAL');
 const exhausted=auditOriginalMainGalleryVoxelReadiness(179,0,0,{
  materialAt:()=>1,maxCells:100
 });
 assert.equal(exhausted.reason,'ORIGINAL_M7_GALLERY_VOXEL_BUDGET');
 assert.equal(exhausted.worldChanged,false);
});
