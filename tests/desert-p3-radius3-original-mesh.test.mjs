// New focused ORIGINAL M7 source work, never a synthetic world mock.
// CI checks out protected exact source as ../baseline separately.
import test from 'node:test';
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {meshChunk as meshCandidate} from '../src/voxel.mjs';
import {meshChunk as meshOriginal} from '../../baseline/src/voxel.mjs';
import {FourRegionWorld as CandidateWorld,fourRegionProfile as candidateProfile,
  M7_ENVIRONMENT_GENERATOR as M7,M6_BALANCED_GENERATOR as M6}
  from '../src/manual-biomes/profile-world.mjs';
import {FourRegionWorld as OriginalWorld,fourRegionProfile as originalProfile}
  from '../../baseline/src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {nearestNaturalScreeSquared,desertSeamVertexTint,canBlendNaturalDesertSurface,
  DESERT_SEAM_RADIUS} from '../src/manual-biomes/desert-seam-vertex-tint.mjs';
const sites=[[179,-786,-1774],[2026,-2848,-774]];
function compareMesh(a,b){
 assert.equal(a.length,b.length,'No extra original-engine vertices');
 assert.equal(a.length%9,0);
 let recolored=0,maxDelta=0;
 for(let p=0;p<a.length;p+=9){
  for(const field of [0,1,2,6,7,8])
   assert.equal(a[p+field],b[p+field],'XYZ, UV and source material must be byte-identical');
  for(const field of [3,4,5]){
   const delta=Math.abs(a[p+field]-b[p+field]);
   maxDelta=Math.max(maxDelta,delta);
  }
  if(a[p+3]!==b[p+3]||a[p+4]!==b[p+4]||a[p+5]!==b[p+5]){
   recolored++;
   assert.equal(a[p+8],40,'Only existing original Desert terrain art material can be tinted');
  }
 }
 assert.ok(maxDelta<=.25,'Source tint must stay in modest color envelope');
 return {recolored,maxDelta,vertices:a.length/9,bytes:a.byteLength};
}

test('deterministic 3-block vertex-space gradient is smooth, seam-continuous and bounded',()=>{
 const f=(x,z)=>x===0&&z===0;
 const a=nearestNaturalScreeSquared(0,0,4,f);
 const b=nearestNaturalScreeSquared(0,0,4,f);
 assert.equal(a,b);assert.equal(a,.5);
 const natural=[.55,.4,.26];
 const close=desertSeamVertexTint(natural,a);
 const farther=desertSeamVertexTint(natural,(DESERT_SEAM_RADIUS-0.01)**2);
 assert.ok(close[2]>farther[2]&&farther[2]>natural[2]);
 assert.strictEqual(desertSeamVertexTint(natural,DESERT_SEAM_RADIUS**2),natural);
 assert.strictEqual(desertSeamVertexTint(natural,Infinity),natural);
 assert.deepEqual(desertSeamVertexTint(natural,a),close);
});

test('authentic M7 original and candidate meshing changes RGB only, bounds bytes and records build costs',()=>{
 let totalRecolored=0;
 for(const [seed,x,z] of sites){
  const o=new OriginalWorld(seed,originalProfile(seed,M7));
  const c=new CandidateWorld(seed,candidateProfile(seed,M7));
  const cx=Math.floor(x/16),cz=Math.floor(z/16);
  const aStart=performance.now(),a=meshOriginal(o,cx,cz),aMs=performance.now()-aStart;
  const bStart=performance.now(),b=meshCandidate(c,cx,cz),bMs=performance.now()-bStart;
  const metrics=compareMesh(a,b);
  totalRecolored+=metrics.recolored;
  assert.equal(metrics.bytes,a.byteLength);
  assert.deepEqual(o.save().edits,[]);
  assert.deepEqual(c.save().edits,[]);
  assert.ok(c.cachedBiomeColumns<=1024,'Original bounded source cache preserved');
  console.log('DESERT_P3_RADIUS3_MESH '+JSON.stringify({
   seed,cx,cz,...metrics,originalMeshMs:+aMs.toFixed(3),
   candidateMeshMs:+bMs.toFixed(3),originalCachedColumns:o.cachedBiomeColumns,
   candidateCachedColumns:c.cachedBiomeColumns,
   note:'CI CPU timings are NOT iPhone frame-time measurements'
  }));
 }
 assert.ok(totalRecolored>0,'Genuine original M7 edge must produce visible RGB differences');
});

