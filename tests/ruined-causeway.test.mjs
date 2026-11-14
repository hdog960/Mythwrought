import test from 'node:test';
import assert from 'node:assert/strict';
import {ruinedCausewayVertices,CAUSEWAY_LIMITS} from '../src/ruined-causeway.mjs';
import {VoxelWorld,terrainHeight,baseBlock,BLOCK,meshChunk} from '../src/voxel.mjs';
const options={chunkSize:16,heightAt:terrainHeight,baseAt:baseBlock,grass:BLOCK.GRASS,air:BLOCK.AIR};
function find(seed=179){
 const world=new VoxelWorld(seed);
 for(let cx=-130;cx<=130;cx++)for(let cz=-130;cz<=130;cz++){
  if(((cx%17)+17)%17!==11||((cz%17)+17)%17!==6)continue;
  const vertices=ruinedCausewayVertices(world,cx,cz,options);
  if(vertices.length)return {world,cx,cz,vertices};
 }
 throw Error('No seeded causeway found in representative region');
}
test('ruined causeway is deterministic, bounded and reuses the chunk vertex format',()=>{
 const {world,cx,cz,vertices}=find();
 assert.equal(vertices.length%CAUSEWAY_LIMITS.stride,0);
 assert.ok(vertices.length/9<=CAUSEWAY_LIMITS.maxVerticesPerChunk);
 assert.deepEqual(vertices,ruinedCausewayVertices(world,cx,cz,options));
 assert.equal(CAUSEWAY_LIMITS.collidable,false);
 assert.equal(CAUSEWAY_LIMITS.newDrawCalls,0);
 assert.ok(meshChunk(world,cx,cz).length>=vertices.length);
});
test('player edits suppress causeway without changing the saved world or terrain',()=>{
 const {world,cx,cz,vertices}=find();
 const x=cx*16+8,z=cz*16+8,h=terrainHeight(x,z,world.seed);
 const before=world.save();
 assert.ok(vertices.length>0);
 assert.equal(world.set(x,h+1,z,BLOCK.STONE),true);
 assert.equal(ruinedCausewayVertices(world,cx,cz,options).length,0);
 const restored=VoxelWorld.restore(world.save());
 assert.equal(ruinedCausewayVertices(restored,cx,cz,options).length,0);
 assert.equal(restored.get(x,h+1,z),BLOCK.STONE);
 assert.equal(world.set(x,h+1,z,BLOCK.AIR),true);
 assert.deepEqual(world.save(),before);
 assert.deepEqual(ruinedCausewayVertices(world,cx,cz,options),vertices);
});
test('no new block IDs or edits are created by causeway geometry',()=>{
 const {world,cx,cz}=find(179);
 const before=world.save();
 const vertices=ruinedCausewayVertices(world,cx,cz,options);
 for(let i=8;i<vertices.length;i+=9)assert.ok([3,5,6].includes(vertices[i]));
 assert.deepEqual(world.save(),before);
});
