import test from 'node:test';
import assert from 'node:assert/strict';
import {planGalleryEasementCityDistrict,
 auditSourceProtectedGalleryEasementDistrict}
 from '../src/living-underworld/city-gallery-easement-district.mjs';
import {selectCityCompatibleDeepLinks}
 from '../src/living-underworld/source-aware-city-deep-selection.mjs';
import {compileMainGalleryPedestrianClearance,
 compileSelectedStairPedestrianClearance}
 from '../src/living-underworld/combined-stair-footprints.mjs';
const seed=179;
const stone=()=>({naturalAt:()=>1,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false});
const cache=new Map();
const proof=(rx,rz)=>{
 const key=rx+','+rz;
 if(!cache.has(key))cache.set(key,
  selectCityCompatibleDeepLinks(seed,rx,rz,{source:stone()}));
 const result=cache.get(key);
 assert.equal(result.ok,true);
 assert.deepEqual(result.chosen.map(x=>x.index),[16,25,34]);
 assert.equal(result.joined.completeFourHubCandidateTopologyVerified,true);
 assert.equal(result.joined.completeDeepLinkSourceOwnershipVerified,true);
 return result;
};
const plan=(rx,rz,extra={})=>{
 const r=proof(rx,rz);
 return planGalleryEasementCityDistrict(seed,rx,rz,{
  selectedDeepProposals:r.deepProposals,
  sourceAuditedCityAccessRoute:
   r.joined.sourceAuditedCityAccessRouteGeometry,
  ...extra
 });
};
test('original seed179 (2,0) landing district has 222 verified 3-wide connected tiles',()=>{
 const r=plan(2,0);
 assert.equal(r.ok,true);
 assert.equal(r.centerTileCount,222);
 assert.equal(r.columns,1998);
 assert.equal(r.requiredSourceChecks,29970);
 assert.equal(r.selectedStairRouteCount,4);
 assert.equal(r.marginCells,1);
 assert.equal(r.geometryClearanceComparedToAll16MainGalleries,true);
 assert.equal(r.threeWideLandingFootprintPreserved,true);
 assert.equal(r.cityCenterWithinConnectedLandingDistrict,false);
 assert.equal(r.fullOriginalEllipseNotApproved,true);
 assert.equal(r.actualSettlementPlaced,false);
 assert.equal(r.worldChanged,false);
});
test('original seed179 (2,1) keeps 471 three-wide landing tiles, not full city floor',()=>{
 const r=plan(2,1);
 assert.equal(r.ok,true);
 assert.equal(r.centerTileCount,471);
 assert.equal(r.columns,4239);
 assert.equal(r.requiredSourceChecks,63585);
 assert.equal(r.selectedStairRouteCount,4);
 assert.equal(r.cityCenterWithinConnectedLandingDistrict,false);
 assert.equal(r.fullOriginalEllipseNotApproved,true);
});
test('every district tile is uniquely connected by shared three-wide faces',()=>{
 for(const [rx,rz] of [[2,0],[2,1]]){
  const r=plan(rx,rz);
  const tiles=new Set(r.tileCenters.map(t=>t.i+','+t.j));
  assert.equal(tiles.size,r.centerTileCount);
  assert.ok(tiles.has('0,0'));
  const queue=['0,0'],seen=new Set();
  while(queue.length){
   const tile=queue.shift();
   if(seen.has(tile))continue;
   seen.add(tile);
   const [i,j]=tile.split(',').map(Number);
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
    const id=(i+dx)+','+(j+dz);
    if(tiles.has(id)&&!seen.has(id))queue.push(id);
   }
  }
  assert.equal(seen.size,tiles.size);
  assert.equal(r.columns,tiles.size*9);
 }
});
test('all tiled support and headroom cells avoid exact 16 gallery and four route footprints',()=>{
 for(const [rx,rz] of [[2,0],[2,1]]){
  const p=proof(rx,rz),r=plan(rx,rz);
  const gallery=compileMainGalleryPedestrianClearance(seed,rx,rz);
  const selected=compileSelectedStairPedestrianClearance([
   ...p.deepProposals,p.joined.sourceAuditedCityAccessRouteGeometry
  ]);
  assert.equal(gallery.ok,true);assert.equal(selected.ok,true);
  for(const t of r.tileCenters)for(let dx=-1;dx<=1;dx++)
   for(let dz=-1;dz<=1;dz++)
    for(let y=r.floorY-5;y<=r.floorY+9;y++){
     const role=y<=r.floorY?'support':'clearance';
     assert.equal(gallery.inspectCell(t.x+dx,y,t.z+dz,role),null);
     assert.equal(selected.inspectCell(t.x+dx,y,t.z+dz,role),null);
    }
 }
});
test('source-conserving district (2,0) uses exactly 8815+29970 source visits',()=>{
 const r=auditSourceProtectedGalleryEasementDistrict(seed,2,0,{
  source:stone(),sourceOwnedDeepSelection:proof(2,0)
 });
 assert.equal(r.ok,true);
 assert.equal(r.columns,1998);
 assert.equal(r.originalFourHubSourceChecks,8815);
 assert.equal(r.floorSourceChecks,29970);
 assert.equal(r.sourceChecks,38785);
 assert.equal(r.solidSupport,11988);
 assert.equal(r.excavation,17982);
 assert.equal(r.releaseApproved,false);
 assert.equal(r.worldChanged,false);
});
test('source-conserving district (2,1) stays below existing 150k original budget',()=>{
 const r=auditSourceProtectedGalleryEasementDistrict(seed,2,1,{
  source:stone(),sourceOwnedDeepSelection:proof(2,1)
 });
 assert.equal(r.ok,true);
 assert.equal(r.columns,4239);
 assert.equal(r.originalFourHubSourceChecks,12711);
 assert.equal(r.floorSourceChecks,63585);
 assert.equal(r.sourceChecks,76296);
 assert.equal(r.originalFullCityFloorStillRejected,true);
 assert.equal(r.actualPlayerWalkingUnverified,true);
});
test('an inadequate global budget fails BEFORE any original district terrain reads',()=>{
 let reads=0;
 const r=auditSourceProtectedGalleryEasementDistrict(seed,2,0,{
  source:{...stone(),naturalAt:()=>{reads++;return 1;}},
  sourceOwnedDeepSelection:proof(2,0),maxTotalSourceChecks:30000
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'DISTRICT_TOTAL_ORIGINAL_SOURCE_BUDGET');
 assert.equal(r.sourceChecks,8815);
 assert.equal(reads,0);
});
test('a too-small maxColumns threshold refuses the WHOLE connected district',()=>{
 const r=plan(2,0,{maxDistrictColumns:1000});
 assert.equal(r.ok,false);
 assert.equal(r.reason,'DISTRICT_SOURCE_PREFLIGHT_BUDGET');
 assert.equal(r.columns,1998);
 assert.equal(r.worldChanged,false);
});
test('historic hub and landing endpoints are mandatory for any city access route',()=>{
 const p=proof(2,0),valid=p.joined.sourceAuditedCityAccessRouteGeometry;
 const forged={...valid,segments:valid.segments.map((segment,i)=>
  i===0?{...segment,a:{...segment.a,x:segment.a.x+1}}:segment)};
 const r=planGalleryEasementCityDistrict(seed,2,0,{
  selectedDeepProposals:p.deepProposals,
  sourceAuditedCityAccessRoute:forged
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'CITY_DISTRICT_ACCESS_ANCHOR_MISMATCH');
});
test('missing authentic four-hub source selection never approves district source',()=>{
 const r=auditSourceProtectedGalleryEasementDistrict(seed,2,0,{
  source:stone()
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'MISSING_SOURCE_OWNED_FOUR_HUB_CITY_APPROACH');
 assert.equal(r.worldChanged,false);
});
test('old ore, player edits, landmarks and authored AIR supports refuse district use',()=>{
 // Adversarial source inputs intentionally differ from the synthetic stone
 // selection fixture to exercise district checks; NOT original-M7 admission.
 const sources=[
  [{...stone(),naturalAt:()=>6},'UNSAFE_MATERIAL'],
  [{...stone(),editedAt:()=>true},'PLAYER_EDIT'],
  [{...stone(),protectedAt:()=>true},'PROTECTED_LANDMARK'],
  [{...stone(),naturalAt:()=>0,authoredAt:()=>0},'AUTHORED_AIR_SUPPORT']
 ];
 for(const [source,expected] of sources){
  const r=auditSourceProtectedGalleryEasementDistrict(seed,2,0,{
   source,sourceOwnedDeepSelection:proof(2,0)
  });
  assert.equal(r.ok,false);
  assert.equal(r.reason,'DISTRICT_ORIGINAL_M7_SOURCE_REFUSAL');
  assert.equal(r.sourceRefusal,expected);
  assert.equal(r.worldChanged,false);
 }
});
test('nonboolean edit/landmark flags and invalid material IDs never certify district',()=>{
 for(const [role,expected] of [
  ['editedAt',/Nonboolean original M7 district edit source/],
  ['protectedAt',/Nonboolean original M7 district landmark source/]]){
  for(const v of [0,1,null,undefined,'false'])
   assert.throws(()=>auditSourceProtectedGalleryEasementDistrict(
    seed,2,0,{source:{...stone(),[role]:()=>v},
     sourceOwnedDeepSelection:proof(2,0)}),expected);
 }
 for(const v of [null,-1,Infinity,NaN,1.5,'6'])
  assert.throws(()=>auditSourceProtectedGalleryEasementDistrict(
   seed,2,0,{source:{...stone(),naturalAt:()=>v},
    sourceOwnedDeepSelection:proof(2,0)}),
   /Invalid original M7 district material/);
});
