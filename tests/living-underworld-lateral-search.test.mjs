import test from 'node:test';
import assert from 'node:assert/strict';
import {planUnderworldSurfaceEntrance}
 from '../src/living-underworld/surface-entrance-proposal.mjs';
import {searchExtendedProtectedEntrances,searchWideProtectedEntrances}
 from '../src/living-underworld/entrance-candidate-search.mjs';
const args={surfaceHeightAt:()=>8,biomeAt:()=> 'snow',
 requiredBiome:'snow',naturalAt:()=>3};
test('lateral zero preserves all original 16-way geometry for distinct seeds and regions',()=>{
 for(const seed of [179,-17,2026])for(const [rx,rz] of [[0,0],[-35,42]])
 for(let radialVariant=0;radialVariant<4;radialVariant++)
 for(let searchStart=0;searchStart<4;searchStart++){
  const opts={...args,radialVariant,searchStart};
  assert.deepEqual(planUnderworldSurfaceEntrance(seed,rx,rz,opts),
   planUnderworldSurfaceEntrance(seed,rx,rz,{...opts,lateralVariant:0}));
 }
});
test('wide search never reports success under protected ore, authored stone, edits or landmarks',()=>{
 for(const protectedInputs of [
  {naturalAt:()=>6},{authoredAt:()=>3},
  {editedAt:()=>true},{existingLandmarkAt:()=>true}
 ]){
  const q=searchWideProtectedEntrances(179,0,0,{...args,...protectedInputs});
  assert.equal(q.ok,false);
  assert.equal(q.totalAttempts,64);
  assert.equal(q.lateralFamiliesExamined,4);
  assert.ok(q.groups.flatMap(g=>g.uniqueExamined)
   .every(a=>a.stage!=='STRICT_SOURCE_CANDIDATE'));
 }
});
test('when original 16 approaches are protected, an offset mouth can pass same strict envelope',()=>{
 const originals=new Set();
 for(let radialVariant=0;radialVariant<4;radialVariant++)
 for(let searchStart=0;searchStart<4;searchStart++){
  const q=planUnderworldSurfaceEntrance(179,0,0,{...args,radialVariant,searchStart});
  if(q.ok)originals.add(q.mouth.x+','+q.mouth.y+','+q.mouth.z);
 }
 const blocked={...args,existingLandmarkAt:(x,y,z)=>
  originals.has(x+','+y+','+z)};
 const old=searchExtendedProtectedEntrances(179,0,0,blocked);
 const wide=searchWideProtectedEntrances(179,0,0,blocked);
 assert.equal(old.ok,false);
 assert.equal(wide.ok,true,JSON.stringify(wide.groups));
 assert.ok(wide.accepted.proposal.lateralVariant>=1);
 assert.ok(wide.accepted.envelope.ok&&wide.accepted.geometry.pass&&wide.accepted.stairs.ok);
 assert.equal(wide.originalM7Edited,false);
});
test('strict input validation refuses invalid options',()=>{
 assert.throws(()=>planUnderworldSurfaceEntrance(179,0,0,{...args,lateralVariant:4}),/Invalid/);
 assert.throws(()=>searchWideProtectedEntrances(179,0,0,{...args,maxLaterals:5}),/Invalid/);
});
