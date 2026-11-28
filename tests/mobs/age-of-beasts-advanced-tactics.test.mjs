import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../../src/voxel.mjs';
import {MOUNTAIN_V8_MATERIAL as M,mountainV8Material} from '../../src/manual-biomes/mountain-v8-materials.mjs';
import {createExpansionWorldQuery} from '../../src/mobs/age-of-beasts/physical-query.mjs';
import {completeBeastCandidateCatalog} from '../../src/mobs/age-of-beasts/complete-catalog.mjs';
import {createDesertActor,stepDesertActor,createForestActor,stepForestActor,createCaveActor,stepCaveActor,createPlainsActor,stepPlainsActor,createSnowActor,stepSnowActor} from '../../src/mobs/age-of-beasts/plains-execution.mjs';
const cat=completeBeastCandidateCatalog();
function fixture(biome,floor=-3,snow=false){
 const get=(x,y,z)=>y===floor?(snow?M.snow:BLOCK.STONE):BLOCK.AIR;
 const query=createExpansionWorldQuery({get,mobMountainShape:mountainV8Material},{resident:()=>true,revision:()=>1,observe:()=>({biome,hazard:false,light:.2,dayPhase:'night'}),extraOverlayBlocked:()=>false});
 return {query,revision:()=>1,materialAt:get};
}
test('three territorial creatures pursue within home radius and return when target leaves',()=>{
 for(const [id,biome,floor,create,step] of [['sand-colossus','desert',-3,createDesertActor,stepDesertActor],['chimera','forest',-3,createForestActor,stepForestActor],['abyssal-sentinel','cave',-100,createCaveActor,stepCaveActor]]){
  const {query:q}=fixture(biome,floor),a=create(cat.get(id),[.5,floor+1,.5],q);
  const target={position:[7,floor+1.5,.5]};let hits=0;
  for(let i=0;i<20;i++)assert.ok(step(a,q,{target,commitDamage:()=>{hits++;return true;}}));
  const x=a.position[0];assert.ok(x>.5,id);
  target.position=[100,floor+1.5,.5];
  for(let i=0;i<60;i++)assert.ok(step(a,q,{target,commitDamage:()=>{hits++;return true;}}));
  assert.ok(Math.abs(a.position[0]-.5)<.25,id);assert.equal(hits,0);
  assert.deepEqual(a.home,[.5,floor+1,.5]);
 }
});
test('actual dire-hound peer snapshots stagger lunges in distinct owner tick slots',()=>{
 const {query:q}=fixture('meadow'),c=cat.get('dire-hound'),a=createPlainsActor(c,[-.5,-2,.5],q),b=createPlainsActor(c,[.5,-2,-.5],q);
 a.id='hound-a';b.id='hound-b';
 const target={id:'target',alive:true,position:[.5,-1.7,.5]},hits=[];
 for(let tick=0;tick<32;tick++){
  const readPeers=()=>({revision:1,tick,entities:[a,b].map(x=>({id:x.id,species:x.species,state:x.state,position:[...x.position],targetId:target.id}))});
  for(const x of [a,b])assert.ok(stepPlainsActor(x,q,{target,controllerTick:tick,readPeers,commitDamage:(v,n,rev,k)=>{hits.push({id:x.id,tick,k});return true;}}));
 }
 assert.equal(hits.length,2);assert.equal(hits[0].k,'lunge');assert.equal(hits[1].k,'lunge');assert.notEqual(hits[0].tick,hits[1].tick);
 for(const h of hits)assert.equal(Math.floor(h.tick/4)%2,h.id==='hound-a'?0:1);
});
test('Snowdrifter accelerates on physical snow, bounds roll duration and cannot roll on stone',()=>{
 const v=fixture('snow',-3,true),q=v.query,a=createSnowActor(cat.get('snowdrifter'),[.5,-2,.5],q),threat={position:[3,-1.8,.5]};
 for(let i=0;i<10;i++)assert.ok(stepSnowActor(a,q,{ownerView:v,threat}));
 assert.equal(a.motionMode,'roll');assert.ok(a.position[0]<-.5);assert.equal(a.rollTicks,10);
 for(let i=0;i<8;i++)assert.ok(stepSnowActor(a,q,{ownerView:v,threat:{position:[a.position[0]+2,-1.8,.5]}}));
 assert.equal(a.rollCooldown,30);assert.ok(stepSnowActor(a,q,{ownerView:v,threat:{position:[a.position[0]+2,-1.8,.5]}}));assert.notEqual(a.motionMode,'roll');
 const s=fixture('snow'),b=createSnowActor(cat.get('snowdrifter'),[.5,-2,.5],s.query);
 assert.ok(stepSnowActor(b,s.query,{ownerView:s,threat}));assert.notEqual(b.motionMode,'roll');
});
