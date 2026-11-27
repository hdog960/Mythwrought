import test from 'node:test';
import assert from 'node:assert/strict';
import {canAdmitCombinedRandomSeed,FourRegionWorld,fourRegionProfile} from '../../src/manual-biomes/profile-world.mjs';
import {VEILREACH_GENERATOR} from '../../src/environment-ground.mjs';
test('actual failed random seed is skipped without weakening explicit cave preflight',()=>{
 const bad=1606283545;
 assert.throws(()=>new FourRegionWorld(bad,fourRegionProfile(bad,VEILREACH_GENERATOR)),/New cave surface entrances not safe/);
 assert.equal(canAdmitCombinedRandomSeed(bad),false);
 for(const seed of [2026,180]){
  assert.equal(canAdmitCombinedRandomSeed(seed),true);
  const world=new FourRegionWorld(seed,fourRegionProfile(seed,VEILREACH_GENERATOR));
  assert.equal(world.generationProfile.generator,VEILREACH_GENERATOR);
  assert.equal(world.environmentCaves.entranceSites.length,4);
 }
});
