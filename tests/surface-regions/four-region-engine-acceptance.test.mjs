import assert from 'node:assert/strict';
import {test} from 'node:test';
import {VoxelWorld,terrainHeight,meshChunk,chunkCoord} from '../../src/voxel.mjs';
import {WORLD_MAX_Y} from '../../src/depth.mjs';
import {SURFACE_BIOME_REGIONS,surfaceBiomeHeight,surfaceBiomeFreshColumn,createSurfaceBiomeWorldView} from '../../src/surface-regions/regions.mjs';

// Candidate engine-level acceptance: real world reader + chunk mesher, not a
// screenshot, player controller, save-profile migration, or physical iPhone.
test('all four regions simultaneously compose protected, supported multichunk surfaces on three seeds',()=>{
 for(const seed of [179,7,2201]){
  const world=new VoxelWorld(seed),before=JSON.stringify(world.save());
  const view=createSurfaceBiomeWorldView(world,{
   enabled:true,profileIsFresh:true,maxCachedColumns:128,
   isProtected:()=>false,hasDurableEditIntent:()=>false
  });
  assert.ok(view);
  for(const region of SURFACE_BIOME_REGIONS){
   let composed=0,preserved=0;
   const liveChunks=new Set();
   for(const dx of [-32,-16,0,16,32])for(const dz of [-32,-16,0,16,32]){
    const x=region.x+dx,z=region.z+dz,old=terrainHeight(x,z,seed);
    const top=Math.max(old,surfaceBiomeHeight(x,z,seed));
    assert.ok(top+2<=WORLD_MAX_Y,region.name+' requires headroom');
    // Source-derived safety is decisive, not a blanket requirement to
    // replace every existing natural/landmark column. The old assertion
    // incorrectly assumed every sample was eligible for new terrain.
    const plan=surfaceBiomeFreshColumn(x,z,seed,{
      enabled:true,profileIsFresh:true,
      readBaseline:(cx,y,cz)=>world.naturalAndLandmarkBlock(cx,y,cz),
      hasEdit:()=>false,isProtected:()=>false
    });
    if(!plan){
      // Preserve an actual existing landmark/cave instead of burying it to
      // satisfy a screenshot test. Fail if a protected column changes.
      preserved++;
      assert.equal(view.get(x,top,z),world.get(x,top,z),
        region.name+' protected terrain must remain original');
    }else{
      assert.equal(plan.name,region.name,'correct biome ownership');
      assert.ok(plan.writes.length>0,region.name+' must author real voxels');
      assert.equal(view.get(x,top,z),region.surface,region.name+' solid top');
      assert.equal(view.get(x,top+1,z),0,region.name+' clear first headroom');
      assert.equal(view.get(x,top+2,z),0,region.name+' clear second headroom');
      assert.notEqual(view.get(x,top-1,z),0,region.name+' supported top');
      composed++;
      liveChunks.add(chunkCoord(x)+','+chunkCoord(z));
    }
    assert.equal(view.get(x,old-8,z),world.get(x,old-8,z),
      region.name+' must preserve legacy cave-bearing ground');
   }
   // 25 samples across five chunk-index offsets per region. A high bar for
   // material coverage plus a strict old-world fallback on genuine conflicts;
   // not a blanket waiver of the four-biome generator.
   assert.ok(composed>=18,region.name+' seed '+seed+
     ': fewer than 18/25 source-authentic biome columns ('+composed+')');
   assert.ok(liveChunks.size>=4,region.name+' requires real multi-chunk coverage');
   assert.equal(composed+preserved,25);
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
