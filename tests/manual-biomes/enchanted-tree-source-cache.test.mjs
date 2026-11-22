// New source-specific proof that experimental candidate cave/landmark/terrain
// memo cannot grow without bound on a phone. No edits or global world cache.
// Uses the REAL original FourRegionWorld and environmentalTreesForChunk.
import test from 'node:test';
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {EnchantedCandidateSourceCache,
  ENCHANTED_CANDIDATE_SOURCE_CACHE_MAX_ENTRIES as MAX}
  from '../../src/manual-biomes/enchanted-tree-source-cache.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {environmentalTreesForChunk}
  from '../../src/manual-biomes/environment-v7.mjs';
import {BLOCK,chunkCoord} from '../../src/voxel.mjs';
import {WORLD_MAX_Y} from '../../src/depth.mjs';

test('bounded cache hard-stops at 2048 entries through thousands of distinct source coordinates',()=>{
  assert.equal(MAX,2048,'review cache limit before relaxing mobile memory');
  assert.throws(()=>new EnchantedCandidateSourceCache(0),/capacity/);
  assert.throws(()=>new EnchantedCandidateSourceCache(MAX+1),/capacity/);
  assert.throws(()=>new EnchantedCandidateSourceCache(1.5),/capacity/);
  const cache=new EnchantedCandidateSourceCache(64);
  for(let i=0;i<5000;i++){
    cache.set(i+',8,-512',i%3);
    assert.ok(cache.size<=64,'no unbounded growth even on dense forest');
  }
  assert.equal(cache.peakEntries,64);
  assert.equal(cache.evictions,5000-64);
  assert.equal(cache.has('0,8,-512'),false,'oldest entries must be evicted');
  assert.equal(cache.get('4999,8,-512'),4999%3);
  assert.equal(cache.size,64);
  // Modifying a known key must not change its FIFO ownership or capacity.
  cache.set('4936,8,-512',99);
  assert.equal(cache.size,64);
  assert.equal(cache.evictions,4936);
  cache.set('5000,8,-512',55);
  assert.equal(cache.has('4936,8,-512'),false);
  assert.equal(cache.get('5000,8,-512'),55);
});
test('evicted AIR, non-AIR and undefined source entries can only be reconstructed from real input',()=>{
  const source=new Map([['0,8,0',BLOCK.AIR],['1,8,0',3]]);
  const cache=new EnchantedCandidateSourceCache(2);
  let calls=0;
  const read=at=>{
    if(!cache.has(at)){
      calls++;cache.set(at,source.get(at));
    }
    return cache.get(at);
  };
  assert.equal(read('0,8,0'),BLOCK.AIR);
  assert.equal(read('1,8,0'),3);
  assert.equal(read('0,8,0'),BLOCK.AIR);
  assert.equal(calls,2);
  assert.equal(read('2,8,0'),undefined);
  assert.equal(cache.size,2);
  assert.equal(read('0,8,0'),BLOCK.AIR,
    'after eviction AIR must be read again from the source, never guessed solid');
  assert.equal(calls,4,'eviction must cause an authentic source lookup');
  source.set('1,8,0',BLOCK.AIR);
  assert.equal(read('1,8,0'),BLOCK.AIR,
    'evicted original protected solid may only change if genuine source changes');
});
test('dense original-source M7 sampling stays bounded, deterministic, cave-safe and save-safe',()=>{
  const seeds=[179,7919,-88];
  let plannedVoxels=0,checked=0,peak=0,evictions=0;
  const denseWork=[]; // test-only real native reads, time, occupancy
  let observedProcessHeapPeak=0;
  const rows=[];
  const chunks=[];
  // 4x4 actual independent source regions around the original Enchanted
  // Forest. Negative chunk seams, cave/landmark readers and mixed terrain
  // are evaluated by the real game, not by a synthetic block array.
  for(let cx=-3;cx<=0;cx++)for(let cz=-34;cz<=-31;cz++)
    chunks.push([cx,cz]);
  for(const seed of seeds){
    const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
      {experimentalEnchantedTrees:true});
    const fresh=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
      {experimentalEnchantedTrees:true});
    const column=(x,z)=>world._columnPlan(x,z);
    let originalSourceReads=0;
    const read=(x,y,z)=>{
      originalSourceReads++;
      return column(x,z).get(y)??world._environmentBaseline(x,y,z);
    };
    const readFresh=(x,z)=>fresh._columnPlan(x,z);
    const freshCell=(x,y,z)=>readFresh(x,z).get(y)??fresh._environmentBaseline(x,y,z);
    let sourceCells=0,sourceEvictions=0,sourcePeak=0;
    for(const [cx,cz] of chunks){
      let metrics;
      const beforeReads=originalSourceReads;
      const startMs=performance.now();
      const candidate=environmentalTreesForChunk(cx,cz,seed,column,read,{
        experimentalEnchantedTrees:true,
        onCandidateCacheSummary:summary=>{metrics=summary;}
      });
      const nativeMs=+(performance.now()-startMs).toFixed(3);
      const sourceReadCalls=originalSourceReads-beforeReads;
      const processHeapUsed=process.memoryUsage().heapUsed;
      observedProcessHeapPeak=Math.max(observedProcessHeapPeak,processHeapUsed);
      assert.ok(metrics,'one test-only synchronous metrics callback per chunk');
      assert.ok(Object.isFrozen(metrics));
      assert.ok(metrics.peakEntries<=MAX,'hard cap must never be exceeded');
      assert.ok(metrics.entries<=MAX);
      assert.ok(metrics.evictions>=0);
      assert.ok(metrics.hits>=0&&metrics.misses>=0);
      assert.ok(metrics.misses<=sourceReadCalls,
        'actual candidate cache misses cannot exceed original source reads');
      denseWork.push({
        seed,cx,cz,sourceReadCalls,nativeMs,sourceCells:candidate.size,
        hits:metrics.hits,misses:metrics.misses,
        peakEntries:metrics.peakEntries,evictions:metrics.evictions
      });
      if(metrics.entries)assert.equal(metrics.limit,MAX);
      else assert.equal(metrics.limit,0,'nonenchanted chunk does not allocate cache');
      peak=Math.max(peak,metrics.peakEntries);
      sourcePeak=Math.max(sourcePeak,metrics.peakEntries);
      sourceEvictions+=metrics.evictions;
      const duplicate=environmentalTreesForChunk(cx,cz,seed,readFresh,freshCell,
        {experimentalEnchantedTrees:true});
      assert.deepEqual([...candidate],[...duplicate],
        'fresh cold M7 source cache must produce byte-identical candidate voxels');
      for(const [at,id] of candidate){
        const [x,y,z]=at.split(',').map(Number);
        assert.equal(chunkCoord(x),cx);
        assert.equal(chunkCoord(z),cz);
        assert.ok(y<=WORLD_MAX_Y);
        assert.equal(world.naturalAndLandmarkBlock(x,y,z),id,
          'original cave/landmark-aware world reader and bounded cache disagree');
        assert.equal(read(x,y,z),BLOCK.AIR,
          'candidate tree may not replace original cave/landmark/terrain');
        sourceCells++;
      }
      checked++;
    }
    plannedVoxels+=sourceCells;evictions+=sourceEvictions;
    assert.throws(()=>world.save(),/cannot be saved as historical M7/);
    rows.push({seed,sourceCells,sourcePeak,sourceEvictions});
  }
  assert.equal(checked,seeds.length*chunks.length);
  assert.ok(plannedVoxels>700,'dense original forest acceptance must contain real trees');
  const byTime=[...denseWork].sort((a,b)=>a.nativeMs-b.nativeMs);
  const byReads=[...denseWork].sort((a,b)=>b.sourceReadCalls-a.sourceReadCalls);
  const p95=byTime[Math.ceil(byTime.length*.95)-1]?.nativeMs??0;
  const averageMs=+(denseWork.reduce((sum,r)=>sum+r.nativeMs,0)/denseWork.length).toFixed(3);
  const totalReads=denseWork.reduce((sum,r)=>sum+r.sourceReadCalls,0);
  const cacheHits=denseWork.reduce((sum,r)=>sum+r.hits,0);
  const cacheMisses=denseWork.reduce((sum,r)=>sum+r.misses,0);
  assert.ok(totalReads>0&&cacheMisses>0);
  assert.equal(denseWork.length,checked);
  console.log('# ENCHANTED REAL BOUNDED CACHE DENSE SOURCE '+JSON.stringify({
    chunks:checked,sourceVoxels:plannedVoxels,
    peakEntries:peak,hardLimit:MAX,evictions,rows,
    sourceReadCalls:totalReads,cacheHits,cacheMisses,
    nativeRunnerAvgChunkMs:averageMs,nativeRunnerP95ChunkMs:p95,
    worstReadChunks:byReads.slice(0,5),
    observedNodeProcessHeapUsedPeakBytes:observedProcessHeapPeak,
    heapSampleIsWholeProcessNotCacheAllocation:true,
    nativeTimingIncludesColdWorldReaderAndTestOverhead:true,
    physicalIphone:false,notAnFpsTest:true
  }));
});
test('experimental cache diagnostics are opt-in and never invoked on original historical generation',()=>{
  const seed=179;
  const historical=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  let historyCallbacks=0;
  const cx=-2,cz=-33;
  const column=(x,z)=>historical._columnPlan(x,z);
  const baseline=(x,y,z)=>column(x,z).get(y)??historical._environmentBaseline(x,y,z);
  const original=environmentalTreesForChunk(cx,cz,seed,column,baseline);
  const originalAgain=environmentalTreesForChunk(cx,cz,seed,column,baseline,{
    experimentalEnchantedTrees:false,
    onCandidateCacheSummary:s=>{historyCallbacks++;assert.equal(s.entries,0);assert.equal(s.limit,0);}
  });
  assert.deepEqual([...original],[...originalAgain],
    'historical M7 must retain exact original tree map, site order and IDs');
  assert.equal(historyCallbacks,1);
  assert.throws(()=>environmentalTreesForChunk(cx,cz,seed,column,baseline,{
    experimentalEnchantedTrees:true,onCandidateCacheSummary:3
  }),/diagnostics callback/);
  assert.deepEqual(historical.save(),{schema:1,seed,edits:[]});
});
