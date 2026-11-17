import assert from 'node:assert/strict';
import {test} from 'node:test';
import {VoxelWorld,terrainHeight} from '../../src/voxel.mjs';
import {surfaceBiomeHeight,createSurfaceBiomeWorldView,SURFACE_BIOME_REGIONS} from '../../src/surface-regions/regions.mjs';

// Safety acceptance for a *candidate* read-only view, not production save wiring.
test('post-cache player excavation wins over every biome overlay and survives schema-1 restore',()=>{
 const seed=179,world=new VoxelWorld(seed),history=new Set();
 const view=createSurfaceBiomeWorldView(world,{
  enabled:true,profileIsFresh:true,maxCachedColumns:64,
  isProtected:()=>false,
  hasDurableEditIntent:(x,y,z)=>history.has(x+','+y+','+z)
 });
 assert.ok(view);
 for(const region of SURFACE_BIOME_REGIONS){
  const x=region.x,z=region.z;
  const top=Math.max(terrainHeight(x,z,seed),surfaceBiomeHeight(x,z,seed));
  assert.equal(view.get(x,top,z),region.surface,region.name+' initial surface');
  const key=x+','+top+','+z;
  assert.equal(world.set(x,top,z,0),true);
  history.add(key);
  assert.equal(view.get(x,top,z),0,region.name+' excavation is authoritative');
  assert.equal(view.get(x,top+1,z),world.get(x,top+1,z));
  assert.equal(view.get(x,top-1,z),world.get(x,top-1,z),
   region.name+' edited column does not retain stale cached shelf');
 }
 const payload=world.save();
 assert.equal(payload.schema,1);
 const restored=VoxelWorld.restore(payload);
 assert.deepEqual(restored.save(),payload);
 for(const region of SURFACE_BIOME_REGIONS){
  const x=region.x,z=region.z;
  const top=Math.max(terrainHeight(x,z,seed),surfaceBiomeHeight(x,z,seed));
  assert.equal(restored.get(x,top,z),0,region.name+' excavation survives restore');
 }
 assert.ok(view.cachedColumns<=64);
});

test('fresh-profile opt-in is explicit; dynamic protection invalidates cached columns',()=>{
 const world=new VoxelWorld(179),protectedCells=new Set();
 const options={
  enabled:true,profileIsFresh:true,maxCachedColumns:32,
  isProtected:(x,y,z)=>protectedCells.has(x+','+y+','+z),
  hasDurableEditIntent:()=>false
 };
 assert.equal(createSurfaceBiomeWorldView(world,{...options,profileIsFresh:false}),null);
 assert.equal(createSurfaceBiomeWorldView(world,{...options,hasDurableEditIntent:null}),null);
 const view=createSurfaceBiomeWorldView(world,options);
 assert.ok(view);
 const x=512,z=0,top=Math.max(terrainHeight(x,z,179),surfaceBiomeHeight(x,z,179));
 assert.equal(view.get(x,top,z),SURFACE_BIOME_REGIONS[0].surface);
 protectedCells.add(x+','+top+','+z);
 assert.equal(view.get(x,top,z),world.get(x,top,z));
 assert.equal(view.cachedColumns,0,'protected column must leave cache');
 protectedCells.clear();
 assert.equal(view.get(x,top,z),SURFACE_BIOME_REGIONS[0].surface);
 assert.equal(view.cachedColumns,1);
});
