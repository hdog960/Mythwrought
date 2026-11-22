import test from 'node:test';
import assert from 'node:assert/strict';
import {planUnderworldRegion}
 from '../src/living-underworld/worldwide-network.mjs';
import {compileMainGalleryPedestrianClearance}
 from '../src/living-underworld/combined-stair-footprints.mjs';
import {auditOriginalCityFloorProvenance}
 from '../src/living-underworld/original-city-floor-provenance.mjs';
const stone={naturalAt:()=>1,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false};
test('original three-wide gallery cells are detected in both floor/air directions',()=>{
 const plan=planUnderworldRegion(179,0,0);
 const idx=compileMainGalleryPedestrianClearance(179,0,0);
 assert.equal(idx.ok,true);
 const hub=plan.capsules[0].a;
 assert.equal(idx.inspectCell(hub.x,hub.y,hub.z,'support').horizontalPairIndex,0);
 assert.equal(idx.inspectCell(hub.x,hub.y-1,hub.z,'clearance').horizontalPairIndex,0);
 assert.equal(idx.inspectCell(hub.x,hub.y-150,hub.z,'clearance'),null);
 assert.throws(()=>idx.inspectCell(hub.x,hub.y,hub.z,'invalid'));
});
test('seed179 rare city region (2,0) refuses city-pad gallery obstruction',()=>{
 const r=auditOriginalCityFloorProvenance(179,2,0,{
  source:stone,maxColumns:40000,maxSourceChecks:400000
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'CITY_PAD_CONFLICTS_WITH_MAIN_GALLERY');
 assert.ok(r.sourceChecks>0);
 assert.equal(r.firstRejectedCell.type,'clearance');
 assert.equal(r.worldChanged,false);
});
test('seed179 rare city region (2,1) likewise cannot erase main gallery',()=>{
 const r=auditOriginalCityFloorProvenance(179,2,1,{
  source:stone,maxColumns:40000,maxSourceChecks:400000
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'CITY_PAD_CONFLICTS_WITH_MAIN_GALLERY');
 assert.equal(r.firstRejectedCell.type,'clearance');
});
