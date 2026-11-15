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
test('four physically occupied tree silhouettes, repeatable over seeds',()=>{
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
  assert.ok(new Set(counts).size>=3,'Tree variants need distinct silhouettes');
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

test('elderwood creates a broad real-voxel crown with four limbs and respects edits',()=>{
 for(const seed of [179,917,-184]){
  const w=new VoxelWorld(seed),p=site(w,'elderwood');
  assert.ok(p.blockCount>80,'elderwood should be a visibly substantial tree');
  const [x,y,z]=p.origin;
  assert.ok(p.cells.some(c=>c[0]===x+3&&c[2]===z&&c[3]===BLOCK.WOOD),'east limb');
  assert.ok(p.cells.some(c=>c[0]===x-3&&c[2]===z&&c[3]===BLOCK.WOOD),'west limb');
  assert.ok(p.cells.some(c=>c[0]===x&&c[2]===z+3&&c[3]===BLOCK.WOOD),'south limb');
  assert.ok(p.cells.some(c=>c[0]===x&&c[2]===z-3&&c[3]===BLOCK.WOOD),'north limb');
  assert.equal(placeVoxelTree(w,p),true);
  const crown=p.cells.find(c=>c[3]===p.leafId);
  assert.equal(w.get(...crown.slice(0,3)),p.leafId);
  assert.equal(VoxelWorld.restore(w.save()).get(...crown.slice(0,3)),p.leafId);
  assert.equal(placeVoxelTree(w,p),false,'existing tree cannot be overwritten');
  assert.equal(w.set(...crown.slice(0,3),BLOCK.AIR),true);
  assert.equal(w.get(...crown.slice(0,3)),BLOCK.AIR);
 }
});

test('rejected mid-tree writes roll back every placed voxel and preserve saves',()=>{
 for(const variant of TREE_VARIANTS){
  const w=new VoxelWorld(179),p=site(w,variant),before=w.save();
  let writes=0;
  const guarded={
   seed:w.seed,
   get:(...args)=>w.get(...args),
   set:(x,y,z,id)=>{
    if(id!==BLOCK.AIR&&++writes===Math.ceil(p.blockCount/2))return false;
    return w.set(x,y,z,id);
   }
  };
  assert.equal(placeVoxelTree(guarded,p),false,variant);
  assert.deepEqual(w.save(),before,variant+' must not leave partial edits');
  assert.ok(p.cells.every(c=>w.get(...c.slice(0,3))===BLOCK.AIR));
  assert.equal(placeVoxelTree(w,p),true,'valid retry must remain possible');
 }
});
test('exceptions during tree installation also restore the original world',()=>{
 const w=new VoxelWorld(917),p=site(w,'elderwood'),before=w.save();
 let writes=0;
 const guarded={
  seed:w.seed,
  get:(...args)=>w.get(...args),
  set:(x,y,z,id)=>{
   if(id!==BLOCK.AIR&&++writes===12)throw Error('injected write failure');
   return w.set(x,y,z,id);
  }
 };
 assert.equal(placeVoxelTree(guarded,p),false);
 assert.deepEqual(w.save(),before);
});

test('archwood forms a continuous editable canopy crossing without touching old terrain',()=>{
 for(const seed of [179,917,-184]){
  const w=new VoxelWorld(seed),p=site(w,'archwood');
  const [x,y,z]=p.origin;
  for(let dx=0;dx<=6;dx++)
   assert.ok(p.cells.some(c=>c[0]===x+dx&&c[1]===y+7&&c[2]===z&&c[3]===BLOCK.WOOD),
    'each bridge deck cell must be a physical wood voxel');
  for(const dx of [0,6])
   assert.ok(p.cells.some(c=>c[0]===x+dx&&c[1]===y+1&&c[2]===z&&c[3]===BLOCK.WOOD),
    'both roots must reach ground');
  assert.equal(w.save().edits.length,0);
  assert.equal(placeVoxelTree(w,p),true);
  assert.equal(VoxelWorld.restore(w.save()).get(x+3,y+7,z),BLOCK.WOOD);
  assert.equal(w.set(x+3,y+7,z,BLOCK.AIR),true);
  assert.equal(w.get(x+3,y+7,z),BLOCK.AIR);
 }
});
test('archwood refuses modified distant footing and never overwrites its edit',()=>{
 const w=new VoxelWorld(179),p=site(w,'archwood');
 const [x,y,z]=p.origin;
 w.set(x+6,y,z,BLOCK.STONE);
 assert.equal(placeVoxelTree(w,p),false);
 assert.equal(w.get(x+6,y,z),BLOCK.STONE);
});

test('archwood canopy bridge keeps a continuous two-cell standing aisle',()=>{
 for(const seed of [179,917,-184]){
  const w=new VoxelWorld(seed),p=site(w,'archwood');
  const [x,y,z]=p.origin;
  for(let dx=0;dx<=6;dx++){
   for(const dy of [8,9]){
    assert.equal(p.cells.some(c=>c[0]===x+dx&&c[1]===y+dy&&c[2]===z),false,
     'deck center aisle must have full standing headroom');
   }
   assert.ok(p.cells.some(c=>c[0]===x+dx&&c[1]===y+8&&c[2]===z+1&&c[3]===BLOCK.LEAVES),
    'side canopy remains physically voxel-built');
  }
  assert.equal(placeVoxelTree(w,p),true);
  for(let dx=0;dx<=6;dx++)for(const dy of [8,9])
   assert.equal(w.get(x+dx,y+dy,z),BLOCK.AIR);
 }
});
