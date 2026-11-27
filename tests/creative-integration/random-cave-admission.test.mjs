import test from 'node:test';
import assert from 'node:assert/strict';
import {canAdmitCombinedRandomSeed,FourRegionWorld,fourRegionProfile} from '../../src/manual-biomes/profile-world.mjs';
import {VEILREACH_GENERATOR} from '../../src/environment-ground.mjs';
import {combinedEnvironmentCaves} from '../../src/manual-caves/opt-in-runtime.mjs';
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

test('actual spiral seam conflict refuses explicit admission and is skipped for random selection',()=>{
 let rejected=null,state=0x3b2377e1;
 for(let i=0;i<512;i++){
  state^=state<<13;state^=state>>>17;state^=state<<5;
  const seed=state|0;
  try{combinedEnvironmentCaves(seed);}
  catch(error){
   if(error.message.startsWith('Historical deep spiral surface seam is unsafe: ')&&
     error.message.includes('SURFACE_PORTAL_SUPPORT_COLLISION')){rejected=seed;break;}
  }
 }
 assert.notEqual(rejected,null,'Bounded deterministic survey must find a real seam-refused seed');
 assert.throws(()=>new FourRegionWorld(rejected,fourRegionProfile(rejected,VEILREACH_GENERATOR)),/Historical deep spiral surface seam is unsafe/);
 assert.equal(canAdmitCombinedRandomSeed(rejected),false);
 console.log('SEAM_REJECTED_SEED='+rejected);
});
