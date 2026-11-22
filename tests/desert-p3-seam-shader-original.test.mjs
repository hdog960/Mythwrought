// Exact-source regression against PREVIOUS radius-three research checkpoint.
// Neither protected original terrain nor shared shader source is changed.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {performance} from 'node:perf_hooks';
import {meshChunk as candidateMesh} from '../src/voxel.mjs';
import {meshChunk as priorMesh} from '../../baseline/src/voxel.mjs';
import {FourRegionWorld as CandidateWorld,fourRegionProfile as candidateProfile,
 M7_ENVIRONMENT_GENERATOR as M7,M6_BALANCED_GENERATOR as M6}
  from '../src/manual-biomes/profile-world.mjs';
import {FourRegionWorld as PriorWorld,fourRegionProfile as priorProfile}
  from '../../baseline/src/manual-biomes/profile-world.mjs';
import {STORYBOOK_MATERIAL_FRAGMENT_SHADER} from '../src/storybook-materials.mjs';
import {withDesertSeamTextureBlend,ORIGINAL_DESERT_TERRAIN_SHADE}
  from '../src/manual-biomes/desert-seam-shader.mjs';
import {desertSeamBlendWeight,desertSeamPackedTerrainTag}
  from '../src/manual-biomes/desert-seam-vertex-tint.mjs';
const sites=[[179,-786,-1774],[2026,-2848,-774]];

test('shader replacement is exact, opt-in, and preserves all unrelated material paths',()=>{
 const input=STORYBOOK_MATERIAL_FRAGMENT_SHADER.replace(
  'in float vDistance;','in float vDistance; in float vPack2Alpha;');
 const next=withDesertSeamTextureBlend(input);
 assert.equal(input.split(ORIGINAL_DESERT_TERRAIN_SHADE).length,2);
 assert.equal(next.includes(ORIGINAL_DESERT_TERRAIN_SHADE),false);
 assert.equal(next.includes('if(vMat==40){'),true);
 assert.equal(next.includes('if(vPack2Alpha>0.001){'),true);
 assert.equal(next.includes('float stoneGrit=hashCell(floor(vUv*15.0)+42.0);'),true);
 assert.equal(next.includes('else if(vMat==42) shade=1.0+.06*sin(vUv.y*1.23+.82*sweep)+.085*(grit-.5);'),true);
 // Replace the ONE added shader region with the original line and compare
 // the entire rest of the fragment source byte-for-byte.
 const start=next.indexOf('if(vMat==40){'),end=next.indexOf('else if(vMat==41)');
 assert.ok(start>=0&&end>start);
 const reconstructed=next.slice(0,start)+ORIGINAL_DESERT_TERRAIN_SHADE+'\n    '+next.slice(end);
 assert.equal(reconstructed,input);
 const main=readFileSync(new URL('../src/main.mjs',import.meta.url),'utf8');
 assert.ok(main.includes('const FSTerrain=withDesertSeamTextureBlend(FS);'));
 assert.ok(main.includes('terrainVertex:VS,terrainFragment:FSTerrain,'));
 // Fail closed: unchanged fragments that lack original anchor cannot silently
 // swap or affect other source files, and shader must expose the existing
 // channel before injection is permitted.
 assert.throws(()=>withDesertSeamTextureBlend('in float vPack2Alpha;'));
 assert.throws(()=>withDesertSeamTextureBlend(STORYBOOK_MATERIAL_FRAGMENT_SHADER));
});

test('existing material40 fractional tag is bounded and leaves all other tags unchanged',()=>{
 for(const material of [0,1,20,23,40,41,42,43,257,401]){
  assert.equal(desertSeamPackedTerrainTag(material,0),material);
  if(material!==40)assert.equal(desertSeamPackedTerrainTag(material,.45),material);
 }
 for(const squared of [0,.5,1,3,4,8.99,9,Infinity]){
  const w=desertSeamBlendWeight(squared);
  assert.ok(w>=0&&w<=.64);
  const packed=desertSeamPackedTerrainTag(40,w);
  assert.equal(Math.floor(packed),40);
  assert.ok(packed<41);
 }
 assert.throws(()=>desertSeamPackedTerrainTag(40,.8));
});

