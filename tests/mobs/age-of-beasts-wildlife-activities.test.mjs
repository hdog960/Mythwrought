import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../../src/voxel.mjs';
import {MOUNTAIN_V8_MATERIAL as M,mountainV8Material} from '../../src/manual-biomes/mountain-v8-materials.mjs';
import {waterCell} from '../../src/block-packs/pack-2/water.mjs';
import {createExpansionWorldQuery} from '../../src/mobs/age-of-beasts/physical-query.mjs';
import {completeBeastCandidateCatalog} from '../../src/mobs/age-of-beasts/complete-catalog.mjs';
import {createPlainsActor,stepPlainsActor,createDesertActor,stepDesertActor,createForestActor,stepForestActor,createSnowActor,stepSnowActor} from '../../src/mobs/age-of-beasts/plains-execution.mjs';
import {shallowWade,shelteredAt} from '../../src/mobs/age-of-beasts/wildlife-activities.mjs';
const cat=completeBeastCandidateCatalog();
function fixture(get,biome,dayPhase='day',water=()=>undefined,shape=mountainV8Material){
 const query=createExpansionWorldQuery({get,getPack2State:water,mobMountainShape:shape},{resident:()=>true,revision:()=>1,observe:()=>({biome,hazard:false,dayPhase,light:dayPhase==='night'?.2:.8}),extraOverlayBlocked:()=>false});
 return {query,revision:()=>1,materialAt:get};
}
test('honeybee visits actual two distinct blossom cells and transfers pollen once via owner',()=>{
 const v=fixture((x,y,z)=>y===-3?BLOCK.STONE:y===-2&&z===0&&(x===2||x===4)?M['flower-petal']:BLOCK.AIR,'meadow'),q=v.query;
 const a=createPlainsActor(cat.get('honeybee'),[.5,-1.28,.5],q);a.id='bee-a';let transfers=[];
 const options=flowerCell=>({ownerView:v,flowerCell,commitPollination:r=>{transfers.push(r);return true;}});
 for(let i=0;i<65;i++)assert.ok(stepPlainsActor(a,q,options([2,-2,0])));
 assert.equal(a.pollenOrigin,'2,-2,0');assert.equal(transfers.length,0);
 for(let i=0;i<75;i++)assert.ok(stepPlainsActor(a,q,options([4,-2,0])));
 assert.equal(a.pollenOrigin,'4,-2,0');assert.equal(transfers.length,1);assert.equal(transfers[0].from,'2,-2,0');
 for(let i=0;i<20;i++)assert.ok(stepPlainsActor(a,q,options([6,-2,0])));
 assert.equal(transfers.length,1);
});
test('ibis wades through supported shallow water using original movement, deep water is rejected',()=>{
 const v=fixture((x,y,z)=>y===-3?BLOCK.STONE:y===-2&&x<4?76:BLOCK.AIR,'desert','day',(x,y,z)=>y===-2&&x<4?waterCell({level:6}):undefined),q=v.query,c=cat.get('oasis-ibis');
 const p=[.5,-2,.5],a=createDesertActor(c,p,q);
 assert.ok(shallowWade(q,p,c.record.body));
 for(let i=0;i<20;i++)assert.ok(stepDesertActor(a,q,{ownerView:v,goal:[2.5,-2,.5]}));
 assert.equal(a.motionMode,'wade');assert.ok(a.position[0]>.5);assert.ok(shallowWade(q,a.position,c.record.body));
 const deep=fixture((x,y,z)=>y===-3?BLOCK.STONE:y===-2||y===-1?76:BLOCK.AIR,'desert','day',()=>waterCell());
 assert.equal(shallowWade(deep.query,p,c.record.body),false);
});
test('gravehand physically leaves existing overhead refuge before attack; no terrain writes',()=>{
 const v=fixture((x,y,z)=>y===-3||y===0&&x<2?BLOCK.STONE:BLOCK.AIR,'meadow','night'),q=v.query,c=cat.get('gravehand'),p=[.5,-2,.5];
 const a=createPlainsActor(c,p,q);
 assert.ok(shelteredAt(q,p,c.record.body));assert.ok(stepPlainsActor(a,q,{ownerView:v}));assert.equal(a.refugeState,'concealed');
 const target={position:[4,-1.6,.5]},hits=[];
 for(let i=0;i<150&&a.refugeState!=='exposed';i++){
  const before=[...a.position];assert.ok(stepPlainsActor(a,q,{ownerView:v,goal:[3,-2,.5],target,commitDamage:()=>{hits.push(1);return true;}}));
  assert.ok(Math.hypot(...a.position.map((n,j)=>n-before[j]))<.1);
 }
 assert.equal(a.refugeState,'exposed');assert.equal(hits.length,0);assert.equal(shelteredAt(q,a.position,c.record.body),false);
});

test('unknown blossom collision authority stays fail-closed; no pollen is inferred from material id',()=>{
 const v=fixture((x,y,z)=>y===-3?BLOCK.STONE:y===-2&&x===2&&z===0?M['flower-petal']:BLOCK.AIR,'meadow','day',()=>undefined,()=>undefined);
 const a=createPlainsActor(cat.get('honeybee'),[.5,-1.28,.5],v.query);a.id='bee-a';
 for(let i=0;i<30;i++)assert.ok(stepPlainsActor(a,v.query,{ownerView:v,flowerCell:[2,-2,0],commitPollination:()=>{throw Error('unexpected transfer')}}));
 assert.equal(a.pollenOrigin,undefined);assert.equal(a.flowerTicks,0);
});
test('faerie and prismwing approach real blossom and maintain contact without creating pollen rewards',()=>{
 for(const id of ['faerie','prismwing']){
  const v=fixture((x,y,z)=>y===-3?BLOCK.STONE:y===-2&&x===2&&z===0?M['flower-petal']:BLOCK.AIR,'forest');
  const a=createForestActor(cat.get(id),[.5,-1.28,.5],v.query);a.id=id;
  for(let i=0;i<65;i++)assert.ok(stepForestActor(a,v.query,{ownerView:v,flowerCell:[2,-2,0],commitPollination:()=>{throw Error('unexpected transfer')}}));
  assert.equal(a.action,'flower-contact');assert.equal(a.flowerTicks,12);assert.equal(a.pollenOrigin,undefined);
 }
});
test('meadowlark and ptarmigan land at physical support, then leave for a threat',()=>{
 for(const [id,biome,create,step] of [['meadowlark','meadow',createPlainsActor,stepPlainsActor],['ptarmigan','snow',createSnowActor,stepSnowActor]]){
  const v=fixture((x,y,z)=>y===-3?BLOCK.STONE:BLOCK.AIR,biome),a=create(cat.get(id),[.5,0,.5],v.query),goal=[3.5,-2,.5];
  for(let i=0;i<220&&a.motionMode!=='perch';i++)assert.ok(step(a,v.query,{goal}));
  assert.equal(a.motionMode,'perch',id);const at=[...a.position];
  assert.ok(step(a,v.query,{goal}));assert.deepEqual(a.position,at);
  assert.ok(step(a,v.query,{goal:[at[0],at[1]+3,at[2]],threat:{position:[at[0]+1,at[1]+.5,at[2]]}}));assert.equal(a.motionMode,'fly');assert.ok(a.position[1]>at[1]);
 }
});
