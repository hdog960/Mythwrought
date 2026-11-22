// Authentic original MYTHWROUGHT bilateral Desert surface color experiment.
// Baseline is exact RGB-only V7 research SHA f976... in ../baseline.
// Never run broad native / Chromium suites when this focused test is adequate.
import assert from 'node:assert/strict';
import test from 'node:test';
import {performance} from 'node:perf_hooks';
import {readFileSync} from 'node:fs';
import {meshChunk as experimentalMesh} from '../src/voxel.mjs';
import {meshChunk as originalRgbMesh} from '../../baseline/src/voxel.mjs';
import {FourRegionWorld as NewWorld,fourRegionProfile as newProfile,
 M7_ENVIRONMENT_GENERATOR as M7,M6_BALANCED_GENERATOR as M6}
 from '../src/manual-biomes/profile-world.mjs';
import {FourRegionWorld as OldWorld,fourRegionProfile as oldProfile}
 from '../../baseline/src/manual-biomes/profile-world.mjs';
import {nearestDesertHardpanSquared,canWarmSourceScree,
 canUseDesertHardpanCue,warmScreeVertexColor,SCREE_DESERT_MAX_WARMTH}
 from '../src/manual-biomes/desert-bilateral-rgb.mjs';
const locations=[[179,-786,-1774],[2026,-2848,-774]];
function compareOriginalChunk(before,after,{requireWarm=false}={}){
 assert.equal(before.length,after.length,'No new vertices allowed');
 assert.equal(before.byteLength,after.byteLength,'Original nine-float GPU buffer byte count unchanged');
 let warmScreeVertices=0,unmodified=0,maxRgbDelta=0;
 for(let i=0;i<before.length;i+=9){
  for(const j of [0,1,2,6,7,8])
    assert.equal(after[i+j],before[i+j],'Original XYZ UV and integer material must be exact');
  const diff=Math.max(...[3,4,5].map(j=>Math.abs(after[i+j]-before[i+j])));
  if(diff>0){
   assert.equal(before[i+8],42,'Only existing scree material42 may receive new RGB');
   warmScreeVertices++;
   maxRgbDelta=Math.max(maxRgbDelta,diff);
   assert.ok(diff<.18,'Bound the warm scree source RGB amplitude');
  }else unmodified++;
 }
 if(requireWarm)assert.ok(warmScreeVertices>0,'A genuine M7 site must include a warmed scree face');
 return {vertices:before.length/9,bytes:before.byteLength,
  warmScreeVertices,unmodified,maxRgbDelta};
}
test('rejected shader code is completely inactive; original M7 visual pipeline restored',()=>{
 const oldMain=readFileSync(new URL('../../baseline/src/main.mjs',import.meta.url),'utf8');
 const nextMain=readFileSync(new URL('../src/main.mjs',import.meta.url),'utf8');
 const oldShader=readFileSync(new URL('../../baseline/src/storybook-materials.mjs',import.meta.url),'utf8');
 const nextShader=readFileSync(new URL('../src/storybook-materials.mjs',import.meta.url),'utf8');
 assert.equal(nextMain,oldMain,'The entire original shader pipeline stays byte identical');
 assert.equal(nextShader,oldShader);
 assert.equal(nextMain.includes('withDesertSeamTextureBlend'),false);
});