test('authentic source M7 mesh stays byte-identical to prior RGB prototype except optional material40 fraction',()=>{
 let totalPacked=0;
 for(const [seed,x,z] of sites){
  const old=new PriorWorld(seed,priorProfile(seed,M7));
  const next=new CandidateWorld(seed,candidateProfile(seed,M7));
  const cx=Math.floor(x/16),cz=Math.floor(z/16);
  const start=performance.now(),a=priorMesh(old,cx,cz),priorMs=performance.now()-start;
  const start2=performance.now(),b=candidateMesh(next,cx,cz),candidateMs=performance.now()-start2;
  assert.equal(a.byteLength,b.byteLength);
  assert.equal(a.length%9,0);
  let tagged=0,maxWeight=0,unmodified=0;
  for(let i=0;i<a.length;i+=9){
   for(let offset=0;offset<8;offset++)
    assert.equal(a[i+offset],b[i+offset],
      'Original XYZ, RGB and UV are still identical; shading only changes artwork');
   const before=a[i+8],after=b[i+8];
   assert.equal(Math.floor(after+.001),Math.floor(before+.001),
     'Original integer art-material ID must never change');
   if(after!==before){
    tagged++;
    assert.equal(before,40,'Only natural Desert terrain material 40 gets a fraction');
    assert.ok(after>40&&after<=40.641);
    maxWeight=Math.max(maxWeight,after-40);
   }else unmodified++;
  }
  assert.ok(tagged>0,'One actual original Desert contact must receive a shader mix');
  totalPacked+=tagged;
  assert.deepEqual(next.save().edits,[]);
  assert.deepEqual(old.save().edits,[]);
  assert.ok(next.cachedBiomeColumns<=1024);
  console.log('DESERT_P3_SHADER_ORIGINAL_MESH '+JSON.stringify({
   seed,cx,cz,vertices:a.length/9,bytes:a.byteLength,tagged,unmodified,maxWeight,
   priorMeshMs:+priorMs.toFixed(3),candidateMeshMs:+candidateMs.toFixed(3),
   candidateCachedColumns:next.cachedBiomeColumns,
   iPhonePerformanceVerified:false
  }));
 }
 assert.ok(totalPacked>0);
});

test('older M6 world remains bit-identical and real player-edited source material stays untagged',()=>{
 const seed=179,cx=-50,cz=-111;
 const oldM6=new PriorWorld(seed,priorProfile(seed,M6));
 const newM6=new CandidateWorld(seed,candidateProfile(seed,M6));
 assert.deepEqual(candidateMesh(newM6,cx,cz),priorMesh(oldM6,cx,cz));
 const a=new PriorWorld(seed,priorProfile(seed,M7));
 const b=new CandidateWorld(seed,candidateProfile(seed,M7));
 const x=-786,y=4,z=-1775;
 assert.equal(a.get(x,y,z),258);
 assert.equal(b.get(x,y,z),258);
 assert.ok(a.set(x,y,z,257));assert.ok(b.set(x,y,z,257));
 assert.deepEqual(a.save().edits,b.save().edits);
 const am=priorMesh(a,cx,cz),bm=candidateMesh(b,cx,cz);
 assert.equal(am.length,bm.length);
 for(let i=0;i<am.length;i+=9){
  for(let j=0;j<8;j++)assert.equal(am[i+j],bm[i+j]);
  assert.equal(Math.floor(am[i+8]+.001),Math.floor(bm[i+8]+.001));
  if(bm[i+8]!==am[i+8])assert.equal(am[i+8],40);
  if(am[i]>=x&&am[i]<=x+1&&am[i+2]>=z&&am[i+2]<=z+1 &&
     Math.abs(am[i+1]-y)<=1.0&&am[i+8]===0)assert.equal(bm[i+8],0);
 }
 console.log('DESERT_P3_SHADER_SAVE '+JSON.stringify({
  seed,edit:[x,y,z,257],rows:b.save().edits.length,
  originalMeshBytes:am.byteLength,candidateMeshBytes:bm.byteLength,
  legacyM6Identical:true
 }));
});
