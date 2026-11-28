import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../../src/voxel.mjs';
import {createExpansionWorldQuery} from '../../src/mobs/age-of-beasts/physical-query.mjs';
import {createBeastEngineFixture} from '../../src/mobs/age-of-beasts/engine-fixture.mjs';
import {completeBeastCandidateCatalog} from '../../src/mobs/age-of-beasts/complete-catalog.mjs';
import {readExpansionHabitatFacts} from '../../src/mobs/age-of-beasts/habitat-facts.mjs';
import {createDesertActor,stepDesertActor,createForestActor,stepForestActor} from '../../src/mobs/age-of-beasts/plains-execution.mjs';
import {FIXED_STEP} from '../../src/mobs/engine.mjs';
const cat=completeBeastCandidateCatalog();
function fixture(get,biome,phase=()=> 'night'){
 const query=createExpansionWorldQuery({get},{resident:()=>true,revision:()=>1,observe:()=>({biome,hazard:false,light:phase()==='night'?.2:.8,dayPhase:phase()}),extraOverlayBlocked:()=>false});
 return {query,revision:()=>1,materialAt:get,generatedMaterialAt:get};
}
test('Scarefiend uses original engine disguise and twelve-tick awakening before actual ambush damage',()=>{
 let phase='night';
 const v=fixture((x,y,z)=>y===-3?BLOCK.GRASS:BLOCK.AIR,'meadow',()=>phase),f=createBeastEngineFixture(v),p=[.5,-2,.5];
 const id=f.selectAndSpawn({proposals:[{id:'scarefiend',point:p,rarityRoll:0}],observer:[8,-2,.5],homeChunk:'0,0,0'});
 assert.ok(id);const cow=f.spawnOriginal('cow',[1.7,-2,.5]);assert.ok(cow);
 const cmd=[{id,targetId:cow}],hp=f.get(cow).health;
 f.advancePopulation(FIXED_STEP);assert.equal(f.get(id).motionMode,'disguise');
 for(let i=0;i<6;i++){f.advancePopulation(FIXED_STEP,cmd);assert.equal(f.get(id).motionMode,'awaken');assert.equal(f.get(cow).health,hp);}
 phase='day';f.advancePopulation(FIXED_STEP,cmd);assert.equal(f.get(cow).health,hp);
 phase='night';
 for(let i=0;i<12;i++){f.advancePopulation(FIXED_STEP,cmd);assert.equal(f.get(id).motionMode,'awaken');assert.equal(f.get(cow).health,hp);}
 for(let i=0;i<35;i++)f.advancePopulation(FIXED_STEP,cmd);
 assert.equal(f.get(cow).health,hp-cat.get('scarefiend').record.combat.damage);
 f.dispose();
});
test('Scorpion and Treant cannot switch physical attack variants without fresh windup',()=>{
 for(const [id,biome,create,step,near,far,first,second] of [
  ['giant-scorpion','desert',createDesertActor,stepDesertActor,.8,1.5,'pincer','tail-strike'],
  ['corrupted-treant','forest',createForestActor,stepForestActor,1.0,2.1,'root-strike','branch-strike']]){
  const v=fixture((x,y,z)=>y===-3?BLOCK.STONE:BLOCK.AIR,biome),c=cat.get(id),a=create(c,[.5,-2,.5],v.query);
  const target={position:[.5+near,-2,.5],alive:true},hits=[],opts={target,commitDamage:(victim,amount,rev,kind)=>{hits.push({amount,kind});return true;}};
  const ticks=Math.ceil(c.record.combat.windup*30);
  for(let i=0;i<ticks-2;i++)assert.ok(step(a,v.query,opts));assert.equal(hits.length,0);
  target.position=[.5+far,-2,.5];
  for(let i=0;i<ticks-2;i++)assert.ok(step(a,v.query,opts));assert.equal(hits.length,0);
  for(let i=0;i<5;i++)assert.ok(step(a,v.query,opts));assert.deepEqual(hits,[{amount:c.record.combat.damage,kind:second}]);
  target.position=[.5+near,-2,.5];
  for(let i=0;i<Math.ceil(c.record.combat.cooldown*30)+ticks+5;i++)assert.ok(step(a,v.query,opts));
  assert.deepEqual(hits,[{amount:c.record.combat.damage,kind:second},{amount:c.record.combat.damage,kind:first}]);
 }
});
test('Treant dense forest gate requires two real woody directions and known source',()=>{
 const c=cat.get('corrupted-treant'),p=[.5,-2,.5];
 const get=(x,y,z)=>y===-3?BLOCK.STONE:(x===4||x===-4)&&z===0&&y>=-2&&y<=0?BLOCK.WOOD:BLOCK.AIR;
 const v=fixture(get,'forest');
 assert.equal(readExpansionHabitatFacts(v,p,c.capability,c.requirement)['dense-forest'],true);
 const open=fixture((x,y,z)=>y===-3?BLOCK.STONE:BLOCK.AIR,'forest');
 assert.equal(readExpansionHabitatFacts(open,p,c.capability,c.requirement)['dense-forest'],false);
 assert.equal(readExpansionHabitatFacts({...v,materialAt:(x,y,z)=>x===4?undefined:get(x,y,z)},p,c.capability,c.requirement)['dense-forest'],false);
});
