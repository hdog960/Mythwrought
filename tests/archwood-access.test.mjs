import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,CHUNK_SIZE} from '../src/voxel.mjs';
import {planArchwoodAccess,placeArchwoodAccess} from '../src/archwood-access.mjs';
function site(w){
 for(let x=-96;x<=96;x++)for(let z=-96;z<=96;z++){
  const p=planArchwoodAccess(w,x,z);
  if(p)return p;
 }
 return null;
}
test('opt-in archwood access is physical, deterministic and keeps standing headroom',()=>{
 for(const seed of [179,917,-184]){
  const w=new VoxelWorld(seed),p=site(w);
  if(!p)continue; // A flat 20-cell approach is intentionally rare.
  const [x,y,z]=p.origin;
  assert.deepEqual(planArchwoodAccess(new VoxelWorld(seed),x,z),p);
  for(const side of [-1,1])for(let step=1;step<=6;step++){
   const dx=side<0?-7+step:13-step;
   assert.ok(p.cells.some(c=>c[0]===x+dx&&c[1]===y+step&&c[2]===z&&c[3]===BLOCK.WOOD));
   assert.ok(!p.cells.some(c=>c[0]===x+dx&&c[1]===y+step+1&&c[2]===z));
  }
  assert.equal(placeArchwoodAccess(w,p),true);
  assert.equal(VoxelWorld.restore(w.save()).get(x-1,y+6,z),BLOCK.WOOD);
  assert.equal(w.get(x+3,y+7,z),BLOCK.WOOD);
  assert.equal(placeArchwoodAccess(w,p),false,'no double installation');
  return;
 }
 assert.fail('No flat archwood access fixture found across fixed seeds');
});
test('existing player edit in stair footprint rejects the entire structure',()=>{
 const w=new VoxelWorld(179),p=site(w);
 if(!p)return;
 const [x,y,z]=p.cells[0];
 w.set(x,y,z,BLOCK.STONE);
 const before=w.save();
 assert.equal(placeArchwoodAccess(w,p),false);
 assert.deepEqual(w.save(),before);
});
test('rejected stair write restores all bridge and stair edits',()=>{
 const w=new VoxelWorld(179),p=site(w);
 if(!p)return;
 const before=w.save();
 let count=0;
 const guarded={seed:w.seed,get:(...a)=>w.get(...a),set:(x,y,z,id)=>{
  if(id!==BLOCK.AIR&&++count===p.tree.blockCount+3)return false;
  return w.set(x,y,z,id);
 }};
 assert.equal(placeArchwoodAccess(guarded,p),false);
 assert.deepEqual(w.save(),before);
});

test('cross-chunk archwood approach cells remain unique and save-stable',()=>{
 const w=new VoxelWorld(179);
 let p=null;
 // Scan only chunk-boundary sites; fail loudly if the feature cannot be placed.
 for(let x=-96;x<=96&&!p;x++)for(let z=-96;z<=96;z++){
  if(x%CHUNK_SIZE!==0 && (x+6)%CHUNK_SIZE!==0)continue;
  p=planArchwoodAccess(w,x,z);
  if(p)break;
 }
 assert.ok(p,'no chunk-boundary archwood access candidate exists');
 const all=[...p.tree.cells,...p.cells],keys=all.map(c=>c.slice(0,3).join(','));
 assert.equal(new Set(keys).size,keys.length,'bridge and access must never overlap');
 const touchedChunks=new Set(all.map(([x,,z])=>Math.floor(x/CHUNK_SIZE)+','+Math.floor(z/CHUNK_SIZE)));
 assert.ok(touchedChunks.size>=2,'fixture must cross a real chunk boundary');
 const before=w.save();
 assert.equal(placeArchwoodAccess(w,p),true);
 const restored=VoxelWorld.restore(w.save());
 for(const [x,y,z,id] of all)assert.equal(restored.get(x,y,z),id);
 assert.equal(restored.save().schema,before.schema,'preserve save schema');
});

test('stale plans and edited approach headroom cannot overwrite player edits',()=>{
 const w=new VoxelWorld(179),p=site(w);
 assert.ok(p,'fixed seed must provide a valid archwood approach');
 const [x,y,z]=p.cells[0];
 const changed={...p,cells:p.cells.slice(1)};
 assert.equal(placeArchwoodAccess(w,changed),false,'truncated stair plans rejected');
 const before=w.save();
 w.set(x,y+1,z,BLOCK.CRYSTAL);
 const edited=w.save();
 assert.equal(placeArchwoodAccess(w,p),false);
 assert.deepEqual(w.save(),edited);
 assert.notDeepEqual(w.save(),before);
});
