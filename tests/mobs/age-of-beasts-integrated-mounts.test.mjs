import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../../src/voxel.mjs';
import {MOUNTAIN_V8_MATERIAL as M,mountainV8Material} from '../../src/manual-biomes/mountain-v8-materials.mjs';
import {createExpansionWorldQuery} from '../../src/mobs/age-of-beasts/physical-query.mjs';
import {createBeastEngineFixture} from '../../src/mobs/age-of-beasts/engine-fixture.mjs';
import {readExpansionHabitatFacts} from '../../src/mobs/age-of-beasts/habitat-facts.mjs';
import {completeBeastCandidateCatalog} from '../../src/mobs/age-of-beasts/complete-catalog.mjs';
import {FIXED_STEP} from '../../src/mobs/engine.mjs';
const cat=completeBeastCandidateCatalog();
function fixture(get,biome,materialAt=get){
 const query=createExpansionWorldQuery({get,mobMountainShape:mountainV8Material},{resident:()=>true,revision:()=>1,observe:()=>({biome,hazard:false,light:.8,dayPhase:'day'}),extraOverlayBlocked:()=>false});
 return {query,revision:()=>1,materialAt,generatedMaterialAt:materialAt};
}
test('actual engine unicorn taming, mounting, steering under a roof and dismount use single identity and clock',()=>{
 const get=(x,y,z)=>y===-3||x>=5&&y===2?BLOCK.STONE:BLOCK.AIR;
 const v=fixture(get,'forest'),f=createBeastEngineFixture(v),p=[.5,-2,.5];
 const id=f.selectAndSpawn({proposals:[{id:'unicorn',point:p,rarityRoll:0}],observer:[8,-2,.5],homeChunk:'0,0,0'});assert.ok(id);
 let owner={id:'player-a',position:[-1.2,-2,.5],height:1.78,alive:true},other={...owner,id:'player-b'};
 assert.equal(f.mount(id,owner),false);assert.ok(f.tame(id,owner));assert.equal(f.tame(id,other),false);assert.equal(f.mount(id,other),false);
 assert.ok(f.mount(id,owner));assert.equal(f.steerMount(owner,[1,0]),false);assert.equal(f.riderPose(other),null);
 owner={...owner,position:f.riderPose(owner).position};assert.ok(f.steerMount(owner,[1,0]));
 assert.deepEqual(f.get(id).position,p,'steering cannot move creature outside engine tick');
 for(let i=0;i<60;i++){assert.equal(f.advancePopulation(FIXED_STEP),1);const e=f.get(id),pose=f.riderPose(owner);assert.ok(pose);assert.equal(pose.position[1],e.position[1]+e.species.body.height);assert.equal(v.query.volume(pose.position,{radius:.24,height:1.78}),'clear');owner={...owner,position:pose.position};}
 assert.ok(f.get(id).position[0]>p[0]);assert.ok(f.get(id).position[0]+.24<=5.001);
 assert.ok(f.dismount(owner));assert.equal(f.riderPose(owner),null);assert.equal(f.steerMount(owner,[1,0]),false);assert.equal(f.counts().total,1);assert.throws(()=>f.checkpoint(),/fixture/);f.dispose();
});
test('integrated camel riding respects source sand, owner identity and dormant retirement',()=>{
 const get=(x,y,z)=>y===-3?256:BLOCK.AIR;
 const v=fixture(get,'desert'),f=createBeastEngineFixture(v);
 const id=f.selectAndSpawn({proposals:[{id:'camel',point:[.5,-2,.5],rarityRoll:0}],observer:[8,-2,.5],homeChunk:'0,0,0'});assert.ok(id);
 let o={id:'rider',position:[-1.25,-2,.5],height:1.78};assert.ok(f.tame(id,o));assert.ok(f.mount(id,o));
 o={...o,position:f.riderPose(o).position};assert.ok(f.steerMount(o,[0,1],true));
 assert.equal(f.advancePopulation(FIXED_STEP),1);assert.ok(f.get(id).position[2]>.5);
 assert.ok(f.transition(id,'dormant'));assert.equal(f.riderPose(o),null);assert.equal(f.steerMount(o,[0,1]),false);f.dispose();
});
test('unicorn clearing rejects obstructed or unknown source footprint, yak taming does not authorize riding',()=>{
 const c=cat.get('unicorn'),p=[.5,-2,.5],get=(x,y,z)=>y===-3?BLOCK.STONE:BLOCK.AIR;
 const v=fixture(get,'forest');assert.equal(readExpansionHabitatFacts(v,p,c.capability,c.requirement).clearing,true);
 const closed=fixture((x,y,z)=>y===-3||x===2&&y===-2?BLOCK.STONE:BLOCK.AIR,'forest');
 assert.equal(readExpansionHabitatFacts(closed,p,c.capability,c.requirement).clearing,false);
 assert.equal(readExpansionHabitatFacts({...v,materialAt:(x,y,z)=>x===2?undefined:get(x,y,z)},p,c.capability,c.requirement).clearing,false);
 const y=fixture((x,h,z)=>h===10?M['alpine-grass']:BLOCK.AIR,'alpine'),f=createBeastEngineFixture(y);
 const id=f.selectAndSpawn({proposals:[{id:'yak',point:[.5,11,.5],rarityRoll:0}],observer:[8,11,.5],homeChunk:'0,0,0'});assert.ok(id);
 const o={id:'rider',position:[-1.25,11,.5],height:1.78};assert.ok(f.tame(id,o));assert.equal(f.mount(id,o),false);f.dispose();
});
