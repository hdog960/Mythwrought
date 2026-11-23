// MYTHWROUGHT Desert Phase 3 — exact accepted-gameplay negative-climate
// full-mesh byte parity, not just a shallow color-admission predicate.
// The other checked-out source is authentic immutable accepted gameplay
// commit 2bd0395d3ef163e9fdc491ab5119b1ee80844194.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld as OriginalWorld,fourRegionProfile as originalProfile,
 M7_ENVIRONMENT_GENERATOR as M7} from '../../accepted/src/manual-biomes/profile-world.mjs';
import {FourRegionWorld as ResearchWorld,fourRegionProfile as researchProfile}
 from '../src/manual-biomes/profile-world.mjs';
import {meshChunk as originalMesh,chunkCoord as originalChunkCoord}
 from '../../accepted/src/voxel.mjs';
import {meshChunk as researchMesh,chunkCoord} from '../src/voxel.mjs';
import {v6BiomeAt as oldBiome} from '../../accepted/src/manual-biomes/v6-balanced-biomes.mjs';
import {v6BiomeAt as newBiome} from '../src/manual-biomes/v6-balanced-biomes.mjs';

const SITES=[
 {name:'snow',seed:179,x:128,z:-2304,expected:'snow'},
 {name:'enchanted',seed:179,x:-1536,z:-2304,expected:'enchanted'},
 {name:'plains',seed:179,x:-2304,z:-2304,expected:'plains'},
 {name:'mountain-high-weight',seed:179,x:512,z:-2304,expected:'mountain'},
 {name:'original-verified-cave-entrance',seed:179,x:40,z:64,expected:null}
];
test('authentic accepted gameplay and Desert candidate have identical 9-float meshes in distant unrelated climates and cave entrance',()=>{
 const report=[];
 let verifiedVertices=0,verifiedBytes=0,protectedColumns=0;
 for(const site of SITES){
  const a=new OriginalWorld(site.seed,originalProfile(site.seed,M7));
  const b=new ResearchWorld(site.seed,researchProfile(site.seed,M7));
  const originalRegion=oldBiome(site.x,site.z,site.seed);
  const candidateRegion=newBiome(site.x,site.z,site.seed);
  assert.deepEqual(candidateRegion,originalRegion,'Original biome region and weight must be unchanged');
  if(site.expected){
   assert.equal(candidateRegion?.name??'plains',site.expected);
   if(site.expected==='mountain')assert.ok(candidateRegion.weight>.8);
  }
  const chunks=[];
  const cx=chunkCoord(site.x),cz=chunkCoord(site.z);
  assert.equal(cx,originalChunkCoord(site.x));
  assert.equal(cz,originalChunkCoord(site.z));
  // Actual original and candidate terrain source, two contiguous chunks
  // per region. Checks EVERY RGB, XYZ, UV and material Float32 field.
  for(const [dx,dz] of [[0,0],[1,0]]){
   const x=cx+dx,z=cz+dz;
   const before=originalMesh(a,x,z),after=researchMesh(b,x,z);
   assert.equal(after.byteLength,before.byteLength,
    'Candidate must not allocate extra GPU vertex bytes in unrelated climates');
   let difference=0;
   for(let i=0;i<before.length;i++)if(before[i]!==after[i])difference++;
   assert.equal(difference,0,JSON.stringify({
    name:site.name,chunk:[x,z],fields:before.length,differences:difference
   }));
   assert.deepEqual(after,before,'Every actual generated-world vertex field must match accepted source');
   verifiedVertices+=before.length/9;
   verifiedBytes+=before.byteLength;
   chunks.push({chunk:[x,z],vertices:before.length/9,bytes:before.byteLength});
  }
  const p=a._columnPlan(site.x,site.z),q=b._columnPlan(site.x,site.z);
  assert.deepEqual(q,p);
  if(!p.size)protectedColumns++;
  assert.deepEqual(a.save().edits,[]);
  assert.deepEqual(b.save().edits,[]);
  assert.ok(a.cachedBiomeColumns<=1024&&b.cachedBiomeColumns<=1024);
  report.push({name:site.name,seed:site.seed,source:[site.x,site.z],
   region:candidateRegion?.name??'plains',chunks});
 }
 assert.ok(verifiedVertices>0);
 console.log('DESERT_P3_ACCEPTED_ORIGINAL_NO_TOUCH_MESH '+JSON.stringify({
  originalAccepted:'2bd0395d3ef163e9fdc491ab5119b1ee80844194',
  actualChunks:10,siteCount:SITES.length,verifiedVertices,verifiedBytes,
  protectedColumnsAtCenters:protectedColumns,allNineFloatsIdentical:true,
  sites:report
 }));
});
