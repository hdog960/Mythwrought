// Long-range, connected 32-chunk original M7 source-planning passes across
// three latitude tracks, several V6 climate borders and three genuine seeds.
// Exact ordered voxel parity against THE SAME original planner with its new
// density fast path disabled (not synthetic mocks / changed save identity).
// This is sequential native chunk generation, not browser streaming or FPS.
import test from 'node:test';
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {environmentalTreesForChunk,
  ENCHANTED_TREE_MAX_DENSITY_THRESHOLD}
  from '../../src/manual-biomes/environment-v7.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {BLOCK,chunkCoord} from '../../src/voxel.mjs';
import {WORLD_MAX_Y} from '../../src/depth.mjs';

const seeds=[179,7919,-88];
const tracks=[-34,-16,0];
const minCX=-16,maxCX=15;
const mkReader=(world,counts)=>{
 const column=(x,z)=>world._columnPlan(x,z);
 const cell=(x,y,z)=>{
  counts.reads++;
  return column(x,z).get(y)??world._environmentBaseline(x,y,z);
 };
 return {column,cell};
};
const k=(x,y,z)=>x+','+y+','+z;

test('maximal possible Enchanted density never exceeds exact source roll cutoff',()=>{
 assert.equal(ENCHANTED_TREE_MAX_DENSITY_THRESHOLD,.52+.34,
   'use the exact native JavaScript addition of the maximum Enchanted threshold');
 let high=0;
 // Actual original density selection formula is .52+(.5+.5*sin(t))*.34.
 // Check extreme and intermediate full phase rotations with no epsilon
 // that might admit a live tree at >=.86 in snow, Enchanted or other V6.
 for(let i=0;i<=4096;i++){
  const t=(i/4096)*Math.PI*4;
  const canopy=.5+.5*Math.sin(t);
  const enchanted=.52+canopy*.34;
  const other=Math.max(.52,.13);
  const max=Math.max(enchanted,other);
  assert.ok(max<=ENCHANTED_TREE_MAX_DENSITY_THRESHOLD);
  high=Math.max(high,max);
 }
 assert.equal(high,ENCHANTED_TREE_MAX_DENSITY_THRESHOLD,
   'the source threshold must agree with the greatest native JS canopy phase');
});

