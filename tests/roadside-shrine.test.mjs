import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,terrainHeight,baseBlock,BLOCK} from '../src/voxel.mjs';
import {roadsideShrineVertices,SHRINE_LIMITS} from '../src/roadside-shrine.mjs';
const opts={chunkSize:16,heightAt:terrainHeight,baseAt:baseBlock,grass:BLOCK.GRASS,air:BLOCK.AIR};
test('rare roadside shrines are seed-stable, bounded, use existing materials and never write saves',()=>{
 const world=new VoxelWorld(179),before=JSON.stringify(world.save());let found=0;
 for(let cx=-49;cx<=49;cx++)for(let cz=-49;cz<=49;cz++){
  const v=roadsideShrineVertices(world,cx,cz,opts);
  assert.equal(v.length%9,0);assert.ok(v.length/9<=SHRINE_LIMITS.maxVerticesPerChunk);
  if(!v.length)continue;
  found++;assert.deepEqual(v,roadsideShrineVertices(world,cx,cz,opts));
  const x=cx*16+8,z=cz*16+8;
  for(let i=0;i<v.length;i+=9){
   assert.ok([v[i],v[i+1],v[i+2],v[i+3],v[i+4],v[i+5]].every(Number.isFinite));
   assert.ok([3,5,6].includes(v[i+8]));
   assert.ok(Math.abs(v[i]-x)<4&&Math.abs(v[i+2]-z)<4);
  }
 }
 assert.ok(found>0,'representative seed must yield a shrine');
 assert.equal(JSON.stringify(world.save()),before);
});
test('saved player edits suppress decorative shrine without modifying persisted terrain',()=>{
 const world=new VoxelWorld(179);let chosen;
 for(let cx=-49;cx<=49&&!chosen;cx++)for(let cz=-49;cz<=49;cz++)if(roadsideShrineVertices(world,cx,cz,opts).length){chosen=[cx,cz];break;}
 assert.ok(chosen);
 const [cx,cz]=chosen,x=cx*16+8,z=cz*16+8,h=terrainHeight(x,z,world.seed);
 const original=roadsideShrineVertices(world,cx,cz,opts);
 assert.ok(world.set(x,h+1,z,BLOCK.STONE));
 const saved=world.save();
 assert.equal(roadsideShrineVertices(world,cx,cz,opts).length,0);
 assert.deepEqual(world.save(),saved);
 assert.deepEqual(roadsideShrineVertices(VoxelWorld.restore(saved),cx,cz,opts),new Float32Array());
 assert.ok(world.set(x,h+1,z,BLOCK.AIR));
 assert.deepEqual(roadsideShrineVertices(world,cx,cz,opts),original);
});
