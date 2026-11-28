import test from 'node:test';
import assert from 'node:assert/strict';
import {arena} from './fixture.mjs';
import {createExpansionOwnerView} from '../../src/mobs/age-of-beasts/owner-view.mjs';
import {desertCandidate} from '../../src/mobs/age-of-beasts/desert-candidates.mjs';
import {createDesertActor,stepDesertActor} from '../../src/mobs/age-of-beasts/plains-execution.mjs';
function fixture(phase='night'){const world=arena({floor:-3});return createExpansionOwnerView(world,{hasOwner:()=>true,overlayEpoch:()=>0,observe:()=>({biome:'desert',hazard:false,dayPhase:phase,light:phase==='day'?.8:.2})}).query;}
test('desert physical pursuit, evasive hop and guarded pincer damage',()=>{
 const q=fixture(),m=createDesertActor(desertCandidate('mummy'),[.5,-2,.5],q);
 assert.ok(stepDesertActor(m,q,{target:{position:[4,-1,.5]}}));assert.ok(m.position[0]>.5);
 const j=createDesertActor(desertCandidate('jerboa'),[.5,-2,.5],q);
 assert.ok(stepDesertActor(j,q,{threat:{position:[3,-1,.5]}}));assert.ok(j.position[0]<.5&&j.position[1]>-2);
 const s=createDesertActor(desertCandidate('giant-scorpion'),[.5,-2,.5],q),t={position:[1.4,-1.7,.5]},hits=[];
 for(let i=0;i<25;i++)assert.ok(stepDesertActor(s,q,{target:t,commitDamage:(v,n,rev,kind)=>{assert.equal(v,t);assert.equal(rev,q.revision());hits.push([n,kind]);return true;}}));
 assert.deepEqual(hits,[[14,'pincer']]);
});
test('mummy does not pursue in bright daytime',()=>{
 const q=fixture('day'),m=createDesertActor(desertCandidate('mummy'),[.5,-2,.5],q);
 assert.ok(stepDesertActor(m,q,{target:{position:[4,-1,.5]}}));assert.equal(m.position[0],.5);assert.equal(m.action,'idle');
});
