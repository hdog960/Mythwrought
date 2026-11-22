import test from 'node:test';
import assert from 'node:assert/strict';
import {planUnderworldRegion} from '../src/living-underworld/worldwide-network.mjs';
import {auditOriginalCityFloorProvenance}
 from '../src/living-underworld/original-city-floor-provenance.mjs';
const base={naturalAt:()=>1,authoredAt:()=>undefined,editedAt:()=>false,protectedAt:()=>false};
function citySite(){
 for(let x=-4;x<=4;x++)for(let z=-4;z<=4;z++)
  if(planUnderworldRegion(179,x,z).cityCandidate)return [x,z];
 throw Error('No rare city in search grid');
}
const [rx,rz]=citySite();
test('does not approve source inspection beyond work budget',()=>{
 const r=auditOriginalCityFloorProvenance(179,rx,rz,{source:base,maxSourceChecks:150000});
 assert.equal(r.ok,false);assert.equal(r.reason,'CITY_ORIGINAL_SOURCE_PREFLIGHT_BUDGET');
 assert.equal(r.sourceChecks,0);
});
test('first original ore cannot be cut or replaced',()=>{
 const r=auditOriginalCityFloorProvenance(179,rx,rz,{
  source:{...base,naturalAt:()=>999},maxSourceChecks:400000,maxColumns:40000});
 assert.equal(r.ok,false);assert.equal(r.firstRefusal,'UNSAFE_MATERIAL');
});
test('first original authored cave air cannot be filled',()=>{
 const r=auditOriginalCityFloorProvenance(179,rx,rz,{
  source:{...base,naturalAt:()=>0,authoredAt:()=>0},
  maxSourceChecks:400000,maxColumns:40000});
 assert.equal(r.ok,false);assert.equal(r.firstRefusal,'AUTHORED_AIR_SUPPORT');
});
test('first original natural cave air cannot be filled',()=>{
 const r=auditOriginalCityFloorProvenance(179,rx,rz,{
  source:{...base,naturalAt:()=>0},maxSourceChecks:400000,maxColumns:40000});
 assert.equal(r.ok,false);assert.equal(r.firstRefusal,'NATURAL_AIR_SUPPORT');
});
test('original edits and landmark refuse before natural query',()=>{
 for(const [role,expected] of [['editedAt','PLAYER_EDIT'],
  ['protectedAt','PROTECTED_LANDMARK']]){
  const r=auditOriginalCityFloorProvenance(179,rx,rz,{
   source:{...base,[role]:()=>true},maxSourceChecks:400000,maxColumns:40000});
  assert.equal(r.ok,false);assert.equal(r.firstRefusal,expected);
 }
});
test('no city site is not a false positive',()=>{
 let missing;
 for(let x=-4;x<=4;x++)for(let z=-4;z<=4;z++)
  if(!planUnderworldRegion(179,x,z).cityCandidate){missing=[x,z];break;}
 if(!missing)throw Error('unexpected');
 const r=auditOriginalCityFloorProvenance(179,...missing,{source:base});
 assert.equal(r.sitePresent,false);
});
