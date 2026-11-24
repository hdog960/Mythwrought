import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {VoxelWorld,BLOCK,baseBlock,worldKey,collides} from '../src/voxel.mjs';
import {stepPlayer} from '../src/physics.mjs';
import {CaveVoxelWorld} from '../src/manual-caves/cave-voxel-world.mjs';
import {planNewCaveEntrances} from '../src/manual-caves/entrance-preflight.mjs';
import {descentEntranceApproach,descentRoute} from '../src/underground-switchback-descent.mjs';
import {FourRegionWorld,fourRegionProfile,restoreFourRegionWorld,M7_ENVIRONMENT_GENERATOR,FOUR_REGION_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
const digest=m=>createHash('sha256').update(JSON.stringify([...m].sort((a,b)=>a[0].localeCompare(b[0])))).digest('hex');
const options=seed=>{
 const c=new CaveVoxelWorld(seed,{approved:true});
 return {world:new VoxelWorld(seed),sourceCells:c.caveCellMap,
  additionalSourceMaps:[c.caveConnectorCells,c.caveEastCells],approved:true};
};
const drive=(world,route)=>{
 const a=route[0],p={x:a.x+.5,z:a.z+.5,feet:a.feet,yaw:0,pitch:0,vX:0,vZ:0,vY:0,onGround:true,coyote:.09,jumpBuffer:0};
 let frames=0;
 for(const b of route.slice(1)){
  let reached=false;
  for(let n=0;n<120;n++){
   const dx=b.x+.5-p.x,dz=b.z+.5-p.z,d=Math.hypot(dx,dz);
   if(d>.085)p.yaw=Math.atan2(dx,dz);
   stepPlayer(world,p,{forward:d>.085?1:0,strafe:0,jump:false},1/60);frames++;
   assert.equal(collides(world,p.x,p.feet,p.z),false);
   if(Math.hypot(b.x+.5-p.x,b.z+.5-p.z)<=.12&&Math.abs(p.feet-b.feet)<=.025&&p.onGround&&collides(world,p.x,p.feet-.002,p.z)){reached=true;break;}
  }
  assert.ok(reached,'failed actual joined route '+JSON.stringify(b));
 }
 return frames;
};
for(const seed of [8675309,13579])test('actual constructed M7 descent join and footprint '+seed,()=>{
 const o=options(seed),before=[o.sourceCells,...o.additionalSourceMaps].map(digest);
 const plan=planNewCaveEntrances(o);assert.ok(plan.ok,JSON.stringify(plan.failures));
 const e=plan.entrances.find(x=>x.name==='switchback36');
 assert.ok(e.fallback?.originalDescentJoinVerified);
 const m7=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
 for(const [k,id] of e.cells){
  const [x,y,z]=k.split(',').map(Number);
  assert.equal(m7.get(x,y,z),id,k);
  for(const map of [o.sourceCells,...o.additionalSourceMaps])if(map.has(k))assert.equal(id,map.get(k),k);
  if(o.world.get(x,y,z)===BLOCK.ORE)assert.equal(id,BLOCK.ORE,k);
 }
 const route=[...descentEntranceApproach().slice(1),...descentRoute().slice(1,3)].reverse().concat(e.route);
 for(const p of route){assert.equal(collides(m7,p.x+.5,p.feet,p.z+.5),false);assert.ok(collides(m7,p.x+.5,p.feet-.002,p.z+.5));}
 const forward=drive(m7,route),reverse=drive(m7,[...route].reverse());
 assert.deepEqual([o.sourceCells,...o.additionalSourceMaps].map(digest),before);
 assert.equal(m7.edits.size,0);
 console.log(JSON.stringify({seed,fullFootprint:e.cells.size,collar:e.fallback.collarCells,stations:route.length,forward,reverse,sourceMapsUnchanged:true}));
});
test('exact historical planner parity for every previously successful sample',async()=>{
 const old=await import('../src/manual-caves/.phase38-historical-entrance.mjs');
 let successes=0;
 for(const seed of [179,2026,1,-77,42,12345,0,2147483647,-2147483648]){
  const o=options(seed),original=old.planNewCaveEntrances(o),now=planNewCaveEntrances(o);
  if(original.ok){
   successes++;assert.ok(now.ok);
   assert.deepEqual(now.entrances,original.entrances);
   assert.equal(digest(now.cells),digest(original.cells));
   const m7=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
   for(const [k,id] of now.cells){const [x,y,z]=k.split(',').map(Number);assert.equal(m7.get(x,y,z),id,k);}
  }
  console.log(JSON.stringify({seed,historical:original.ok,current:now.ok,exactParity:original.ok?true:null}));
 }
 assert.ok(successes>=2);
});
test('legacy and historical four-region in-memory schema-1 round trips retain edits',()=>{
 const seed=179,legacy=new VoxelWorld(seed);
 assert.ok(legacy.set(901,-24,902,BLOCK.CRYSTAL));
 const payload=legacy.save(),snapshot=JSON.stringify(payload);
 assert.deepEqual(VoxelWorld.restore(payload).save(),payload);
 const profile=fourRegionProfile(seed,FOUR_REGION_GENERATOR),old=new FourRegionWorld(seed,profile);
 assert.ok(old.set(901,-24,902,BLOCK.CRYSTAL));
 const oldPayload=old.save();
 assert.deepEqual(restoreFourRegionWorld(oldPayload,profile).save(),oldPayload);
 assert.equal(JSON.stringify(payload),snapshot);
});
test('join collar cannot overwrite an explicit player edit',()=>{
 const o=options(13579),p=descentEntranceApproach()[1];
 o.world.edits.set(worldKey(p.x,p.floor+2,p.z),BLOCK.STONE);
 const plan=planNewCaveEntrances(o);
 assert.equal(plan.ok,false);
 assert.ok(plan.failures.find(f=>f.name==='switchback36'));
});
