import assert from 'node:assert/strict';
import {test} from 'node:test';
import {VoxelWorld,withM8SaveReplay,replayWithNaturalMemo} from '../src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR,FOUR_REGION_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
const seed=566928984;
const owner=()=>new FourRegionWorld(seed,fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR));
function replay(w,kind,cells){
 const result=replayWithNaturalMemo(w,kind,()=>cells.map(c=>w.naturalAndLandmarkBlock(...c)));
 assert.equal(Object.hasOwn(w,'naturalAndLandmarkBlock'),false);
 return result;
}
test('save replay caches are bounded, per owner, per generator and never escape the synchronous scope',()=>{
 const a=owner(),b=owner(),legacy=new VoxelWorld(seed),profile=owner();
 const cells=Array.from({length:2049},(_,i)=>[-16+i%16,Math.floor(i/256),-176+Math.floor(i/16)%16]);
 for(const [kind,w,proto] of [['legacy',legacy,VoxelWorld.prototype],['profile',profile,FourRegionWorld.prototype]]){
  const expected=replay(w,kind,cells),original=proto.naturalAndLandmarkBlock;let calls=0;
  proto.naturalAndLandmarkBlock=function(...args){calls++;return original.apply(this,args)};
  try{
   withM8SaveReplay(a,()=>{assert.deepEqual(replay(w,kind,cells),expected);assert.equal(calls,2049)});
   calls=0;withM8SaveReplay(a,()=>assert.deepEqual(replay(w,kind,cells.slice(1)),expected.slice(1)));assert.equal(calls,0);
   withM8SaveReplay(a,()=>assert.deepEqual(replay(w,kind,[cells[0]]),[expected[0]]));assert.equal(calls,1);
   calls=0;withM8SaveReplay(b,()=>assert.deepEqual(replay(w,kind,[cells[0]]),[expected[0]]));assert.equal(calls,1);
   calls=0;withM8SaveReplay(a,()=>withM8SaveReplay(b,()=>assert.deepEqual(replay(w,kind,[cells[0]]),[expected[0]])));assert.equal(calls,1);
   assert.throws(()=>withM8SaveReplay(a,()=>replayWithNaturalMemo(w,kind,()=>{throw Error('injected replay exception')})),/injected replay exception/);
   assert.equal(Object.hasOwn(w,'naturalAndLandmarkBlock'),false);
   calls=0;assert.deepEqual(replay(w,kind,[cells[0]]),[expected[0]]);assert.equal(calls,1);
  }finally{proto.naturalAndLandmarkBlock=original}
 }
 const prior=new FourRegionWorld(seed,fourRegionProfile(seed,FOUR_REGION_GENERATOR));
 const other=new VoxelWorld(seed+1);
 const coords=[[-11,7,-175],[-11,-141,-175],[500,256,500]];
 const expected=[replay(prior,'profile',coords),replay(other,'legacy',coords)];
 withM8SaveReplay(a,()=>{assert.deepEqual(replay(prior,'profile',coords),expected[0]);assert.deepEqual(replay(other,'legacy',coords),expected[1])});
});
