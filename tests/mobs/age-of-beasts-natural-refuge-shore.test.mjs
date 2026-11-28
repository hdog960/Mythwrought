import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../../src/voxel.mjs';
import {waterCell} from '../../src/block-packs/pack-2/water.mjs';
import {createExpansionWorldQuery} from '../../src/mobs/age-of-beasts/physical-query.mjs';
import {readExpansionHabitatFacts} from '../../src/mobs/age-of-beasts/habitat-facts.mjs';
import {completeBeastCandidateCatalog} from '../../src/mobs/age-of-beasts/complete-catalog.mjs';
import {chooseExpansionSpawn} from '../../src/mobs/age-of-beasts/spawn-selection.mjs';
const cat=completeBeastCandidateCatalog();
function fixture(get,biome,water=()=>undefined){
 const query=createExpansionWorldQuery({get,getPack2State:water},{resident:()=>true,revision:()=>1,observe:()=>({biome,hazard:false,dayPhase:'night',light:.2}),extraOverlayBlocked:()=>false});
 return {query,revision:()=>1,materialAt:get,generatedMaterialAt:get};
}
test('source-known physical refuge admits Gravehand and rejects unknown roof or exposed ground',()=>{
 const c=cat.get('gravehand'),point=[.5,-2,.5],get=(x,y,z)=>y===-3||y===0?BLOCK.STONE:BLOCK.AIR,v=fixture(get,'meadow');
 const opts={proposals:[{id:c.record.id,point,rarityRoll:0}],observer:[8,-2,.5],entities:[],homeChunk:'0,0,0'};
 assert.equal(readExpansionHabitatFacts(v,point,c.capability,c.requirement)['emergence-site'],true);
 assert.equal(chooseExpansionSpawn(v,opts)?.id,c.record.id);
 assert.equal(chooseExpansionSpawn({...v,generatedMaterialAt:(x,y,z)=>y===0?undefined:get(x,y,z)},opts),null);
 const open=fixture((x,y,z)=>y===-3?BLOCK.STONE:BLOCK.AIR,'meadow');
 assert.equal(chooseExpansionSpawn(open,opts),null);
});
test('ibis shoreline requires actual adjacent dry and shallow supported water, not just fluid id',()=>{
 const c=cat.get('oasis-ibis'),p=[-.5,-2,.5];
 const get=(x,y,z)=>y===-3?BLOCK.STONE:y===-2&&x>=0?76:BLOCK.AIR;
 const v=fixture(get,'desert',(x,y,z)=>y===-2&&x>=0?waterCell({level:6}):undefined);
 const f=readExpansionHabitatFacts(v,p,c.capability,c.requirement);
 assert.equal(f['shoreline'],true);assert.equal(f['water-nearby'],true);
 const deep=fixture(get,'desert',()=>waterCell());
 assert.equal(readExpansionHabitatFacts(deep,p,c.capability,c.requirement)['shoreline'],false);
 assert.equal(readExpansionHabitatFacts({...v,materialAt:(x,y,z)=>y===-2&&x>=0?undefined:get(x,y,z)},p,c.capability,c.requirement)['shoreline'],false);
});
