import test from 'node:test';
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {BLOCK} from '../../src/voxel.mjs';
import {Pack2LiveWorld} from '../../src/pack2-world.mjs';
import {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {createExpansionOwnerView} from '../../src/mobs/age-of-beasts/owner-view.mjs';
import {createExpansionWorldQuery} from '../../src/mobs/age-of-beasts/physical-query.mjs';
import {createBeastEngineFixture} from '../../src/mobs/age-of-beasts/engine-fixture.mjs';
import {completeBeastCandidateCatalog} from '../../src/mobs/age-of-beasts/complete-catalog.mjs';
import {FIXED_STEP} from '../../src/mobs/engine.mjs';
const cat=completeBeastCandidateCatalog();
const awake=e=>['idle','active'].includes(e.state);
function observeSteps(f,q,steps){
 const times=[];let activeSteps=0;
 for(let i=0;i<steps;i++){
  const t=performance.now();assert.equal(f.advancePopulation(FIXED_STEP),1);times.push(performance.now()-t);
  assert.ok(f.counts().awake<=8&&f.counts().total<=32);
  for(const e of f.all().filter(awake)){
   assert.equal(q.volume(e.position,e.species.body),'clear');
   activeSteps++;
  }
 }
 times.sort((a,b)=>a-b);
 return {activeSteps,p95Ms:Math.round(times[Math.ceil(times.length*.95)-1]*1000)/1000};
}
test('actual generated baseline populations are selected and admitted into original MobEngine across five regions',()=>{
 const sites=[['meadow',0,0],['desert',512,0],['snow',0,512],['alpine',-512,0],['forest',0,-512]],all=[];
 for(const seed of [179,42,2026]){
  const world=new Pack2LiveWorld(new FourRegionWorld(seed,fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR))),before=JSON.stringify(world.save());
  const biomeAt=(x,z)=>({mountain:'alpine',enchanted:'forest',snow:'snow',desert:'desert'})[v6BiomeAt(x,z,seed)?.name]??'meadow';
  const view=createExpansionOwnerView(world,{hasOwner:()=>true,overlayEpoch:()=>0,observe:([x,y,z])=>({biome:biomeAt(x,z),hazard:false,light:.2,dayPhase:'night'})});
  for(const [biome,cx,cz] of sites){
   const f=createBeastEngineFixture(view,seed),admitted=[];
   for(const d of [-8,0,8]){
    const x=cx+d,z=cz+d;if(biomeAt(x,z)!==biome)continue;
    let top=null;for(let y=19;y>=-3;y--){const id=world.get(x,y,z);if(id!==BLOCK.AIR&&id!==BLOCK.WOOD&&id!==BLOCK.LEAVES){top=y;break;}}
    if(top===null)continue;
    const candidates=cat.candidates.filter(c=>c.requirement.biome===biome);
    for(let i=0;i<candidates.length;i+=6){
     const id=f.selectAndSpawn({proposals:candidates.slice(i,i+6).map(c=>({id:c.record.id,point:[x+.5,top+1,z+.5],rarityRoll:0})),observer:[x+8.5,top+1,z+.5],homeChunk:[Math.floor(x/16),Math.floor(z/16),Math.floor((top+1)/16)].join(',')});
     if(id){const e=f.get(id);assert.ok(e);admitted.push(e.species.id);}
    }
   }
   const counts=f.counts(),timing=observeSteps(f,view.query,30);
   all.push({seed,biome,admitted,counts,timing});f.dispose();
  }
  assert.equal(JSON.stringify(world.save()),before);assert.equal(world.pack2Snapshot().cells.length,0);
 }
 console.log('AB22 integrated generated surface '+JSON.stringify(all));
 assert.equal(all.length,15);assert.ok(all.some(r=>r.admitted.length>=2));assert.ok(all.reduce((n,r)=>n+r.timing.activeSteps,0)>0);
});
test('actual generated baseline cave admissions run under original engine with no source edits',()=>{
 const all=[];
 for(const seed of [179,42,2026]){
  const world=new Pack2LiveWorld(new FourRegionWorld(seed,fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR))),before=JSON.stringify(world.save());
  const view=createExpansionOwnerView(world,{hasOwner:()=>true,overlayEpoch:()=>0,observe:([x,y,z])=>({biome:y<=-4?'cave':'meadow',hazard:false,light:.2,dayPhase:'night'})});
  const f=createBeastEngineFixture(view,seed),admitted=[];
  for(const x of [-32,0,32])for(const z of [-32,0,32]){
   let floor=null,roof=null;
   for(let y=-6;y>=-180&&(floor===null||roof===null);y--)if(world.get(x,y,z)===BLOCK.AIR){
    if(floor===null&&world.get(x,y-1,z)!==BLOCK.AIR)floor=y;
    if(roof===null&&world.get(x,y+1,z)!==BLOCK.AIR)roof=y+1;
   }
   for(const [id,y] of [['echo-stalker',floor],['cave-bat',roof],['ceiling-lurker',roof]]){
    if(y===null)continue;const c=cat.get(id),p=[x+.5,id==='echo-stalker'?y:y-c.record.body.height,z+.5];
    const born=f.selectAndSpawn({proposals:[{id,point:p,rarityRoll:0}],observer:[x+8.5,p[1],z+.5],homeChunk:[Math.floor(x/16),Math.floor(z/16),Math.floor(p[1]/16)].join(',')});
    if(born)admitted.push(f.get(born).species.id);
   }
  }
  all.push({seed,admitted,timing:observeSteps(f,view.query,30)});f.dispose();
  assert.equal(JSON.stringify(world.save()),before);assert.equal(world.pack2Snapshot().cells.length,0);
 }
 console.log('AB22 integrated generated cave '+JSON.stringify(all));
 assert.ok(all.some(r=>r.admitted.length>0));
});
test('mixed original-engine dire hounds consume one immutable target batch and stagger actual health changes',()=>{
 const get=(x,y,z)=>y===-3?BLOCK.GRASS:BLOCK.AIR;
 const q=createExpansionWorldQuery({get},{resident:()=>true,revision:()=>1,observe:()=>({biome:'meadow',hazard:false,light:.2,dayPhase:'night'}),extraOverlayBlocked:()=>false});
 const view={query:q,revision:()=>1,materialAt:get,generatedMaterialAt:get},f=createBeastEngineFixture(view);
 const spawn=x=>f.selectAndSpawn({proposals:[{id:'dire-hound',point:[x,-2,.5],rarityRoll:0}],observer:[x+8,-2,.5],homeChunk:'0,0,0'});
 const a=spawn(-1.25),b=spawn(1.25);assert.ok(a&&b);
 const target=f.spawnOriginal('cow',[0,-2,.5]);assert.ok(target);
 const commands=[{id:a,targetId:target},{id:b,targetId:target}],ticks=[];
 assert.equal(f.advancePopulation(FIXED_STEP,[commands[0],commands[0]]),0);
 f.drainEvents();
 for(let tick=1;tick<=32;tick++){
  assert.equal(f.advancePopulation(FIXED_STEP,commands),1);
  const hits=f.drainEvents().filter(e=>e.type==='hurt'&&e.id===target);
  assert.ok(hits.length<=1);if(hits.length)ticks.push(tick);
 }
 assert.equal(ticks.length,2);assert.notEqual(Math.floor(ticks[0]/4)%2,Math.floor(ticks[1]/4)%2);
 assert.ok(f.get(target).health<cat.index.get('cow').combat.health);
});
