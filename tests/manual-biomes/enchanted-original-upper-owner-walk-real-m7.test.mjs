// Original-M7 upper-network *author source* audit, NOT a proof by mere
// proximity. Only true upperCaveCells outputs, matching combined world and
// real full-body stepPlayer can certify movement. Test separate original
// and optional tree worlds. No changes to another cave developer.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {BLOCK} from '../../src/voxel.mjs';
import {originalCaveEntranceSites}
  from '../../src/manual-caves/entrance-preflight.mjs';
import {originalM7AuthoredCaveFloorCap}
  from '../../src/manual-biomes/enchanted-original-cave-descent-evidence.mjs';
import {auditOriginalM7UpperAnchorWalk}
  from '../../src/manual-biomes/enchanted-original-upper-owner-walk-audit.mjs';
const SEED=-88;
const world=experimental=>new FourRegionWorld(SEED,
 fourRegionProfile(SEED,M7_ENVIRONMENT_GENERATOR),
 experimental?{experimentalEnchantedTrees:true}:{});
const names=['upper24-windcut','upper24-hollowbend'];
const summary=result=>({
 ok:result.ok,reason:result.reason??null,
 siteName:result.siteName??null,
 sourceOwnedUpperSteps:result.sourceOwnedUpperSteps??0,
 physicalSteps:result.physicallyTraversedUpperSteps??0,
 sourceStepsConfirmed:result.sourceStepsConfirmed??0,
 diagonalCorners:result.authoredCornersAdded??0,
 firstBlockedAtStep:result.atStep??null,
 blockedAt:result.target??result.source??null,
 inspected:result.inspected??null,
 physicallyAccepted:result.upperPhysicsAccepted??false,
 actualTicks:result.physics?.ticks??0,
 physicalReason:result.physics?.ok?null:result.physics?.reason??null
});

test('two original upper network entrances have authenticated original-owner cave cells or honest precise blocker',()=>{
 const old=world(false),prototype=world(true);
 const diagnostics=[];let trulyPhysicallyWalked=0;
 for(const name of names){
  const originalAnchor=originalCaveEntranceSites().find(a=>a.name===name);
  assert.ok(originalAnchor);
  const cap=originalM7AuthoredCaveFloorCap(old,
    originalAnchor.x,originalAnchor.floor,originalAnchor.z);
  assert.ok(cap,'original authentic upper source anchor preserved');
  for(const steps of [1,2,4,8,16,24]){
   const a=auditOriginalM7UpperAnchorWalk(old,name,{ownerSteps:steps});
   const b=auditOriginalM7UpperAnchorWalk(prototype,name,{ownerSteps:steps});
   assert.equal(a.ok,b.ok,
    'experimental tree candidate must never invent original upper source AIR');
   if(a.ok){
    assert.equal(a.sourceOwnedUpperSteps,steps);
    assert.equal(b.sourceOwnedUpperSteps,steps);
    assert.deepEqual(a.lastSourceUpperCenter,b.lastSourceUpperCenter);
    assert.equal(a.upperPhysicsAccepted,b.upperPhysicsAccepted,
      'actual physics on original upper source must match candidate');
    if(a.upperPhysicsAccepted){
     assert.equal(a.physics.ticks,b.physics.ticks);
     assert.ok(a.physics.sourceAnchorActuallyWalked);
     assert.equal(a.physicallyTraversedUpperSteps,steps);
     assert.equal(a.wholeUpperNetworkProven,false);
     trulyPhysicallyWalked++;
    }else{
     assert.equal(a.physicallyTraversedUpperSteps,0);
    }
   }else{
    assert.equal(a.physicallyTraversedUpperSteps??0,0,
      'source blocker must not claim a route');
   }
   diagnostics.push({name,ownerRouteSteps:steps,
    original:summary(a),experimental:summary(b)});
  }
 }
 console.log('# ENCHANTED ORIGINAL UPPER24 GENUINE OWNER MAP AND BODY-PHYSICS SURVEY '+
  JSON.stringify({diagnostics,authenticatedPhysicalSurveys:trulyPhysicallyWalked,
    noInferredOrConstructedCaveGeometry:true,
    entireUpperNetworkNotClaimed:true}));
 assert.equal(diagnostics.length,12);
 assert.deepEqual(old.save(),{schema:1,seed:SEED,edits:[]});
 assert.throws(()=>prototype.save(),/cannot be saved as historical M7/);
});

test('mining a genuine upper network original anchor never creates synthetic future source/walking proof',()=>{
 const original=world(false);
 const anchor=originalCaveEntranceSites().find(a=>a.name==='upper24-windcut');
 assert.ok(originalM7AuthoredCaveFloorCap(original,
  anchor.x,anchor.floor,anchor.z));
 assert.equal(original.set(anchor.x,anchor.floor,anchor.z,BLOCK.AIR),true);
 assert.equal(originalM7AuthoredCaveFloorCap(original,
  anchor.x,anchor.floor,anchor.z),null);
 const denied=auditOriginalM7UpperAnchorWalk(original,
  'upper24-windcut',{ownerSteps:2});
 assert.equal(denied.ok,false);
 assert.equal(denied.reason,'original-upper-entrance-not-physically-authored');
 assert.equal(denied.physicallyTraversedUpperSteps??0,0);
 console.log('# ENCHANTED UPPER24 ORIGINAL SOURCE-ANCHOR MINING PROTECTION '+
  JSON.stringify({anchor:[anchor.x,anchor.floor,anchor.z],
   actualUserWorldWrites:false,disposableM7WorldOnly:true,
   acceptedPhysicalUpperStepsAfterMining:0,reason:denied.reason}));
});
