import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../../src/voxel.mjs';
import {createExpansionWorldQuery} from '../../src/mobs/age-of-beasts/physical-query.mjs';
import {completeBeastCandidateCatalog} from '../../src/mobs/age-of-beasts/complete-catalog.mjs';
import {createSnowActor,stepSnowActor,createAlpineActor,stepAlpineActor} from '../../src/mobs/age-of-beasts/plains-execution.mjs';
import {launchBeastProjectile} from '../../src/mobs/age-of-beasts/ranged-abilities.mjs';
const cat=completeBeastCandidateCatalog();
function fixture(biome){let wall=false;const q=createExpansionWorldQuery({get:(x,y,z)=>y===-3||wall&&x===3?BLOCK.STONE:BLOCK.AIR},{resident:()=>true,revision:()=>Number(wall),observe:()=>({biome,hazard:false,dayPhase:'night',light:.2}),extraOverlayBlocked:()=>false});return {q,block:()=>{wall=true;}};}
test('three ranged species wind up and submit one owner-authorized projectile without immediate damage',()=>{
 for(const [id,biome,create,step] of [['yeti','snow',createSnowActor,stepSnowActor],['cyclops','alpine',createAlpineActor,stepAlpineActor],['storm-elemental','alpine',createAlpineActor,stepAlpineActor]]){
  const {q}=fixture(biome),a=create(cat.get(id),[.5,-2,.5],q),target={id:'target',position:[7,-2,.5],height:1.78,alive:true},launches=[];a.id=id+'-a';
  let hits=0;
  for(let i=0;i<45;i++)assert.ok(step(a,q,{target,launchProjectile:p=>{launches.push(p);return true;},commitDamage:()=>{hits++;return true;}}));
  assert.equal(launches.length,1,id);assert.equal(hits,0);assert.equal(launches[0].sourceId,a.id);assert.equal(launches[0].targetId,target.id);assert.ok(a.cooldown>0);
  assert.ok(Object.isFrozen(launches[0].origin));let submitted;
  const pool={launch:p=>{submitted=p;return true;}},identity={sourceId:a.id,definitionId:launches[0].definitionId,projectileId:'bolt-1',fixture:true};
  assert.equal(launchBeastProjectile(pool,launches[0],{sequence:1,identity:{...identity,sourceId:'wrong'}}),false);
  assert.ok(launchBeastProjectile(pool,launches[0],{sequence:1,identity}));assert.equal(submitted.options.range,launches[0].range);
 }
});
test('blocked sight prevents projectile and denied launch cannot consume cooldown',()=>{
 const {q,block}=fixture('snow'),a=createSnowActor(cat.get('yeti'),[.5,-2,.5],q),target={id:'target',position:[7,-2,.5],height:1.78,alive:true};a.id='yeti-a';
 let attempts=0;
 for(let i=0;i<40&&attempts===0;i++)stepSnowActor(a,q,{target,launchProjectile:()=>{attempts++;return false;}});
 assert.equal(attempts,1);assert.equal(a.cooldown,0);
 block();for(let i=0;i<5;i++)stepSnowActor(a,q,{target,launchProjectile:()=>{attempts++;return true;}});
 assert.equal(attempts,1);
});
