import test from 'node:test';
import assert from 'node:assert/strict';
import {surveyCityGalleryFloorCutsets}
 from '../src/living-underworld/city-gallery-floor-cutset-survey.mjs';
import {planGalleryEasementCityDistrict}
 from '../src/living-underworld/city-gallery-easement-district.mjs';

test('seed179 city (2,0) ellipse separates original landing from city center',()=>{
 const r=surveyCityGalleryFloorCutsets(179,2,0);
 assert.equal(r.ok,true);
 assert.equal(r.totalColumns,11387);
 assert.equal(r.blockedColumns,626);
 assert.equal(r.galleryConflictFreeColumns,10761);
 assert.equal(r.potentialConnectedComponents,3);
 assert.deepEqual(r.components.map(x=>x.count),[5827,2666,2268]);
 assert.equal(r.landingComponentColumns,2666);
 assert.equal(r.cityCenterComponentColumns,2268);
 assert.equal(r.landingAndCityCenterOnSameClearFloorComponent,false);
 assert.equal(r.originalM7SourceChecks,0);
 assert.equal(r.fullEllipseCityFloorApproved,false);
});
test('seed179 city (2,1) same-elevation planar floor has four disconnected areas',()=>{
 const r=surveyCityGalleryFloorCutsets(179,2,1);
 assert.equal(r.ok,true);
 assert.equal(r.totalColumns,16133);
 assert.equal(r.blockedColumns,813);
 assert.equal(r.galleryConflictFreeColumns,15320);
 assert.equal(r.potentialConnectedComponents,4);
 assert.deepEqual(r.components.map(x=>x.count),[5105,4661,2811,2743]);
 assert.equal(r.landingComponentColumns,5105);
 assert.equal(r.cityCenterComponentColumns,4661);
 assert.equal(r.landingAndCityCenterOnSameClearFloorComponent,false);
 assert.equal(r.sameElevationPlanarSeparationConfirmed,true);
 assert.equal(r.multiLevelBridgeOrAlternativeUnstudied,true);
});
test('exact all-ellipse column totals and discrete components are conserved',()=>{
 for(const [rx,rz] of [[2,0],[2,1]]){
  const r=surveyCityGalleryFloorCutsets(179,rx,rz);
  assert.equal(r.totalColumns,
   r.blockedColumns+r.galleryConflictFreeColumns);
  assert.equal(r.galleryConflictFreeColumns,
   r.components.reduce((n,c)=>n+c.count,0));
  assert.equal(r.blockedColumns,
   Object.values(r.galleryBlockedColumnsByPair).reduce((n,v)=>n+v,0));
 }
});
test('cut-set does not perform any original-M7 or settlement mutation',()=>{
 const r=surveyCityGalleryFloorCutsets(179,2,0);
 assert.equal(r.originalM7TerrainUninspected,true);
 assert.equal(r.voxelWorldUnchanged,true);
 assert.equal(r.settlementPlaced,false);
 assert.equal(r.worldChanged,false);
});
test('cut-set budget refusal cannot turn into a misleading partial floor census',()=>{
 const a=surveyCityGalleryFloorCutsets(179,2,0,{maxColumns:1000});
 assert.equal(a.ok,false);
 assert.equal(a.reason,'FLOOR_CUTSET_GEOMETRY_BUDGET');
 assert.equal(a.originalM7SourceChecks,0);
 const b=surveyCityGalleryFloorCutsets(179,2,1,{
  maxGeometryChecks:10000
 });
 assert.equal(b.ok,false);
 assert.equal(b.reason,'FLOOR_CUTSET_GEOMETRY_BUDGET');
 assert.equal(b.originalM7SourceChecks,0);
});
test('a region without an original rare-city candidate has no invented cut-set',()=>{
 const r=surveyCityGalleryFloorCutsets(179,0,0);
 assert.equal(r.sitePresent,false);
 assert.equal(r.sourceTerrainNeverRead,true);
});
test('landing-side three-wide fallback never claims the center across real cut-set',()=>{
 for(const [rx,rz] of [[2,0],[2,1]]){
  const separation=surveyCityGalleryFloorCutsets(179,rx,rz);
  const district=planGalleryEasementCityDistrict(179,rx,rz);
  assert.equal(district.ok,true);
  assert.ok(district.columns<separation.landingComponentColumns);
  assert.equal(district.cityCenterWithinConnectedLandingDistrict,false);
  assert.equal(district.fullOriginalEllipseNotApproved,true);
 }
});
