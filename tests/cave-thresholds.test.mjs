import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,terrainHeight,baseBlock,meshChunk} from '../src/voxel.mjs';
import {caveThresholdVertices,CAVE_THRESHOLD_LIMITS} from '../src/cave-thresholds.mjs';
const options={heightAt:terrainHeight,baseAt:baseBlock,air:BLOCK.AIR,stoneId:BLOCK.STONE,chunkSize:16,minY:-3,maxY:19};
test('threshold art is deterministic, bounded, finite and never saved',()=>{
 const world=new VoxelWorld(179),before=JSON.stringify(world.save());
 for(let cx=-8;cx<=8;cx++)for(let cz=-8;cz<=8;cz++){
  const a=caveThresholdVertices(world,cx,cz,options);
  assert.deepEqual(a,caveThresholdVertices(world,cx,cz,options));
  assert.equal(a.length%9,0);
  assert.ok(a.length<=CAVE_THRESHOLD_LIMITS.maxVerticesPerChunk*9);
  for(let i=0;i<a.length;i+=9){
   assert.ok(Number.isFinite(a[i])&&Number.isFinite(a[i+1])&&Number.isFinite(a[i+2]));
   assert.ok(a[i]>=cx*16&&a[i]<(cx+1)*16);
   assert.ok(a[i+2]>=cz*16&&a[i+2]<(cz+1)*16);
  }
 }
 assert.equal(JSON.stringify(world.save()),before);
 assert.equal(CAVE_THRESHOLD_LIMITS.newDrawCalls,0);
 assert.equal(CAVE_THRESHOLD_LIMITS.newTextures,0);
});
test('no cave mouth art appears in a uniformly solid or artificial tunnel',()=>{
 const w=new VoxelWorld(179);
 const solid={...options,heightAt:()=>10,baseAt:()=>BLOCK.STONE};
 assert.equal(caveThresholdVertices(w,0,0,solid).length,0);
 const fake={...options,heightAt:(x,z)=>x<8?10:4,baseAt:()=>BLOCK.STONE};
 const edited={seed:179,get:(x,y,z)=>y>=4&&y<=7&&x>=5&&x<=11&&z===8?BLOCK.AIR:BLOCK.STONE};
 assert.equal(caveThresholdVertices(edited,0,0,fake).length,0);
});
test('existing voxel meshing and schema-1 roundtrip remain valid',()=>{
 const w=new VoxelWorld(179);
 const before=meshChunk(w,1,2);
 assert.equal(before.length%9,0);
 const restored=VoxelWorld.restore(w.save());
 assert.deepEqual(meshChunk(restored,1,2),before);
});

test('real natural cave approach receives fractured rock and moss geometry without changing voxels',()=>{
 const heightAt=(x)=>x<=8?10:3;
 const baseAt=(x,y)=>y>=4?BLOCK.AIR:BLOCK.STONE;
 const world={seed:179,get:(x,y,z)=>baseAt(x,y,z)};
 const before=world.get(8,4,8);
 const art=caveThresholdVertices(world,0,0,{...options,heightAt,baseAt});
 assert.ok(art.length>=42*9,'authentic natural opening should carry the complete layered silhouette');
 assert.equal(art.length%9,0);
 assert.ok(art.length<=CAVE_THRESHOLD_LIMITS.maxVerticesPerChunk*9);
 const colors=new Set();
 for(let i=0;i<art.length;i+=9){
  assert.ok(Number.isFinite(art[i])&&Number.isFinite(art[i+1])&&Number.isFinite(art[i+2]));
  colors.add(art.slice(i+3,i+6).join(','));
 }
 assert.ok(colors.size>=3,'shale, shadow and moss should remain visually distinct');
 assert.equal(world.get(8,4,8),before);
});