test('real original source cave/landmark vetoes, underground layers and edited caps fail closed',()=>{
 const [seed,x,z]=sites[0];
 const world=new CandidateWorld(seed,candidateProfile(seed,M7));
 const plan=world._columnPlan(x-1,z-1);
 assert.ok(plan.size);
 const top=Math.max(...plan.keys());
 const climate=v6BiomeAt(x-1,z-1,seed);
 // A genuine surface-cap admission requires the actual last source plan row.
 const actual={id:plan.get(top),top};
 const target={id:actual.id,edited:false,region:climate,sourceSurface:actual,y:top};
 assert.equal(canBlendNaturalDesertSurface(target),actual.id===258&&
  climate?.name==='desert'&&climate.weight<=.5);
 assert.equal(canBlendNaturalDesertSurface({...target,edited:true}),false);
 assert.equal(canBlendNaturalDesertSurface({...target,y:top-1}),false);
 assert.equal(canBlendNaturalDesertSurface({...target,sourceSurface:null}),false);
 assert.equal(canBlendNaturalDesertSurface({...target,id:401}),false);
 let protectedVeto=0,protectedDesertVeto=0;
 for(let dz=-16;dz<=16;dz++)for(let dx=-16;dx<=16;dx++){
  const sx=x+dx,sz=z+dz,biome=v6BiomeAt(sx,sz,seed);
  const guarded=world._columnPlan(sx,sz);
  if(guarded.size)continue;
  protectedVeto++;
  if(biome?.name==='desert')protectedDesertVeto++;
  assert.equal(canBlendNaturalDesertSurface({
   id:258,edited:false,region:biome,sourceSurface:null,y:0
  }),false);
 }
 assert.ok(protectedVeto>0,'Authentic original M7 protected cells exist in sampled original-world window');
 // This particular window has protected non-Desert columns. Never invent
 // a protected Desert hit, and never relax the negative admission contract.
 const editedX=-786,editedZ=-1775;
 const natural=world._columnPlan(editedX,editedZ);
 assert.ok(natural.size,'Actual original selected source column must be eligible');
 const editedY=Math.max(...natural.keys());
 assert.equal(natural.get(editedY),258,'Actual source witness must be hardpan 258');
 const baseline=new OriginalWorld(seed,originalProfile(seed,M7));
 assert.ok(world.set(editedX,editedY,editedZ,257),'Actual M7 player edit must persist');
 assert.ok(baseline.set(editedX,editedY,editedZ,257),'Exact protected baseline must take matching edit');
 assert.equal(world.get(editedX,editedY,editedZ),257);
 assert.deepEqual(world.save().edits,baseline.save().edits);
 const editCandidate=meshCandidate(world,Math.floor(editedX/16),Math.floor(editedZ/16));
 const editOriginal=meshOriginal(baseline,Math.floor(editedX/16),Math.floor(editedZ/16));
 compareMesh(editOriginal,editCandidate);
 assert.equal(canBlendNaturalDesertSurface({
  id:258,edited:true,region:v6BiomeAt(editedX,editedZ,seed),
  sourceSurface:{id:258,top:editedY},y:editedY
 }),false);
 console.log('DESERT_P3_RADIUS3_PROTECTED '+JSON.stringify({
  seed,protectedVeto,protectedDesertVeto,editedWitness:[editedX,editedY,editedZ],
  preservedSaveRows:world.save().edits.length
 }));
});

test('unchanged original M6 generator gets byte-exact source mesh',()=>{
 const seed=179,cx=-50,cz=-111;
 const old=new OriginalWorld(seed,originalProfile(seed,M6));
 const candidate=new CandidateWorld(seed,candidateProfile(seed,M6));
 const a=meshOriginal(old,cx,cz),b=meshCandidate(candidate,cx,cz);
 assert.deepEqual(b,a);
 assert.deepEqual(candidate.save().edits,[]);
 console.log('DESERT_P3_RADIUS3_LEGACY '+JSON.stringify({seed,cx,cz,bytes:a.byteLength,identical:true}));
});
