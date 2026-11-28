import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../../src/voxel.mjs';
import {createExpansionWorldQuery} from '../../src/mobs/age-of-beasts/physical-query.mjs';
import {completeBeastCandidateCatalog} from '../../src/mobs/age-of-beasts/complete-catalog.mjs';
import {createDesertActor,createForestActor,createAlpineActor,createSnowActor} from '../../src/mobs/age-of-beasts/plains-execution.mjs';
import {createCandidateAnimalInteractions} from '../../src/mobs/age-of-beasts/animal-abilities.mjs';
const cat=completeBeastCandidateCatalog();
function query(biome,get=(x,y,z)=>y===-3?BLOCK.STONE:BLOCK.AIR){return createExpansionWorldQuery({get},{resident:()=>true,revision:()=>1,observe:()=>({biome,hazard:false,light:.8,dayPhase:'day'}),extraOverlayBlocked:()=>false});}
test('original animal owner tames, mounts, steers and safely dismounts actual candidate camel',()=>{
 const q=query('desert',(x,y,z)=>y===-3||x>=3&&y===2?BLOCK.STONE:BLOCK.AIR);
 const a=createDesertActor(cat.get('camel'),[.5,-2,.5],q);a.id='camel-a';
 const o={id:'player-a',position:[-1.25,-2,.5],height:1.78,alive:true},other={...o,id:'player-b'};
 const animals=createCandidateAnimalInteractions(q,[a]);
 assert.equal(animals.mount(a.id,o),false);assert.ok(animals.tame(a.id,o));assert.equal(animals.tame(a.id,other),false);
 assert.equal(animals.mount(a.id,other),false);assert.ok(animals.mount(a.id,o));
 const start=a.position[0];let last;
 for(let i=0;i<60;i++){last=animals.step(o,[1,0]);assert.ok(last);}
 assert.ok(a.position[0]>start);assert.ok(a.position[0]+.24<=3.001);assert.equal(last.position[1],a.position[1]+a.species.body.height);
 const dismount=animals.dismount(o);assert.ok(dismount);assert.equal(animals.step(o,[1,0]),null);
 const save=animals.checkpoint();assert.deepEqual(save,[[a.id,o.id]]);
 const restored=createCandidateAnimalInteractions(q,[a],{tamed:save});assert.ok(restored.isTamed(a.id,o));assert.equal(restored.isTamed(a.id,other),false);
});
test('unicorn and yak tame via original owner, Griffin aerial riding remains locked',()=>{
 const q=query('forest'),a=createForestActor(cat.get('unicorn'),[.5,-2,.5],q);a.id='unicorn-a';
 const o={id:'p',position:[-1.2,-2,.5],height:1.78},u=createCandidateAnimalInteractions(q,[a]);
 assert.ok(u.tame(a.id,o));assert.ok(u.mount(a.id,o));assert.ok(u.step(o,[0,1]));assert.ok(u.dismount(o));
 const alpine=query('alpine'),yak=createAlpineActor(cat.get('yak'),[.5,-2,.5],alpine);yak.id='yak-a';
 const y=createCandidateAnimalInteractions(alpine,[yak]);assert.ok(y.tame(yak.id,o));assert.equal(y.mount(yak.id,o),false);
 const griffin=createAlpineActor(cat.get('griffin'),[.5,-2,.5],alpine);griffin.id='griffin-a';
 const g=createCandidateAnimalInteractions(alpine,[griffin]);assert.equal(g.mount(griffin.id,o),false);
});
