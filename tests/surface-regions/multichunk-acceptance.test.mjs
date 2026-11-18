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
 assert.equal(view.cachedColumns,0,
   'touched column must NOT remain cached after a restored legacy edit');
});

test('region boundaries remain deterministic across chunk seams without changing legacy spawn',()=>{
 for(const seed of [179,7,2201]){
  const world=new VoxelWorld(seed);
  const view=createSurfaceBiomeWorldView(world,{
   enabled:true,profileIsFresh:true,isProtected:()=>false,
   hasDurableEditIntent:()=>false,maxCachedColumns:64
  });
  assert.ok(view);
  for(const [x,z] of [[0,0],[1,1],[15,15],[-16,0]]){
   for(let y=terrainHeight(x,z,seed)-2;y<=terrainHeight(x,z,seed)+2;y++)
    assert.equal(view.get(x,y,z),world.get(x,y,z),'legacy spawn unchanged');
  }
  for(const region of SURFACE_BIOME_REGIONS){
   for(const [dx,dz] of [[15,0],[16,0],[0,15],[0,16],[-1,0],[0,-1]]){
    const x=region.x+dx,z=region.z+dz;
    const first=[];
    for(let y=terrainHeight(x,z,seed)-2;y<=Math.min(19,terrainHeight(x,z,seed)+15);y++)
     first.push(view.get(x,y,z));
    // Evict cached columns and verify regenerated cells are identical.
    for(let n=0;n<80;n++)view.get(x+1000+n,0,z+1000);
    const second=first.map((_,i)=>view.get(x,terrainHeight(x,z,seed)-2+i,z));
    assert.deepEqual(second,first,region.name+' seam reproducibility');
   }
  }
  assert.ok(view.cachedColumns<=64);
 }
});


test('newly protected landmarks mask already cached biome columns without altering saves',()=>{
 const world=new VoxelWorld(179),protectedCells=new Set();
 const view=createSurfaceBiomeWorldView(world,{
  enabled:true,profileIsFresh:true,
  isProtected:(x,y,z)=>protectedCells.has(x+','+y+','+z),
  hasDurableEditIntent:()=>false,maxCachedColumns:8
 });
 assert.ok(view);
 const region=SURFACE_BIOME_REGIONS[0],x=region.x,z=region.z;
 const y=Math.max(terrainHeight(x,z,179),surfaceBiomeHeight(x,z,179));
 const key=x+','+y+','+z;
 const before=JSON.stringify(world.save());
 assert.equal(view.get(x,y,z),region.surface,'warm the physical surface column');
 protectedCells.add(key);
 assert.equal(view.get(x,y,z),world.get(x,y,z),'new protection wins after cache warmup');
 protectedCells.delete(key);
 assert.equal(view.get(x,y,z),region.surface,'unprotected natural column remains deterministic');
 assert.equal(JSON.stringify(world.save()),before,'protection never changes schema-1 save');
});
