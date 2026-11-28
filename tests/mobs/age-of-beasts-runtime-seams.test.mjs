import test from 'node:test';
import assert from 'node:assert/strict';
import {MobEngine} from '../../src/mobs/engine.mjs';
import {getSpecies,speciesRegistry} from '../../src/mobs/species.mjs';
import {legacyIndex,normalizeExpansionCapabilities} from '../../src/mobs/age-of-beasts/catalog-index.mjs';
import {APPROVED} from '../../src/mobs/age-of-beasts/roster-contract.mjs';
import {createWorldQuery} from '../../src/mobs/world-query.mjs';
import {createExpansionWorldQuery} from '../../src/mobs/age-of-beasts/physical-query.mjs';
import {expansionSupport,expansionHabitatEligible} from '../../src/mobs/age-of-beasts/environment-support.mjs';
import {BLOCK} from '../../src/voxel.mjs';
import {waterCell} from '../../src/block-packs/pack-2/water.mjs';
const w={volume:()=> 'clear',grounded:()=>true,residentAt:()=>true,revision:()=>1};
test('explicit legacy authority preserves identities and engine checkpoint bytes',()=>{
 const a=new MobEngine(w,179,{maxEntities:32,maxActive:8}),b=new MobEngine(w,179,{maxEntities:32,maxActive:8,catalog:legacyIndex});
 for(let i=0;i<32;i++){const id=speciesRegistry[i].id,pos=[i,0,0];assert.equal(a.spawn(id,pos),b.spawn(id,pos));}
 assert.deepEqual(a.checkpoint(),b.checkpoint());assert.deepEqual(b.counts(),{total:32,awake:8});
 assert.equal(b.get(b.all()[0].id).species,getSpecies('cow'));
 assert.deepEqual(MobEngine.fromCheckpoint(w,b.checkpoint(),{catalog:legacyIndex}).checkpoint(),b.checkpoint());
 assert.throws(()=>new MobEngine(w,179,{catalog:{...legacyIndex,size:100}}));
 assert.throws(()=>new MobEngine(w,179,{catalog:{...legacyIndex,get:()=>null}}));
 const c=new MobEngine(w,179,{catalog:legacyIndex});assert.equal(c.spawn('griffin',[0,0,0]),null);
 const invalid=JSON.parse(JSON.stringify(b.checkpoint()));invalid.entities[0].species='griffin';
 assert.throws(()=>MobEngine.fromCheckpoint(w,invalid,{catalog:legacyIndex}));
});
const big={radius:2.5,height:6,collision:'aabb'},fish={radius:.2,height:.4,collision:'aabb'};
const obs=()=>({biome:'cave',hazard:false,light:.25,dayPhase:'night'});
function fixture(get,{resident=()=>true,revision=()=>1,water=()=>undefined,overlay=()=>false,observe=obs}={}){
 return createExpansionWorldQuery({get,getPack2State:water},{resident,revision,observe,extraOverlayBlocked:overlay});
}
test('canonical shape query: upper owners, bounds and legacy default',()=>{
 const seen=new Set(),old=createWorldQuery({get:()=>BLOCK.AIR},{resident:()=>true});
 assert.equal(old.volume([0,30,0],fish),'unknown');assert.equal(old.volume([0,0,0],big),'unknown');
 const q=fixture(()=>BLOCK.AIR,{resident:(x,z,s)=>{seen.add(s);return true;}});
 assert.equal(q.volume([16.1,18.3,16.1],big),'clear');assert.ok(seen.has(0)&&seen.has(1));
 assert.equal(q.volume([0,251.001,0],big),'unknown');
 assert.equal(fixture(()=>BLOCK.AIR,{resident:(x,z,s)=>s===0}).volume([16.1,18.3,16.1],big),'unknown');
 assert.equal(fixture(()=>BLOCK.AIR,{overlay:()=>true}).volume([0,30,0],big),'solid');
 assert.equal(fixture(()=>999999).volume([0,30,0],big),'unknown');
});
test('full footprint support and true overhead contact',()=>{
 const flat=fixture((x,y,z)=>y===-6?BLOCK.STONE:BLOCK.AIR);
 assert.equal(expansionSupport(flat,[.5,-5,.5],big,'ground'),true);
 const pillar=fixture((x,y,z)=>y===-6&&x===0&&z===0?BLOCK.STONE:BLOCK.AIR);
 assert.equal(expansionSupport(pillar,[.5,-5,.5],big,'ground'),false);
 const roof=fixture((x,y,z)=>y===-4?BLOCK.STONE:BLOCK.AIR);
 assert.equal(expansionSupport(roof,[.5,-4.4,.5],fish,'ceiling'),true);
 assert.equal(expansionSupport(flat,[.5,-4.4,.5],fish,'ceiling'),false);
 assert.equal(expansionSupport(flat,[.5,-5,.5],fish,'air'),true);
});
test('actual sloped water state rejects dry shallow and unknown',()=>{
 const water=fixture(()=>76,{water:()=>waterCell()});
 assert.equal(expansionSupport(water,[.5,-5,.5],fish,'water'),true);
 assert.equal(expansionSupport(water,[.5,-5,.5],fish,'air'),false);
 assert.equal(expansionSupport(fixture(()=>76,{water:()=>waterCell({level:7,flow:'east'})}),[.5,-5,.5],fish,'water'),false);
 assert.equal(expansionSupport(fixture(()=>BLOCK.AIR),[.5,-5,.5],fish,'water'),false);
 assert.equal(expansionSupport(fixture(()=>76),[.5,-5,.5],fish,'water'),false);
});
test('habitat facts, biome, range and revision fail closed',()=>{
 const spec=APPROVED.find(s=>s.id==='blind-cavefish'),cap=normalizeExpansionCapabilities(spec.id,{body:fish,depth:[-100,-4],movement:['swim'],spawnSupport:['water']});
 const opts={facts:()=>({'submerged-space':true}),lightRange:[0,.4],observer:[8,-5,0]};
 const q=fixture(()=>76,{water:()=>waterCell()});
 assert.equal(expansionHabitatEligible(q,[.5,-5,.5],cap,spec,opts),true);
 assert.equal(expansionHabitatEligible(q,[.5,-5,.5],cap,spec,{...opts,facts:()=>({})}),false);
 assert.equal(expansionHabitatEligible(q,[.5,-5,.5],cap,spec,{...opts,observer:[1,-5,0]}),false);
 assert.equal(expansionHabitatEligible(fixture(()=>76,{water:()=>waterCell(),observe:()=>({...obs(),biome:'forest'})}),[.5,-5,.5],cap,spec,opts),false);
 let revision=1;
 const stale=fixture(()=>76,{water:()=>waterCell(),revision:()=>revision});
 assert.equal(expansionHabitatEligible(stale,[.5,-5,.5],cap,spec,{...opts,facts:()=>{revision++;return {'submerged-space':true}}}),false);
});
