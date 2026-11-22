// Original-M7 world integration: experimental tree-site biome metadata may
// be cached between consecutive chunk builds, but source cave AIR, landmarks,
// edits, roots, overlapping branches and all output IDs MUST still be read
// and resolved by the original physical world independently for every chunk.
// No browser, production save, synthetic chunk renderer or FPS claims.
import test from 'node:test';
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {EnchantedSiteBiomeCache,ENCHANTED_SITE_BIOME_CACHE_LIMIT as LIMIT}
 from '../../src/manual-biomes/enchanted-tree-site-biome-cache.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
 from '../../src/manual-biomes/profile-world.mjs';
import {environmentalTreesForChunk} from '../../src/manual-biomes/environment-v7.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {BLOCK,chunkCoord,worldKey} from '../../src/voxel.mjs';
import {WORLD_MAX_Y} from '../../src/depth.mjs';

function readFrom(world,counter){
 const column=(x,z)=>world._columnPlan(x,z);
 const cell=(x,y,z)=>{
  counter.calls++;
  return column(x,z).get(y)??world._environmentBaseline(x,y,z);
 };
 return {column,cell};
}

test('128-entry immutable site memo is seed-scoped, deterministic, bounded and rejects mutable classifications',()=>{
 assert.equal(LIMIT,128);
 assert.throws(()=>new EnchantedSiteBiomeCache(0),/capacity/);
 assert.throws(()=>new EnchantedSiteBiomeCache(LIMIT+1),/capacity/);
 const cache=new EnchantedSiteBiomeCache(4);
 let calls=0;
 const reader=(x,z,seed)=>{calls++;return v6BiomeAt(x,z,seed);};
 const a=cache.getOrRead(-40,-511,179,reader);
 assert.strictEqual(cache.getOrRead(-40,-511,179,reader),a);
 assert.equal(calls,1);
 assert.deepEqual(cache.getOrRead(-40,-511,7919,reader),
   v6BiomeAt(-40,-511,7919),'seed changes must not collide');
 assert.equal(calls,2);
 for(let i=0;i<45;i++){
  cache.getOrRead(-80+i,-508,179,reader);
  assert.ok(cache.size<=4);
 }
 assert.equal(cache.peakEntries,4);
 assert.ok(cache.evictions>=40);
 cache.set('179:1,2',null);
 cache.set('179:2,3',null);
 assert.equal(cache.size,4,'even direct Map writes must obey the hard cap');
 const beforeRejection=[...cache];
 const evictionsBeforeRejection=cache.evictions;
 const unsealedCenter=Object.freeze({name:'enchanted',weight:1,center:[0,0]});
 assert.throws(()=>cache.set('179:50,51',unsealedCenter),/immutable/);
 assert.throws(()=>cache.set('179:50,51',{name:'enchanted',weight:1,center:Object.freeze([0,0])}),/immutable/);
 assert.throws(()=>cache.set('179:50,51',Object.freeze({name:'plains',weight:1,
   center:Object.freeze([0,0])})),/immutable/);
 assert.throws(()=>cache.set('wrong-key',null),/immutable/);
 assert.throws(()=>cache.getOrRead(9007199254740992,0,179,reader),/lookup/);
 const directNested=Object.freeze({name:'enchanted',weight:1,
   center:Object.freeze([0,0])});
 cache.set('179:50,51',directNested);
 assert.strictEqual(cache.getOrRead(50,51,179,reader),directNested);
 assert.equal(cache.size,4);
 assert.equal(beforeRejection.length,4);
 assert.equal(cache.evictions,evictionsBeforeRejection+1,
   'invalid direct writes may never evict a valid classification');
 const nullCache=new EnchantedSiteBiomeCache(2);
 let nullCalls=0;
 assert.equal(nullCache.getOrRead(0,0,179,()=>{nullCalls++;return null;}),null);
 assert.equal(nullCache.getOrRead(0,0,179,()=>{nullCalls++;return null;}),null);
 assert.equal(nullCalls,1,'null Plains classification must be cached');
 assert.throws(()=>cache.getOrRead(1,1,179,()=>({name:'enchanted',weight:1})),
   /Unstable/);
 assert.throws(()=>cache.getOrRead(1,1,179,()=>{throw Error('source reader failed');}),
   /source reader failed/);
 assert.throws(()=>cache.getOrRead(1,1,1.5,reader),/lookup/);
});

