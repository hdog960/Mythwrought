import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,CHUNK_SIZE,raycast,collides,meshChunk} from '../src/voxel.mjs';
import {TREE_VARIANTS,planVoxelTree,placeVoxelTree} from '../src/voxel-trees.mjs';
function site(world,variant){
 for(let x=-48;x<=48;x++)for(let z=-48;z<=48;z++){
  const plan=planVoxelTree(world,x,z,{variant});
  if(plan)return plan;
 }
 throw Error('No compatible tree site for '+variant);
}
test('three physically occupied, distinct tree silhouettes, repeatable over seeds',()=>{
 for(const seed of [179,917,-184]){
  const a=new VoxelWorld(seed),b=new VoxelWorld(seed),counts=[];
  for(const variant of TREE_VARIANTS){
   const p=site(a,variant),q=planVoxelTree(b,p.origin[0],p.origin[2],{variant});
   assert.deepEqual(p,q);
   assert.ok(p.blockCount>=15);
   assert.ok(p.cells.some(c=>c[3]===BLOCK.WOOD));
   assert.ok(p.cells.some(c=>c[3]===BLOCK.LEAVES),'Physical foliage must use registered leaf blocks');
   counts.push(p.blockCount);
  }
  assert.equal(new Set(counts).size,3);
  assert.equal(a.save().edits.length,0,'planning never changes worlds');
 }
});
test('opt-in installation produces real raycastable collidable editable saved voxels',()=>{
 const w=new VoxelWorld(179),p=site(w,'roundwood');
 assert.equal(placeVoxelTree(w,p),true);
 const trunk=p.cells.find(c=>c[3]===BLOCK.WOOD);
 assert.equal(w.get(...trunk.slice(0,3)),BLOCK.WOOD);
 assert.equal(collides(w,trunk[0]+.5,trunk[1],trunk[2]+.5),true);
 const hit=raycast(w,[trunk[0]+.5,trunk[1]+.5,trunk[2]-2],[0,0,1],4);
 assert.ok(hit.hit,'tree is visible to ordinary raycast');
 const restored=VoxelWorld.restore(w.save());
 assert.equal(restored.get(...trunk.slice(0,3)),BLOCK.WOOD);
 assert.equal(restored.set(...trunk.slice(0,3),BLOCK.AIR),true);
 assert.equal(restored.get(...trunk.slice(0,3)),BLOCK.AIR);
 assert.equal(placeVoxelTree(w,p),false,'cannot overwrite installed tree');
});
test('chunk seam cells are ordinary meshable voxels and protected from edits',()=>{
 const w=new VoxelWorld(917);
 let p;
 for(let z=-48;z<=48&&!p;z++)for(let x=-48;x<=48;x++){
  if(x%CHUNK_SIZE!==15)continue;
  p=planVoxelTree(w,x,z,{variant:'windswept'});
  if(p)break;
 }
 assert.ok(p);
 assert.ok(p.cells.some(c=>Math.floor(c[0]/CHUNK_SIZE)!==Math.floor(p.origin[0]/CHUNK_SIZE)));
 const [x,y,z]=p.cells[0];
 w.set(x,y,z,BLOCK.CRYSTAL);
 assert.equal(placeVoxelTree(w,p),false);
 assert.equal(w.get(x,y,z),BLOCK.CRYSTAL);
 w.set(x,y,z,BLOCK.AIR);
 assert.equal(placeVoxelTree(w,p),true);
 const cx=Math.floor(x/CHUNK_SIZE),cz=Math.floor(z/CHUNK_SIZE);
 assert.ok(meshChunk(w,cx,cz).length>0);
});
test('reject invalid variants and already occupied space without mutation',()=>{
 const w=new VoxelWorld(179),p=site(w,'spire');
 assert.equal(planVoxelTree(w,p.origin[0],p.origin[2],{variant:'unknown'}),null);
 const [x,y,z]=p.cells[0];
 w.set(x,y,z,BLOCK.STONE);
 assert.equal(planVoxelTree(w,p.origin[0],p.origin[2],{variant:'spire'}),null);
 assert.equal(placeVoxelTree(w,p),false);
 assert.equal(w.get(x,y,z),BLOCK.STONE);
});

