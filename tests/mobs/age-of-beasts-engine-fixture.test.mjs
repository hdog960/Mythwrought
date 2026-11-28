import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../../src/voxel.mjs';
import {MOUNTAIN_V8_MATERIAL as M,mountainV8Material} from '../../src/manual-biomes/mountain-v8-materials.mjs';
import {MobEngine,FIXED_STEP} from '../../src/mobs/engine.mjs';
import {speciesRegistry} from '../../src/mobs/species.mjs';
import {createExpansionWorldQuery} from '../../src/mobs/age-of-beasts/physical-query.mjs';
import {createBeastEngineFixture} from '../../src/mobs/age-of-beasts/engine-fixture.mjs';
import {completeBeastCandidateCatalog} from '../../src/mobs/age-of-beasts/complete-catalog.mjs';
function fixture(biome,floor,material){
 let rev=1;
 const get=(x,y,z)=>y===floor?material:BLOCK.AIR;
 const q=createExpansionWorldQuery({get,mobMountainShape:mountainV8Material},{resident:()=>true,revision:()=>rev,observe:()=>({biome,hazard:false,light:.2,dayPhase:'night'}),extraOverlayBlocked:()=>false});
 return {query:q,revision:()=>rev,materialAt:get,generatedMaterialAt:get};
}
test('original engine clock, identity and actual movement drive selected candidates in all six regions',()=>{
 for(const [biome,id,floor,material] of [['meadow','headless-knight',-3,BLOCK.GRASS],['desert','mummy',-3,BLOCK.STONE],['snow','ice-golem',-3,M.snow],['forest','nightshade-witch',-3,BLOCK.STONE],['alpine','cyclops',-3,BLOCK.STONE],['cave','echo-stalker',-100,BLOCK.STONE]]){
  const v=fixture(biome,floor,material),f=createBeastEngineFixture(v,179),p=[.5,floor+1,.5];
  const id1=f.selectAndSpawn({proposals:[{id,point:p,rarityRoll:0}],observer:[9,floor+1,.5],homeChunk:'0,0,0'});
  assert.ok(id1,biome);assert.equal(f.get(id1).species,completeBeastCandidateCatalog().get(id).record);
  const prey=f.spawnOriginal('cow',[7,floor+1,.5]);assert.ok(prey);
  for(let i=0;i<30;i++)assert.equal(f.advance(FIXED_STEP,m=>m.id===id1?{targetId:prey}:undefined),1);
  assert.ok(f.get(id1).position[0]>.5,biome);
  assert.equal(f.get(prey).species,speciesRegistry[0]);assert.throws(()=>f.checkpoint(),/fixture/);
  f.dispose();
 }
});
test('actual original engine mixed capacity and health owner stay singular; default saves remain original-only',()=>{
 const v=fixture('meadow',-3,BLOCK.GRASS),f=createBeastEngineFixture(v),legacy=new MobEngine(v.query,179,{maxEntities:32,maxActive:8});
 assert.equal(legacy.spawn('dire-hound',[.5,-2,.5]),null);
 assert.throws(()=>new MobEngine(v.query,179,{catalog:completeBeastCandidateCatalog().index}));
 const id=f.selectAndSpawn({proposals:[{id:'dire-hound',point:[.5,-2,.5],rarityRoll:0}],observer:[8,-2,.5],homeChunk:'0,0,0'});
 assert.ok(id);
 const cow=f.spawnOriginal('cow',[1.6,-2,.5]),before=f.get(cow).health;
 for(let i=0;i<25;i++)f.advance(FIXED_STEP,m=>m.id===id?{targetId:cow}:undefined);
 assert.ok(f.get(cow).health<before);assert.ok(f.drainEvents().some(e=>e.type==='hurt'&&e.id===cow));
 for(let i=2;i<32;i++)assert.ok(f.spawnOriginal('cow',[30+i,-2,.5]));
 assert.deepEqual(f.counts(),{total:32,awake:8});assert.equal(f.spawnOriginal('cow',[99,-2,.5]),null);
 assert.equal(f.selectAndSpawn({proposals:[{id:'dire-hound',point:[4,-2,.5],rarityRoll:0}],observer:[12,-2,.5],homeChunk:'0,0,0'}),null);
 assert.throws(()=>f.checkpoint(),/fixture/);
 assert.ok(legacy.spawn('cow',[0,-2,0]));assert.equal(MobEngine.fromCheckpoint(v.query,legacy.checkpoint()).counts().total,1);
});
