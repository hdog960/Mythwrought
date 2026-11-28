import test from 'node:test';
import assert from 'node:assert/strict';
import {arena} from './fixture.mjs';
import {createExpansionOwnerView} from '../../src/mobs/age-of-beasts/owner-view.mjs';
import {forestCandidate} from '../../src/mobs/age-of-beasts/forest-candidates.mjs';
import {createForestActor,stepForestActor} from '../../src/mobs/age-of-beasts/plains-execution.mjs';
function fixture(phase='night'){return createExpansionOwnerView(arena({floor:-3}),{hasOwner:()=>true,overlayEpoch:()=>0,observe:()=>({biome:'forest',hazard:false,dayPhase:phase,light:phase==='day'?.8:.2})}).query;}
test('forest evasive jump, flower flight and treant guarded branch damage',()=>{
 const q=fixture(),u=createForestActor(forestCandidate('unicorn'),[.5,-2,.5],q);
 assert.ok(stepForestActor(u,q,{threat:{position:[3,-1,.5]}}));assert.ok(u.position[0]<.5&&u.position[1]>-2);
 const p=createForestActor(forestCandidate('prismwing'),[.5,-1,.5],q);
 assert.ok(stepForestActor(p,q,{goal:[2,0,.5],facts:{flowerNearby:true}}));assert.equal(p.action,'flower-visit');assert.ok(p.position[0]>.5&&p.position[1]>-1);
 const t=createForestActor(forestCandidate('corrupted-treant'),[.5,-2,.5],q),victim={position:[2,-1,.5]},hits=[];
 for(let i=0;i<34;i++)assert.ok(stepForestActor(t,q,{target:victim,commitDamage:(v,n,rev,k)=>{assert.equal(v,victim);assert.equal(rev,q.revision());hits.push([n,k]);return true;}}));
 assert.deepEqual(hits,[[26,'branch-strike']]);
});
test('nightshade witch does not pursue in bright daytime',()=>{
 const q=fixture('day'),w=createForestActor(forestCandidate('nightshade-witch'),[.5,-2,.5],q);
 assert.ok(stepForestActor(w,q,{target:{position:[4,-1,.5]}}));assert.equal(w.action,'idle');assert.equal(w.position[0],.5);
});