test('rejects tampered tree plans, cross-seed replay and stale ground edits',()=>{
 const w=new VoxelWorld(179),p=site(w,'roundwood');
 const mutated=structuredClone(p);
 mutated.cells[0][3]=BLOCK.CRYSTAL;
 assert.equal(placeVoxelTree(w,mutated),false);
 const clipped=structuredClone(p);
 clipped.cells.pop();clipped.blockCount--;
 assert.equal(placeVoxelTree(w,clipped),false);
 const swapped=structuredClone(p);
 [swapped.cells[0],swapped.cells[1]]=[swapped.cells[1],swapped.cells[0]];
 assert.equal(placeVoxelTree(w,swapped),false);
 const other=new VoxelWorld(917);
 assert.equal(placeVoxelTree(other,p),false);
 const [gx,gy,gz]=p.origin;
 w.set(gx,gy,gz,BLOCK.STONE);
 assert.equal(placeVoxelTree(w,p),false);
 assert.equal(w.get(gx,gy,gz),BLOCK.STONE);
 assert.equal(w.save().edits.some(e=>e[0]===gx&&e[1]===gy&&e[2]===gz),true);
});
test('reserved physical leaf material is accepted only when present in registry',()=>{
 const w=new VoxelWorld(179),p=site(w,'spire');
 assert.equal(p.leafId,BLOCK.LEAVES??BLOCK.GRASS);
 if(BLOCK.LEAVES!==undefined){
  const leaves=planVoxelTree(w,p.origin[0],p.origin[2],{variant:'spire',leafId:BLOCK.LEAVES});
  assert.ok(leaves.cells.some(c=>c[3]===BLOCK.LEAVES));
 }
});

test('elderwood has substantial physical buttress roots, limbs, and broad canopy',()=>{
 for(const seed of [179,917,-184]){
  const world=new VoxelWorld(seed),p=site(world,'elderwood');
  const [x,y,z]=p.origin;
  assert.ok(p.blockCount>100,'large tree should be visibly larger than saplings');
  assert.ok(p.cells.some(c=>c[0]===x+2&&c[1]===y+1&&c[2]===z&&c[3]===BLOCK.WOOD),'buttress root');
  assert.ok(p.cells.some(c=>c[0]===x+3&&c[1]===y+6&&c[2]===z&&c[3]===BLOCK.WOOD),'long branch');
  assert.ok(p.cells.some(c=>c[3]===BLOCK.LEAVES),'physical leaves');
  assert.deepEqual(planVoxelTree(world,x,z,{variant:'elderwood'}),p);
  assert.equal(placeVoxelTree(world,p),true);
  const saved=VoxelWorld.restore(world.save());
  assert.equal(saved.get(x+2,y+1,z),BLOCK.WOOD);
  assert.equal(saved.set(x+2,y+1,z,BLOCK.AIR),true);
  assert.equal(saved.get(x+2,y+1,z),BLOCK.AIR);
  assert.equal(placeVoxelTree(world,p),false,'must not overwrite an installed tree');
 }
});
test('elderwood rejects tampered cells and player edits before installation',()=>{
 const w=new VoxelWorld(179),p=site(w,'elderwood');
 const forged=structuredClone(p);forged.cells[0][3]=BLOCK.STONE;
 assert.equal(placeVoxelTree(w,forged),false);
 const [x,y,z]=p.cells.at(-1);
 assert.equal(w.set(x,y,z,BLOCK.CRYSTAL),true);
 assert.equal(placeVoxelTree(w,p),false);
 assert.equal(w.get(x,y,z),BLOCK.CRYSTAL);
});
