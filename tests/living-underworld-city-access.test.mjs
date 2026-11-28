import test from 'node:test';
import assert from 'node:assert/strict';
import {planUnderworldRegion} from '../src/living-underworld/worldwide-network.mjs';
import {auditFullCityCandidate} from '../src/living-underworld/city-full-floor-audit.mjs';
import {auditCityAccessRamp} from '../src/living-underworld/city-access-proposal.mjs';
test('each real detached giant city pad has a face-connected AIR approach with a three-wide supported-step design',()=>{
 let verified=0;
 for(const seed of [179,-17,2026,314159]){
  let loc;
  for(let rx=-5;rx<=5&&!loc;rx++)for(let rz=-5;rz<=5&&!loc;rz++)
   if(planUnderworldRegion(seed,rx,rz).cityCandidate)loc={rx,rz};
  assert.ok(loc);
  const floor=auditFullCityCandidate(seed,loc.rx,loc.rz);
  assert.equal(floor.ok,true,JSON.stringify(floor));
  const approach=auditCityAccessRamp(seed,loc.rx,loc.rz);
  assert.equal(approach.ok,true,JSON.stringify(approach));
  assert.equal(approach.landingSolidSupport,true);
  assert.equal(approach.landing3WideClearance,true);
  assert.equal(approach.candidateStairDeckValid,true);
  assert.ok(approach.routeFaceSteps>=20);
  assert.equal(approach.deckPlaced,false);
  verified++;
 }
 assert.equal(verified,4);
});
test('no-city site and invalid seed fail closed without creating a settlement or route',()=>{
 let loc;
 for(let rx=0;rx<=5&&!loc;rx++)for(let rz=0;rz<=5&&!loc;rz++)
  if(!planUnderworldRegion(179,rx,rz).cityCandidate)loc={rx,rz};
 assert.ok(loc);
 assert.equal(auditCityAccessRamp(179,loc.rx,loc.rz).sitePresent,false);
 assert.throws(()=>auditCityAccessRamp(2147483648,0,0),/Invalid/);
});
