// Original M7 upper-cave mineral-branch overlap physics. The original
// upperCaveCells keeps actual DEEPSTONE floor -26 at step114, even though
// an older raw route waypoint nominally says -27. Genuine authored
// support/headroom, same original stepPlayer and mine veto are mandatory.
// Nothing creates floors, edits original authors, alters save or collision.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
 from '../../src/manual-biomes/profile-world.mjs';
import {BLOCK} from '../../src/voxel.mjs';
import {auditOriginalM7UpperAnchorWalk}
 from '../../src/manual-biomes/enchanted-original-upper-owner-walk-audit.mjs';
import {originalM7AuthoredCaveFloorCap}
 from '../../src/manual-biomes/enchanted-original-cave-descent-evidence.mjs';
const seed=-88;
const world=trees=>new FourRegionWorld(seed,
 fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
 trees?{experimentalEnchantedTrees:true}:{});
const names=['upper24-windcut','upper24-hollowbend'];
function small(s){return {sourceAccepted:s.ok,
 reason:s.reason??null,
 ownerRouteSteps:s.sourceOwnedUpperSteps??0,
 acceptedOriginalPlayer:s.upperPhysicsAccepted??false,
 actualTicks:s.physics?.ticks??0,
 physicsReason:s.physics?.ok?null:s.physics?.reason??null,
 end:s.lastSourceUpperCenter??null,
 overlaps:s.originalOwnedOverlapFloors??null,
 firstBlockedStep:s.atStep??null,
 blockedTarget:s.target??s.actualSourceTarget??null
};}
test('corrected source-aware reader preserves precisely already verified 96-step original upper player physics',()=>{
 const a=world(false),b=world(true),results=[];
 for(const [i,name] of names.entries()){
  const old=auditOriginalM7UpperAnchorWalk(a,name,{ownerSteps:96});
  const experimental=auditOriginalM7UpperAnchorWalk(b,name,{ownerSteps:96});
  assert.equal(old.ok,true);
  assert.equal(experimental.ok,true);
  assert.equal(old.upperPhysicsAccepted,true);
  assert.equal(experimental.upperPhysicsAccepted,true);
  assert.equal(old.physics.ticks,experimental.physics.ticks);
  assert.equal(old.physics.ticks,i===0?1832:1733,
    'accepted old exact original native source physics must not regress');
  results.push({name,ticks:old.physics.ticks,
   originalOwnedOverlapFloors:old.originalOwnedOverlapFloors});
 }
 console.log('# ENCHANTED ORIGINAL M7 UPPER OVERLAP SOURCE READER PRIOR 96-STEP PARITY '+JSON.stringify(results));
});

test('real original and candidate player walk THROUGH authentic raised mineral-gallery floor at step114',()=>{
 const a=world(false),b=world(true),observed=[];
 for(const name of names){
  const original=auditOriginalM7UpperAnchorWalk(a,name,{ownerSteps:114});
  const experimental=auditOriginalM7UpperAnchorWalk(b,name,{ownerSteps:114});
  observed.push({name,original:small(original),experimental:small(experimental)});
  assert.equal(original.ok,true,
    'original owner floor and headroom must authenticate: '+JSON.stringify(small(original)));
  assert.equal(experimental.ok,true);
  assert.equal(original.upperPhysicsAccepted,true,
    'original stepPlayer, not authored geometry alone, must WALK through step114');
  assert.equal(experimental.upperPhysicsAccepted,true);
  assert.equal(original.physics.ticks,experimental.physics.ticks);
  assert.equal(original.physicallyTraversedUpperSteps,114);
  assert.ok(original.originalOwnedOverlapFloors.some(x=>
    x.step===114&&x.nominal[1]===-27&&
    x.physicallyAuthorOwned[1]===-26),
   'must prove actual original -26 owner floor, not use fictitious -27');
  assert.ok(original.physics.sourceAnchorActuallyWalked);
  assert.equal(original.wholeUpperNetworkProven,false);
 }
 console.log('# ENCHANTED ORIGINAL M7 UPPER TRUE -26 OWNER FLOOR STEP114 PHYSICS '+JSON.stringify({
  observed,originalGeometryWrites:0,collisionsBypassed:false,
  allUpperNetworkNotClaimed:true}));
 assert.deepEqual(a.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>b.save(),/cannot be saved as historical M7/);
});

test('full original upper 120 route survey and raised floor original mining veto without fabricated acceptance',()=>{
 const a=world(false),b=world(true),results=[];
 for(const name of names){
  const old=auditOriginalM7UpperAnchorWalk(a,name,{ownerSteps:120});
  const prototype=auditOriginalM7UpperAnchorWalk(b,name,{ownerSteps:120});
  assert.equal(old.ok,prototype.ok);
  if(old.ok){
   assert.deepEqual(old.lastSourceUpperCenter,prototype.lastSourceUpperCenter);
   assert.equal(old.upperPhysicsAccepted,prototype.upperPhysicsAccepted);
   if(old.upperPhysicsAccepted){
    assert.equal(old.physicallyTraversedUpperSteps,120);
    assert.equal(old.physics.ticks,prototype.physics.ticks);
   }
  }
  results.push({name,original:small(old),prototype:small(prototype)});
 }
 console.log('# ENCHANTED ORIGINAL M7 FULL UPPER120 EXACT FLOOR SOURCE PHYSICS '+JSON.stringify({
  results,physicallyVerified:results.filter(x=>
   x.original.acceptedOriginalPlayer).length,
  unrealSourcePassageClaimed:false}));
 const ref=auditOriginalM7UpperAnchorWalk(a,'upper24-windcut',
  {ownerSteps:114});
 assert.equal(ref.ok,true);
 assert.equal(ref.upperPhysicsAccepted,true);
 const pos=[178,-26,-94];
 assert.ok(ref.originalOwnedOverlapFloors.some(x=>
  x.step===114&&x.physicallyAuthorOwned.join(',')===pos.join(',')));
 assert.ok(originalM7AuthoredCaveFloorCap(a,...pos));
 assert.equal(a.set(...pos,BLOCK.AIR),true);
 assert.equal(originalM7AuthoredCaveFloorCap(a,...pos),null);
 const denied=auditOriginalM7UpperAnchorWalk(a,
   'upper24-windcut',{ownerSteps:114});
 assert.equal(denied.ok,false);
 assert.equal(denied.physicallyTraversedUpperSteps??0,0);
 console.log('# ENCHANTED ORIGINAL M7 ACTUAL RAISED GALLERY SUPPORT AIR EDIT VETO '+
  JSON.stringify({realAuthorFloorMined:pos,
   acceptedUpperStepsAfterEdit:0,caveSourceStillUnchanged:true}));
});
