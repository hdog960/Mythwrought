import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,CHUNK_SIZE,WORLD_MIN_Y,WORLD_MAX_Y,
  terrainHeight,baseBlock,meshChunk} from '../src/voxel.mjs';
import {grottoAccentVertices,GROTTO_LIMITS} from '../src/grotto.mjs';
const accents=(world,cx,cz)=>grottoAccentVertices(world,cx,cz,{
  chunkSize:CHUNK_SIZE,minY:WORLD_MIN_Y,maxY:WORLD_MAX_Y,
  heightAt:terrainHeight,baseAt:baseBlock,air:BLOCK.AIR,
  stone:BLOCK.STONE,ore:BLOCK.ORE
});
function origins(mesh){
 const seen=new Set();
 for(let i=0;i<mesh.length;i+=9){
   const mat=mesh[i+8];
   if(mat!==11)continue;
   const x=Math.floor(mesh[i]),y=Math.floor(mesh[i+1]),z=Math.floor(mesh[i+2]);
   seen.add(x+','+y+','+z);
 }
 return seen;
}
test('natural grotto art is deterministic, 9-float packed, bounded and seed-specific',()=>{
 const seeds=[179,0,-719,284731];
 let count=0;
 for(const seed of seeds){
   const w=new VoxelWorld(seed),other=new VoxelWorld(seed);
   for(const [cx,cz] of [[0,0],[-1,0],[0,-1],[1,1],[-2,-2],[2,-1]]){
     const a=accents(w,cx,cz),b=accents(other,cx,cz);
     assert.deepEqual(a,b);
     assert.equal(a.length%9,0);
     assert.ok(a.length<=GROTTO_LIMITS.maxAccentsPerChunk*GROTTO_LIMITS.maxVerticesPerAccent*9);
     assert.ok([...a].every(Number.isFinite));
     for(let i=0;i<a.length;i+=9){
       assert.ok(a[i]>=cx*16&&a[i]<(cx+1)*16);
       assert.ok(a[i+2]>=cz*16&&a[i+2]<(cz+1)*16);
       assert.ok(GROTTO_LIMITS.materialIds.includes(a[i+8]));
     }
     count+=a.length;
   }
 }
 assert.ok(count>0,'No naturally hollow grotto contained any decoration');
 assert.deepEqual(GROTTO_LIMITS.materialIds,[10,11,12]);
});
test('cave fungi and crystal geometry never change saves, block selection or collision',()=>{
 const w=new VoxelWorld(179),original=JSON.stringify(w.save());
 const all=accents(w,0,0),chunk=meshChunk(w,0,0);
 assert.equal(JSON.stringify(w.save()),original);
 assert.ok(chunk.length>=all.length);
 assert.deepEqual(chunk.subarray(chunk.length-all.length),all,
   'Grotto colors must use the original chunk GPU buffer and edit invalidation');
 assert.equal(w.set(1,4,1,10),false);
 assert.equal(w.set(1,4,1,11),false);
 assert.equal(w.set(1,4,1,12),false);
 assert.equal(JSON.stringify(w.save()),original);
 assert.equal(VoxelWorld.restore(JSON.parse(original)).save().schema,1);
});
test('changing a natural grotto floor or filling its air removes only its artwork',()=>{
 const w=new VoxelWorld(179);
 let found=null;
 for(let cx=-2;cx<=2&&!found;cx++)for(let cz=-2;cz<=2&&!found;cz++){
   const mesh=accents(w,cx,cz);
   if(mesh.length<9)continue;
   // The first drawn vertex begins above the original floor and lies inside
   // that 1×1 natural cave cell, including negative-coordinate chunks.
   const x=Math.floor(mesh[0]),y=Math.floor(mesh[1]),z=Math.floor(mesh[2]);
   const before=mesh;
   assert.equal(baseBlock(x,y,z,w.seed),BLOCK.AIR);
   w.set(x,y,z,BLOCK.STONE);
   const filled=accents(w,cx,cz);
   w.set(x,y,z,BLOCK.AIR);
   if(filled.length<before.length)found={x,y,z,cx,cz,before};
 }
 assert.ok(found,'Could not identify a naturally anchored edit-sensitive grotto accent');
 const {x,y,z,cx,cz,before}=found;
 const start=JSON.stringify(w.save());
 const support=w.get(x,y-1,z);
 assert.equal(w.set(x,y-1,z,BLOCK.AIR),true);
 assert.ok(accents(w,cx,cz).length<before.length);
 assert.equal(w.set(x,y-1,z,support),true);
 assert.deepEqual(accents(w,cx,cz),before);
 assert.equal(JSON.stringify(w.save()),start,'Restoring natural floor left phantom save edit');
 assert.equal(w.set(x,y,z,BLOCK.STONE),true);
 assert.ok(accents(w,cx,cz).length<before.length);
 const stored=JSON.stringify(w.save());
 assert.equal(VoxelWorld.restore(JSON.parse(stored)).get(x,y,z),BLOCK.STONE);
 assert.equal(w.set(x,y,z,BLOCK.AIR),true);
 assert.deepEqual(accents(w,cx,cz),before);
});
test('invalid grotto input is rejected rather than accidentally generating saves',()=>{
 const w=new VoxelWorld(179);
 assert.throws(()=>grottoAccentVertices(w,0.2,0,{heightAt:terrainHeight,baseAt:baseBlock}),/Invalid/);
 assert.throws(()=>grottoAccentVertices(w,0,0,{heightAt:terrainHeight}),/Invalid/);
 assert.throws(()=>grottoAccentVertices({},0,0,{heightAt:terrainHeight,baseAt:baseBlock}),/Invalid/);
});
