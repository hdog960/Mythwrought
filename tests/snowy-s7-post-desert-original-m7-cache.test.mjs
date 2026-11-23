// ORIGINAL post-Desert main release is checked out separately into
// production-readonly. This imports that genuine current M7 world; the S7
// cache candidate itself is detached and cannot change M7 generator/saves.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,
  restoreFourRegionWorld} from '../production-readonly/src/manual-biomes/profile-world.mjs';
import {terrainHeight,BLOCK} from '../production-readonly/src/voxel.mjs';
import {v6BiomeAt} from '../production-readonly/src/manual-biomes/v6-balanced-biomes.mjs';
import {createSnowS7MeshTintReview}
  from '../src/manual-biomes/snowy-s7-mesh-tint-source-cache.mjs';
import {previewSnowS6WinterTone}
  from '../src/manual-biomes/snowy-s6-winter-tone-proposal.mjs';

test('exact post-Desert M7 two-seed natural snow source is bounded to one climate lookup per snow column',()=>{
 for(const {seed,glacier,tileX,tileZ} of [
  {seed:179,glacier:[-144,8,528],tileX:-160,tileZ:512},
  {seed:2026,glacier:[-144,9,504],tileX:-160,tileZ:480}
 ]){
  const profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const world=new FourRegionWorld(seed,profile),initial=JSON.stringify(world.save());
  const [gx,gy,gz]=glacier;
  assert.equal(world.get(gx,gy,gz),276,'Authenticated original M7 glacier no longer matched');
  let climateCount=0;
  const deps={biomeAt:(x,z,s)=>{climateCount++;return v6BiomeAt(x,z,s)}};
  const cache=createSnowS7MeshTintReview(world,tileX/16,tileZ/16,deps);
  let approved=0,protectedColumns=0,physicalTop=0;
  for(let z=tileZ;z<tileZ+16;z++)for(let x=tileX;x<tileX+16;x++){
   const plan=world._columnPlan(x,z);
   let top=-Infinity;
   for(const y of plan.keys())top=Math.max(top,y);
   const id=plan.get(top);
   const candidate=cache.colorFor(x,top,z,id);
   // Repeated visible top faces MUST reuse the cache, not re-evaluate V6.
   for(let n=0;n<5;n++)
    assert.deepEqual(cache.colorFor(x,top,z,id),candidate);
   physicalTop++;
   if(candidate){
    approved++;
    assert.ok([272,276,279].includes(id));
    assert.equal(world.get(x,top,z),id);
    assert.equal(world.edits.has(x+','+top+','+z),false);
    assert.equal(world.environmentCaves.get(x,top,z),undefined);
    assert.deepEqual(candidate,previewSnowS6WinterTone(seed,x,z,id,
      v6BiomeAt(x,z,seed).weight).proposedLinearRgb);
   }else protectedColumns++;
  }
  const stats=cache.stats();
  assert.equal(stats.requests,256*6);
  assert.ok(stats.misses<=256);
  assert.equal(stats.cachedColumns,stats.misses);
  assert.equal(stats.climateReads,climateCount);
  assert.ok(stats.climateReads<=stats.misses);
  assert.ok(approved>0,'Authentic original snow interior did not contain tintable snow');
  assert.equal(approved+protectedColumns,256);
  assert.equal(world.edits.size,0);
  assert.equal(JSON.stringify(world.save()),initial);
  // Negative-owner seam is absolutely identical when queried in two distinct
  // one-cell halo caches (no per-chunk hash or edge color discontinuity).
  const bx=Math.floor(gx/16),bz=Math.floor(gz/16);
  const left=createSnowS7MeshTintReview(world,bx-1,bz,
    {biomeAt:v6BiomeAt},{halo:1});
  const right=createSnowS7MeshTintReview(world,bx,bz,
    {biomeAt:v6BiomeAt},{halo:1});
  const ca=left.colorFor(gx,gy,gz,276),cb=right.colorFor(gx,gy,gz,276);
  assert.ok(ca,'Original authenticated glacier failed S7 physical eligibility');
  assert.deepEqual(ca,cb,'Original owner halo seam must be exact');
  // Both seeds retain protected original grass at this same known source
  // location from the original S4 authenticated grass census.
  const grassX=-104,grassZ=360,grassY=terrainHeight(grassX,grassZ,seed);
  assert.equal(world.get(grassX,grassY,grassZ),BLOCK.GRASS);
  const grassCache=createSnowS7MeshTintReview(world,
    Math.floor(grassX/16),Math.floor(grassZ/16),{biomeAt:v6BiomeAt});
  assert.equal(grassCache.colorFor(grassX,grassY,grassZ,BLOCK.GRASS),
    undefined,'Historical protected original green grass cannot be tinted');
  assert.equal(grassCache.stats().climateReads,0);
  assert.equal(JSON.stringify(world.save()),initial);
  assert.deepEqual(restoreFourRegionWorld(world.save(),profile).save(),world.save());
  console.log('SNOW_S7_POST_DESERT_ORIGINAL_M7_CACHED_TINT '+JSON.stringify({
   seed,sourceGlacier:glacier,sourceChunk:[tileX/16,tileZ/16],
   originalColumns:256,approved,protected:protectedColumns,
   climateEvaluations:climateCount,sourcePlanReads:stats.planReads,
   totalColorRequests:stats.requests,
   avoidedRepeatClimateEvaluations:stats.requests-stats.climateReads,
   savedWorldUnmodified:true,legacyGrassUntouched:true,
   originalHaloSeamEqual:true,unregisteredProfile:true
  }));
 }
});
test('current Desert main keeps plains, desert and mountain source columns out of S7 tint',()=>{
 const seed=179,profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
  world=new FourRegionWorld(seed,profile),before=JSON.stringify(world.save());
 const regions=new Map();
 for(let z=-320;z<=640;z+=64){
  for(let x=-320;x<=640;x+=64){
   const climate=v6BiomeAt(x,z,seed),name=climate?.name??'plains';
   if(!regions.has(name))regions.set(name,[x,z]);
  }
 }
 for(const name of ['desert','mountain','plains']){
  assert.ok(regions.has(name),'Original Desert main cannot locate '+name);
  const [x,z]=regions.get(name),p=world._columnPlan(x,z);
  let top=-Infinity;for(const y of p.keys())top=Math.max(top,y);
  const id=p.get(top);
  const t=createSnowS7MeshTintReview(world,Math.floor(x/16),Math.floor(z/16),
    {biomeAt:v6BiomeAt});
  assert.equal(t.colorFor(x,top,z,id),undefined,name);
  console.log('SNOW_S7_PROTECTED_NON_SNOW '+JSON.stringify({name,x,z,
   originalPhysicalCap:id,sourceTop:top,
   noWinterColor:true,editsUnchanged:world.edits.size===0}));
 }
 assert.equal(JSON.stringify(world.save()),before);
});
