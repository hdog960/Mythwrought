import assert from 'node:assert/strict';
import {test} from 'node:test';
import {VoxelWorld,meshChunk,chunkCoord,terrainHeight} from '../../src/voxel.mjs';
import {SURFACE_BIOME_REGIONS,createSurfaceBiomeWorldView,surfaceBiomeHeight} from '../../src/surface-regions/regions.mjs';

// Dedicated source-to-mesher acceptance: not a screenshot or a deployed runtime.
// A future integration must additionally prove collision, player traversal,
// persisted fresh-profile selection and authentic WebGL2 frames.
test('all four fresh-world regions mesh on three seeds across neighboring chunks',()=>{
 for(const seed of [179,7,2201]){
  const world=new VoxelWorld(seed);
  const before=JSON.stringify(world.save());
  const view=createSurfaceBiomeWorldView(world,{
   enabled:true,profileIsFresh:true,isProtected:()=>false,
   hasDurableEditIntent:()=>false,maxCachedColumns:512
  });
  assert.ok(view);
  for(const region of SURFACE_BIOME_REGIONS){
   const cx=chunkCoord(region.x),cz=chunkCoord(region.z);
   for(const [dx,dz] of [[0,0],[1,0],[0,1]]){
    const mesh=meshChunk(view,cx+dx,cz+dz);
    assert.ok(mesh,region.name+' chunk '+(cx+dx)+','+(cz+dz));
   }
   for(const [dx,dz] of [[0,0],[1,0],[0,1],[8,8]]){
    const x=region.x+dx,z=region.z+dz;
    const oldTop=terrainHeight(x,z,seed);
    const top=Math.max(oldTop,surfaceBiomeHeight(x,z,seed));
    assert.equal(view.get(x,top,z),region.surface,region.name+' physical surface');
    assert.equal(view.get(x,top+1,z),world.get(x,top+1,z),'clear headroom');
    assert.equal(view.get(x,oldTop-8,z),world.get(x,oldTop-8,z),'deep foundation unchanged');
   }
  }
  assert.ok(view.cachedColumns<=512);
  assert.equal(JSON.stringify(world.save()),before,'read-only preview must not mutate schema-1');
 }
});

test('durable touched-cell history takes precedence after edits revert and cache evicts',()=>{
 const world=new VoxelWorld(179),touched=new Set();
 const view=createSurfaceBiomeWorldView(world,{
  enabled:true,profileIsFresh:true,isProtected:()=>false,maxCachedColumns:1,
  hasDurableEditIntent:(x,y,z)=>touched.has(x+','+y+','+z)
 });
 assert.ok(view);
 const region=SURFACE_BIOME_REGIONS[2],x=region.x,z=region.z;
 const y=terrainHeight(x,z,179),key=x+','+y+','+z;
 const original=world.get(x,y,z);
 assert.notEqual(view.get(x,y,z),original);
 touched.add(key);
 assert.equal(world.set(x,y,z,4),true);
 assert.equal(view.get(x,y,z),4);
 assert.equal(world.set(x,y,z,original),true);
 assert.equal(world.edits.has(key),false);
 // Force LRU eviction, then rebuild the original region column.
 view.get(x+32,y,z+32);
 assert.equal(view.get(x,y,z),original);
 assert.equal(view.cachedColumns,1);
});
