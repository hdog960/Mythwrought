import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../../src/voxel.mjs';
import {waterCell} from '../../src/block-packs/pack-2/water.mjs';
import {createExpansionWorldQuery} from '../../src/mobs/age-of-beasts/physical-query.mjs';
import {expansionSupport} from '../../src/mobs/age-of-beasts/environment-support.mjs';
import {caveCandidate} from '../../src/mobs/age-of-beasts/cave-candidates.mjs';
import {alpineCandidate} from '../../src/mobs/age-of-beasts/alpine-candidates.mjs';
import {createCaveActor,stepCaveActor,createAlpineActor,stepAlpineActor} from '../../src/mobs/age-of-beasts/plains-execution.mjs';
function fixture(get,water=()=>undefined,biome='cave'){return createExpansionWorldQuery({get,getPack2State:water},{resident:()=>true,revision:()=>1,observe:()=>({biome,hazard:false,dayPhase:'night',light:.2}),extraOverlayBlocked:()=>false});}
test('blind cavefish swims in actual canonical water and refuses dry transition',()=>{
 const q=fixture((x,y,z)=>x<3&&y>=-8&&y<=-6?76:BLOCK.AIR,()=>waterCell());
 const fish=caveCandidate('blind-cavefish'),a=createCaveActor(fish,[.5,-7.5,.5],q);
 for(let i=0;i<80;i++)assert.ok(stepCaveActor(a,q,{goal:[5,-7.5,.5]}));
 assert.equal(a.motionMode,'swim');assert.ok(a.position[0]>1&&a.position[0]+fish.record.body.radius<=3.0001);
 assert.ok(expansionSupport(q,a.position,fish.record.body,'water'));
 assert.throws(()=>createCaveActor(fish,[4,-7.5,.5],q));
});
test('ceiling lurker follows continuous roof and stops at unsupported edge; bat roost stays attached',()=>{
 const q=fixture((x,y,z)=>x<3&&y===-5?BLOCK.STONE:BLOCK.AIR);
 const c=caveCandidate('ceiling-lurker'),p=[.5,-5-c.record.body.height,.5],a=createCaveActor(c,p,q);
 for(let i=0;i<60;i++)assert.ok(stepCaveActor(a,q,{goal:[5,p[1],.5]}));
 assert.ok(a.position[0]>.5&&a.position[0]+c.record.body.radius<=3.0001);
 assert.ok(expansionSupport(q,a.position,c.record.body,'ceiling'));assert.equal(a.motionMode,'ceiling-crawl');
 assert.throws(()=>createCaveActor(c,[5,p[1],.5],q));
 const b=caveCandidate('cave-bat'),bat=createCaveActor(b,[.5,-5-b.record.body.height,.5],q),before=[...bat.position];
 assert.ok(stepCaveActor(bat,q));assert.deepEqual(bat.position,before);assert.equal(bat.motionMode,'roost');
 assert.ok(stepCaveActor(bat,q,{facts:{departRoost:true},goal:[.5,-8,.5]}));assert.ok(bat.position[1]<before[1]);
});
test('alpine original movement executes charge and aerial pursuit',()=>{
 const q=fixture((x,y,z)=>y===-6?BLOCK.STONE:BLOCK.AIR,undefined,'alpine');
 const a=createAlpineActor(alpineCandidate('avalanche-beast'),[.5,-5,.5],q);
 assert.ok(stepAlpineActor(a,q,{target:{position:[6,-4,.5]}}));assert.equal(a.action,'charge');assert.ok(a.position[0]>.65);
 const w=createAlpineActor(alpineCandidate('wyvern'),[.5,-4,.5],q);
 assert.ok(stepAlpineActor(w,q,{target:{position:[5,-2,.5]}}));assert.equal(w.motionMode,'fly');assert.ok(w.position[1]>-4);
});
