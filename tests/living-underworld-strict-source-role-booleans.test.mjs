import test from 'node:test';
import assert from 'node:assert/strict';
import {auditProtectedSubsurfaceStairs}
 from '../src/living-underworld/protected-subsurface-stairs.mjs';
import {auditSourceProtectedMainGalleries}
 from '../src/living-underworld/main-gallery-source-survey.mjs';

const geometry={ok:true,segments:[{a:{x:2,y:-30,z:2},b:{x:6,y:-30,z:2}}]};
const source={naturalAt:()=>1,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false};
test('ordinary original-M7 boolean roles permit geometry-only source acceptance',()=>{
 const a=auditProtectedSubsurfaceStairs(geometry,{
  ...source,maxCells:20000,stopOnFirstUnsafe:true
 });
 assert.equal(a.ok,true);
 assert.ok(a.sourceChecks>0);
 assert.equal(a.originalM7Edited,false);
});
test('nonboolean numeric original edit source is never treated as clean',()=>{
 for(const value of [0,1,null,undefined,'false']){
  assert.throws(()=>auditProtectedSubsurfaceStairs(geometry,{
   ...source,editedAt:()=>value,stopOnFirstUnsafe:true
  }),/Nonboolean original M7 stair edit source/);
 }
});
test('nonboolean numeric original landmark source is never treated as clear',()=>{
 for(const value of [0,1,null,undefined,'false']){
  assert.throws(()=>auditProtectedSubsurfaceStairs(geometry,{
   ...source,protectedAt:()=>value,stopOnFirstUnsafe:true
  }),/Nonboolean original M7 stair landmark source/);
 }
});
test('genuine edited and protected booleans retain strict source refusals',()=>{
 const edit=auditProtectedSubsurfaceStairs(geometry,{
  ...source,editedAt:()=>true,stopOnFirstUnsafe:true
 });
 assert.equal(edit.ok,false);
 assert.equal(edit.firstRefusal,'PLAYER_EDIT');
 const protectedResult=auditProtectedSubsurfaceStairs(geometry,{
  ...source,protectedAt:()=>true,stopOnFirstUnsafe:true
 });
 assert.equal(protectedResult.ok,false);
 assert.equal(protectedResult.firstRefusal,'PROTECTED_LANDMARK');
});
test('five-biome gallery source wrapper cannot silently accept integer role flags',()=>{
 for(const [role,reason] of [['editedAt','edit'],['protectedAt','landmark']]){
  assert.throws(()=>auditSourceProtectedMainGalleries(179,2,0,{
   source:{...source,[role]:()=>0},
   diagnoseAllGalleries:true,maxTotalSourceChecks:120000
  }),new RegExp('Nonboolean original M7 stair '+reason+' source'));
 }
});
