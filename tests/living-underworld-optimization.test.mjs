import test from 'node:test';
import assert from 'node:assert/strict';
import {candidateCaveAt,candidateChamberAt,candidateNoiseScoreAt}
 from '../src/living-underworld/procedural-core.mjs';
import {cityFloorAt,cityClearanceAt,cityMaterialOverrideAt}
 from '../src/living-underworld/city-floor-proposal.mjs';
import {networkAirAt} from '../src/living-underworld/worldwide-network.mjs';
import {caveThresholdForDepth,detachedCalibratedUnderworldAirAt}
 from '../src/living-underworld/depth-calibrated-proposal.mjs';

test('single-pass city material override is byte-for-byte equivalent in classification',()=>{
 for(const seed of [179,-17,2026,13579])for(const [bx,bz] of [
  [0,0],[768,128],[-20480,8192],[4096,-4096]]){
  for(let i=0;i<320;i++){
   const x=bx+((i*47)%319),z=bz+((i*103)%293),y=-4-(i*37)%207;
   const expected=cityFloorAt(seed,x,y,z)?-1:cityClearanceAt(seed,x,y,z)?1:0;
   assert.equal(cityMaterialOverrideAt(seed,x,y,z),expected);
  }
 }
});
test('faster chamber bounding rejection equals existing unoptimized cave result when noise is below legacy threshold',()=>{
 let checked=0;
 for(const seed of [179,-17,2026])for(let i=0;i<900;i++){
  const x=-1500+(i*37)%3000,y=-4-(i*17)%207,z=1100-(i*71)%2400;
  if(candidateNoiseScoreAt(seed,x,y,z)>.13)continue;
  assert.equal(candidateChamberAt(seed,x,y,z),candidateCaveAt(seed,x,y,z));
  checked++;
 }
 assert.ok(checked>500);
});
test('optimized calibrated query retains full reference same-source output across distant coordinates',()=>{
 let checked=0;
 for(const seed of [179,-17,2026,13579])for(const [bx,bz] of [
  [0,0],[1024,-1024],[-16384,16384]]){
  for(let i=0;i<200;i++){
   const x=bx+(i*47)%251,y=-4-(i*11)%207,z=bz+(i*83)%251;
   let expected;
   if(cityFloorAt(seed,x,y,z))expected=false;
   else if(cityClearanceAt(seed,x,y,z))expected=true;
   else if(networkAirAt(seed,x,y,z))expected=true;
   else if(candidateNoiseScoreAt(seed,x,y,z)>caveThresholdForDepth(y))expected=true;
   else expected=candidateChamberAt(seed,x,y,z);
   assert.equal(detachedCalibratedUnderworldAirAt(seed,x,y,z),expected,
    'changed cave voxel '+seed+':'+x+','+y+','+z);
   checked++;
  }
 }
 assert.equal(checked,2400);
});
