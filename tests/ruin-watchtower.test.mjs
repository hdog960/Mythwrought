import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,terrainHeight,baseBlock,BLOCK} from '../src/voxel.mjs';
import {ruinWatchtowerVertices,WATCHTOWER_LIMITS} from '../src/ruin-watchtower.mjs';
const opts={chunkSize:16,heightAt:terrainHeight,baseAt:baseBlock,grass:BLOCK.GRASS,air:BLOCK.AIR};
test('rare watchtower ruins are deterministic, bounded and never write saves',()=>{
 const world=new VoxelWorld(179),before=JSON.stringify(world.save());let found=0;
 for(let cx=-31;cx<=31;cx++)for(let cz=-31;cz<=31;cz++){
  const a=ruinWatchtowerVertices(world,cx,cz,opts);
  assert.equal(a.length%9,0);assert.ok(a.length/9<=WATCHTOWER_LIMITS.maxVerticesPerChunk);
  if(a.length){found++;assert.deepEqual(a,ruinWatchtowerVertices(world,cx,cz,opts));}
 }
 assert.ok(found>0,'seeded landscape must contain at least one landmark');
 assert.equal(JSON.stringify(world.save()),before);
});
test('world edits at candidate footprints suppress ruins without changing edits',()=>{
 const world=new VoxelWorld(179);let chosen;
 for(let cx=-31;cx<=31&&!chosen;cx++)for(let cz=-31;cz<=31;cz++)if(ruinWatchtowerVertices(world,cx,cz,opts).length){chosen=[cx,cz];break;}
 assert.ok(chosen);const [cx,cz]=chosen,x=cx*16+8,z=cz*16+8,y=terrainHeight(x,z,world.seed);
 assert.equal(world.set(x,y,z,BLOCK.STONE),true);
 const before=world.save();
 assert.equal(ruinWatchtowerVertices(world,cx,cz,opts).length,0);
 assert.deepEqual(world.save(),before);
});
