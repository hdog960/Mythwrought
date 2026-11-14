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

test('ruin geometry keeps a clear central sightline, valid atlas IDs and stable foot elevation',()=>{
 const world=new VoxelWorld(179);let found=null;
 for(let cx=-43;cx<=43&&!found;cx++)for(let cz=-43;cz<=43;cz++){
   const v=ruinWatchtowerVertices(world,cx,cz,opts);
   if(v.length) {found={cx,cz,v};break;}
 }
 assert.ok(found,'representative seed should contain a ruin');
 const {cx,cz,v}=found,x=cx*16+8,z=cz*16+8;
 let minY=Infinity,maxY=-Infinity;
 for(let i=0;i<v.length;i+=9){
   const px=v[i],py=v[i+1],pz=v[i+2],id=v[i+8];
   assert.ok([px,py,pz,...v.slice(i+3,i+6)].every(Number.isFinite));
   assert.ok(id===3||id===5||id===6,'only existing material IDs');
   minY=Math.min(minY,py);maxY=Math.max(maxY,py);
   assert.ok(Math.abs(px-x)<4&&Math.abs(pz-z)<4,'geometry remains inside the landmark footprint');
   // A player looking through the center should see the far side: the
   // gallery, buttresses and decorative stair cannot fill the passage.
   assert.ok(!(Math.abs(px-x)<.12&&Math.abs(pz-z)<.12&&py<terrainHeight(x,z,world.seed)+3),
     'central ground-level sightline must remain unobstructed');
 }
 assert.ok(maxY-minY>5,'distinctive multi-level skyline');
 assert.ok(v.length/9<=WATCHTOWER_LIMITS.maxVerticesPerChunk);
});
