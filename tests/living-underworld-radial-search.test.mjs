import test from 'node:test';
import assert from 'node:assert/strict';
import {planUnderworldSurfaceEntrance}
 from '../src/living-underworld/surface-entrance-proposal.mjs';
import {searchProtectedEntranceCandidates,searchExtendedProtectedEntrances}
 from '../src/living-underworld/entrance-candidate-search.mjs';
const args={surfaceHeightAt:()=>8,biomeAt:()=> 'snow',requiredBiome:'snow',
 naturalAt:()=>3};
test('radial-family zero retains all previously verified original compass geometries',()=>{
 for(const seed of [179,-17,2026])for(const [rx,rz] of [[0,0],[-40,66]]){
  for(let turn=0;turn<4;turn++){
   const a=planUnderworldSurfaceEntrance(seed,rx,rz,{...args,searchStart:turn});
   const b=planUnderworldSurfaceEntrance(seed,rx,rz,
    {...args,searchStart:turn,radialVariant:0});
   assert.deepEqual(a,b);
  }
 }
});
test('expanded search keeps the same protected approvals and no world writes',()=>{
 const old=searchProtectedEntranceCandidates(179,0,0,args);
 const next=searchExtendedProtectedEntrances(179,0,0,args);
 assert.equal(old.ok,true);
 assert.equal(next.ok,true);
 assert.deepEqual(old.accepted,next.accepted);
 assert.equal(next.attempts,old.tested);
 assert.equal(next.noOriginalCellsChanged,true);
 assert.equal(next.worldCarved,false);
});
test('all radial families refuse original edits, ore, authored solids and landmarks',()=>{
 for(const flags of [
  {naturalAt:()=>6},
  {editedAt:()=>true},
  {authoredAt:()=>3},
  {existingLandmarkAt:()=>true}
 ]){
  const r=searchExtendedProtectedEntrances(179,0,0,{...args,...flags});
  assert.equal(r.ok,false);
  assert.equal(r.radialVariantsExamined,4);
  assert.ok(r.attempts>=4&&r.attempts<=16);
  assert.equal(r.accepted,null);
  assert.ok(r.audited.every(g=>g.uniqueExamined
   .every(q=>q.stage!=='STRICT_SOURCE_CANDIDATE')));
 }
});
test('radial alternatives can avoid every original compass mouth without ignoring protection',()=>{
 const oldMouths=new Set();
 for(let turn=0;turn<4;turn++){
  const p=planUnderworldSurfaceEntrance(179,0,0,{...args,searchStart:turn});
  assert.equal(p.ok,true);
  oldMouths.add(p.mouth.x+','+p.mouth.y+','+p.mouth.z);
 }
 const blocked={...args,existingLandmarkAt:(x,y,z)=>oldMouths.has(x+','+y+','+z)};
 const strict=searchProtectedEntranceCandidates(179,0,0,blocked);
 const extended=searchExtendedProtectedEntrances(179,0,0,blocked);
 assert.equal(strict.ok,false);
 assert.equal(extended.ok,true,JSON.stringify(extended.audited));
 assert.ok(extended.radialVariantsExamined>=2);
 assert.ok(extended.accepted.envelope.ok&&extended.accepted.stairs.ok);
});
test('invalid radial variants and bounds fail closed without changing original candidates',()=>{
 assert.throws(()=>planUnderworldSurfaceEntrance(179,0,0,
  {...args,radialVariant:4}),/Invalid/);
 assert.throws(()=>searchProtectedEntranceCandidates(179,0,0,
  {...args,maxCandidates:5}),/Invalid/);
 assert.throws(()=>searchExtendedProtectedEntrances(179,0,0,
  {...args,maxVariants:5}),/Invalid/);
});
