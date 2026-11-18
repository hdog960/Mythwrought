import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,VoxelWorld,worldKey,collides} from '../src/voxel.mjs';
import {planHistoricalEastGallery,EAST_GALLERY_SOURCE} from '../src/manual-caves/east-gallery-intake.mjs';
import {eastGalleryConnectionTrace} from '../src/east-gallery-cave.mjs';
test('east gallery cannot modify preexisting player worlds without explicit opt-in',()=>{
 assert.equal(planHistoricalEastGallery().reason,'EXPLICIT_NEW_WORLD_REQUIRED');
 assert.equal(planHistoricalEastGallery({seed:999999999999,approved:true}).reason,'INVALID_SEED');
});
for(const seed of [179,1,2026,-77]){
 test('historical east candidate exact original source, south-side connection and 35-cell room seed '+seed,()=>{
  const base=new VoxelWorld(seed),raw=JSON.stringify(base.save());
  const result=planHistoricalEastGallery({seed,baseWorld:base,approved:true});
  assert.equal(result.source,EAST_GALLERY_SOURCE);
  assert.equal(result.ok,true,JSON.stringify({reasons:result.reasons,
    conflicts:result.conflicts,problems:result.problems}));
  assert.equal(result.sourceWalkable,true);
  assert.equal(result.physicalWalkable,true);
  assert.equal(result.roomCells,35);
  assert.ok(result.cells.size>0,'must stage genuinely new East source geometry');
  const view={seed,edits:base.edits,get(x,y,z){
   const k=worldKey(x,y,z);
   return base.edits.get(k)??result.cells.get(k)??base.get(x,y,z);
  }};
  for(const p of result.sourceRoute){
   const floor=p.feet-1;
   assert.notEqual(view.get(p.x,floor,p.z),BLOCK.AIR);
   for(let h=0;h<2;h++)assert.equal(view.get(p.x,p.feet+h,p.z),BLOCK.AIR);
   assert.equal(collides(view,p.x+.5,p.feet,p.z+.5),false);
  }
  assert.equal(JSON.stringify(base.save()),raw,'read-only East intake changed old schema-1 world');
  assert.equal(result.homeScreenRegistered,false);
 });
}
test('East side plan refuses to overwrite a placed saved player block',()=>{
 const base=new VoxelWorld(179),candidate=planHistoricalEastGallery({seed:179,baseWorld:base,approved:true});
 assert.ok(candidate.ok);
 const target=[...candidate.cells.keys()].find(k=>candidate.cells.get(k)===BLOCK.AIR);
 assert.ok(target);
 const [x,y,z]=target.split(',').map(Number);
 base.set(x,y,z,BLOCK.WOOD);
 const result=planHistoricalEastGallery({seed:179,baseWorld:base,approved:true});
 assert.equal(result.ok,false);
 assert.ok(result.conflicts.some(x=>x.key===target&&x.reason==='EXISTING_PLAYER_EDIT'));
 assert.equal(base.get(x,y,z),BLOCK.WOOD,'player edit was overwritten');
});
