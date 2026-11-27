import test from 'node:test';
import assert from 'node:assert/strict';
import {arena} from './fixture.mjs';
import {BLOCK} from '../../src/voxel.mjs';
import {createExpansionOwnerView} from '../../src/mobs/age-of-beasts/owner-view.mjs';
import {plainsCandidate} from '../../src/mobs/age-of-beasts/plains-candidates.mjs';
import {createPlainsActor,stepPlainsActor} from '../../src/mobs/age-of-beasts/plains-execution.mjs';
function fixture(){const world=arena({floor:-3});const {query}=createExpansionOwnerView(world,{hasOwner:()=>true,overlayEpoch:()=>0,observe:()=>({biome:'meadow',light:.2,hazard:false,dayPhase:'night'})});return {world,query};}
test('actual original movement owner executes pursuit with collision and unknown-source rejection',()=>{
 const {world,query}=fixture(),a=createPlainsActor(plainsCandidate('werewolf'),[.5,-2,.5],query);
 const target={position:[4,-.8,.5]};
 assert.ok(stepPlainsActor(a,query,{target}));assert.ok(a.position[0]>.5);
 for(let y=-2;y<=0;y++)for(let z=-1;z<=1;z++)assert.ok(world.set(2,y,z,BLOCK.STONE));
 for(let i=0;i<30;i++)stepPlainsActor(a,query,{target});
 assert.ok(a.position[0]+a.species.body.radius<=2.001);
});
test('isolated combat commits once after actual windup, enforces cooldown and refuses occluded target',()=>{
 const {query}=fixture(),a=createPlainsActor(plainsCandidate('werewolf'),[.5,-2,.5],query);
 const target={position:[1.4,-1.7,.5]},hits=[];
 const commitDamage=(victim,amount,rev,kind)=>{assert.equal(victim,target);assert.equal(rev,query.revision());hits.push([amount,kind]);return true;};
 for(let i=0;i<20;i++)assert.ok(stepPlainsActor(a,query,{target,commitDamage}));
 assert.deepEqual(hits,[[18,'claw']]);
 for(let i=0;i<10;i++)stepPlainsActor(a,query,{target,commitDamage});
 assert.equal(hits.length,1);
});
