import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../../src/voxel.mjs';
import {createExpansionWorldQuery} from '../../src/mobs/age-of-beasts/physical-query.mjs';
import {completeBeastCandidateCatalog} from '../../src/mobs/age-of-beasts/complete-catalog.mjs';
import {createForestActor,stepForestActor,createCaveActor,stepCaveActor} from '../../src/mobs/age-of-beasts/plains-execution.mjs';
const cat=completeBeastCandidateCatalog();
function fixture(biome,floor){return createExpansionWorldQuery({get:(x,y,z)=>y===floor?BLOCK.STONE:BLOCK.AIR},{resident:()=>true,revision:()=>1,observe:()=>({biome,hazard:false,light:.2,dayPhase:'night'}),extraOverlayBlocked:()=>false});}
test('Chimera and Hydra resolve three bounded owner-confirmed attacks at separate ticks',()=>{
 for(const [id,biome,floor,create,step,prefix] of [['chimera','forest',-3,createForestActor,stepForestActor,'chimera-strike'],['abyssal-hydra','cave',-100,createCaveActor,stepCaveActor,'hydra-bite']]){
  const q=fixture(biome,floor),c=cat.get(id),a=create(c,[.5,floor+1,.5],q),target={position:[2,floor+1.4,.5]},hits=[];
  for(let tick=0;tick<66;tick++)assert.ok(step(a,q,{target,commitDamage:(v,amount,rev,kind)=>{assert.equal(v,target);assert.equal(rev,1);hits.push({tick,amount,kind});return true;}}));
  assert.deepEqual(hits.map(h=>h.kind),[prefix+'-1',prefix+'-2',prefix+'-3']);
  assert.equal(hits.reduce((n,h)=>n+h.amount,0),c.record.combat.damage);
  assert.ok(hits[1].tick-hits[0].tick>=8&&hits[2].tick-hits[1].tick>=8);
  assert.equal(a.combo,null);assert.ok(a.cooldown>0);
 }
});
test('target loss cancels multiattack; rejected hit preserves pending state without resetting cooldown',()=>{
 const q=fixture('forest',-3),a=createForestActor(cat.get('chimera'),[.5,-2,.5],q),target={position:[2,-1.6,.5]},hits=[];
 const commit=(v,n,rev,k)=>{hits.push(k);return true;};
 for(let i=0;i<40&&!hits.length;i++)assert.ok(stepForestActor(a,q,{target,commitDamage:commit}));
 assert.deepEqual(hits,['chimera-strike-1']);assert.ok(a.combo);
 for(let i=0;i<7;i++)assert.ok(stepForestActor(a,q,{target,commitDamage:commit}));
 const before=a.combo,cd=a.cooldown;
 assert.equal(stepForestActor(a,q,{target,commitDamage:()=>false}),false);
 assert.equal(a.combo,before);assert.equal(a.cooldown,cd);
 assert.ok(stepForestActor(a,q,{target:{position:[9,-1.6,.5]},commitDamage:commit}));
 assert.equal(a.combo,null);assert.equal(hits.length,1);
});
