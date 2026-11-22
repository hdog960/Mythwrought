import test from 'node:test';
import assert from 'node:assert/strict';
import {WORLD_MAX_Y} from '../../src/depth.mjs';
import {ENVIRONMENT_GROUND as G} from '../../src/environment-ground.mjs';
import {BLOCK,meshChunk,chunkCoord} from '../../src/voxel.mjs';
import {MAX_CHUNK_UPLOAD_BYTES,validateChunkUploadBytes} from '../../src/gpu-recovery.mjs';
import {FourRegionWorld,fourRegionProfile,
  M7_ENVIRONMENT_GENERATOR,M6_BALANCED_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {buildEnchantedTreeCandidate,enchantedTreeCandidateKind,
  ENCHANTED_TREE_CANDIDATE_KIND,ENCHANTED_TREE_MAX_CELLS,
  ENCHANTED_TREE_MAX_RADIUS} from '../../src/manual-biomes/enchanted-tree-candidates.mjs';
import {environmentalTreesForChunk} from '../../src/manual-biomes/environment-v7.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';

const seed=7919,profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
const key=(x,y,z)=>x+','+y+','+z;
const kinds=Object.values(ENCHANTED_TREE_CANDIDATE_KIND);

test('three physically distinct tall enchanted tree silhouettes obey Y19 and per-tree voxel budget',()=>{
  const all=[];
  for(const [roll,expected,floor] of [
    [.07,'ancient-giant',5],[.31,'starspire',6],[.82,'moonwillow',7]
  ]){
    assert.equal(enchantedTreeCandidateKind(roll),expected);
    const sample=buildEnchantedTreeCandidate(0,floor,0,roll);
    assert.equal(sample.species,expected);
    assert.ok(sample.cells.length>=40,'must have visible nontrivial canopy');
    assert.ok(sample.cells.length<=ENCHANTED_TREE_MAX_CELLS);
    assert.ok(sample.trunkHeight>=7,'taller shaft than original 5–6');
    assert.ok(sample.highestY<=WORLD_MAX_Y);
    assert.ok(sample.highestY-floor>=8,'should produce a genuine tall silhouette');
    assert.equal(new Set(sample.cells.map(([x,y,z])=>key(x,y,z))).size,sample.cells.length,
      'no duplicate sparse voxels');
    assert.ok(sample.cells.some(v=>v[3]===G.aetherBark));
    assert.ok(sample.cells.some(v=>v[3]===G.aetherLeaves||v[3]===G.moonLeaves));
    assert.ok(sample.cells.every(([x,y,z,id])=>
      y>floor&&y<=WORLD_MAX_Y&&Math.abs(x)<=ENCHANTED_TREE_MAX_RADIUS&&
      Math.abs(z)<=ENCHANTED_TREE_MAX_RADIUS&&
      [G.aetherBark,G.aetherLeaves,G.moonLeaves].includes(id)));
    all.push(sample);
  }
  assert.equal(all[0].footprint.length,4,'ancient old-growth trunk has four roots');
  assert.equal(all[1].footprint.length,1);
  assert.equal(all[2].footprint.length,1);
  assert.ok(all[0].cells.filter(v=>v[3]===G.aetherBark).length>
    all[1].cells.filter(v=>v[3]===G.aetherBark).length,
    'ancient giant has materially broader load-bearing trunk');
  assert.ok(all[2].cells.some(([x,y,z,id])=>
    (Math.abs(x)>=3||Math.abs(z)>=3)&&id===G.moonLeaves),
    'moonwillow must contain distinct drooping outer fronds');
  assert.deepEqual(buildEnchantedTreeCandidate(0,5,0,.07).cells,all[0].cells,
    'same-seed style candidate must be deterministic');
});
test('ceiling is hard-fail, never clipped, and invalid style or coordinates reject',()=>{
  for(const roll of [.07,.31,.82])
    assert.equal(buildEnchantedTreeCandidate(0,15,0,roll),null,
      'candidate must decline high terrain instead of dropping top leaves');
  for(const n of [-.01,1,NaN])
    assert.throws(()=>buildEnchantedTreeCandidate(0,2,0,n),/roll/);
  assert.throws(()=>buildEnchantedTreeCandidate(.5,4,0,.31),/integer/);
  assert.equal(WORLD_MAX_Y,19,'Phase2 must never increase engine ceiling');
});
test('M7 production/default remains non-experimental and other profiles reject opt-in',()=>{
  const old=new FourRegionWorld(seed,profile);
  const explicit=new FourRegionWorld(seed,profile,{experimentalEnchantedTrees:false});
  assert.equal(old.experimentalEnchantedTrees,false);
  assert.equal(explicit.experimentalEnchantedTrees,false);
  assert.deepEqual(old.save(),explicit.save());
  for(const [x,z] of [[-60,-568],[-24,-537],[0,-512],[64,-512]])
    for(let y=2;y<=WORLD_MAX_Y;y++)
      assert.equal(old.get(x,y,z),explicit.get(x,y,z),
        'historical default M7 must not silently opt into new shape');
  assert.throws(()=>new FourRegionWorld(seed,fourRegionProfile(seed,
    M6_BALANCED_GENERATOR),{experimentalEnchantedTrees:true}),/requires explicit M7/);
  assert.throws(()=>new FourRegionWorld(seed,profile,{experimentalEnchantedTrees:'on'}),/requires explicit M7/);
});
test('candidate is explicitly ephemeral: persisted M7 saves cannot silently change tree baseline',()=>{
  const candidate=new FourRegionWorld(seed,profile,{experimentalEnchantedTrees:true});
  assert.equal(candidate.experimentalEnchantedTrees,true);
  assert.equal(candidate.get(0,0,-512)>=0,true);
  assert.throws(()=>candidate.save(),/cannot be saved as historical M7/);
  assert.deepEqual(new FourRegionWorld(seed,profile).save(),{schema:1,seed,edits:[]});
});
test('candidate results are deterministic across original 16-block chunk boundaries',()=>{
  // Genuine sampled forest chunks straddling both negative and positive X,
  // including the Z=-512 boundary. Compare source reader and direct chunk
  // planner with the same actual M7 terrain/cave provenance readers.
  const world=new FourRegionWorld(seed,profile,{experimentalEnchantedTrees:true});
  const fresh=new FourRegionWorld(seed,profile,{experimentalEnchantedTrees:true});
  const checkChunks=[[-2,-33],[-1,-33],[0,-33],[-2,-32],[-1,-32],[0,-32]];
  let actualCandidateVoxels=0;
  for(const [cx,cz] of checkChunks){
    const cells=environmentalTreesForChunk(cx,cz,seed,
      (x,z)=>world._columnPlan(x,z),
      (x,y,z)=>world._columnPlan(x,z).get(y)??world._environmentBaseline(x,y,z),
      {experimentalEnchantedTrees:true});
    const duplicate=environmentalTreesForChunk(cx,cz,seed,
      (x,z)=>fresh._columnPlan(x,z),
      (x,y,z)=>fresh._columnPlan(x,z).get(y)??fresh._environmentBaseline(x,y,z),
      {experimentalEnchantedTrees:true});
    assert.deepEqual([...cells.entries()],[...duplicate.entries()],
      'same-seed candidate tree material exact parity at chunk seam');
    for(const [at,id] of cells){
      const [x,y,z]=at.split(',').map(Number);
      assert.equal(chunkCoord(x),cx);
      assert.equal(chunkCoord(z),cz);
      assert.ok(y>0&&y<=WORLD_MAX_Y);
      assert.ok([G.aetherBark,G.aetherLeaves,G.moonLeaves].includes(id));
      assert.equal(world.naturalAndLandmarkBlock(x,y,z),id,
        'actual original VoxelWorld source reader must expose candidate cell');
      actualCandidateVoxels++;
    }
  }
  assert.ok(actualCandidateVoxels>=50,
    'genuine sampled forest area should show more than a paper silhouette');
});
test('non-enchanted original climate tree chunks remain byte-identical under opt-in',()=>{
  const old=new FourRegionWorld(seed,profile);
  const opt=new FourRegionWorld(seed,profile,{experimentalEnchantedTrees:true});
  for(const [x,z] of [[0,512],[-512,0],[512,0],[0,0]]){
    assert.notEqual(v6BiomeAt(x,z,seed)?.name,'enchanted');
    const cx=chunkCoord(x),cz=chunkCoord(z);
    const a=environmentalTreesForChunk(cx,cz,seed,
      (u,v)=>old._columnPlan(u,v),
      (u,y,v)=>old._columnPlan(u,v).get(y)??old._environmentBaseline(u,y,v));
    const b=environmentalTreesForChunk(cx,cz,seed,
      (u,v)=>opt._columnPlan(u,v),
      (u,y,v)=>opt._columnPlan(u,v).get(y)??opt._environmentBaseline(u,y,v),
      {experimentalEnchantedTrees:true});
    assert.deepEqual([...a.entries()],[...b.entries()],
      'snow/mountain/desert/plain tree cells must not change');
  }
});

test('real original meshChunk upload for experimental tall silhouettes stays under unchanged GPU cap',()=>{
  const candidate=new FourRegionWorld(seed,profile,{experimentalEnchantedTrees:true});
  const legacy=new FourRegionWorld(seed,profile);
  const chunks=[[-2,-33],[-1,-33],[0,-33],[-2,-32],[-1,-32],[0,-32]];
  let baselineBytes=0,candidateBytes=0;
  for(const [cx,cz] of chunks){
    const a=meshChunk(legacy,cx,cz);
    const b=meshChunk(candidate,cx,cz);
    assert.ok(a instanceof Float32Array&&b instanceof Float32Array);
    assert.ok(a.length>0&&b.length>0,'real physical mesh cannot be empty');
    assert.ok(b.byteLength<=MAX_CHUNK_UPLOAD_BYTES,
      'candidate may not increase the real GPU upload bound');
    assert.doesNotThrow(()=>validateChunkUploadBytes(b));
    assert.ok(b.every(Number.isFinite),'mesh must contain finite native vertex data');
    baselineBytes+=a.byteLength;candidateBytes+=b.byteLength;
  }
  assert.ok(candidateBytes<baselineBytes*2.5,
    'prototype must avoid explosive GPU mesh growth');
  console.log('# ENCHANTED PHASE2 GPU '+JSON.stringify({
    seed,checkedChunks:chunks.length,baselineBytes,candidateBytes,
    ratio:+(candidateBytes/baselineBytes).toFixed(3),limit:MAX_CHUNK_UPLOAD_BYTES
  }));
});
test('mining ephemeral prototype canopy uses ordinary edits but never permits historical M7 save',()=>{
  const world=new FourRegionWorld(seed,profile,{experimentalEnchantedTrees:true});
  const chunks=[[-2,-33],[-1,-33],[0,-33],[-2,-32],[-1,-32],[0,-32]];
  let sample;
  for(const [cx,cz] of chunks){
    const trees=environmentalTreesForChunk(cx,cz,seed,
      (x,z)=>world._columnPlan(x,z),
      (x,y,z)=>world._columnPlan(x,z).get(y)??world._environmentBaseline(x,y,z),
      {experimentalEnchantedTrees:true});
    for(const [k,id] of trees)if([G.aetherLeaves,G.moonLeaves].includes(id)){
      const [x,y,z]=k.split(',').map(Number);
      if(world.get(x,y,z)===id){sample=[x,y,z,id];break;}
    }
    if(sample)break;
  }
  assert.ok(sample,'must inspect a genuinely generated mineable canopy');
  const [x,y,z,id]=sample;
  assert.equal(world.set(x,y,z,BLOCK.AIR),true);
  assert.equal(world.get(x,y,z),BLOCK.AIR,'mining must create a real temporary edit');
  assert.ok(world.edits.has(key(x,y,z)));
  assert.throws(()=>world.save(),/cannot be saved as historical M7/,
    'candidate cannot be serialized under the old generator identity');
  const historical=new FourRegionWorld(seed,profile);
  assert.doesNotThrow(()=>historical.save());
  assert.equal(historical.edits.size,0);
});
