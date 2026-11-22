// Original M7 cache-cost comparison. Both sides invoke the real
// FourRegionWorld._environmentTreeAt residency path and write ZERO save data.
// One candidate has the immutable site memo; the other has the exact same
// original M7 world source with ONLY the optional memo disabled. Interleave
// order to reduce warm-runner bias. Node CPU measurements are descriptive;
// no unstable timing-based performance acceptance or invented iPhone FPS.
import test from 'node:test';
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {EnchantedSiteBiomeCache,
  ENCHANTED_SITE_BIOME_CACHE_LIMIT as MAX}
  from '../../src/manual-biomes/enchanted-tree-site-biome-cache.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {BLOCK,chunkCoord} from '../../src/voxel.mjs';
import {WORLD_MAX_Y} from '../../src/depth.mjs';

function getPlan(world,cx,cz){
  world._environmentTreeAt(cx*16,WORLD_MAX_Y,cz*16);
  const plan=world._environmentTreeChunks.get(cx+','+cz);
  assert.ok(plan instanceof Map);
  return plan;
}
const rounded=x=>+x.toFixed(4);
function distribution(a){
 const b=[...a].sort((x,y)=>x-y);
 const pick=rate=>rounded(b[Math.max(0,Math.ceil(b.length*rate)-1)]);
 return {minMs:pick(0),p50Ms:pick(.5),p95Ms:pick(.95),
   maxMs:pick(1),sumMs:rounded(a.reduce((sum,n)=>sum+n,0))};
}
test('real original M7 cache vs no-cache: identical 128 connected chunk plans with controlled elapsed costs',()=>{
 const seeds=[179,7919],rows=[-34,-16],first=-16,last=15;
 const results=[],totals={chunks:0,voxels:0,hits:0,misses:0,
   evictions:0,actualNewClassifications:0,uncachedClassifications:0,
   peakSiteEntries:0,peakTreeChunkEntries:0,originalAirChecks:0,
   climates:new Set(),seamPairs:0};
 const cachedTimes=[],uncachedTimes=[];
 for(const seed of seeds){
  const profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const withMemo=new FourRegionWorld(seed,profile,{experimentalEnchantedTrees:true});
  const noMemo=new FourRegionWorld(seed,profile,{experimentalEnchantedTrees:true});
  const memo=withMemo._environmentCandidateSiteBiomes;
  assert.ok(memo instanceof EnchantedSiteBiomeCache);
  assert.equal(memo.limit,MAX);
  // Isolated test disables ONLY the new optional memo. All tree-site rolls,
  // original terrain/cave/landmark checks and runtime cache size stay real.
  delete noMemo._environmentCandidateSiteBiomes;
  assert.equal(noMemo._environmentCandidateSiteBiomes,undefined);
  let prev=null;
  for(const cz of rows){
   prev=null;
   for(let cx=first;cx<=last;cx++){
    const index=totals.chunks;
    let withTree,withoutTree,withMs,withoutMs;
    const runWith=()=>{
      const t=performance.now();
      withTree=getPlan(withMemo,cx,cz);
      withMs=performance.now()-t;
    };
    const runWithout=()=>{
      const t=performance.now();
      withoutTree=getPlan(noMemo,cx,cz);
      withoutMs=performance.now()-t;
    };
    // AB/BA to suppress single-direction runner warming bias.
    if(index%2){runWithout();runWith();}else{runWith();runWithout();}
    assert.deepEqual([...withTree],[...withoutTree],
      'memo must retain original M7 voxel coordinates, IDs and insertion ordering');
    assert.equal(withMemo._environmentTreeChunks.size<=64,true);
    assert.equal(noMemo._environmentTreeChunks.size<=64,true);
    assert.equal(memo.size<=MAX,true);
    assert.ok(withTree.size>=0);
    results.push({seed,cx,cz,sourceVoxels:withTree.size,
      cachedNodeMs:rounded(withMs),uncachedNodeMs:rounded(withoutMs)});
    cachedTimes.push(withMs);uncachedTimes.push(withoutMs);
    totals.chunks++;
    totals.voxels+=withTree.size;
    totals.peakSiteEntries=Math.max(totals.peakSiteEntries,memo.size);
    totals.peakTreeChunkEntries=Math.max(totals.peakTreeChunkEntries,
      withMemo._environmentTreeChunks.size);
    totals.climates.add(v6BiomeAt(cx*16+8,cz*16+8,seed)?.name??'plains');
    const seen=new Map();
    for(const [key,id] of withTree){
      const [x,y,z]=key.split(',').map(Number);
      assert.equal(chunkCoord(x),cx);
      assert.equal(chunkCoord(z),cz);
      assert.ok(y>0&&y<=WORLD_MAX_Y);
      // This is the original physical AIR/cave/landmark source used by
      // both planners. Do not read provenance from the metadata cache.
      assert.equal(withMemo._columnPlan(x,z).get(y)??
        withMemo._environmentBaseline(x,y,z),BLOCK.AIR);
      totals.originalAirChecks++;
      if(x===cx*16||x===cx*16+15)seen.set(key,id);
    }
    if(prev){
      for(const at of prev.keys()){
        const [x,y,z]=at.split(',').map(Number);
        if(x===(cx-1)*16+15&&seen.has((cx*16)+','+y+','+z))
          totals.seamPairs++;
      }
    }
    prev=seen;
   }
  }
  totals.hits+=memo.hits;
  totals.misses+=memo.misses;
  totals.evictions+=memo.evictions;
  totals.actualNewClassifications+=memo.misses;
  totals.uncachedClassifications+=memo.hits+memo.misses;
  assert.throws(()=>withMemo.save(),/cannot be saved as historical M7/);
  assert.throws(()=>noMemo.save(),/cannot be saved as historical M7/);
  const history=new FourRegionWorld(seed,profile);
  assert.equal(history._environmentCandidateSiteBiomes,undefined);
  assert.deepEqual(history.save(),{schema:1,seed,edits:[]});
 }
 assert.equal(totals.chunks,128);
 assert.ok(totals.voxels>5000,'both real worlds must actually generate Enchanted trees');
 assert.equal(totals.uncachedClassifications-
   totals.actualNewClassifications,totals.hits,
   'matched workload must count exactly the eliminated original V6 calls');
 assert.ok(totals.hits>100,'adjacent chunks must share real, seed-scoped biome classifications');
 assert.ok(totals.climates.size>=2);
 assert.ok(totals.seamPairs>30);
 assert.equal(totals.peakSiteEntries,MAX);
 assert.ok(totals.peakTreeChunkEntries<=64);
 assert.ok(totals.originalAirChecks>5000);
 const byAddedNodeCost=[...results].sort((a,b)=>
   (b.cachedNodeMs-b.uncachedNodeMs)-(a.cachedNodeMs-a.uncachedNodeMs));
 const output={
   ...totals,climates:[...totals.climates],
   measuredBiomeClassificationsAvoided:totals.hits,
   measuredClassificationAvoidancePercent:rounded(
     100*totals.hits/totals.uncachedClassifications),
   nativeNodeTimeCached:distribution(cachedTimes),
   nativeNodeTimeNoMemo:distribution(uncachedTimes),
   slowestCachedRelativeChunks:byAddedNodeCost.slice(0,6),
   timingsNativeNode22Only:true,timingsNotACiPassFail:true,
   physicalIphone:false,liveBrowserStreaming:false
 };
 delete output.peakTreeChunkEntriesOnly;
 console.log('# ENCHANTED ORIGINAL WORLD CONTROLLED SITE-MEMO COST '+
   JSON.stringify(output));
});
