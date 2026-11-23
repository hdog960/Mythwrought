// Enchanted Phase 2, isolated original-M7 cave research: extend previously
// authenticated six interior steps to twelve, preserving original 25ms
// stepPlayer, real authored cave-floor/AIR provenance, 48-tick per-leg cap,
// inherited momentum/gravity, full-body collision and immutable source.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {BLOCK} from '../../src/voxel.mjs';
import {inspectAllOriginalM7AuthoredCaveMouths}
  from '../../src/manual-biomes/enchanted-original-authored-mouth-audit.mjs';
import {originalM7AuthoredCaveFloorCap,originalM7NamedCaveDescentSource,
  replayOriginalM7AuthoredCaveDescent}
  from '../../src/manual-biomes/enchanted-original-cave-descent-evidence.mjs';

const seed=-88;
const historical=()=>new FourRegionWorld(seed,
 fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const prototype=()=>new FourRegionWorld(seed,
 fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
 {experimentalEnchantedTrees:true});

test('four original named M7 cave entrances descend twelve REAL source-owned steps with continuous player controller',()=>{
 const old=historical(),candidate=prototype(),results=[];
 const names=inspectAllOriginalM7AuthoredCaveMouths(old).map(s=>s.name);
 assert.equal(names.length,4);
 for(const name of names){
  const a=originalM7NamedCaveDescentSource(old,name,{inwardSteps:12});
  const b=originalM7NamedCaveDescentSource(candidate,name,{inwardSteps:12});
  assert.equal(a.ok,true,'real historical authored ramp: '+name+' '+JSON.stringify(a));
  assert.equal(b.ok,true,'real prototype authored ramp: '+name+' '+JSON.stringify(b));
  assert.ok(a.startedOutsideMouth&&b.startedOutsideMouth);
  assert.equal(a.sourceOwnedCaveFloorCells,13);
  assert.deepEqual(a.path.map(v=>[v.x,v.feet,v.z]),
   b.path.map(v=>[v.x,v.feet,v.z]),'source exact original/candidate route');
  const original=replayOriginalM7AuthoredCaveDescent(old,a);
  const experimental=replayOriginalM7AuthoredCaveDescent(candidate,b);
  results.push({name,original,experimental,
    authenticatedFloorDrop:a.authoredFloorDrop,
    realOutsideStartFeet:a.path[0].feet,
    realEndFeet:a.path.at(-1).feet});
  if(!original.ok||!experimental.ok)continue;
  assert.equal(original.walkedLegs,a.path.length-1);
  assert.ok(original.walkedLegs>=13);
  assert.equal(original.ticks,experimental.ticks);
  assert.equal(original.physicallyIntegratedFrames,original.ticks);
  assert.equal(original.walkedPastOriginalMouth,true);
  assert.ok(a.authoredFloorDrop>=6);
  const expectedNet=a.path[0].feet-a.path.at(-1).feet;
  assert.ok(Math.abs(original.actualPlayerFeetDrop-expectedNet)<.1);
  assert.ok(Math.abs(experimental.actualPlayerFeetDrop-expectedNet)<.1);
  assert.equal(original.deepNetworkAccepted,false);
 }
 console.log('# ENCHANTED ORIGINAL M7 TWELVE SOURCE DESCENT STEPS '+
  JSON.stringify({results,successes:results.filter(r=>r.original.ok&&r.experimental.ok).length,
    fullDeepNetworkProof:false,physicalIphoneAcceptance:false}));
 assert.equal(results.filter(r=>r.original.ok&&r.experimental.ok).length,4,
  'all four source-authentic deeper original/candidate walks must actually succeed');
 assert.deepEqual(old.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>candidate.save(),/cannot be saved as historical M7/);
});

test('mine an original M7 authored cave support at a deeper inward step: no invented player route',()=>{
 const old=historical(),source=originalM7NamedCaveDescentSource(old,
   'old-deep24',{inwardSteps:12});
 assert.equal(source.ok,true);
 const target=source.path.find(p=>p.step===source.path.at(-1).step);
 assert.ok(target&&target.owner==='original-source-authored-cave-floor');
 assert.ok(originalM7AuthoredCaveFloorCap(old,target.x,target.surface,target.z));
 assert.equal(old.set(target.x,target.surface,target.z,BLOCK.AIR),true);
 assert.equal(originalM7AuthoredCaveFloorCap(old,target.x,target.surface,target.z),null);
 const denied=replayOriginalM7AuthoredCaveDescent(old,source);
 assert.equal(denied.ok,false);
 assert.equal(denied.reason,'original-source-floor-changed');
 assert.equal(denied.ticks,0);
 console.log('# ENCHANTED ORIGINAL DEEPER AUTHORED SOURCE MINING VETO '+
 JSON.stringify({target:[target.x,target.surface,target.z],
  realOriginalWorldSet:true,rejectedBeforePhysics:true,
  userSavesUntouched:true}));
});