test('pure bilateral warmth only admits eligible original scree, mountain-facing Desert contact and safe distance',()=>{
 const target={id:401,edited:false,region:{name:'mountain',weight:.4},
  sourceSurface:{top:7,id:401},y:7};
 assert.equal(canWarmSourceScree(target),true);
 for(const bad of [
  {...target,edited:true},{...target,id:400},{...target,sourceSurface:null},
  {...target,sourceSurface:{top:6,id:401}},
  {...target,region:{name:'snow',weight:0}},
  {...target,region:{name:'enchanted',weight:0}},
  {...target,region:{name:'mountain',weight:.9}},
  {...target,region:{name:'plains',weight:0}}
 ])assert.equal(canWarmSourceScree(bad),false);
 const desert={sourceSurface:{top:4,id:258},region:{name:'desert',weight:.3},
  edited:false,actualId:258,atY:4,sampleY:4};
 assert.equal(canUseDesertHardpanCue(desert),true);
 for(const bad of [
  {...desert,edited:true},{...desert,actualId:257},
  {...desert,region:{name:'plains',weight:0}},
  {...desert,region:{name:'desert',weight:.8}},
  {...desert,sourceSurface:null},
  {...desert,sampleY:8}
 ])assert.equal(canUseDesertHardpanCue(bad),false);
 const c=[.46,.43,.40],near=warmScreeVertexColor(c,.5);
 const far=warmScreeVertexColor(c,8.5);
 assert.ok(near[0]>far[0]&&far[0]>c[0]);
 assert.strictEqual(warmScreeVertexColor(c,Infinity),c);
 assert.strictEqual(warmScreeVertexColor(c,9),c);
 assert.ok(SCREE_DESERT_MAX_WARMTH<=.6);
 const probe=(x,z)=>x===0&&z===0;
 assert.equal(nearestDesertHardpanSquared(0,0,4,probe),.5);
 assert.equal(nearestDesertHardpanSquared(0,0,4,probe),.5);
});

test('authentic original V7 two-junction meshes preserve every non-RGB field and existing Desert-side color',()=>{
 let warmTotal=0;
 for(const [seed,x,z] of locations){
  const oldWorld=new OldWorld(seed,oldProfile(seed,M7));
  const newWorld=new NewWorld(seed,newProfile(seed,M7));
  const cx=Math.floor(x/16),cz=Math.floor(z/16);
  const b0=performance.now(),old=originalRgbMesh(oldWorld,cx,cz),baseMs=performance.now()-b0;
  const b1=performance.now(),next=experimentalMesh(newWorld,cx,cz),newMs=performance.now()-b1;
  const metrics=compareOriginalChunk(old,next,{requireWarm:true});
  warmTotal+=metrics.warmScreeVertices;
  assert.deepEqual(oldWorld.save().edits,[]);
  assert.deepEqual(newWorld.save().edits,[]);
  assert.ok(newWorld.cachedBiomeColumns<=1024);
  console.log('DESERT_P3_BILATERAL_ORIGINAL_MESH '+JSON.stringify({
   seed,cx,cz,...metrics,baseSourceMs:+baseMs.toFixed(3),
   candidateSourceMs:+newMs.toFixed(3),
   baseCachedColumns:oldWorld.cachedBiomeColumns,
   candidateCachedColumns:newWorld.cachedBiomeColumns,
   note:'One CI Node22 source measurement, NOT physical iPhone FPS'
  }));
 }
 assert.ok(warmTotal>0);
});

test('genuine previous-world M6 meshes identical and real M7 edits preserve rows, original shapes and IDs',()=>{
 const seed=179,cx=-50,cz=-111;
 const oM6=new OldWorld(seed,oldProfile(seed,M6));
 const nM6=new NewWorld(seed,newProfile(seed,M6));
 assert.deepEqual(experimentalMesh(nM6,cx,cz),originalRgbMesh(oM6,cx,cz));
 const o=new OldWorld(seed,oldProfile(seed,M7));
 const n=new NewWorld(seed,newProfile(seed,M7));
 const edits=[[-786,4,-1774,400],[-786,4,-1775,257]];
 for(const [x,y,z,id] of edits){
  assert.equal(o.get(x,y,z),id===400?401:258);
  assert.equal(n.get(x,y,z),id===400?401:258);
  assert.ok(o.set(x,y,z,id));
  assert.ok(n.set(x,y,z,id));
  assert.equal(n.get(x,y,z),id);
 }
 assert.deepEqual(n.save().edits,o.save().edits);
 const a=originalRgbMesh(o,cx,cz),b=experimentalMesh(n,cx,cz);
 const metrics=compareOriginalChunk(a,b);
 assert.deepEqual(n.save().edits,o.save().edits);
 assert.equal(n.save().edits.length,2);
 console.log('DESERT_P3_BILATERAL_SAVED_EDIT '+JSON.stringify({
  seed,edits,saveRows:n.save().edits.length,...metrics,legacyM6BytesIdentical:true
 }));
});
