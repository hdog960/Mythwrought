import test from 'node:test';
import assert from 'node:assert/strict';
import {createMountainV8SurveyCache} from '../src/manual-biomes/mountain-v8-survey-cache.mjs';
const proposal=(x,z,seed)=>({x,z,seed,safeToIntegrate:false,generatorIdentityRequired:'v8-new-opt-in'});
test('cache preserves identical original-site identity and saves repeated reads',()=>{
 let reads=0; const cache=createMountainV8SurveyCache({seed:179,read:(x,z,s)=>{reads++;return proposal(x,z,s);}});
 const p=cache.survey(-512,16);assert.equal(cache.survey(-512,16),p);
 assert.equal(reads,1);assert.deepEqual(cache.stats(),{uniqueSites:1,cacheHits:1,cachedRejections:0,limit:576});
});
test('foreign biome rejection is cached and not re-read',()=>{
 let reads=0;const cache=createMountainV8SurveyCache({seed:179,read:()=>{reads++;return null;}});
 assert.equal(cache.survey(-1,-1),null);assert.equal(cache.survey(-1,-1),null);
 assert.equal(reads,1);assert.equal(cache.stats().cachedRejections,1);
});
test('hard maximum stops source reads, including new negative coordinates',()=>{
 let count=0;const cache=createMountainV8SurveyCache({seed:2026,maxSites:2,read:(x,z,s)=>{count++;return proposal(x,z,s);}});
 assert.ok(cache.survey(-1,-1));assert.ok(cache.survey(0,-1));assert.equal(cache.survey(1,-1),null);
 assert.ok(cache.survey(-1,-1));assert.equal(count,2);assert.equal(cache.stats().uniqueSites,2);
});
test('rejects forged coordinates, seed, identity or mutable generator results',()=>{
 for(const change of [{x:123},{seed:2026},{safeToIntegrate:true},{generatorIdentityRequired:'v7'}]){
  const cache=createMountainV8SurveyCache({seed:179,read:(x,z,s)=>({...proposal(x,z,s),...change})});
  assert.equal(cache.survey(-16,0),null);
 }
});
test('invalid seed, limit and coordinate inputs fail closed',()=>{
 assert.equal(createMountainV8SurveyCache({seed:1.5,read:()=>null}),null);
 assert.equal(createMountainV8SurveyCache({seed:179,maxSites:577,read:()=>null}),null);
 assert.equal(createMountainV8SurveyCache({seed:179,read:()=>null,maxSites:0}),null);
 const cache=createMountainV8SurveyCache({seed:179,read:()=>null});
 assert.equal(cache.survey(Infinity,0),null);assert.equal(cache.stats().uniqueSites,0);
});
