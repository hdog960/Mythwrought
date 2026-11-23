// Changed-only original-repository Node22 tests for REAL per-25ms player
// traces. Earlier certified three-leg negative-X route is replayed, not
// re-searched. Never synthesize source/cave geometry or rewrite physics.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {chunkCoord} from '../../src/voxel.mjs';
import {originalM7PhysicalGroundCap}
  from '../../src/manual-biomes/enchanted-original-standing-diagnostic.mjs';
import {traceOriginalM7PhysicalWalkTicks}
  from '../../src/manual-biomes/enchanted-original-physics-tick-trace.mjs';

const seed=-88;
const history=()=>new FourRegionWorld(seed,
  fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const candidate=()=>new FourRegionWorld(seed,
  fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
  {experimentalEnchantedTrees:true});
const cells=[[-272,-588],[-273,-588],[-274,-588],[-275,-588]];
function actualCaps(world){
 return cells.map(([x,z])=>originalM7PhysicalGroundCap(world,x,z));
}

test('original seed -88 three-leg player trace actually crosses the negative-X 16-block chunk boundary at real physics ticks',()=>{
 const original=history(),prototype=candidate();
 const a=actualCaps(original),b=actualCaps(prototype);
 assert.ok(a.every(Boolean),'prior authenticated three-leg original grass source');
 assert.ok(b.every(Boolean),'candidate cannot invent source ground');
 assert.equal(chunkCoord(-272),-17);
 assert.equal(chunkCoord(-273),-18);
 const originalTick=traceOriginalM7PhysicalWalkTicks(original,a);
 assert.equal(originalTick.ok,true,'unchanged real original M7 stepPlayer must reach all three legs');
 assert.equal(originalTick.metrics.actualLegs,3);
 assert.equal(originalTick.frames.length,originalTick.metrics.actualPhysicsTicks+1);
 assert.ok(originalTick.metrics.actualSignedChunkSeams>=1,
   'real continuous player trace must cross signed -17 to -18 ownership seam');
 assert.ok(originalTick.seams.some(s=>s.from[0]===-17&&s.to[0]===-18),
   'the exact negative chunk boundary must be crossed by player feet');
 assert.equal(originalTick.perLegTicks.reduce((x,y)=>x+y,0),
   originalTick.originalPhysics.ticks);
 assert.equal(originalTick.perLegSteps.reduce((x,y)=>x+y,0),
   originalTick.originalPhysics.steps);
 assert.equal(originalTick.metrics.realCaveMouthTraversalsCertified,0);
 assert.ok(originalTick.metrics.maxPlayerMotionPer25msTick>0);
 const experimentalTick=traceOriginalM7PhysicalWalkTicks(prototype,b);
 assert.equal(experimentalTick.ok,true);
 assert.equal(experimentalTick.originalPhysics.ticks,
   originalTick.originalPhysics.ticks,
   'candidate and original 25ms real controller ticks must agree');
 assert.equal(experimentalTick.metrics.actualSignedChunkSeams,
   originalTick.metrics.actualSignedChunkSeams);
 assert.deepEqual(original.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>prototype.save(),/cannot be saved as historical M7/);
 console.log('# ENCHANTED ORIGINAL M7 REAL 25MS SIGNED CHUNK SEAM '+JSON.stringify({
  realOriginalTicks:originalTick.originalPhysics.ticks,
  realCandidateTicks:experimentalTick.originalPhysics.ticks,
  realOriginalChunkSeams:originalTick.seams,
  playerFeetVerticalRange:originalTick.metrics.actualFeetVerticalRange,
  trueGroundContactTicks:originalTick.metrics.groundContactTicks,
  noFabricatedCaveMouthProof:true,
  fullOriginalSaveUnchanged:true}));
});

test('actual mined legacy source blocks never generate a synthetic physics tick trace',()=>{
 const original=history(),caps=actualCaps(original);
 assert.ok(caps.every(Boolean));
 const originalAccepted=traceOriginalM7PhysicalWalkTicks(original,caps);
 assert.equal(originalAccepted.ok,true);
 assert.equal(original.set(caps[2].x,caps[2].surface,caps[2].z,0),true);
 const rejected=traceOriginalM7PhysicalWalkTicks(original,caps);
 assert.equal(rejected.ok,false);
 assert.equal(rejected.reason,'original-ground-changed');
 assert.equal(rejected.frames.length,0,
   'a rejected path must not produce accepted partial witness frames');
 assert.throws(()=>traceOriginalM7PhysicalWalkTicks(original,caps,{edgeTicks:49}),
   /Invalid original M7 physical tick trace/);
 console.log('# ENCHANTED REAL 25MS SOURCE AIR EDIT VETO '+JSON.stringify({
  originalTicks:originalAccepted.originalPhysics.ticks,
  minedSourceRejected:true,
  fabricatedTickFrames:rejected.frames.length,
  disposableTestWorldOnly:true}));
});
