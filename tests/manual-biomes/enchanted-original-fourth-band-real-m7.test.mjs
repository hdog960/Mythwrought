// New original M7 fourth band, fourth chamber and source terminus.
// All old native cases are reused; no production source or collision changes.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {deepCaveRoute,DEEP_CAVE_ORIGIN} from '../../src/deep-cave-network.mjs';
import {BLOCK} from '../../src/voxel.mjs';
import {planFullOriginalM7CaveAnchorWalk,replayFullOriginalM7CaveAnchorWalk} from '../../src/manual-biomes/enchanted-original-full-anchor-continuity.mjs';
import {planOriginalM7FourthChamberRoundTrip,surveyOriginalM7FourthChamberPhysicalReturn} from '../../src/manual-biomes/enchanted-original-fourth-chamber-roundtrip.mjs';
const seed=-88;
const make=(trees=false)=>new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),trees?{experimentalEnchantedTrees:true}:{});
const route=deepCaveRoute(DEEP_CAVE_ORIGIN);
function probe(w,n){
 const p=planFullOriginalM7CaveAnchorWalk(w,'old-deep24',{spiralSteps:n});
 const r=p.ok?replayFullOriginalM7CaveAnchorWalk(w,p):null;
 return {step:n,target:[route[n].x,route[n].floor,route[n].z],
  source:p.ok,physical:r?.ok===true,reason:p.ok?r?.reason??null:p.reason,
  blocked:p.position??r?.failedSourceCell??null,ticks:r?.ticks??0,
  legs:r?.walkedLegs??0,netDrop:r?.actualPlayerFeetDrop??null,
  seams:r?.realChunkSeams??0,accepted:r?.actualDeepSpiralStepsWalked??0};
}
test('original fourth band entry, -185 level and canonical final spiral: unchanged physical parity',()=>{
 const a=make(),b=make(true),results=[];
 assert.equal(route[608].floor,-156);
 assert.equal(route[724].floor,-185);
 assert.equal(route.length,825);
 for(const n of [608,724,784,824]){
  const x=probe(a,n),y=probe(b,n);
  assert.deepEqual(x,y);
  if(x.physical)assert.equal(x.accepted,n);
  results.push(x);
 }
 console.log('ENCHANTED FOURTH BAND AND TERMINUS '+JSON.stringify(results));
 assert.equal(results[0].physical,true);
 assert.deepEqual(a.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>b.save(),/cannot be saved as historical M7/);
});
test('fourth rest chamber genuine source spoke, return and continuing spiral in same player',()=>{
 const a=make(),b=make(true);
 const x=surveyOriginalM7FourthChamberPhysicalReturn(a),y=surveyOriginalM7FourthChamberPhysicalReturn(b);
 const brief=r=>({ok:r.ok,reason:r.reason??null,attempts:r.attempts??null,
  spoke:r.plan?.originalFourthChamberSpoke.map(p=>[p.x,p.surface,p.z])??null,
  ticks:r.replay?.ticks??0,resumed:r.replay?.actualDeepSpiralStepsWalked??0});
 console.log('ENCHANTED FOURTH CHAMBER '+JSON.stringify({original:brief(x),candidate:brief(y)}));
 assert.deepEqual(brief(x),brief(y));
 assert.equal(x.ok,true);
 assert.equal(x.physicallyReturnedToOriginalSpiral,true);
 assert.equal(x.replay.actualDeepSpiralStepsWalked,740);
 assert.deepEqual(a.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>b.save(),/cannot be saved as historical M7/);
});
test('actual fourth chamber mined support rejects entire stale replay with zero ticks',()=>{
 const a=make(),p=planOriginalM7FourthChamberRoundTrip(a);
 assert.equal(p.ok,true);
 const plan=p.candidates[0],v=plan.originalFourthChamberSpoke.at(-1);
 assert.equal(a.set(v.x,v.surface,v.z,BLOCK.AIR),true);
 const r=replayFullOriginalM7CaveAnchorWalk(a,plan);
 assert.equal(r.ok,false);
 assert.equal(r.reason,'original-authored-source-was-edited');
 assert.equal(r.ticks,0);
 console.log('ENCHANTED FOURTH CHAMBER MINING '+JSON.stringify({mined:[v.x,v.surface,v.z],ticks:r.ticks}));
});
