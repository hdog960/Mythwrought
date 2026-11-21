import test from 'node:test';
import assert from 'node:assert/strict';
import {CAVE_CALIBRATION,caveThresholdForDepth,detachedCalibratedUnderworldAirAt}
 from '../src/living-underworld/depth-calibrated-proposal.mjs';
import {planUnderworldRegion} from '../src/living-underworld/worldwide-network.mjs';

test('depth calibration smoothly connects all four geology bands without spikes',()=>{
 assert.equal(caveThresholdForDepth(-4),CAVE_CALIBRATION.upper);
 assert.equal(caveThresholdForDepth(-210),CAVE_CALIBRATION.lowest);
 assert.equal(caveThresholdForDepth(-60),CAVE_CALIBRATION.middle);
 assert.equal(caveThresholdForDepth(-135),CAVE_CALIBRATION.deep);
 for(let y=-209;y<=-4;y++){
  const jump=Math.abs(caveThresholdForDepth(y)-caveThresholdForDepth(y-1));
  assert.ok(jump<.015,'hard cross-depth calibration seam at y '+y);
 }
 assert.throws(()=>caveThresholdForDepth(-211),/Invalid/);
 assert.throws(()=>caveThresholdForDepth(0),/Invalid/);
});
test('calibrated field is nontrivial across distant signed regions, all bands and seeds',()=>{
 for(const seed of [179,-17,2026])for(const [baseX,baseZ] of [
   [0,0],[20480,-20480],[-32768,32768]]) {
  let air=0,solid=0;
  for(let dx=0;dx<160;dx+=16)for(let dz=0;dz<160;dz+=16)
   for(const y of [-20,-55,-90,-130,-170,-205]){
    if(detachedCalibratedUnderworldAirAt(seed,baseX+dx,y,baseZ+dz))air++;
    else solid++;
   }
  assert.ok(air>0&&solid>0,'degenerate detached region '+JSON.stringify({seed,baseX,baseZ}));
 }
 assert.equal(detachedCalibratedUnderworldAirAt(179,1,19,1),false);
 assert.equal(detachedCalibratedUnderworldAirAt(179,1,-211,1),false);
 assert.throws(()=>detachedCalibratedUnderworldAirAt(179,1.5,-25,0),/Invalid/);
});
test('calibrated field cannot hollow guaranteed city-grade floor but preserves interior clearance',()=>{
 let found=0;
 for(let rx=-6;rx<=6;rx++)for(let rz=-6;rz<=6;rz++){
  const city=planUnderworldRegion(179,rx,rz).cityCandidate;
  if(!city)continue;found++;
  const y=city.y-8;
  assert.equal(detachedCalibratedUnderworldAirAt(179,city.x,y,city.z),false);
  for(let h=1;h<=9;h++)
   assert.equal(detachedCalibratedUnderworldAirAt(179,city.x,y+h,city.z),true);
 }
 assert.ok(found>=3);
});
