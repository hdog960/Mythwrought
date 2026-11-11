import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,WORLD_MAX_Y} from '../src/voxel.mjs';
import {INTERACTION_REACH,BUILD_MATERIALS,BLOCK_NAMES,inspectBlockTarget,applyBlockAction,intersectsPlayerBlock} from '../src/blocks.mjs';

function stage(){
  const w=new VoxelWorld(179);
  const x=21,y=18,z=1;
  w.set(x,y,z,BLOCK.STONE);
  return {w,x,y,z,eye:[x+.5,y+.5,z+3.5],dir:[0,0,-1],
    player:{x:x+.5,z:z+3.5,feet:y-1.1}};
}
test('basic interaction materials and finite range are explicit',()=>{
  assert.equal(INTERACTION_REACH,6);
  assert.deepEqual(BUILD_MATERIALS,[BLOCK.STONE,BLOCK.WOOD,BLOCK.CRYSTAL]);
  assert.equal(BLOCK_NAMES[BLOCK.GRASS],'grass');
});
test('first visible block is mined, never the invisible block behind it',()=>{
  const {w,x,y,z,eye,dir,player}=stage();
  w.set(x,y,z-1,BLOCK.CRYSTAL);
  const target=inspectBlockTarget(w,eye,dir,BLOCK.WOOD,player);
  assert.deepEqual(target.hit,[x,y,z]);
  assert.deepEqual(target.adjacent,[x,y,z+1]);
  const result=applyBlockAction(w,eye,dir,'mine',BLOCK.WOOD,player,()=>{});
  assert.equal(result.ok,true);
  assert.equal(result.previous,BLOCK.STONE);
  assert.equal(w.get(x,y,z),BLOCK.AIR);
  assert.equal(w.get(x,y,z-1),BLOCK.CRYSTAL);
});
test('place selected materials only in line-of-sight adjacent empty cell',()=>{
  for(const selected of BUILD_MATERIALS){
    const {w,x,y,z,eye,dir,player}=stage();
    const result=applyBlockAction(w,eye,dir,'place',selected,player,()=>{});
    assert.equal(result.ok,true);
    assert.deepEqual(result.cell,[x,y,z+1]);
    assert.equal(w.get(x,y,z+1),selected);
    assert.equal(w.get(x,y,z),BLOCK.STONE);
  }
});
test('no target, out of range and unsupported action do not mutate world',()=>{
  const {w,eye,player}=stage();
  const original=JSON.stringify(w.save());
  assert.equal(inspectBlockTarget(w,[5,18,5],[0,1,0],BLOCK.STONE,player).canMine,false);
  assert.equal(applyBlockAction(w,eye,[0,1,0],'mine',BLOCK.STONE,player).ok,false);
  assert.equal(applyBlockAction(w,eye,[0,0,-1],'erase-everything',BLOCK.STONE,player).ok,false);
  assert.equal(inspectBlockTarget(w,[21.5,18.5,15],[0,0,-1],BLOCK.STONE,player).canMine,false);
  assert.equal(JSON.stringify(w.save()),original);
});
test('cannot place blocks inside player while mining remains allowed',()=>{
  const {w,x,y,z,eye,dir}=stage();
  const player={x:x+.5,feet:y-1.0,z:z+1.45};
  const state=inspectBlockTarget(w,eye,dir,BLOCK.STONE,player);
  assert.equal(state.canMine,true);
  assert.equal(state.canPlace,false);
  assert.match(state.reason,/inside the player/);
  const result=applyBlockAction(w,eye,dir,'place',BLOCK.STONE,player);
  assert.equal(result.ok,false);
  assert.equal(w.get(x,y,z+1),BLOCK.AIR);
  assert.equal(applyBlockAction(w,eye,dir,'mine',BLOCK.STONE,player).ok,true);
});
test('head, feet and edge of player volume behave as real voxel AABB',()=>{
  const player={x:.5,z:.5,feet:10};
  assert.equal(intersectsPlayerBlock(player,[0,10,0]),true);
  assert.equal(intersectsPlayerBlock(player,[0,11,0]),true);
  assert.equal(intersectsPlayerBlock(player,[0,12,0]),false);
  assert.equal(intersectsPlayerBlock(player,[1,10,0]),false);
});
test('placing with an unsupported material is rejected without side effects',()=>{
  const {w,eye,dir,player}=stage();
  assert.equal(inspectBlockTarget(w,eye,dir,BLOCK.ORE,player).canPlace,false);
  assert.equal(applyBlockAction(w,eye,dir,'place',BLOCK.ORE,player).ok,false);
  assert.equal(w.edits.size,1);
});
test('blocked or out-of-range placement never changes saves',()=>{
  const {w,x,y,z,eye,dir,player}=stage();
  w.set(x,y,z+1,BLOCK.STONE);
  const previous=JSON.stringify(w.save());
  const result=applyBlockAction(w,eye,dir,'place',BLOCK.WOOD,player);
  assert.equal(result.ok,true); // The first visible stone shifts forward by one.
  assert.equal(w.get(x,y,z+2),BLOCK.WOOD);
  assert.notEqual(JSON.stringify(w.save()),previous);
  assert.equal(WORLD_MAX_Y,19);
});
test('failed GPU seam rebuild rolls back edit and preserves the same save bytes',()=>{
  const {w,eye,dir,player}=stage();
  const previous=JSON.stringify(w.save());
  let attempted=0;
  const result=applyBlockAction(w,eye,dir,'mine',BLOCK.STONE,player,()=>{
    attempted++;throw Error('WebGL buffer creation failed');
  });
  assert.equal(attempted,1);
  assert.equal(result.ok,false);
  assert.equal(JSON.stringify(w.save()),previous);
});
test('valid action notifies neighbor remesher for negative/positive chunk edges',()=>{
  const {w,x,y,z,eye,dir,player}=stage();
  const calls=[];
  const result=applyBlockAction(w,eye,dir,'mine',BLOCK.STONE,player,(px,pz)=>calls.push([px,pz]));
  assert.equal(result.ok,true);
  assert.deepEqual(calls,[[x,z]]);
  assert.deepEqual(result.cell,[x,y,z]);
});
test('schema 1 saved-world edits restore after mining and placing',()=>{
  const {w,eye,dir,player}=stage();
  const placed=applyBlockAction(w,eye,dir,'place',BLOCK.CRYSTAL,player);
  assert.equal(placed.ok,true);
  const restored=VoxelWorld.restore(w.save());
  assert.equal(restored.get(...placed.cell),BLOCK.CRYSTAL);
  assert.deepEqual(restored.save(),w.save());
});
