import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,VoxelWorld} from '../../src/voxel.mjs';
import {Pack2LiveWorld} from '../../src/pack2-world.mjs';
import {createExpansionOwnerView} from '../../src/mobs/age-of-beasts/owner-view.mjs';
import {createExpansionWorldQuery} from '../../src/mobs/age-of-beasts/physical-query.mjs';
import {completeBeastCandidateCatalog} from '../../src/mobs/age-of-beasts/complete-catalog.mjs';
import {chooseExpansionSpawn} from '../../src/mobs/age-of-beasts/spawn-selection.mjs';
import {createCaveActor,stepCaveActor,createAlpineActor,stepAlpineActor} from '../../src/mobs/age-of-beasts/plains-execution.mjs';
const cat=completeBeastCandidateCatalog();
function query(get,biome='cave'){return createExpansionWorldQuery({get},{resident:()=>true,revision:()=>1,observe:()=>({biome,light:.2,hazard:false,dayPhase:'night'}),extraOverlayBlocked:()=>false});}
test('generated source reader excludes edited terrain, placed overlay and upper placeholder',()=>{
 const base=new VoxelWorld(179),world=new Pack2LiveWorld(base),view=createExpansionOwnerView(world,{hasOwner:()=>true,overlayEpoch:()=>0,observe:()=>({biome:'cave',light:.2,hazard:false,dayPhase:'night'})});
 const p=[0,-180,0],natural=base.naturalAndLandmarkBlock(...p);
 assert.equal(view.generatedMaterialAt(...p),natural);
 assert.ok(world.set(...p,natural===BLOCK.STONE?BLOCK.AIR:BLOCK.STONE));
 assert.equal(view.generatedMaterialAt(...p),undefined);
 assert.equal(view.generatedMaterialAt(0,30,0),undefined);
});
test('bounded spawn selection requires generated physical support and honors rejection gates',()=>{
 const get=(x,y,z)=>y===-6?BLOCK.STONE:BLOCK.AIR,q=query(get,'meadow');
 const view={query:q,revision:()=>1,generatedMaterialAt:get},p=[.5,-5,.5],c=cat.get('headless-knight');
 // Candidate surface depth begins at -3; use a separate natural floor at -3.
 const ground=(x,y,z)=>y===-3?BLOCK.STONE:BLOCK.AIR,Q=query(ground,'meadow'),point=[.5,-2,.5];
 const v={query:Q,revision:()=>1,generatedMaterialAt:ground};
 const opts={proposals:[{id:c.record.id,point,rarityRoll:0}],observer:[8,-2,.5],entities:[],homeChunk:'0,0,0'};
 assert.equal(chooseExpansionSpawn(v,opts)?.id,c.record.id);
 assert.equal(chooseExpansionSpawn(v,{...opts,proposals:Array(7).fill(opts.proposals[0])}),null);
 assert.equal(chooseExpansionSpawn({...v,generatedMaterialAt:(x,y,z)=>y===-3?undefined:ground(x,y,z)},opts),null);
 assert.equal(chooseExpansionSpawn(v,{...opts,observer:[1,-2,.5]}),null);
 assert.equal(chooseExpansionSpawn(v,{...opts,entities:[{id:'one',species:c.record,position:point,homeChunk:'0,0,0'}]}),null);
});
test('ceiling drop falls under original gravity, applies one guarded impact and remains on ground',()=>{
 const q=query((x,y,z)=>y===-10||y===-5?BLOCK.STONE:BLOCK.AIR);
 const c=cat.get('ceiling-lurker'),p=[.5,-5-c.record.body.height,.5],a=createCaveActor(c,p,q),target={position:[.5,-8.7,.5]},hits=[];
 for(let i=0;i<120;i++)assert.ok(stepCaveActor(a,q,{target,commitDamage:(t,n,rev,k)=>{assert.equal(t,target);hits.push([n,k]);return true;}}));
 assert.ok(a.position[1]<p[1]-1);assert.equal(a.dropState,'recovering');assert.deepEqual(hits,[[16,'drop-attack']]);
});
test('cliff reaver climbs actual full body wall through original movement integrator',()=>{
 const c=cat.get('cliff-reaver'),r=c.record.body.radius;
 const q=query((x,y,z)=>x===2||y===-6?BLOCK.STONE:BLOCK.AIR,'alpine');
 const a=createAlpineActor(c,[2-r,-5,.5],q);
 for(let i=0;i<5;i++)assert.ok(stepAlpineActor(a,q,{goal:[3,-2,.5]}));
 assert.equal(a.motionMode,'climb');assert.ok(a.position[1]>-4.8);
});
