import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,terrainHeight,baseBlock,meshChunk} from '../src/voxel.mjs';
import {waystoneVertices,WAYSTONE_LIMITS} from '../src/waystones.mjs';
const opts={chunkSize:16,heightAt:terrainHeight,baseAt:baseBlock,grass:BLOCK.GRASS,air:BLOCK.AIR};
test('rare waystones are deterministic, sparse, bounded, and save-invariant',()=>{
 const w=new VoxelWorld(179),saved=JSON.stringify(w.save());let found=0,empty=0;
 for(let cx=-12;cx<=12;cx++)for(let cz=-12;cz<=12;cz++){
  const a=waystoneVertices(w,cx,cz,opts),b=waystoneVertices(w,cx,cz,opts);
  assert.deepEqual(a,b);assert.equal(a.length%9,0);assert.ok(a.length<=WAYSTONE_LIMITS.maxVerticesPerChunk*9);
  if(!a.length){empty++;continue;}found++;
  for(let i=0;i<a.length;i+=9){assert.ok(Number.isFinite(a[i])&&Number.isFinite(a[i+1])&&Number.isFinite(a[i+2]));assert.ok(a[i]>=cx*16&&a[i]<(cx+1)*16);assert.ok(a[i+2]>=cz*16&&a[i+2]<(cz+1)*16);}
 }
 assert.ok(found>0&&empty>found*20,'landmarks must be visible but rare');
 assert.equal(JSON.stringify(w.save()),saved);
 assert.equal(WAYSTONE_LIMITS.newDrawCalls,0);
});
test('waystones disappear when their natural anchor is mined or occupied, without editing saved data',()=>{
 const w=new VoxelWorld(179);let site;
 for(let cx=-12;cx<=12&&!site;cx++)for(let cz=-12;cz<=12&&!site;cz++){
  const v=waystoneVertices(w,cx,cz,opts);if(v.length)site={cx,cz,x:cx*16+7,z:cz*16+8,v};
 }
 assert.ok(site);
 const h=terrainHeight(site.x,site.z,w.seed);
 assert.equal(w.set(site.x,h,site.z,BLOCK.AIR),true);
 assert.equal(waystoneVertices(w,site.cx,site.cz,opts).length,0);
 w.set(site.x,h,site.z,BLOCK.GRASS);
 assert.deepEqual(waystoneVertices(w,site.cx,site.cz,opts),site.v);
 w.set(site.x,h+2,site.z,BLOCK.WOOD);
 assert.equal(waystoneVertices(w,site.cx,site.cz,opts).length,0);
 w.set(site.x,h+2,site.z,BLOCK.AIR);
 assert.deepEqual(waystoneVertices(w,site.cx,site.cz,opts),site.v);
 assert.equal(JSON.stringify(new VoxelWorld(179).save()),JSON.stringify(VoxelWorld.restore(new VoxelWorld(179).save()).save()));
 assert.ok(meshChunk(w,site.cx,site.cz).length>0);
});
