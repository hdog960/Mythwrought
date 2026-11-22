// Original-source Phase 2 proof of conservative candidate-site rejection.
// Compare fast scanning with the exact same site's PREVIOUS unculled scan
// path in independent original FourRegionWorld instances, including negative
// chunk boundaries, terrain/cave/landmark provenance and historical M7 saves.
// No synthetic image/browser, no generator migration or cached world writes.
import test from 'node:test';
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {buildEnchantedTreeCandidate,ENCHANTED_TREE_MAX_RADIUS}
  from '../../src/manual-biomes/enchanted-tree-candidates.mjs';
import {environmentalTreesForChunk} from '../../src/manual-biomes/environment-v7.mjs';
import {BLOCK,chunkCoord} from '../../src/voxel.mjs';
import {WORLD_MAX_Y} from '../../src/depth.mjs';

test('geometric rejection cannot hide a real authored tree voxel or reach an adjacent chunk',()=>{
  assert.equal(ENCHANTED_TREE_MAX_RADIUS,4);
  const cases=[[-2,-33],[-1,-33],[0,-32],[1,-31],[-3,-34]];
  let rejectedSites=0,authoredExcluded=0;
  for(const [cx,cz] of cases){
    const left=cx*16,right=left+15,front=cz*16,back=front+15;
    for(let x=left-8;x<=right+8;x++)
      for(let z=front-8;z<=back+8;z++){
        const excluded=x+4<left||x-4>right||z+4<front||z-4>back;
        if(!excluded)continue;
        for(const roll of [.07,.31,.82]){
          const candidate=buildEnchantedTreeCandidate(x,3,z,roll);
          assert.ok(candidate);
          assert.ok(candidate.cells.every(([a,b,c])=>
            a<left||a>right||c<front||c>back),
            'off-chunk site unexpectedly writes a cube across the candidate halo');
          authoredExcluded+=candidate.cells.length;
        }
        rejectedSites++;
      }
  }
  assert.ok(rejectedSites>=200);
  assert.ok(authoredExcluded>1000);
  console.log('# ENCHANTED PHASE2 EXACT SITE BOUNDS '+JSON.stringify({
    rejectedSites,authoredExcluded,chunkSamples:cases.length,
    allExcludedVoxelsPhysicallyOutsideChunk:true
  }));
});

