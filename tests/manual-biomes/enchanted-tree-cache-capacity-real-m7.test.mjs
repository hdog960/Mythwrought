// Controlled source-backed comparison of bounded candidate cache sizes.
// Same authentic source worlds/sites, same immutable M7 terrain/caves, five
// capacities; compare exact voxel arrays, actual misses and native CPU samples.
// This is a development experiment, NOT physical iPhone speed/heap evidence.
import test from 'node:test';
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {environmentalTreesForChunk}
  from '../../src/manual-biomes/environment-v7.mjs';
import {ENCHANTED_CANDIDATE_SOURCE_CACHE_MAX_ENTRIES as MAX}
  from '../../src/manual-biomes/enchanted-tree-source-cache.mjs';
import {BLOCK} from '../../src/voxel.mjs';

const footprints=[
  [-88,0,-31],[179,0,-33],[-88,0,-32],[179,0,-34],
  [179,-2,-33],[7919,-1,-32],[7919,0,-31],[-88,-2,-32],
  [179,-3,-34]
];
const capacities=[128,256,512,1024,2048];
test('identical original M7 forest footprints support five bounded cache capacities with byte-exact geometry',()=>{
 assert.equal(MAX,2048);
 const rows=[],totals=new Map(capacities.map(n=>[n,{
   sourceReads:0,hits:0,misses:0,evictions:0,
   peakEntries:0,nativeMs:0,sourceVoxels:0
 }]));
 for(const [seed,cx,cz] of footprints){
  const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
    {experimentalEnchantedTrees:true});
  const column=(x,z)=>world._columnPlan(x,z);
  let expected=null,referenceCount=0;
  for(const capacity of [...capacities].reverse()){
   let calls=0,summary=null;
   const read=(x,y,z)=>{
     calls++;
     return column(x,z).get(y)??world._environmentBaseline(x,y,z);
   };
   const started=performance.now();
   const result=environmentalTreesForChunk(cx,cz,seed,column,read,{
     experimentalEnchantedTrees:true,
     candidateSourceCacheCapacity:capacity,
     onCandidateCacheSummary:diagnostics=>{summary=diagnostics;}
   });
   const elapsedMs=+(performance.now()-started).toFixed(3);
   assert.ok(summary);
   assert.ok(summary.peakEntries<=capacity,'actual cache never exceeds requested cap');
   assert.ok(summary.entries<=capacity);
   assert.ok(summary.misses<=calls,
     'cache misses cannot exceed actual real-source callback invocations');
   if(result.size){
     assert.equal(summary.limit,capacity);
     assert.ok(result.size>0);
   }
   if(expected===null){
     expected=[...result];referenceCount=result.size;
     for(const [key,id] of result){
       const [x,y,z]=key.split(',').map(Number);
       assert.equal(world.naturalAndLandmarkBlock(x,y,z),id,
         'original game cave/landmark-aware voxel reader disagrees with candidate');
     }
   }else assert.deepEqual([...result],expected,
     'eviction/capacity must never alter actual original M7 tree voxels');
   const aggregate=totals.get(capacity);
   aggregate.sourceReads+=calls;
   aggregate.hits+=summary.hits;
   aggregate.misses+=summary.misses;
   aggregate.evictions+=summary.evictions;
   aggregate.nativeMs+=elapsedMs;
   aggregate.sourceVoxels+=result.size;
   aggregate.peakEntries=Math.max(aggregate.peakEntries,summary.peakEntries);
   rows.push({seed,cx,cz,capacity,sourceReads:calls,elapsedMs,
     voxels:result.size,hits:summary.hits,misses:summary.misses,
     peakEntries:summary.peakEntries,evictions:summary.evictions});
  }
  assert.ok(referenceCount>=0);
  assert.throws(()=>world.save(),/cannot be saved as historical M7/);
 }
 const comparisons=capacities.map(capacity=>({capacity,...totals.get(capacity),
   nativeMs:+totals.get(capacity).nativeMs.toFixed(3)}));
 const baseline=totals.get(MAX);
 for(const t of comparisons){
  assert.equal(t.sourceVoxels,baseline.sourceVoxels);
  assert.equal(t.peakEntries<=t.capacity,true);
 }
 assert.ok(baseline.sourceVoxels>100,'compare actual densely authored M7 forest geometry');
 console.log('# ENCHANTED REAL M7 CACHE CAPACITY STUDY '+JSON.stringify({
   exactSourceSeeds:[179,7919,-88],chunkCases:footprints.length,
   capacities,baselineCapacity:MAX,comparisons,
   worstReadExamples:rows.sort((a,b)=>b.sourceReads-a.sourceReads).slice(0,7),
   nativeMsIncludesWarmSourceVariation:true,
   readCountsAreAuthoritativeSourceCallbacks:true,
   notIphoneFps:true,notCacheByteHeapMeasurement:true
 }));
});
