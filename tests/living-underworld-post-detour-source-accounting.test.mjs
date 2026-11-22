// Native-test-runner source-contract regression. The real original module
// body is evaluated with narrow dependency sentinels ONLY to exercise late
// fail-closed branches that are unreachable under ordinary valid geometry.
// These are NOT original M7 geology or live game results.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source=readFileSync(new URL(
 '../src/living-underworld/source-protected-city-terrace-access.mjs',
 import.meta.url
),'utf8');
const body=source
 .replace(/(?:^|\n)\s*import[\s\S]*?\s+from\s*['"][^'"]+['"]\s*;?/g,'\n')
 .replace(/export\s+(?=(?:const|function|class|async)\b)/g,'');
const hub=Object.freeze({x:1,y:-120,z:1});
const landing=Object.freeze({x:20,y:-127,z:20});
const mockSource={naturalAt:()=>1,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false};
function gateAt(stage,sourceChecks=543){
 const modules={
  planUnderworldRegion:()=>({
   cityCandidate:{x:0,y:-120,z:0},layers:[{hub}]
  }),
  auditSelectedInterlevelTopology:()=>({ok:true}),
  searchSourceProtectedCityDetours:()=>({
   ok:true,sourceChecks,
   proposal:{ok:true,segments:[{a:hub,b:landing}]}
  }),
  auditCityAccessRamp:()=>({
   sitePresent:true,ok:true,hub,landing,
   candidateStairDeckValid:true,
   routeAirFaceConnected:true,
   landing3WideClearance:true,landingSolidSupport:true
  }),
  auditProtectedSubsurfaceStairs:()=>({ok:true,sourceChecks:0}),
  compileSelectedStairPedestrianClearance:()=>stage==='combined'?
   {ok:false,reason:'MOCK_COMBINED_REFUSAL'}:{ok:true},
  compileMainGalleryPedestrianClearance:()=>stage==='index'?
   {ok:false,reason:'MOCK_GALLERY_INDEX_REFUSAL'}:
   {ok:true,inspect:()=>stage==='gallery'?
    {ok:false,blockedCells:7}:{ok:true}},
  proposeProtectedCityLandingTerrace:()=>({
   ok:true,radius:8,sourceChecks:0
  })
 };
 return new Function(...Object.keys(modules),body+
  '\nreturn auditSourceProtectedCityTerraceAccess;')(...Object.values(modules));
}
test('post-detour combined-route refusal carries source queries already paid',()=>{
 const r=gateAt('combined')(179,2,0,{
  source:mockSource,useSourceAwareDetour:true
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'CITY_LINK_AND_SELECTED_STAIRS_UNSAFE');
 assert.equal(r.sourceChecks,543);
 assert.equal(r.worldChanged,false);
});
test('post-detour gallery index refusal preserves already inspected source cells',()=>{
 const r=gateAt('index')(179,2,0,{
  source:mockSource,useSourceAwareDetour:true
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'CITY_GALLERY_INDEX_UNSAFE');
 assert.equal(r.sourceChecks,543);
});
test('post-detour gallery collision refuses without forgiving expensive reads',()=>{
 const r=gateAt('gallery')(179,2,0,{
  source:mockSource,useSourceAwareDetour:true
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'CITY_LINK_OR_SELECTED_STAIRS_BLOCK_GALLERY');
 assert.equal(r.blockedCells,7);
 assert.equal(r.sourceChecks,543);
});
test('historic non-detour mode retains zero unspent detour budget',()=>{
 const r=gateAt('combined')(179,2,0,{
  source:mockSource,useSourceAwareDetour:false
 });
 assert.equal(r.ok,false);
 assert.equal(r.sourceChecks,0);
});