test('actual original M7 world stream has identical ordered voxels across 288 consecutive chunks and bounded site cache',()=>{
 const seeds=[179,7919,-88],latitudes=[-34,-16,0],cxStart=-16,cxEnd=15;
 const metrics={chunks:0,voxels:0,sourceReadsReference:0,liveTreeCachePeak:0,
   biomeSiteCachePeak:0,biomeSiteHits:0,biomeSiteMisses:0,
   biomeSiteEvictions:0,uncachedLookups:0,visibleSourceMatches:0,
   adjacentFacePairs:0,cacheRegenerationChecks:0};
 const seedRows=[];
 for(const seed of seeds){
  const profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const live=new FourRegionWorld(seed,profile,
    {experimentalEnchantedTrees:true});
  const control=new FourRegionWorld(seed,profile,
    {experimentalEnchantedTrees:true});
  const counter={calls:0},ref=readFrom(control,counter);
  const cache=live._environmentCandidateSiteBiomes;
  assert.ok(cache instanceof EnchantedSiteBiomeCache);
  assert.equal(cache.limit,LIMIT);
  let last=null,seedPlans=0,seedVoxels=0;
  const firstPlans=[];
  const started=performance.now();
  for(const cz of latitudes){
   last=null;
   for(let cx=cxStart;cx<=cxEnd;cx++){
    // This calls the ORIGINAL FourRegionWorld chunk residency path, not
    // just a detached planner helper. Candidate tree chunks are still
    // strictly bounded at 64 by that unchanged original world engine.
    live._environmentTreeAt(cx*16,WORLD_MAX_Y,cz*16);
    const natural=live._environmentTreeChunks.get(cx+','+cz);
    assert.ok(natural instanceof Map,'original game must build this real chunk');
    let stats;
    const original=environmentalTreesForChunk(cx,cz,seed,
      ref.column,ref.cell,{
        experimentalEnchantedTrees:true,
        onCandidateSiteSummary:s=>{stats=s;}
      });
    assert.deepEqual([...natural],[...original],
      'bounded memo must preserve EVERY ordered native M7 tree voxel, material ID and overlap');
    assert.ok(stats&&Object.isFrozen(stats));
    metrics.uncachedLookups+=stats.biomeLookupSites;
    metrics.chunks++;
    metrics.voxels+=natural.size;
    seedPlans++;seedVoxels+=natural.size;
    metrics.liveTreeCachePeak=Math.max(metrics.liveTreeCachePeak,
      live._environmentTreeChunks.size);
    metrics.biomeSiteCachePeak=Math.max(metrics.biomeSiteCachePeak,cache.size);
    assert.ok(cache.size<=LIMIT,'live original world must not retain unbounded site entries');
    assert.ok(live._environmentTreeChunks.size<=64);
    const seen=new Map();
    for(const [key,id] of natural){
      const [x,y,z]=key.split(',').map(Number);
      assert.equal(chunkCoord(x),cx);
      assert.equal(chunkCoord(z),cz);
      assert.ok(y>0&&y<=WORLD_MAX_Y);
      assert.equal(ref.column(x,z).get(y)??control._environmentBaseline(x,y,z),
        BLOCK.AIR,'real candidate cannot occupy original cave or landmark source');
      if(metrics.visibleSourceMatches<40){
        assert.equal(live.naturalAndLandmarkBlock(x,y,z),id,
          'original game physical tree reader disagrees with its own chunk map');
        assert.equal(control.naturalAndLandmarkBlock(x,y,z),id);
        metrics.visibleSourceMatches++;
      }
      if(x===cx*16||x===cx*16+15)seen.set(key,id);
    }
    if(last){
      const priorX=(cx-1)*16+15,liveX=cx*16;
      for(const at of last.keys()){
        const [x,y,z]=at.split(',').map(Number);
        if(x===priorX&&seen.has(worldKey(liveX,y,z)))
          metrics.adjacentFacePairs++;
      }
    }
    last=seen;
    if(firstPlans.length<2)firstPlans.push({cx,cz,cells:[...natural]});
   }
  }
  // Three 32-chunk latitudes = 96 builds per seed, genuinely exceeding
  // the original fixed 64 chunk residency budget and forcing eviction.
  // Rebuilding from the SAME seed and immutable biome-site cache must not
  // alter source cells or accidentally mask a cave/saved world edit.
  assert.equal(live._environmentTreeChunks.has(firstPlans[0].cx+','+firstPlans[0].cz),
    false,'real original-world 64-chunk FIFO must have evicted first source');
  for(const p of firstPlans){
    live._environmentTreeAt(p.cx*16,WORLD_MAX_Y,p.cz*16);
    const replay=live._environmentTreeChunks.get(p.cx+','+p.cz);
    assert.deepEqual([...replay],p.cells,
      'real original world must rehydrate identical physical tree voxels after eviction');
    metrics.cacheRegenerationChecks++;
  }
  metrics.biomeSiteHits+=cache.hits;
  metrics.biomeSiteMisses+=cache.misses;
  metrics.biomeSiteEvictions+=cache.evictions;
  metrics.sourceReadsReference+=counter.calls;
  assert.throws(()=>live.save(),/cannot be saved as historical M7/);
  assert.throws(()=>control.save(),/cannot be saved as historical M7/);
  const historic=new FourRegionWorld(seed,profile);
  assert.equal(historic._environmentCandidateSiteBiomes,undefined,
    'historical M7 must not allocate experimental site cache');
  assert.deepEqual(historic.save(),{schema:1,seed,edits:[]});
  seedRows.push({seed,plans:seedPlans,voxels:seedVoxels,
    cacheHits:cache.hits,cacheMisses:cache.misses,
    evictions:cache.evictions,nativeRunnerMs:+(performance.now()-started).toFixed(2)});
 }
 assert.equal(metrics.chunks,288);
 assert.ok(metrics.voxels>8000,'must cover nonempty natural Enchanted source terrain');
 assert.ok(metrics.biomeSiteHits>100,'sequential chunk plan must share real immutable site classifications');
 assert.ok(metrics.biomeSiteMisses>0);
 assert.ok(metrics.biomeSiteCachePeak<=LIMIT);
 assert.equal(metrics.liveTreeCachePeak,64);
 assert.ok(metrics.adjacentFacePairs>30);
 assert.ok(metrics.cacheRegenerationChecks>=6);
 console.log('# ENCHANTED ORIGINAL WORLD 288-CHUNK SITE BIOME RESIDENCY '+
   JSON.stringify({...metrics,seedRows,
     cachedTotalBiomes:metrics.biomeSiteHits+metrics.biomeSiteMisses,
     cachedHitPercent:+(100*metrics.biomeSiteHits/
       (metrics.biomeSiteHits+metrics.biomeSiteMisses)).toFixed(2),
     nativeRunnerNotIphoneFPS:true,liveBrowserNotTested:true}));
});