test('authentic 48-chunk three-seed site cull preserves EVERY original M7 candidate voxel and site order',()=>{
  const seeds=[179,7919,-88];
  const chunks=[];
  for(let cx=-3;cx<=0;cx++)for(let cz=-34;cz<=-31;cz++)
    chunks.push([cx,cz]);
  const summary={chunks:0,totalSites:0,culled:0,biomeLookupFast:0,
    biomeLookupUnculled:0,sourceFast:0,sourceUnculled:0,
    sourceCells:0,changedVoxels:0,activeChunkPlans:0};
  const witnesses=[];
  for(const seed of seeds){
    const fastWorld=new FourRegionWorld(seed,
      fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
      {experimentalEnchantedTrees:true});
    const originalScanWorld=new FourRegionWorld(seed,
      fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
      {experimentalEnchantedTrees:true});
    const readerFor=(world,counter)=>{
      const column=(x,z)=>world._columnPlan(x,z);
      const read=(x,y,z)=>{
        counter.calls++;
        return column(x,z).get(y)??world._environmentBaseline(x,y,z);
      };
      return {column,read};
    };
    const fastReads={calls:0},originalReads={calls:0};
    const fastReader=readerFor(fastWorld,fastReads);
    const originalReader=readerFor(originalScanWorld,originalReads);
    for(const [cx,cz] of chunks){
      let aSummary,bSummary;
      const startFast=fastReads.calls;
      const t0=performance.now();
      const actual=environmentalTreesForChunk(cx,cz,seed,
        fastReader.column,fastReader.read,{
          experimentalEnchantedTrees:true,
          onCandidateSiteSummary:s=>{aSummary=s;}
        });
      const fastMs=performance.now()-t0;
      const startUnculled=originalReads.calls;
      const t1=performance.now();
      const previous=environmentalTreesForChunk(cx,cz,seed,
        originalReader.column,originalReader.read,{
          experimentalEnchantedTrees:true,
          disableCandidateSiteCulling:true,
          onCandidateSiteSummary:s=>{bSummary=s;}
        });
      const oldMs=performance.now()-t1;
      assert.ok(aSummary&&bSummary,'both paths must report original site search bounds');
      assert.ok(Object.isFrozen(aSummary)&&Object.isFrozen(bSummary));
      assert.equal(aSummary.experimental,true);
      assert.equal(aSummary.sampledSites,bSummary.sampledSites);
      assert.equal(bSummary.geometricallyCulledSites,0);
      assert.equal(bSummary.sampledSites,bSummary.biomeLookupSites);
      assert.equal(aSummary.sampledSites,
        aSummary.biomeLookupSites+aSummary.geometricallyCulledSites);
      // Exact ordered source maps, not merely cell totals or shape silhouettes.
      assert.deepEqual([...actual],[...previous],
        'original scan and early-cull source generated different M7 voxel/IDs');
      for(const [at,id] of actual){
        const [x,y,z]=at.split(',').map(Number);
        assert.equal(chunkCoord(x),cx);
        assert.equal(chunkCoord(z),cz);
        assert.ok(y<=WORLD_MAX_Y);
        assert.equal(fastWorld.naturalAndLandmarkBlock(x,y,z),id,
          'candidate changed real source-world view or protected AIR');
        assert.equal(originalScanWorld.naturalAndLandmarkBlock(x,y,z),id);
        assert.equal(fastWorld._columnPlan(x,z).get(y)??
          fastWorld._environmentBaseline(x,y,z),BLOCK.AIR,
          'candidate may not replace the original terrain/landmark baseline');
      }
      summary.chunks++;
      summary.totalSites+=aSummary.sampledSites;
      summary.culled+=aSummary.geometricallyCulledSites;
      summary.biomeLookupFast+=aSummary.biomeLookupSites;
      summary.biomeLookupUnculled+=bSummary.biomeLookupSites;
      summary.sourceFast+=fastReads.calls-startFast;
      summary.sourceUnculled+=originalReads.calls-startUnculled;
      summary.sourceCells+=actual.size;
      if(actual.size)summary.activeChunkPlans++;
      if(witnesses.length<8&&aSummary.geometricallyCulledSites>0)
        witnesses.push({seed,cx,cz,sites:aSummary.sampledSites,
          culled:aSummary.geometricallyCulledSites,
          fastSourceCalls:fastReads.calls-startFast,
          unculledSourceCalls:originalReads.calls-startUnculled,
          fastRunnerMs:+fastMs.toFixed(3),
          unculledRunnerMs:+oldMs.toFixed(3)});
    }
    assert.throws(()=>fastWorld.save(),/cannot be saved as historical M7/);
    assert.throws(()=>originalScanWorld.save(),/cannot be saved as historical M7/);
  }
  assert.equal(summary.chunks,48);
  assert.ok(summary.culled>0,
    'same 48 original chunk plans must actually skip useless sites');
  assert.equal(summary.biomeLookupUnculled-summary.biomeLookupFast,
    summary.culled,'every rejected site must bypass its biome lookup');
  assert.ok(summary.sourceCells>500,'test must inspect real source-generated trees');
  assert.ok(summary.sourceFast<=summary.sourceUnculled,
    'physically off-chunk site culling must never create more baseline reads');
  console.log('# ENCHANTED EXACT M7 SITE EARLY CULL '+JSON.stringify({
    ...summary,witnesses,
    exactVoxelAndInsertionOrderParity:true,physicalIphone:false,
    runnerTimingNotMobileFps:true
  }));
});

test('historical nonexperimental and foreign-biome M7 branches remain identical',()=>{
  const seed=179,profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const old=new FourRegionWorld(seed,profile);
  const explicit=new FourRegionWorld(seed,profile,{experimentalEnchantedTrees:false});
  const cxz=[[-2,-33],[0,-32],[0,32],[32,0],[-32,0],[0,0]];
  for(const [cx,cz] of cxz){
    const col=(x,z)=>old._columnPlan(x,z);
    const val=(x,y,z)=>col(x,z).get(y)??old._environmentBaseline(x,y,z);
    const original=environmentalTreesForChunk(cx,cz,seed,col,val);
    const optOff=environmentalTreesForChunk(cx,cz,seed,col,val,
      {experimentalEnchantedTrees:false});
    assert.deepEqual([...original],[...optOff]);
    const cold=(x,z)=>explicit._columnPlan(x,z);
    const warm=(x,y,z)=>cold(x,z).get(y)??explicit._environmentBaseline(x,y,z);
    assert.deepEqual([...original],
      [...environmentalTreesForChunk(cx,cz,seed,cold,warm)]);
  }
  assert.deepEqual(old.save(),{schema:1,seed,edits:[]});
  assert.deepEqual(explicit.save(),old.save());
  const noop=(x,z)=>new Map();
  assert.throws(()=>environmentalTreesForChunk(0,0,seed,noop,()=>BLOCK.AIR,{
    experimentalEnchantedTrees:true,onCandidateSiteSummary:'invalid'
  }),/diagnostics callback/);
  assert.throws(()=>environmentalTreesForChunk(0,0,seed,noop,()=>BLOCK.AIR,{
    experimentalEnchantedTrees:true,disableCandidateSiteCulling:'invalid'
  }),/comparison flag/);
});
