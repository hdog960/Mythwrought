import test from 'node:test';
import assert from 'node:assert/strict';
import {arena} from './fixture.mjs';
import {createExpansionOwnerView} from '../../src/mobs/age-of-beasts/owner-view.mjs';
import {snowCandidate} from '../../src/mobs/age-of-beasts/snow-candidates.mjs';
import {createSnowActor,stepSnowActor} from '../../src/mobs/age-of-beasts/plains-execution.mjs';
function fixture(phase='night'){return createExpansionOwnerView(arena({floor:-3}),{hasOwner:()=>true,overlayEpoch:()=>0,observe:()=>({biome:'snow',hazard:false,dayPhase:phase,light:phase==='day'?.8:.2})}).query;}
test('snow charge uses original physical movement, golem damage honors windup',()=>{
 const q=fixture(),y=createSnowActor(snowCandidate('yeti'),[.5,-2,.5],q),target={position:[5,-1,.5]};
 assert.ok(stepSnowActor(y,q,{target}));assert.equal(y.action,'charge');assert.ok(y.position[0]>.64);
 const g=createSnowActor(snowCandidate('ice-golem'),[.5,-2,.5],q),t={position:[2,-1.5,.5]},hits=[];
 for(let i=0;i<40;i++)assert.ok(stepSnowActor(g,q,{target:t,commitDamage:(v,n,rev,kind)=>{assert.equal(v,t);assert.equal(rev,q.revision());hits.push([n,kind]);return true;}}));
 assert.deepEqual(hits,[[27,'heavy-melee']]);
});
test('aurora wisp executes flight at night but not takeoff by day',()=>{
 const q=fixture(),w=createSnowActor(snowCandidate('aurora-wisp'),[.5,-2,.5],q);
 assert.ok(stepSnowActor(w,q,{goal:[.5,1,.5]}));assert.ok(w.position[1]>-2);
 const day=fixture('day'),d=createSnowActor(snowCandidate('aurora-wisp'),[.5,-2,.5],day);
 assert.ok(stepSnowActor(d,day,{goal:[.5,1,.5]}));assert.equal(d.action,'idle');assert.equal(d.position[1],-2);
});
