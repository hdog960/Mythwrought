import test from 'node:test';
import assert from 'node:assert/strict';
import {planUnderworldRegion}
 from '../src/living-underworld/worldwide-network.mjs';
import {compileSelectedStairPedestrianClearance}
 from '../src/living-underworld/combined-stair-footprints.mjs';
import {proposeProtectedCityLandingTerrace}
 from '../src/living-underworld/city-landing-terrace-proposal.mjs';
const city=planUnderworldRegion(179,2,0).cityCandidate;
const floorY=city.y-8;
const center={x:city.x+20,y:floorY+1,z:city.z+20};
const flat={ok:true,segments:[{a:{x:center.x-5,y:center.y,z:center.z},
 b:{x:center.x+5,y:center.y,z:center.z}}]};
const raised={ok:true,segments:[{a:{x:center.x-5,y:center.y+2,z:center.z},
 b:{x:center.x+5,y:center.y+2,z:center.z}}]};
const source={naturalAt:()=>1,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false};
test('source-proposed flat stair shares supported landing without crossing air',()=>{
 const r=proposeProtectedCityLandingTerrace(179,2,0,{source,
  selectedStairProposals:[flat]});
 assert.equal(r.ok,true);assert.equal(r.radius,8);
 assert.equal(r.selectedStairRouteMutualClearanceChecked,true);
 assert.equal(r.selectedStairCount,1);
 assert.equal(r.selectedStairSourceOwnershipNotVerified,true);
 assert.equal(r.worldChanged,false);
});
test('elevated stair support in terrace headroom is rejected at all sizes',()=>{
 const r=proposeProtectedCityLandingTerrace(179,2,0,{source,
  selectedStairProposals:[raised]});
 assert.equal(r.ok,false);
 assert.equal(r.reason,'TERRACE_BLOCKS_SELECTED_STAIRWAY');
 assert.equal(r.attempts.at(-1).reason,'TERRACE_BLOCKS_SELECTED_STAIRWAY');
});
test('mutually obstructing chosen stairways fail before any source reads',()=>{
 let reads=0;
 const r=proposeProtectedCityLandingTerrace(179,2,0,{
  source:{...source,naturalAt:()=>{reads++;return 1;}},
  selectedStairProposals:[flat,raised]});
 assert.equal(r.ok,false);
 assert.equal(r.reason,'SELECTED_STAIRS_MUTUALLY_UNSAFE');
 assert.equal(r.sourceChecks,0);assert.equal(reads,0);
});
test('chosen stair index compares both floor-in-air and air-in-floor',()=>{
 const idx=compileSelectedStairPedestrianClearance([flat]);
 assert.equal(idx.ok,true);
 assert.equal(idx.inspectCell(center.x,center.y-1,center.z,'support'),null);
 assert.equal(idx.inspectCell(center.x,center.y+1,center.z,'support').routeIndex,0);
 assert.equal(idx.inspectCell(center.x,center.y-1,center.z,'clearance').routeIndex,0);
 assert.throws(()=>idx.inspectCell(center.x,center.y,center.z,'nonsense'));
});
test('invalid stair input and cell budgets fail closed',()=>{
 assert.throws(()=>proposeProtectedCityLandingTerrace(179,2,0,{
  source,selectedStairProposals:[]}));
 const idx=compileSelectedStairPedestrianClearance([flat],{maxCells:100});
 assert.equal(idx.ok,false);
 assert.equal(idx.reason,'COMBINED_FOOTPRINT_BUDGET');
});
