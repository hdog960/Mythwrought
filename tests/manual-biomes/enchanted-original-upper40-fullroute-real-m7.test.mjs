// Original source/authenticated upper cave extension beyond accepted 24
// steps. The real original upperCaveCells author, actual M7 world.get,
// whole-body AABB and unchanged original stepPlayer remain authoritative.
// No diagonal floor invention; author-owned cardinal intermediates ONLY.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
 from '../../src/manual-biomes/profile-world.mjs';
import {BLOCK} from '../../src/voxel.mjs';
import {auditOriginalM7UpperAnchorWalk,ORIGINAL_UPPER_M7_BOUNDS}
 from '../../src/manual-biomes/enchanted-original-upper-owner-walk-audit.mjs';
import {originalM7AuthoredCaveFloorCap}
 from '../../src/manual-biomes/enchanted-original-cave-descent-evidence.mjs';
const seed=-88;
const world=trees=>new FourRegionWorld(seed,
 fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
 trees?{experimentalEnchantedTrees:true}:{});
const names=['upper24-windcut','upper24-hollowbend'];
const describe=(x,step)=>({ownerStep:step,sourceOwned:x.ok,
 originalBlocker:x.ok?null:{
  reason:x.reason,atStep:x.atStep??null,
  target:x.target??x.prior??null},
 realPlayerWalked:x.upperPhysicsAccepted??false,
 physicalSteps:x.physicallyTraversedUpperSteps??0,
 physicsTicks:x.physics?.ticks??0,
 actualOwnerCorners:x.authoredCornersAdded??0,
 lastOriginalCenter:x.lastSourceUpperCenter??null,
 playerReason:x.physics?.ok?null:x.physics?.reason??null
});
test('both genuine upper galleries physically continue at least 40 original owner-route steps from real surface',()=>{
 const a=world(false),b=world(true),results=[];
 assert.equal(ORIGINAL_UPPER_M7_BOUNDS.ownerSteps,120);
 for(const name of names){
  const original=auditOriginalM7UpperAnchorWalk(a,name,{ownerSteps:40});
  const prototype=auditOriginalM7UpperAnchorWalk(b,name,{ownerSteps:40});
  results.push({name,original:describe(original,40),
    experimental:describe(prototype,40)});
  assert.equal(original.ok,true,
    'real original owner-authored floor/headroom required for '+name);
  assert.equal(prototype.ok,true,
    'prototype may not invent original cave owner floor for '+name);
  assert.equal(original.upperPhysicsAccepted,true,
    'original actual physics must walk upper route 40');
  assert.equal(prototype.upperPhysicsAccepted,true);
  assert.equal(original.physics.ticks,prototype.physics.ticks);
  assert.deepEqual(original.lastSourceUpperCenter,
    prototype.lastSourceUpperCenter);
  assert.equal(original.physicallyTraversedUpperSteps,40);
  assert.ok(original.authoredCornersAdded>=3,
    'original upper diagonal corners must be physically owned, not fabricated');
  assert.equal(original.physics.fullDeepNetworkAccepted,false);
 }
 console.log('# ENCHANTED ORIGINAL M7 UPPER24 REAL FORTY OWNER STEPS '+JSON.stringify({
  results,uninterruptedOriginalController:true,
  caveOwnerWrites:0,fullUpperNetworkAccepted:false}));
 assert.deepEqual(a.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>b.save(),/cannot be saved as historical M7/);
});

test('survey source-authentic upper galleries through steps 56,72,96,120, report precise first actual blocker and physics',()=>{
 const a=world(false),b=world(true),results=[];
 for(const name of names)for(const step of [56,72,96,120]){
  const old=auditOriginalM7UpperAnchorWalk(a,name,{ownerSteps:step});
  const proto=auditOriginalM7UpperAnchorWalk(b,name,{ownerSteps:step});
  assert.equal(old.ok,proto.ok,
    'prototype cannot fabricate real original upper source/physical owner');
  if(old.ok){
   assert.equal(old.sourceOwnedUpperSteps,step);
   assert.deepEqual(old.lastSourceUpperCenter,proto.lastSourceUpperCenter);
   assert.equal(old.upperPhysicsAccepted,proto.upperPhysicsAccepted,
     'real original/candidate physics parity required');
   if(old.upperPhysicsAccepted){
    assert.equal(old.physics.ticks,proto.physics.ticks);
    assert.equal(old.physicallyTraversedUpperSteps,step);
    assert.equal(old.physics.fullDeepNetworkAccepted,false);
   }else assert.equal(old.physicallyTraversedUpperSteps,0);
  }else assert.equal(old.physicallyTraversedUpperSteps??0,0);
  results.push({name,original:describe(old,step),
    experimental:describe(proto,step)});
 }
 console.log('# ENCHANTED ORIGINAL M7 LONG UPPER OWNER REAL SOURCE PHYSICS SURVEY '+
 JSON.stringify({results,truePhysicalAccepted:results.filter(r=>
  r.original.realPlayerWalked).length,
  fullUpperGalleryNotImplied:true,sourceOrPhysicalBlockersDoNotCreateAir:true}));
 assert.deepEqual(a.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>b.save(),/cannot be saved as historical M7/);
});

test('upper owner source mining inside a genuine extended 40-step route vetoes entire physical walk',()=>{
 const a=world(false);
 const accepted=auditOriginalM7UpperAnchorWalk(a,
  'upper24-windcut',{ownerSteps:40});
 assert.equal(accepted.ok,true);
 assert.equal(accepted.upperPhysicsAccepted,true);
 const [x,floor,z]=accepted.lastSourceUpperCenter;
 assert.ok(originalM7AuthoredCaveFloorCap(a,x,floor,z));
 assert.equal(a.set(x,floor,z,BLOCK.AIR),true);
 assert.equal(originalM7AuthoredCaveFloorCap(a,x,floor,z),null);
 const denied=auditOriginalM7UpperAnchorWalk(a,
  'upper24-windcut',{ownerSteps:40});
 assert.equal(denied.ok,false);
 assert.equal(denied.physicallyTraversedUpperSteps??0,0);
 console.log('# ENCHANTED ORIGINAL M7 EXTENDED UPPER SOURCE MINING VETO '+
  JSON.stringify({actuallyMined:[x,floor,z],
   originalResult:describe(denied,40),
   realUserSavesModified:false}));
});
