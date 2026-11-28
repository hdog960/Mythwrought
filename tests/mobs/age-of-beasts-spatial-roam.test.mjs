import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../../src/voxel.mjs';
import {waterCell} from '../../src/block-packs/pack-2/water.mjs';
import {createExpansionWorldQuery} from '../../src/mobs/age-of-beasts/physical-query.mjs';
import {createBeastEngineFixture} from '../../src/mobs/age-of-beasts/engine-fixture.mjs';
import {completeBeastCandidateCatalog} from '../../src/mobs/age-of-beasts/complete-catalog.mjs';
import {expansionSupport} from '../../src/mobs/age-of-beasts/environment-support.mjs';
import {FIXED_STEP} from '../../src/mobs/engine.mjs';
const cat=completeBeastCandidateCatalog();
function fixture(get,biome,water=()=>undefined){
 const query=createExpansionWorldQuery({get,getPack2State:water},{resident:()=>true,revision:()=>1,observe:()=>({biome,hazard:false,light:.2,dayPhase:'night'}),extraOverlayBlocked:()=>false});
 return {query,revision:()=>1,materialAt:get,generatedMaterialAt:get};
}
test('blind cavefish autonomous original-engine swimming remains submerged in a bounded actual water volume',()=>{
 const v=fixture((x,y,z)=>Math.abs(x)<4&&Math.abs(z)<4&&y>=-8&&y<=-6?76:BLOCK.AIR,'cave',()=>waterCell()),f=createBeastEngineFixture(v);
 const p=[.5,-7.5,.5],id=f.selectAndSpawn({proposals:[{id:'blind-cavefish',point:p,rarityRoll:0}],observer:[8,-7.5,.5],homeChunk:'0,0,-1'});
 assert.ok(id);let travel=0,prior=p;
 for(let i=0;i<60;i++){assert.equal(f.advancePopulation(FIXED_STEP),1);const e=f.get(id);assert.ok(expansionSupport(v.query,e.position,e.species.body,'water'));travel+=Math.hypot(...e.position.map((n,j)=>n-prior[j]));prior=e.position;}
 assert.ok(travel>.75);assert.equal(f.get(id).motionMode,'swim');f.dispose();
});
test('ceiling lurker autonomous original-engine crawling remains attached to actual finite ceiling',()=>{
 const v=fixture((x,y,z)=>Math.abs(x)<4&&Math.abs(z)<4&&y===-5?BLOCK.STONE:BLOCK.AIR,'cave'),f=createBeastEngineFixture(v);
 const c=cat.get('ceiling-lurker'),p=[.5,-5-c.record.body.height,.5],id=f.selectAndSpawn({proposals:[{id:c.record.id,point:p,rarityRoll:0}],observer:[8,p[1],.5],homeChunk:'0,0,-1'});
 assert.ok(id);let travel=0,prior=p;
 for(let i=0;i<60;i++){assert.equal(f.advancePopulation(FIXED_STEP),1);const e=f.get(id);assert.ok(expansionSupport(v.query,e.position,e.species.body,'ceiling'));travel+=Math.hypot(...e.position.map((n,j)=>n-prior[j]));prior=e.position;}
 assert.ok(travel>.75);assert.equal(f.get(id).motionMode,'ceiling-crawl');f.dispose();
});
test('aurora wisp moves autonomously without crossing actual air clearance or bounded home distance',()=>{
 const v=fixture((x,y,z)=>y===-3||x===3?BLOCK.STONE:BLOCK.AIR,'snow'),f=createBeastEngineFixture(v);
 const p=[.5,0,.5],id=f.selectAndSpawn({proposals:[{id:'aurora-wisp',point:p,rarityRoll:0}],observer:[8,0,.5],homeChunk:'0,0,0'});
 assert.ok(id);let travel=0,prior=p;
 for(let i=0;i<90;i++){assert.equal(f.advancePopulation(FIXED_STEP),1);const e=f.get(id);assert.ok(expansionSupport(v.query,e.position,e.species.body,'air'));assert.ok(Math.hypot(...e.position.map((n,j)=>n-p[j]))<=5.2);travel+=Math.hypot(...e.position.map((n,j)=>n-prior[j]));prior=e.position;}
 assert.ok(travel>.75);assert.equal(f.get(id).motionMode,'fly');f.dispose();
});