test('cached site biomes never substitute for live cave/landmark/root source checks',()=>{
 const seed=179,profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
 const world=new FourRegionWorld(seed,profile,
   {experimentalEnchantedTrees:true});
 const read=readFrom(world,{calls:0});
 const cache=new EnchantedSiteBiomeCache(64);
 const chunks=[[-2,-33],[-1,-33],[0,-33]];
 let found=null;
 for(const [cx,cz] of chunks){
  const original=environmentalTreesForChunk(cx,cz,seed,read.column,read.cell,
    {experimentalEnchantedTrees:true,candidateSiteBiomeCache:cache});
  if(original.size&&found===null){
   const candidate=[...original][0],at=candidate[0].split(',').map(Number);
   found={cx,cz,at,original};
  }
 }
 assert.ok(found,'must find genuine original M7 tree source');
 const [bx,by,bz]=found.at;
 const before=environmentalTreesForChunk(found.cx,found.cz,seed,
   read.column,read.cell,{
     experimentalEnchantedTrees:true,candidateSiteBiomeCache:cache
   });
 // A test-only protected original source cell is now occupied; this is
 // NOT an edit to the user's world and does not alter any production source.
 const sourceWithLandmark=(x,y,z)=>
   x===bx&&y===by&&z===bz?BLOCK.STONE:read.cell(x,y,z);
 const guarded=environmentalTreesForChunk(found.cx,found.cz,seed,
   read.column,sourceWithLandmark,{
     experimentalEnchantedTrees:true,candidateSiteBiomeCache:cache
   });
 const fresh=environmentalTreesForChunk(found.cx,found.cz,seed,
   read.column,sourceWithLandmark,{experimentalEnchantedTrees:true});
 assert.deepEqual([...guarded],[...fresh],
   'cached biome may never retain an invalid tree over newly protected source');
 assert.ok(!guarded.has(worldKey(bx,by,bz)),
   'genuine occupied original provenance cell must veto candidate replacement');
 assert.ok(before.has(worldKey(bx,by,bz)));
 assert.throws(()=>world.save(),/cannot be saved as historical M7/);
});
