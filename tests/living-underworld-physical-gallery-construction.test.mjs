import test from 'node:test';
import assert from 'node:assert/strict';
import {constructPhysicalGalleryCohort,measureGalleryCutUnion,GALLERY_CONSTRUCTION_LIMITS}
 from '../src/living-underworld/physical-gallery-construction.mjs';
import {auditProposedChunkCarveDelta} from '../src/living-underworld/chunk-carve-projection.mjs';
test('sparse changed faces agree with original full halo projection across chunk ownership',()=>{
 const cuts=new Set(['15,-16,0','16,-16,0','16,-15,0']);
 const air=new Set(['14,-16,0','16,-15,-1']);
 const naturalAt=(x,y,z)=>air.has(x+','+y+','+z)?0:3;
 const exact=measureGalleryCutUnion(cuts,naturalAt);
 for(const row of exact.rows){
  const full=auditProposedChunkCarveDelta({origin:{x:row.origin[0],y:row.origin[1],z:row.origin[2]},
   isSolidAt:(x,y,z)=>naturalAt(x,y,z)!==0,
   candidateAirAt:(x,y,z)=>cuts.has(x+','+y+','+z)});
  assert.equal(row.exposedFaceDelta,full.exposedFaceDelta);
  assert.equal(row.ownedCarves,full.newlyCarvedSolidCells);
 }
 assert.equal(exact.ownedCarves,3);
 assert.throws(()=>measureGalleryCutUnion(new Set(['14,-16,0']),naturalAt),/OLD_AIR/);
});
test('actual fresh seed179 plains galleries are physically excavated and walked under ONE cumulative cap',()=>{
 const r=constructPhysicalGalleryCohort(179,[{rx:-9,rz:0}]);
 console.log(JSON.stringify({...r,budget:{...r.budget,rows:undefined}}));
 assert.equal(r.requestedGalleries,16);
 assert.ok(r.physicallyBuiltGalleries>0);
 assert.equal(r.walkedGalleries,r.physicallyBuiltGalleries);
 assert.equal(r.actualPhysicalEdits,r.budget.ownedCarves);
 assert.equal(r.actualPhysicalEdits,r.rows.reduce((n,g)=>n+g.addedCuts,0));
 assert.ok(r.budget.ok);
 assert.ok(r.budget.ownedCarves<=10000&&r.budget.faceGrowth<=3500);
 assert.ok(r.budget.maxChunkFaces<=1200);
 assert.ok(r.originalRoleCalls.naturalAt<=40000);
 assert.equal(r.oldAuthoredCellsChanged,0);
 assert.equal(r.historicalSaveWrites,0);
 assert.ok(r.allBuiltFootprintReadbackPassed);
 assert.ok(r.noSupportPlacements);
 assert.equal(r.releaseApproved,false);
 assert.ok(r.completeCohort||r.refused.length>0);
});
test('construction accepts no existing world, duplicate region or overlarge cohort',()=>{
 assert.throws(()=>constructPhysicalGalleryCohort(179,[{rx:0,rz:0},{rx:0,rz:0}]),TypeError);
 assert.throws(()=>constructPhysicalGalleryCohort(179,{seed:179,edits:new Map()}),TypeError);
 assert.throws(()=>constructPhysicalGalleryCohort(179,Array.from({length:6},(_,rx)=>({rx,rz:0}))),TypeError);
 assert.equal(GALLERY_CONSTRUCTION_LIMITS.ownedCarves,10000);
 assert.equal(GALLERY_CONSTRUCTION_LIMITS.faceGrowth,3500);
});
