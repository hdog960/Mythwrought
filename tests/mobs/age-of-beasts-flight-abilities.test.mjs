import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../../src/voxel.mjs';
import {createExpansionWorldQuery} from '../../src/mobs/age-of-beasts/physical-query.mjs';
import {completeBeastCandidateCatalog} from '../../src/mobs/age-of-beasts/complete-catalog.mjs';
import {createAlpineActor,stepAlpineActor} from '../../src/mobs/age-of-beasts/plains-execution.mjs';
import {expansionSupport} from '../../src/mobs/age-of-beasts/environment-support.mjs';
const cat=completeBeastCandidateCatalog();
function fixture(){return createExpansionWorldQuery({get:(x,y,z)=>y===-3?BLOCK.STONE:BLOCK.AIR},{resident:()=>true,revision:()=>1,observe:()=>({biome:'alpine',hazard:false,dayPhase:'day',light:.8}),extraOverlayBlocked:()=>false});}
test('golden eagle approaches real support, perches and departs without teleportation',()=>{
 const q=fixture(),a=createAlpineActor(cat.get('golden-eagle'),[.5,0,.5],q),goal=[3.5,-2,.5];
 for(let i=0;i<150&&a.motionMode!=='perch';i++){
  const before=[...a.position];assert.ok(stepAlpineActor(a,q,{goal}));
  assert.ok(Math.hypot(...a.position.map((v,j)=>v-before[j]))<=.24);
 }
 assert.equal(a.motionMode,'perch');assert.ok(expansionSupport(q,a.position,a.species.body,'ground'));
 const at=[...a.position];assert.ok(stepAlpineActor(a,q,{goal}));assert.deepEqual(a.position,at);
 assert.ok(stepAlpineActor(a,q,{goal:[at[0],at[1]+3,at[2]],threat:{position:[at[0]+1,at[1]+.5,at[2]]}}));assert.equal(a.motionMode,'fly');assert.ok(a.position[1]>at[1]);
});
test('skyray glides with bounded original horizontal and descending movement',()=>{
 const q=fixture(),a=createAlpineActor(cat.get('skyray'),[.5,4,.5],q),before=[...a.position];
 for(let i=0;i<20;i++)assert.ok(stepAlpineActor(a,q,{goal:[8,0,.5]}));
 assert.equal(a.motionMode,'glide');assert.ok(a.position[0]>before[0]+1&&a.position[1]<before[1]-.3&&a.position[1]>before[1]-2);
 assert.ok(expansionSupport(q,a.position,a.species.body,'air'));
});
