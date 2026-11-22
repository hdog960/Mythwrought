// Genuine isolated Moonwillow art/performance gate. A wide-but-solid
// full-cube curtain can cost MORE GPU faces, even if its voxel count falls.
// Measure BOTH the actual six-neighbor physical Moonwillow source topology
// and original M7 meshChunk GPU bytes. No fake renderer or iPhone FPS claim.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildEnchantedTreeCandidate,ENCHANTED_TREE_CANDIDATE_KIND}
  from '../../src/manual-biomes/enchanted-tree-candidates.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {meshChunk} from '../../src/voxel.mjs';
import {MAX_CHUNK_UPLOAD_BYTES,validateChunkUploadBytes}
  from '../../src/gpu-recovery.mjs';

const coord=(x,y,z)=>x+','+y+','+z;
const six=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];

test('staggered five-style Moonwillow exposes fewer real cube faces than previous solid curtain',()=>{
  const results=[];
  for(const roll of [.63,.75,.8,.82,.99]){
    const tree=buildEnchantedTreeCandidate(0,3,0,roll);
    assert.equal(tree.species,ENCHANTED_TREE_CANDIDATE_KIND.MOONWILLOW);
    const positions=new Set(tree.cells.map(([x,y,z])=>coord(x,y,z)));
    let exposedFaces=0;
    for(const [x,y,z] of tree.cells)
      for(const [dx,dy,dz] of six)
        if(!positions.has(coord(x+dx,y+dy,z+dz)))exposedFaces++;
    // The pre-revision umbrella was source-authored at 292-296 exposed
    // external full-cube faces for exactly these deterministic style rolls.
    // Require a meaningful improvement, not just a smaller voxel count.
    assert.ok(exposedFaces<=276,
      'Moonwillow exposed-face reduction must survive its own crown topology');
    assert.ok(tree.cells.length<=115,
      'reduce candidate memory and GC load without eliminating all drapes');
    results.push({roll,authoredVoxels:tree.cells.length,exposedFaces,
      previousUmbrellaExposedFaces:roll<.81?292:296});
  }
  console.log('# ENCHANTED MOONWILLOW SOURCE EXPOSED FACE AUDIT '+
    JSON.stringify({results,renderGeometryNotIphoneFps:true}));
});

test('real original native mesher has fewer experimental six-chunk GPU bytes than last verified umbrella',()=>{
  const seed=7919,profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const old=new FourRegionWorld(seed,profile);
  const experimental=new FourRegionWorld(seed,profile,{experimentalEnchantedTrees:true});
  const chunks=[[-2,-33],[-1,-33],[0,-33],[-2,-32],[-1,-32],[0,-32]];
  let historicalBytes=0,candidateBytes=0;
  for(const [cx,cz] of chunks){
    const historicalMesh=meshChunk(old,cx,cz);
    const candidateMesh=meshChunk(experimental,cx,cz);
    assert.ok(historicalMesh instanceof Float32Array);
    assert.ok(candidateMesh instanceof Float32Array);
    assert.ok(candidateMesh.length>0);
    assert.doesNotThrow(()=>validateChunkUploadBytes(candidateMesh));
    assert.ok(candidateMesh.byteLength<=MAX_CHUNK_UPLOAD_BYTES);
    assert.ok(candidateMesh.every(Number.isFinite));
    historicalBytes+=historicalMesh.byteLength;
    candidateBytes+=candidateMesh.byteLength;
  }
  // Last exact-source umbrella, 2026-11-22 #45055218381:
  // 963360 historical vs 1060344 experimental native GPU bytes.
  const previousCandidateBytes=1060344;
  assert.equal(historicalBytes,963360,'no change allowed to authentic historical M7 mesher');
  assert.ok(candidateBytes<previousCandidateBytes,
    'source change must actually reduce exposed original M7 GPU mesh bytes');
  assert.throws(()=>experimental.save(),/cannot be saved as historical M7/);
  assert.deepEqual(old.save(),{schema:1,seed,edits:[]});
  console.log('# ENCHANTED MOONWILLOW REAL SIX CHUNK GPU FACE BUDGET '+
    JSON.stringify({seed,checkedChunks:chunks.length,historicalBytes,
      candidateBytes,previousCandidateBytes,
      savedNativeBytes:previousCandidateBytes-candidateBytes,
      gpuLimitPerChunk:MAX_CHUNK_UPLOAD_BYTES,physicalIphone:false}));
});