test('original M7 sequential 288-chunk climate crossing preserves exact ordered tree voxels and saves',()=>{
 const totals={chunks:0,trackLengths:[],sampledSites:0,
  physicalSiteCulled:0,densityCulled:0,
  oldBiomeLookups:0,newBiomeLookups:0,
  oldSourceReads:0,newSourceReads:0,
  voxels:0,changedVoxels:0,
  sourceAirVetoViolations:0,regionBorderVoxels:0,
  connectedSeamFacePairs:0};
 const climateCounts=new Map(),sampleRows=[];
 for(const seed of seeds){
  const profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const fast=new FourRegionWorld(seed,profile,{experimentalEnchantedTrees:true});
  const reference=new FourRegionWorld(seed,profile,{experimentalEnchantedTrees:true});
  const fastC={reads:0},refC={reads:0};
  const f=mkReader(fast,fastC),r=mkReader(reference,refC);
  for(const cz of tracks){
   let previous=null,trackVoxels=0,trackDensity=0,trackSaved=0;
   let oldTiming=0,fastTiming=0;
   // These are 32 CONNECTED consecutive horizontal source chunks with
   // no resetting source world or its existing cold/warm terrain caches.
   for(let cx=minCX;cx<=maxCX;cx++){
    const beforeFast=fastC.reads,beforeRef=refC.reads;
    let newStats,oldStats;
    const start=performance.now();
    const actual=environmentalTreesForChunk(cx,cz,seed,f.column,f.cell,{
      experimentalEnchantedTrees:true,onCandidateSiteSummary:v=>{newStats=v;}
    });
    fastTiming+=performance.now()-start;
    const oldStart=performance.now();
    const old=environmentalTreesForChunk(cx,cz,seed,r.column,r.cell,{
      experimentalEnchantedTrees:true,disableCandidateDensityCulling:true,
      onCandidateSiteSummary:v=>{oldStats=v;}
    });
    oldTiming+=performance.now()-oldStart;
    assert.ok(Object.isFrozen(newStats)&&Object.isFrozen(oldStats));
    assert.equal(newStats.sampledSites,oldStats.sampledSites);
    assert.equal(newStats.geometricallyCulledSites,
      oldStats.geometricallyCulledSites);
    assert.equal(oldStats.densityCulledSites,0);
    assert.equal(newStats.biomeLookupSites+newStats.densityCulledSites,
      oldStats.biomeLookupSites,
      'every early rejection must eliminate exactly one real original V6 biome lookup');
    assert.deepEqual([...actual],[...old],
      'density-culling changed original M7 ordered tree voxel content, seam, or material IDs');
    const fastReads=fastC.reads-beforeFast,oldReads=refC.reads-beforeRef;
    assert.equal(fastReads,oldReads,
      'rejected density rolls cannot reach an original source terrain callback');
    totals.chunks++;
    totals.sampledSites+=newStats.sampledSites;
    totals.physicalSiteCulled+=newStats.geometricallyCulledSites;
    totals.densityCulled+=newStats.densityCulledSites;
    totals.oldBiomeLookups+=oldStats.biomeLookupSites;
    totals.newBiomeLookups+=newStats.biomeLookupSites;
    totals.oldSourceReads+=oldReads;
    totals.newSourceReads+=fastReads;
    totals.voxels+=actual.size;
    trackVoxels+=actual.size;
    trackDensity+=newStats.densityCulledSites;
    const climate=v6BiomeAt(cx*16+8,cz*16+8,seed)?.name??'plains';
    climateCounts.set(climate,(climateCounts.get(climate)??0)+1);
    const current=new Map();
    for(const [at,id] of actual){
      const [x,y,z]=at.split(',').map(Number);
      assert.equal(chunkCoord(x),cx);
      assert.equal(chunkCoord(z),cz);
      assert.ok(y>0&&y<=WORLD_MAX_Y);
      // This verifies the original cave/landmark AIR veto and that the
      // physical world reader matches the exact output on BOTH worlds.
      assert.equal(f.column(x,z).get(y)??fast._environmentBaseline(x,y,z),
        BLOCK.AIR,'opt-in tree writes into protected original cave/landmark/terrain');
      assert.equal(fast.naturalAndLandmarkBlock(x,y,z),id,
        'current original M7 world reader differs from emitted tree');
      assert.equal(reference.naturalAndLandmarkBlock(x,y,z),id);
      if(x===cx*16||x===cx*16+15){
       totals.regionBorderVoxels++;
       current.set(at,id);
      }
    }
    if(previous){
      const prevCX=cx-1,right=prevCX*16+15,left=cx*16;
      for(const at of previous.keys()){
        const [x,y,z]=at.split(',').map(Number);
        if(x!==right)continue;
        if(current.has(k(left,y,z)))totals.connectedSeamFacePairs++;
      }
    }
    previous=current;
   }
   totals.trackLengths.push(32);
   if(sampleRows.length<10)sampleRows.push({
     seed,cz,consecutiveChunkSteps:32,treeVoxels:trackVoxels,
     densitySitesSkipped:trackDensity,fastNativeRunnerMs:+fastTiming.toFixed(2),
     unculledNativeRunnerMs:+oldTiming.toFixed(2),
     nativeTimingsNotIphoneFps:true
   });
  }
  assert.throws(()=>fast.save(),/cannot be saved as historical M7/);
  assert.throws(()=>reference.save(),/cannot be saved as historical M7/);
  const historical=new FourRegionWorld(seed,profile);
  assert.deepEqual(historical.save(),{schema:1,seed,edits:[]});
 }
 assert.equal(totals.chunks,288);
 assert.equal(totals.trackLengths.length,9);
 assert.ok(totals.voxels>2500,'real connected tracks must pass original tree-populated land');
 assert.ok(totals.densityCulled>=20,'must actually skip a meaningful number of biome lookups');
 assert.equal(totals.oldBiomeLookups-totals.newBiomeLookups,
   totals.densityCulled);
 assert.equal(totals.oldSourceReads,totals.newSourceReads);
 assert.ok(climateCounts.size>=2,'actual 32-chunk tracks must cross real V6 climate areas');
 assert.ok(totals.regionBorderVoxels>100);
 assert.ok(totals.connectedSeamFacePairs>0,
   'genuine chunk-adjacent tree voxels should remain face-connected');
 console.log('# ENCHANTED M7 288-CHUNK CLIMATE STREAM '+JSON.stringify({
   ...totals,climates:Object.fromEntries(climateCounts),sampleRows,
   identicalOrderedOriginalM7Voxels:true,
   experimentalSaveFailClosed:true,productionRendererNotInvoked:true,
   physicalIphone:false,pwaFpsUnmeasured:true
 }));
});
