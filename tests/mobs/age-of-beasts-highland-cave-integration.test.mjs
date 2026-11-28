import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../../src/voxel.mjs';
import {MOUNTAIN_V8_MATERIAL as M,mountainV8Material} from '../../src/manual-biomes/mountain-v8-materials.mjs';
import {Pack2LiveWorld} from '../../src/pack2-world.mjs';
import {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {createExpansionOwnerView} from '../../src/mobs/age-of-beasts/owner-view.mjs';
import {createExpansionWorldQuery} from '../../src/mobs/age-of-beasts/physical-query.mjs';
import {createBeastEngineFixture} from '../../src/mobs/age-of-beasts/engine-fixture.mjs';
import {completeBeastCandidateCatalog} from '../../src/mobs/age-of-beasts/complete-catalog.mjs';
import {readExpansionHabitatFacts} from '../../src/mobs/age-of-beasts/habitat-facts.mjs';
import {expansionSupport} from '../../src/mobs/age-of-beasts/environment-support.mjs';
import {FIXED_STEP} from '../../src/mobs/engine.mjs';
const cat=completeBeastCandidateCatalog();
function fixture(get,biome){
 const q=createExpansionWorldQuery({get,mobMountainShape:mountainV8Material},{resident:()=>true,revision:()=>1,observe:()=>({biome,hazard:false,light:.2,dayPhase:'night'}),extraOverlayBlocked:()=>false});
 return {query:q,revision:()=>1,materialAt:get,generatedMaterialAt:get};
}
test('physical mountain elevation requires actual high source terrain and ledges require a real drop',()=>{
 const high=fixture((x,y,z)=>y===12?M.stone:BLOCK.AIR,'alpine'),c=cat.get('skyray'),p=[.5,15,.5];
 assert.equal(readExpansionHabitatFacts(high,p,c.capability,c.requirement)['high-elevation'],true);
 const low=fixture((x,y,z)=>y===4?M.stone:BLOCK.AIR,'alpine');
 assert.equal(readExpansionHabitatFacts(low,p,c.capability,c.requirement)['high-elevation'],false);
 const bird=cat.get('golden-eagle'),ledge=fixture((x,y,z)=>y===12&&x<=1?M.stone:BLOCK.AIR,'alpine');
 const at=[.5,14,.5],facts=readExpansionHabitatFacts(ledge,at,bird.capability,bird.requirement);
 assert.equal(facts['cliff-ledge'],true);assert.equal(facts['perch-site'],true);
 assert.equal(readExpansionHabitatFacts(high,at,bird.capability,bird.requirement)['cliff-ledge'],false);
 assert.equal(readExpansionHabitatFacts({...high,materialAt:(x,y,z)=>y===12?undefined:high.materialAt(x,y,z)},p,c.capability,c.requirement)['high-elevation'],false);
});
test('independent generated cave ceiling-lurker admits without competing bat and stays attached',()=>{
 const rows=[];
 for(const seed of [179,42,2026]){
  const world=new Pack2LiveWorld(new FourRegionWorld(seed,fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR))),before=JSON.stringify(world.save());
  const view=createExpansionOwnerView(world,{hasOwner:()=>true,overlayEpoch:()=>0,observe:([x,y,z])=>({biome:y<=-4?'cave':'meadow',hazard:false,light:.2,dayPhase:'night'})});
  const c=cat.get('ceiling-lurker'),f=createBeastEngineFixture(view,seed);let attempts=0,found=0;
  for(const x of [-32,0,32])for(const z of [-32,0,32]){
   let samples=0;
   for(let y=-6;y>=-180&&samples<3;y--){
    if(world.get(x,y,z)!==BLOCK.AIR||world.get(x,y+1,z)===BLOCK.AIR)continue;
    samples++;attempts++;const p=[x+.5,y+1-c.record.body.height,z+.5];
    const id=f.selectAndSpawn({proposals:[{id:c.record.id,point:p,rarityRoll:0}],observer:[x+8.5,p[1],z+.5],homeChunk:[Math.floor(x/16),Math.floor(z/16),Math.floor(p[1]/16)].join(',')});
    if(id)found++;
   }
  }
  for(let i=0;i<30;i++){assert.equal(f.advancePopulation(FIXED_STEP),1);for(const e of f.all())assert.ok(expansionSupport(view.query,e.position,e.species.body,'ceiling'));}
  rows.push({seed,attempts,found});f.dispose();
  assert.equal(JSON.stringify(world.save()),before);assert.equal(world.pack2Snapshot().cells.length,0);
 }
 console.log('AB24 independent ceiling lurker '+JSON.stringify(rows));
 assert.ok(rows.reduce((n,r)=>n+r.found,0)>0);
});
test('broader actual mountain scan independently samples all ten species and advances admitted flyers',()=>{
 const rows=[];
 for(const seed of [179,42,2026]){
  const world=new Pack2LiveWorld(new FourRegionWorld(seed,fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR))),before=JSON.stringify(world.save());
  const biomeAt=(x,z)=>({mountain:'alpine',enchanted:'forest',snow:'snow',desert:'desert'})[v6BiomeAt(x,z,seed)?.name]??'meadow';
  const view=createExpansionOwnerView(world,{hasOwner:()=>true,overlayEpoch:()=>0,observe:([x,y,z])=>({biome:biomeAt(x,z),hazard:false,light:.2,dayPhase:'night'})});
  const f=createBeastEngineFixture(view,seed),admitted=[],counts={columns:0,attempts:0};
  for(const dx of [-16,0,16])for(const dz of [-16,0,16]){
   const x=-512+dx,z=dz;if(biomeAt(x,z)!=='alpine')continue;counts.columns++;
   let y=null;for(let n=19;n>=-3;n--)if(world.get(x,n,z)!==BLOCK.AIR&&world.get(x,n,z)!==BLOCK.WOOD&&world.get(x,n,z)!==BLOCK.LEAVES){y=n+1;break;}
   if(y===null)continue;
   for(const c of cat.candidates.filter(c=>c.requirement.biome==='alpine')){
    const p=[x+.5,y+(c.capability.spawnSupport.includes('air')?2:0),z+.5];counts.attempts++;
    const id=f.selectAndSpawn({proposals:[{id:c.record.id,point:p,rarityRoll:0}],observer:[x+8.5,p[1],z+.5],homeChunk:[Math.floor(x/16),Math.floor(z/16),Math.floor(p[1]/16)].join(',')});
    if(id)admitted.push(c.record.id);
   }
  }
  for(let i=0;i<30;i++){assert.equal(f.advancePopulation(FIXED_STEP),1);assert.ok(f.counts().awake<=8&&f.counts().total<=32);for(const e of f.all())assert.equal(view.query.volume(e.position,e.species.body),'clear');}
  rows.push({seed,...counts,admitted});f.dispose();
  assert.equal(JSON.stringify(world.save()),before);assert.equal(world.pack2Snapshot().cells.length,0);
 }
 console.log('AB24 expanded alpine '+JSON.stringify(rows));assert.ok(rows.every(r=>r.columns>0));assert.ok(rows.some(r=>r.admitted.length>0));
});
test('echo stalker investigates actual completed engine footsteps without assigned combat target',()=>{
 const v=fixture((x,y,z)=>y===-10?BLOCK.STONE:BLOCK.AIR,'cave'),f=createBeastEngineFixture(v),p=[.5,-9,.5];
 const id=f.selectAndSpawn({proposals:[{id:'echo-stalker',point:p,rarityRoll:0}],observer:[8,-9,.5],homeChunk:'0,0,-1'});assert.ok(id);
 const cow=f.spawnOriginal('cow',[12,-9,.5]);assert.ok(cow);
 for(let i=0;i<20;i++)assert.equal(f.advance(FIXED_STEP,e=>e.id===cow?[1,0]:undefined),1);
 assert.ok(f.get(cow).position[0]>12);assert.ok(f.get(id).position[0]>.5,'heard remote source must produce local movement');
 assert.ok(!f.drainEvents().some(e=>e.type==='hurt'));f.dispose();
});
