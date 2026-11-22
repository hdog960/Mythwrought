import test from 'node:test';
import assert from 'node:assert/strict';
import {auditOriginalCityFloorProvenance}
 from '../src/living-underworld/original-city-floor-provenance.mjs';
import {proposeProtectedCityLandingTerrace}
 from '../src/living-underworld/city-landing-terrace-proposal.mjs';

const stone=()=>({naturalAt:()=>1,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false});

test('seed179 original planned city (2,0) refuses real gallery conflict BEFORE terrain budget',()=>{
 let callbacks=0;
 const source={naturalAt:()=>{callbacks++;return 1;},
  authoredAt:()=>{callbacks++;return undefined;},
  editedAt:()=>{callbacks++;return false;},
  protectedAt:()=>{callbacks++;return false;}};
 const r=auditOriginalCityFloorProvenance(179,2,0,{source});
 assert.equal(r.ok,false);
 assert.equal(r.reason,'CITY_PAD_CONFLICTS_WITH_MAIN_GALLERY');
 assert.deepEqual(r.firstRejectedCell,{
  x:654,y:-124,z:79,type:'clearance'
 });
 assert.equal(r.columns,11387);
 assert.equal(r.requiredSourceChecks,170805);
 assert.equal(r.geometryCellsInspected,6630);
 assert.equal(r.sourceChecks,0);
 assert.equal(callbacks,0);
 assert.equal(r.worldChanged,false);
});
test('seed179 second rare city (2,1) cannot hide its true conflict behind 150k cap',()=>{
 let reads=0;
 const r=auditOriginalCityFloorProvenance(179,2,1,{
  source:{...stone(),naturalAt:()=>{reads++;return 1;}}
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'CITY_PAD_CONFLICTS_WITH_MAIN_GALLERY');
 assert.deepEqual(r.firstRejectedCell,{
  x:635,y:-179,z:324,type:'clearance'
 });
 assert.equal(r.columns,16133);
 assert.equal(r.requiredSourceChecks,241995);
 assert.equal(r.sourceChecks,0);
 assert.equal(reads,0);
});
test('even a tiny source allowance still detects a definitive earlier gallery clash',()=>{
 const r=auditOriginalCityFloorProvenance(179,2,0,{
  source:stone(),maxSourceChecks:1
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'CITY_PAD_CONFLICTS_WITH_MAIN_GALLERY');
 assert.equal(r.sourceChecks,0);
});
test('column budget remains strict before geometry scans or original reads',()=>{
 let sourceCalls=0;
 const r=auditOriginalCityFloorProvenance(179,2,0,{
  source:{...stone(),naturalAt:()=>{sourceCalls++;return 1;}},
  maxColumns:100
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'CITY_ORIGINAL_SOURCE_PREFLIGHT_BUDGET');
 assert.equal(r.sourceChecks,0);
 assert.equal(sourceCalls,0);
 assert.equal(r.worldChanged,false);
});
test('detached source-safe terrace still accepts valid geology without building it',()=>{
 const r=proposeProtectedCityLandingTerrace(179,2,0,{source:stone()});
 assert.equal(r.ok,true);
 assert.equal(r.radius,8);
 assert.equal(r.sourceChecks,2955);
 assert.equal(r.terrainActuallyModified,false);
 assert.equal(r.worldChanged,false);
});
test('terrace original edit and landmark sources must return strict boolean flags',()=>{
 for(const [key,reason] of [
  ['editedAt',/Nonboolean original M7 terrace edit source/],
  ['protectedAt',/Nonboolean original M7 terrace landmark source/]
 ]){
  for(const bad of [0,1,null,undefined,'false']){
   assert.throws(()=>proposeProtectedCityLandingTerrace(179,2,0,{
    source:{...stone(),[key]:()=>bad}
   }),reason);
  }
 }
});
test('terrace preserves original authored AIR, ore, and player-edit refusals',()=>{
 const cases=[
  [{...stone(),naturalAt:()=>0,authoredAt:()=>0},'AUTHORED_AIR_SUPPORT'],
  [{...stone(),naturalAt:()=>6},'UNSAFE_MATERIAL'],
  [{...stone(),editedAt:()=>true},'PLAYER_EDIT'],
  [{...stone(),protectedAt:()=>true},'PROTECTED_LANDMARK']
 ];
 for(const [source,expected] of cases){
  const r=proposeProtectedCityLandingTerrace(179,2,0,{source});
  assert.equal(r.ok,false);
  assert.equal(r.reason,expected);
  assert.equal(r.worldChanged,false);
 }
});
test('terrace invalid material IDs cannot be treated as safe old geology',()=>{
 for(const material of [null,-1,1.2,'6',Infinity,NaN]){
  assert.throws(()=>proposeProtectedCityLandingTerrace(179,2,0,{
   source:{...stone(),naturalAt:()=>material}
  }),/Invalid original M7 terrace material source/);
 }
});
