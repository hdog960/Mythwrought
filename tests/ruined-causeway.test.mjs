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

test('causeway paving follows real terrace grade without changing saved heights',()=>{
 const {world,cx,cz,vertices}=find();
 const x=cx*16+8,z=cz*16+8,h=terrainHeight(x,z,world.seed);
 const before=world.save();
 // First 16 prisms are the two paving lanes, with optional grade risers.
 // Every rendered coordinate must be finite and bounded to the local site.
 for(let i=0;i<vertices.length;i+=9){
  assert.ok(Number.isFinite(vertices[i])&&Number.isFinite(vertices[i+1])&&Number.isFinite(vertices[i+2]));
  assert.ok(vertices[i]>=x-4&&vertices[i]<=x+4);
  assert.ok(vertices[i+1]>=h-.5&&vertices[i+1]<=h+5.5);
  assert.ok(vertices[i+2]>=z-5&&vertices[i+2]<=z+5);
 }
 assert.deepEqual(world.save(),before);
});
test('raised terrace edits suppress a causeway and restore without save migration',()=>{
 const {world,cx,cz}=find();
 const x=cx*16+8,z=cz*16+8;
 const xx=x+3,zz=z+3,g=terrainHeight(xx,zz,world.seed);
 const baseline=world.save();
 assert.equal(world.set(xx,g+6,zz,BLOCK.STONE),true);
 assert.equal(ruinedCausewayVertices(world,cx,cz,options).length,0);
 assert.equal(ruinedCausewayVertices(VoxelWorld.restore(world.save()),cx,cz,options).length,0);
 world.set(xx,g+6,zz,BLOCK.AIR);
 assert.deepEqual(world.save(),baseline);
 assert.ok(ruinedCausewayVertices(world,cx,cz,options).length>0);
});

test('broken crown preserves a wide open center and grounded approach markers',()=>{
 const {world,cx,cz,vertices}=find();
 const x=cx*16+8,z=cz*16+8,h=terrainHeight(x,z,world.seed);
 // Each vertex has position/color/UV/material; no crown or marker may
 // bridge the central walking corridor at head height.
 let crown=0,markers=0;
 for(let i=0;i<vertices.length;i+=9){
  const px=vertices[i],py=vertices[i+1],pz=vertices[i+2];
  if(pz>z+2&&pz<z+3&&py>h+4.45){
   crown++;
   assert.ok(px<x-.1||px>x+.9,'broken crown must retain a visible central gap');
  }
  if((pz<z-3||pz>z+3)&&py>h+1&&py<h+3)markers++;
 }
 assert.ok(crown>0,'fractured crown is present');
 assert.ok(markers>0,'approach milestones are present');
 assert.ok(vertices.length/9<=CAUSEWAY_LIMITS.maxVerticesPerChunk);
});

test('terrace-aware broken rails add coping without affecting saves or mesh budgets',()=>{
 const {world,cx,cz,vertices}=find();
 const before=world.save();
 const x=cx*16+8,z=cz*16+8,h=terrainHeight(x,z,world.seed);
 // Rail coping adds thin elevated horizontal stones along both sides,
 // while leaving the central roadway and approaches free.
 let coping=0;
 for(let i=0;i<vertices.length;i+=9){
  const px=vertices[i],py=vertices[i+1],pz=vertices[i+2];
  if((px<x-1.5||px>x+1.5)&&pz>z-1.2&&pz<z+1.7&&py>h+1.4&&py<h+3.1)coping++;
 }
 assert.ok(coping>0,'terrace rails and coping are visible');
 assert.ok(vertices.length/9<=CAUSEWAY_LIMITS.maxVerticesPerChunk);
 assert.deepEqual(ruinedCausewayVertices(world,cx,cz,options),vertices);
 assert.deepEqual(world.save(),before);
});

test('shallow natural voids and excavated supports prevent false causeway crossings',()=>{
 const {world,cx,cz,vertices}=find();
 const x=cx*16+8,z=cz*16+8,g=terrainHeight(x,z,world.seed);
 const before=world.save();
 // A hypothetical naturally hollow roof must not receive a decorative road.
 const caveOptions={...options,baseAt:(xx,yy,zz,seed)=>
  xx===x&&zz===z&&yy===g-1?BLOCK.AIR:baseBlock(xx,yy,zz,seed)};
 assert.equal(ruinedCausewayVertices(world,cx,cz,caveOptions).length,0);
 assert.deepEqual(world.save(),before);
 // A player's underground excavation is also protected across schema-1 restore.
 assert.equal(world.set(x,g-1,z,BLOCK.AIR),true);
 assert.equal(ruinedCausewayVertices(world,cx,cz,options).length,0);
 const restored=VoxelWorld.restore(world.save());
 assert.equal(ruinedCausewayVertices(restored,cx,cz,options).length,0);
 assert.equal(restored.get(x,g-1,z),BLOCK.AIR);
 assert.equal(world.set(x,g-1,z,baseBlock(x,g-1,z,world.seed)),true);
 assert.deepEqual(world.save(),before);
 assert.deepEqual(ruinedCausewayVertices(world,cx,cz,options),vertices);
});
