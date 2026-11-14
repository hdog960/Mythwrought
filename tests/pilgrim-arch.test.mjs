import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,terrainHeight,baseBlock,BLOCK} from '../src/voxel.mjs';
import {pilgrimArchVertices,PILGRIM_ARCH_LIMITS} from '../src/pilgrim-arch.mjs';
const opts={chunkSize:16,heightAt:terrainHeight,baseAt:baseBlock,grass:BLOCK.GRASS,air:BLOCK.AIR};
test('pilgrim arches are rare, deterministic, bounded and preserve schema-1 saves',()=>{
 const world=new VoxelWorld(179),before=JSON.stringify(world.save());let found=0;
 for(let cx=-80;cx<=80;cx++)for(let cz=-80;cz<=80;cz++){
  const v=pilgrimArchVertices(world,cx,cz,opts);
  assert.equal(v.length%9,0);assert.ok(v.length/9<=PILGRIM_ARCH_LIMITS.maxVerticesPerChunk);
  if(!v.length)continue;
  found++;assert.deepEqual(v,pilgrimArchVertices(world,cx,cz,opts));
  const x=cx*16+8,z=cz*16+8;
  for(let i=0;i<v.length;i+=9){
   assert.ok(Array.from(v.subarray(i,i+9)).every(Number.isFinite));
   assert.ok([3,5,6].includes(v[i+8]));
   assert.ok(Math.abs(v[i]-x)<4&&Math.abs(v[i+2]-z)<4);
  }
  // Ground-level central walking corridor stays empty of upright masonry.
  const y=terrainHeight(x,z,world.seed)+1.02;
  for(let i=0;i<v.length;i+=9){
   if(v[i+1]>y+.18&&v[i+1]<y+2.8)
    assert.ok(Math.abs(v[i]-x)>.75||Math.abs(v[i+2]-z)>.75,'central passage must remain open');
  }
 }
 assert.ok(found>0,'representative seeded region should contain arches');
 assert.equal(JSON.stringify(world.save()),before);
});
test('player edits and restored edits suppress the decorative arch without modifying saved voxels',()=>{
 const world=new VoxelWorld(179);let site;
 for(let cx=-80;cx<=80&&!site;cx++)for(let cz=-80;cz<=80;cz++)if(pilgrimArchVertices(world,cx,cz,opts).length){site=[cx,cz];break;}
 assert.ok(site);
 const [cx,cz]=site,x=cx*16+8,z=cz*16+8,h=terrainHeight(x,z,world.seed);
 const original=pilgrimArchVertices(world,cx,cz,opts);
 assert.ok(world.set(x,h+1,z,BLOCK.STONE));
 const saved=world.save();
 assert.equal(pilgrimArchVertices(world,cx,cz,opts).length,0);
 assert.deepEqual(world.save(),saved);
 assert.equal(pilgrimArchVertices(VoxelWorld.restore(saved),cx,cz,opts).length,0);
 assert.ok(world.set(x,h+1,z,BLOCK.AIR));
 assert.deepEqual(pilgrimArchVertices(world,cx,cz,opts),original);
});
