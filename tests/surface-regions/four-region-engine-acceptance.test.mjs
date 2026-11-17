import assert from 'node:assert/strict';
import {test} from 'node:test';
import {VoxelWorld,terrainHeight,meshChunk,chunkCoord} from '../../src/voxel.mjs';
import {WORLD_MAX_Y} from '../../src/depth.mjs';
import {SURFACE_BIOME_REGIONS,surfaceBiomeHeight,createSurfaceBiomeWorldView} from '../../src/surface-regions/regions.mjs';

// Candidate engine-level acceptance: real world reader + chunk mesher, not a
// screenshot, player controller, save-profile migration, or physical iPhone.
test('all four regions simultaneously compose solid, headroom-clear traversable columns on three seeds',()=>{
 for(const seed of [179,7,2201]){
  const world=new VoxelWorld(seed);
  const before=JSON.stringify(world.save());
  const view=createSurfaceBiomeWorldView(world,{
   enabled:true,profileIsFresh:true,maxCachedColumns:128,
   isProtected:()=>false,hasDurableEditIntent:()=>false
  });
  assert.ok(view);
  for(const region of SURFACE_BIOME_REGIONS){
   let tested=0;
   for(const dx of [-32,-16,0,16,32]){
    for(const dz of [-32,-16,0,16,32]){
     const x=region.x+dx,z=region.z+dz;
     const old=terrainHeight(x,z,seed);
     const top=Math.max(old,surfaceBiomeHeight(x,z,seed));
     assert.ok(top+2<=WORLD_MAX_Y,region.name+' requires headroom');
     assert.equal(view.get(x,top,z),region.surface,region.name+' solid top');
     assert.equal(view.get(x,top+1,z),0,region.name+' clear first headroom');
     assert.equal(view.get(x,top+2,z),0,region.name+' clear second headroom');
     assert.notEqual(view.get(x,top-1,z),0,region.name+' supported top');
     assert.equal(view.get(x,old-8,z),world.get(x,old-8,z),
       region.name+' must preserve deep legacy ground');
     tested++;
    }
   }
   assert.equal(tested,25);
  }
  assert.ok(view.cachedColumns<=128,'bounded world-view cache');
  assert.equal(JSON.stringify(world.save()),before,'view must never mutate saves');
 }
});

test('actual chunk mesher accepts neighboring biome chunks without save mutation',()=>{
 const seed=179,world=new VoxelWorld(seed),before=JSON.stringify(world.save());
 const view=createSurfaceBiomeWorldView(world,{
  enabled:true,profileIsFresh:true,maxCachedColumns:512,
  isProtected:()=>false,hasDurableEditIntent:()=>false
 });
 assert.ok(view);
 for(const region of SURFACE_BIOME_REGIONS){
  const cx=chunkCoord(region.x),cz=chunkCoord(region.z);
  assert.ok(meshChunk(view,cx,cz),region.name+' center chunk');
  assert.ok(meshChunk(view,cx+1,cz),region.name+' neighboring chunk');
 }
 assert.equal(JSON.stringify(world.save()),before);
 assert.ok(view.cachedColumns<=512);
});
