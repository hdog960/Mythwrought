import test from 'node:test';
import assert from 'node:assert/strict';
import {auditOriginalMainGalleryVoxelReadiness}
 from '../src/living-underworld/combined-stair-footprints.mjs';

const seed=179,rx=2,rz=0;
const opts={materialAt:()=>3,editedAt:()=>false};
const sum=m=>Object.values(m??{}).reduce((n,v)=>n+v,0);

test('original intact stone is existing deck but NOT existing tunnel headroom',()=>{
 const r=auditOriginalMainGalleryVoxelReadiness(seed,rx,rz,opts);
 assert.equal(r.ok,false);
 assert.equal(r.reason,'PLANNED_GALLERIES_NOT_PRESENT_IN_ORIGINAL_M7');
 assert.equal(r.galleriesChecked,16);
 assert.ok(r.blockedHeadroom>10000);
 assert.equal(r.unsupportedDeck,0);
 assert.equal(r.blockedHeadroomByBlockId['3'],r.blockedHeadroom);
 assert.equal(sum(r.unsupportedDeckByBlockId),0);
 assert.equal(r.allBlockedMaterialIdsReported,true);
 assert.equal(r.worldChanged,false);
});
test('original natural AIR cannot be counted as already supported walking deck',()=>{
 const r=auditOriginalMainGalleryVoxelReadiness(seed,rx,rz,{
  ...opts,materialAt:()=>0
 });
 assert.equal(r.ok,false);
 assert.equal(r.blockedHeadroom,0);
 assert.ok(r.unsupportedDeck>1000);
 assert.equal(r.unsupportedDeckByBlockId['0'],r.unsupportedDeck);
 assert.equal(r.editedCells,0);
});
test('ore and ordinary stone are distinct existing headroom blockers',()=>{
 const r=auditOriginalMainGalleryVoxelReadiness(seed,rx,rz,{
  ...opts,materialAt:(x)=>x%2===0?6:3
 });
 assert.equal(r.ok,false);
 assert.ok(r.blockedHeadroomByBlockId['6']>0);
 assert.ok(r.blockedHeadroomByBlockId['3']>0);
 assert.equal(sum(r.blockedHeadroomByBlockId)+r.blockedIdsOverflow,
  r.blockedHeadroom);
 assert.equal(r.unsupportedDeckByBlockId['6'],r.unsupportedDeck);
});
test('malformed original M7 edit callback never masquerades as untouched',()=>{
 for(const v of [0,1,null,'false',undefined]){
  assert.throws(()=>auditOriginalMainGalleryVoxelReadiness(seed,rx,rz,{
   ...opts,editedAt:()=>v
  }),/Nonboolean original M7 as-built gallery edit source/);
 }
});
test('material histogram remains bounded with explicit overflow accounting',()=>{
 const r=auditOriginalMainGalleryVoxelReadiness(seed,rx,rz,{
  ...opts,materialAt:(x,y,z)=>1000+
   ((x*7+y*23+z*51)%113+113)%113
 });
 assert.equal(r.ok,false);
 assert.ok(Object.keys(r.blockedHeadroomByBlockId).length<=48);
 assert.equal(sum(r.blockedHeadroomByBlockId)+r.blockedIdsOverflow,
  r.blockedHeadroom);
 assert.equal(sum(r.unsupportedDeckByBlockId)+r.unsupportedIdsOverflow,
  r.unsupportedDeck);
 assert.ok(r.blockedIdsOverflow>0);
 assert.equal(r.allBlockedMaterialIdsReported,false);
});
test('bounded as-built source budget is a refusal and not player walkability',()=>{
 const r=auditOriginalMainGalleryVoxelReadiness(seed,rx,rz,{
  ...opts,maxCells:100
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'ORIGINAL_M7_GALLERY_VOXEL_BUDGET');
 assert.ok(r.sampledCells<=101);
 assert.equal(r.worldChanged,false);
});
