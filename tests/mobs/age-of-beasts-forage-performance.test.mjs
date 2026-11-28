import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../../src/voxel.mjs';
import {createExpansionOwnerView} from '../../src/mobs/age-of-beasts/owner-view.mjs';
import {createExpansionWorldQuery} from '../../src/mobs/age-of-beasts/physical-query.mjs';
import {createBeastEngineFixture} from '../../src/mobs/age-of-beasts/engine-fixture.mjs';
import {markMobSourceMutation} from '../../src/mobs/source-edit-epoch.mjs';
import {FIXED_STEP} from '../../src/mobs/engine.mjs';
test('scoped scalar source cache reduces duplicate reads but honors actual revision and residency changes',()=>{
 let reads=0,solid=false,resident=true;
 const world={get(x,y,z){reads++;return solid?BLOCK.STONE:BLOCK.AIR;}};
 const v=createExpansionOwnerView(world,{hasOwner:()=>resident,overlayEpoch:()=>0,observe:()=>({biome:'meadow',hazard:false,light:.8,dayPhase:'day'})});
 const q=v.query,p=[.5,-2,.5],b={radius:.2,height:.5,collision:'aabb'};
 assert.equal(q.volume(p,b),'clear');assert.equal(q.volume(p,b),'clear');const uncached=reads;reads=0;
 v.withSourceReadScope(()=>{
  assert.equal(q.volume(p,b),'clear');assert.equal(q.volume(p,b),'clear');assert.ok(reads<uncached);
  resident=false;assert.equal(q.volume(p,b),'unknown');resident=true;
  solid=true;markMobSourceMutation(world);assert.equal(q.volume(p,b),'solid');
 });
 solid=false;markMobSourceMutation(world);assert.equal(q.volume(p,b),'clear');
 assert.throws(()=>v.withSourceReadScope(()=>v.withSourceReadScope(()=>{})));
});
test('original-engine autonomous ermine forages along real supported ground without external goals',()=>{
 const get=(x,y,z)=>y===-3?BLOCK.STONE:BLOCK.AIR;
 const q=createExpansionWorldQuery({get},{resident:()=>true,revision:()=>1,observe:()=>({biome:'snow',hazard:false,light:.8,dayPhase:'day'}),extraOverlayBlocked:()=>false});
 const v={query:q,revision:()=>1,materialAt:get,generatedMaterialAt:get},f=createBeastEngineFixture(v);
 const id=f.selectAndSpawn({proposals:[{id:'ermine',point:[.5,-2,.5],rarityRoll:0}],observer:[8,-2,.5],homeChunk:'0,0,0'});
 assert.ok(id);let travel=0,previous=f.get(id).position;
 for(let i=0;i<30;i++){assert.equal(f.advancePopulation(FIXED_STEP),1);const e=f.get(id);travel+=Math.hypot(...e.position.map((n,j)=>n-previous[j]));previous=e.position;assert.equal(q.volume(e.position,e.species.body),'clear');}
 assert.ok(travel>.75);assert.equal(f.counts().total,1);
});
