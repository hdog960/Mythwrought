// Executes the ORIGINAL source module function body with one intentionally
// synthetic collision-free index to reach source-reader cases otherwise
// blocked by the real seed179 city/gallery geometry. NOT a real M7 test.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {isCandidateGeologyMaterial}
 from '../src/living-underworld/protected-entrance-envelope.mjs';

const raw=readFileSync(new URL(
 '../src/living-underworld/original-city-floor-provenance.mjs',import.meta.url
),'utf8');
const body=raw
 .replace(/(?:^|\n)\s*import\s+[\s\S]*?\s+from\s*['"][^'"]+['"]\s*;?/g,'\n')
 .replace(/export\s+(?=(?:const|function|class|async)\b)/g,'');
const mockPlan=()=>({cityCandidate:{x:512,y:-110,z:512,rx:16,rz:16}});
const mockGallery=()=>({ok:true,inspectCell:()=>null});
const originalBody=new Function(
 'planUnderworldRegion','isCandidateGeologyMaterial',
 'compileMainGalleryPedestrianClearance',
 body+'\nreturn auditOriginalCityFloorProvenance;'
)(mockPlan,isCandidateGeologyMaterial,mockGallery);
const stone=()=>({
 naturalAt:()=>1,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false
});
const run=source=>originalBody(179,2,0,{source});

test('a controlled collision-free source-only pad still checks all support/headroom',()=>{
 const r=run(stone());
 assert.equal(r.ok,true);
 assert.equal(r.sourceChecks,r.columns*15);
 assert.equal(r.geometryCellsInspected,r.sourceChecks);
 assert.ok(r.solidSupport>0);
 assert.ok(r.excavation>0);
 assert.equal(r.floorActuallyConstructed,false);
 assert.equal(r.worldChanged,false);
});
test('original full-floor edit reader refuses numeric zero and nonbooleans',()=>{
 for(const v of [0,1,null,undefined,'false'])
  assert.throws(()=>run({...stone(),editedAt:()=>v}),
   /Nonboolean original M7 city floor edit source/);
});
test('original full-floor landmark reader refuses numeric zero and nonbooleans',()=>{
 for(const v of [0,1,null,undefined,'false'])
  assert.throws(()=>run({...stone(),protectedAt:()=>v}),
   /Nonboolean original M7 city floor landmark source/);
});
test('invalid old M7 full-pad source material can never be treated as geology',()=>{
 for(const v of [null,-1,Infinity,NaN,0.5,'3'])
  assert.throws(()=>run({...stone(),naturalAt:()=>v}),
   /Invalid original M7 city floor material source/);
});
test('old authored AIR support and existing ore retain their hard protection',()=>{
 const authored=run({...stone(),authoredAt:()=>0,naturalAt:()=>0});
 assert.equal(authored.ok,false);
 assert.equal(authored.firstRefusal,'AUTHORED_AIR_SUPPORT');
 const ore=run({...stone(),naturalAt:()=>6});
 assert.equal(ore.ok,false);
 assert.equal(ore.firstRefusal,'UNSAFE_MATERIAL');
});
test('a strict source budget can never be overridden by a collision-free mock index',()=>{
 let callbacks=0;
 const r=originalBody(179,2,0,{
  source:{...stone(),naturalAt:()=>{callbacks++;return 1;}},
  maxSourceChecks:100
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'CITY_ORIGINAL_SOURCE_PREFLIGHT_BUDGET');
 assert.equal(r.sourceChecks,0);
 assert.equal(callbacks,0);
 assert.equal(r.worldChanged,false);
});
