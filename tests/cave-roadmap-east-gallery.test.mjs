import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,VoxelWorld,worldKey,collides} from '../src/voxel.mjs';
import {planHistoricalEastGallery,EAST_GALLERY_SOURCE,EAST_SITE_OFFSETS}
  from '../src/manual-caves/east-gallery-intake.mjs';
import {eastGalleryConnectionTrace} from '../src/east-gallery-cave.mjs';

test('authored east gallery refuses implicit activation or invalid seed',()=>{
 assert.equal(planHistoricalEastGallery().reason,'EXPLICIT_NEW_WORLD_REQUIRED');
 assert.equal(planHistoricalEastGallery({seed:2**36,approved:true}).reason,'INVALID_SEED');
 assert.ok(EAST_SITE_OFFSETS.length>=3,'Preserve original and verified-safe relocation options');
});
for(const seed of [179,1,2026,-77]){
 test('source-exact historical East+South real connected chamber in protected new world seed '+seed,()=>{
  const base=new VoxelWorld(seed),raw=JSON.stringify(base.save());
  const result=planHistoricalEastGallery({seed,baseWorld:base,approved:true});
  assert.equal(result.ok,true,JSON.stringify(result.rejected??result.earlierBlockedSites));
  assert.equal(result.source,EAST_GALLERY_SOURCE);
  assert.equal(result.sourceWalkable,true);
  assert.equal(result.physicalWalkable,true);
  assert.equal(result.roomCells,35);
  assert.ok(result.cells.size>=100,'Cannot omit South approach or East chamber geometry');
  const expected=eastGalleryConnectionTrace(base,result.origin);
  assert.equal(expected.walkable,true);
  const view={seed,edits:base.edits,get(x,y,z){
   const k=worldKey(x,y,z);
   return base.edits.get(k)??result.cells.get(k)??base.get(x,y,z);
  }};
  for(const p of result.sourceRoute){
   assert.notEqual(view.get(p.x,p.feet-1,p.z),BLOCK.AIR);
   for(let h=0;h<2;h++)assert.equal(view.get(p.x,p.feet+h,p.z),BLOCK.AIR);
   assert.equal(collides(view,p.x+.5,p.feet,p.z+.5),false);
  }
  // This is a NEW CAVE WORLD profile only. The protected old seed remains
  // source- and save-byte-identical, regardless of where the new cave moved.
  assert.equal(JSON.stringify(base.save()),raw);
  assert.equal(result.homeScreenRegistered,false);
  if(seed===179||seed===2026){
   assert.equal(result.relocated,true,'Original x64 site seals existing South cave headroom');
   assert.ok(result.earlierBlockedSites.some(a=>a.conflictCount>0));
  }
 });
}
test('a saved block cannot be overwritten; new East source must move or refuse',()=>{
 const seed=179,base=new VoxelWorld(seed);
 const before=planHistoricalEastGallery({seed,baseWorld:base,approved:true});
 assert.equal(before.ok,true);
 const changed=[...before.cells.keys()].find(k=>before.cells.get(k)===BLOCK.AIR);
 assert.ok(changed);
 const [x,y,z]=changed.split(',').map(Number);
 assert.equal(base.set(x,y,z,BLOCK.WOOD),true);
 const after=planHistoricalEastGallery({seed,baseWorld:base,approved:true});
 assert.ok(after.ok===false||(after.origin.x!==before.origin.x||after.origin.z!==before.origin.z),
  'Candidate overwrote a player block instead of moving to an independent site');
 assert.equal(base.get(x,y,z),BLOCK.WOOD);
 assert.equal(base.edits.get(changed),BLOCK.WOOD);
});
