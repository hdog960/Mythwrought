import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../../src/voxel.mjs';
import {Pack2LiveWorld} from '../../src/pack2-world.mjs';
import {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {createExpansionOwnerView} from '../../src/mobs/age-of-beasts/owner-view.mjs';
import {createExpansionWorldQuery} from '../../src/mobs/age-of-beasts/physical-query.mjs';
import {createBeastEngineFixture} from '../../src/mobs/age-of-beasts/engine-fixture.mjs';
import {completeBeastCandidateCatalog} from '../../src/mobs/age-of-beasts/complete-catalog.mjs';
import {expansionSupport} from '../../src/mobs/age-of-beasts/environment-support.mjs';
import {bodiesOverlap} from '../../src/mobs/age-of-beasts/body-contract.mjs';
import {FIXED_STEP} from '../../src/mobs/engine.mjs';
const cat=completeBeastCandidateCatalog();
test('actual original engine colony bats stagger physical flights and return to their own supported roof',()=>{
 const get=(x,y,z)=>y===-5?BLOCK.STONE:BLOCK.AIR;
 const query=createExpansionWorldQuery({get},{resident:()=>true,revision:()=>1,observe:()=>({biome:'cave',hazard:false,light:.2,dayPhase:'night'}),extraOverlayBlocked:()=>false});
 const view={query,revision:()=>1,materialAt:get,generatedMaterialAt:get},f=createBeastEngineFixture(view),c=cat.get('cave-bat');
 const y=-5-c.record.body.height,spawn=x=>f.selectAndSpawn({proposals:[{id:c.record.id,point:[x,y,.5],rarityRoll:0}],observer:[x+8,y,.5],homeChunk:'0,0,-1'});
 const a=spawn(-2.5),b=spawn(2.5);assert.ok(a&&b);const ids=[a,b].sort(),flights=[0,0],returns=[false,false];
 for(let tick=1;tick<=120;tick++){
  assert.equal(f.advancePopulation(FIXED_STEP),1);
  const es=ids.map(id=>f.get(id));
  assert.equal(bodiesOverlap(es[0].position,c.record.body,es[1].position,c.record.body),false);
  es.forEach((e,i)=>{
   assert.ok(expansionSupport(query,e.position,c.record.body,'air'));
   if(e.position[1]<y-.15){flights[i]++;assert.ok(tick>(i?60:0)&&tick<=(i?120:60));}
   if(flights[i]&&expansionSupport(query,e.position,c.record.body,'ceiling'))returns[i]=true;
   assert.ok(Math.hypot(...e.position.map((n,j)=>n-e.origin[j]))<1.6);
  });
 }
 assert.ok(flights.every(n=>n>=10));assert.deepEqual(returns,[true,true]);assert.ok(f.all().every(e=>expansionSupport(query,e.position,c.record.body,'ceiling')));f.dispose();
});
test('independent actual forest clearing survey tests unicorn admission and unchanged natural sources',()=>{
 const rows=[];
 for(const seed of [179,42,2026]){
  const world=new Pack2LiveWorld(new FourRegionWorld(seed,fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR))),before=JSON.stringify(world.save());
  const biomeAt=(x,z)=>({mountain:'alpine',enchanted:'forest',snow:'snow',desert:'desert'})[v6BiomeAt(x,z,seed)?.name]??'meadow';
  const v=createExpansionOwnerView(world,{hasOwner:()=>true,overlayEpoch:()=>0,observe:([x,y,z])=>({biome:biomeAt(x,z),hazard:false,light:.8,dayPhase:'day'})});
  const f=createBeastEngineFixture(v,seed);let scanned=0,columns=0,proposals=0,admitted=0;
  for(const x of [-24,-12,0,12,24])for(const dz of [-24,-12,0,12,24]){
   const z=-512+dz;scanned++;if(biomeAt(x,z)!=='forest')continue;columns++;
   let y=null;for(let n=19;n>=-3;n--)if(world.get(x,n,z)!==BLOCK.AIR){y=n+1;break;}
   if(y===null)continue;proposals++;
   const id=f.selectAndSpawn({proposals:[{id:'unicorn',point:[x+.5,y,z+.5],rarityRoll:0}],observer:[x+8.5,y,z+.5],homeChunk:[Math.floor(x/16),Math.floor(z/16),Math.floor(y/16)].join(',')});
   if(id)admitted++;
  }
  for(let i=0;i<30;i++){assert.equal(f.advancePopulation(FIXED_STEP),1);for(const e of f.all())assert.equal(v.query.volume(e.position,e.species.body),'clear');}
  rows.push({seed,scanned,columns,proposals,admitted});f.dispose();assert.equal(JSON.stringify(world.save()),before);assert.equal(world.pack2Snapshot().cells.length,0);
 }
 console.log('AB27 natural unicorn '+JSON.stringify(rows));assert.equal(rows.reduce((n,r)=>n+r.scanned,0),75);assert.ok(rows.every(r=>r.columns>0&&r.admitted<=r.proposals&&r.proposals<=r.columns));
});
test('expanded actual underground water census uses only unedited generated source and never manufactures water',()=>{
 const rows=[];
 for(const seed of [179,42,2026]){
  const world=new Pack2LiveWorld(new FourRegionWorld(seed,fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR))),before=JSON.stringify(world.save());
  const v=createExpansionOwnerView(world,{hasOwner:()=>true,overlayEpoch:()=>0,observe:()=>({biome:'cave',hazard:false,light:.2,dayPhase:'night'})});
  const f=createBeastEngineFixture(v,seed);let cells=0,water=0,proposals=0,admitted=0;
  for(const x of [-48,-16,16,48])for(const z of [-48,-16,16,48])for(let y=-6;y>=-180;y--){
   cells++;if(v.generatedMaterialAt(x,y,z)!==76)continue;water++;
   if(!world.getPack2State(x,y,z))continue;proposals++;
   const p=[x+.5,y+.1,z+.5],id=f.selectAndSpawn({proposals:[{id:'blind-cavefish',point:p,rarityRoll:0}],observer:[x+8.5,p[1],z+.5],homeChunk:[Math.floor(x/16),Math.floor(z/16),Math.floor(y/16)].join(',')});
   if(id)admitted++;
  }
  for(let i=0;i<30;i++){assert.equal(f.advancePopulation(FIXED_STEP),1);for(const e of f.all())assert.ok(expansionSupport(v.query,e.position,e.species.body,'water'));}
  rows.push({seed,cells,water,proposals,admitted});f.dispose();assert.equal(JSON.stringify(world.save()),before);assert.equal(world.pack2Snapshot().cells.length,0);
 }
 console.log('AB27 natural cave water '+JSON.stringify(rows));assert.equal(rows.reduce((n,r)=>n+r.cells,0),8400);assert.ok(rows.every(r=>r.admitted<=r.proposals&&r.proposals<=r.water));
});
