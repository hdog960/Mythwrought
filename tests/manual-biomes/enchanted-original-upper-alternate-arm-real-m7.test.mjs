import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {BLOCK} from '../../src/voxel.mjs';
import {planOriginalM7UpperAlternateArm,walkOriginalM7UpperAlternateArm} from '../../src/manual-biomes/enchanted-original-upper-alternate-arm.mjs';
import {replayFullOriginalM7CaveAnchorWalk} from '../../src/manual-biomes/enchanted-original-full-anchor-continuity.mjs';
const seed=-88;
const make=(trees=false)=>new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),trees?{experimentalEnchantedTrees:true}:{});
const names=['upper24-windcut','upper24-hollowbend'];
test('both literal authored upper alternate loop arms, original and experimental real player outcomes',()=>{
 const a=make(),b=make(true),records=[];
 for(const name of names)for(const sign of [1,-1]){
  const x=walkOriginalM7UpperAlternateArm(a,name,sign),y=walkOriginalM7UpperAlternateArm(b,name,sign);
  assert.deepEqual(x,y);
  if(x.ok){
   assert.equal(x.finishedOriginalMain,true);
   assert.ok(x.armLegs>=56);
   assert.equal(x.wholeNetworkAccepted,false);
  }else assert.ok(x.reason);
  records.push({name,sign,...x});
 }
 console.log('ENCHANTED ORIGINAL ALTERNATE LOOP OUTCOMES '+JSON.stringify(records));
 assert.equal(records.length,4);
 assert.deepEqual(a.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>b.save(),/cannot be saved as historical M7/);
});
test('real alternate-arm source support edit veto, or explicitly record no admissible original arm',()=>{
 const a=make();let p;
 for(const name of names)for(const sign of [1,-1]){
  const q=planOriginalM7UpperAlternateArm(a,name,sign);
  if(q.ok&&!p)p=q;
 }
 if(!p){
  console.log('ENCHANTED ORIGINAL ALTERNATE LOOP EDIT VETO NOT APPLICABLE: no admitted source arm');
  return;
 }
 const v=p.arm.find(q=>[q.x,q.surface,q.z].join(',')===p.midpoint.join(','));
 assert.ok(v);
 assert.equal(a.set(v.x,v.surface,v.z,BLOCK.AIR),true);
 const r=replayFullOriginalM7CaveAnchorWalk(a,p.plan);
 assert.equal(r.ok,false);
 assert.equal(r.reason,'original-authored-source-was-edited');
 assert.equal(r.ticks,0);
 console.log('ENCHANTED ORIGINAL ALTERNATE LOOP EDIT VETO '+JSON.stringify({name:p.name,sign:p.sign,mined:p.midpoint,ticks:r.ticks}));
});
