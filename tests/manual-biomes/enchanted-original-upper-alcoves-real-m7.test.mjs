import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {BLOCK} from '../../src/voxel.mjs';
import {planOriginalM7UpperAlcove,walkOriginalM7UpperAlcove} from '../../src/manual-biomes/enchanted-original-upper-alcove-excursion.mjs';
import {replayFullOriginalM7CaveAnchorWalk,planFullOriginalM7CaveAnchorWalk} from '../../src/manual-biomes/enchanted-original-full-anchor-continuity.mjs';
const names=['upper24-windcut','upper24-hollowbend'];
const make=(seed,trees=false)=>new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),trees?{experimentalEnchantedTrees:true}:{});
function identity(a,b,seed){
 assert.deepEqual(a.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>b.save(),/cannot be saved as historical M7/);
}
test('six original high-roof alcoves: actual source admission and uninterrupted physics parity, or precise rejection',()=>{
 const a=make(-88),b=make(-88,true),results=[];
 for(const name of names)for(const d of [48,85,110]){
  const x=walkOriginalM7UpperAlcove(a,name,d),y=walkOriginalM7UpperAlcove(b,name,d);
  assert.deepEqual(x,y);
  if(x.ok){assert.equal(x.finishedMain,true);assert.ok(x.excursionLegs>=4);assert.equal(x.wholeRoomAccepted,false);}
  else assert.ok(x.reason);
  results.push(x);
 }
 console.log('ENCHANTED SIX ORIGINAL ALCOVE OUTCOMES '+JSON.stringify(results));
 assert.equal(results.length,6);
 identity(a,b,-88);
});
test('actual admitted original alcove support mined to AIR vetoes stale replay before movement',()=>{
 const a=make(-88);
 let p=null;
 for(const name of names)for(const d of [110,85,48]){
  const x=planOriginalM7UpperAlcove(a,name,d);
  if(x.ok&&!p)p=x;
 }
 assert.ok(p,'At least one actual source-owned alcove route needed for support edit evidence');
 const v=p.out.at(-1);
 assert.equal(a.set(v.x,v.surface,v.z,BLOCK.AIR),true);
 const r=replayFullOriginalM7CaveAnchorWalk(a,p.plan);
 assert.equal(r.ok,false);assert.equal(r.reason,'original-authored-source-was-edited');assert.equal(r.ticks,0);
 console.log('ENCHANTED ORIGINAL ALCOVE MINING VETO '+JSON.stringify({name:p.name,d:p.d,mined:p.target,ticks:r.ticks}));
});
test('bounded independent M7 seeds 179 and 2026: original/candidate surface-to-deep24 and one new upper alcove attempt per seed',()=>{
 const records=[];
 for(const [seed,name] of [[179,names[0]],[2026,names[1]]]){
  const a=make(seed),b=make(seed,true);
  const deep=w=>{
   const p=planFullOriginalM7CaveAnchorWalk(w,'old-deep24',{spiralSteps:24});
   const r=p.ok?replayFullOriginalM7CaveAnchorWalk(w,p):null;
   return {source:p.ok,physical:r?.ok===true,reason:p.ok?r?.reason??null:p.reason,
    blocked:p.position??r?.failedSourceCell??null,ticks:r?.ticks??0,legs:r?.walkedLegs??0,
    accepted:r?.actualDeepSpiralStepsWalked??0};
  };
  const x=deep(a),y=deep(b);assert.deepEqual(x,y);
  const u=walkOriginalM7UpperAlcove(a,name,110),v=walkOriginalM7UpperAlcove(b,name,110);
  assert.deepEqual(u,v);
  if(x.physical)assert.equal(x.accepted,24);
  if(u.ok)assert.equal(u.finishedMain,true);
  records.push({seed,deep:x,alcove:u});
  identity(a,b,seed);
 }
 console.log('ENCHANTED BOUNDED NEW SEED WITNESSES '+JSON.stringify(records));
});
