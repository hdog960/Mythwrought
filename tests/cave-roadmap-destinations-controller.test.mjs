// Cave Roadmap #240 C3/C5 actual controller destination coverage.
// Four original surface entrances and four historically distinct deep vault
// branches, each forward and back with the real game physics stepPlayer.
// No teleport along a path, authored cell shortcuts or previous world edits.
import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,collides} from '../src/voxel.mjs';
import {stepPlayer,COYOTE_TIME} from '../src/physics.mjs';
import {createStagedCaveRuntime} from '../src/manual-caves/opt-in-runtime.mjs';
import {planDeepVaultConnections} from '../src/manual-caves/deep-vault-bridges.mjs';
import {auditCaveSourceCells} from '../src/manual-caves/source-composition.mjs';
import {VAULT_LEVELS} from '../src/deep-vault-galleries.mjs';
import {planHistoricalEastGallery} from '../src/manual-caves/east-gallery-intake.mjs';

const SEEDS=[179,1,2026,-77];
const TICKS_PER_CELL=115;
const DT=1/60;
function walkRoundTrip(world,route,label){
 assert.ok(Array.isArray(route)&&route.length>=2,label+' requires a distinct physical path');
 const first=route[0],p={x:first.x+.5,z:first.z+.5,feet:first.feet,
   yaw:0,pitch:0,vX:0,vY:0,vZ:0,onGround:true,coyote:COYOTE_TIME,jumpBuffer:0};
 assert.equal(collides(world,p.x,p.feet,p.z),false,label+' real player collision at origin');
 let frames=0,minFeet=p.feet,maxFeet=p.feet;
 function go(q,i,phase){
  const delta=Math.hypot(q.x+.5-p.x,q.z+.5-p.z);
  assert.ok(delta<=2.2,label+' route jumps between authored points '+i);
  let steps=0;
  while(Math.hypot(p.x-q.x-.5,p.z-q.z-.5)>.23&&steps<TICKS_PER_CELL){
   p.yaw=Math.atan2(q.x+.5-p.x,q.z+.5-p.z);
   stepPlayer(world,p,{forward:1,strafe:0,jump:false},DT);
   assert.equal(collides(world,p.x,p.feet,p.z),false,label+' real body clipped at '+phase+' '+i);
   assert.ok(Number.isFinite(p.feet)&&p.feet>=-210&&p.feet<=25,
    label+' player left actual world bounds at '+phase+' '+i);
   frames++;steps++;minFeet=Math.min(minFeet,p.feet);maxFeet=Math.max(maxFeet,p.feet);
  }
  assert.ok(steps<TICKS_PER_CELL,
   label+' real input stuck at '+phase+' '+i+' '+JSON.stringify({goal:q,at:p,steps}));
  assert.ok(Math.hypot(p.x-q.x-.5,p.z-q.z-.5)<.24,
   label+' real player never reached '+phase+' '+i);
  for(let n=0;n<4;n++)stepPlayer(world,p,{forward:0,strafe:0,jump:false},DT);
 }
 for(let i=1;i<route.length;i++)go(route[i],i,'outbound');
 for(let i=route.length-2;i>=0;i--)go(route[i],i,'return');
 assert.ok(Math.hypot(p.x-first.x-.5,p.z-first.z-.5)<.24,
  label+' cannot return to initial source cell');
 assert.ok(Math.abs(p.feet-first.feet)<1.2,label+' return elevation wrong');
 return Object.freeze({frames,legs:2*(route.length-1),minFeet,maxFeet});
}
for(const seed of SEEDS){
 test('real stepPlayer connects all four protected surface mouths to source anchor and back: '+seed,()=>{
  const old=new VoxelWorld(seed),bytes=JSON.stringify(old.save());
  const runtime=createStagedCaveRuntime(seed,null,{approved:true});
  const labels=runtime.entrancePlan.entrances.map(x=>x.name);
  assert.deepEqual(labels,['old-deep24','switchback36','upper24-windcut','upper24-hollowbend']);
  const evidence=[];
  for(const entry of runtime.entrancePlan.entrances){
   assert.equal(entry.route.length,entry.mouth.approachSteps);
   const descending=entry.route.slice().reverse();
   const proof=walkRoundTrip(runtime.world,descending,
     'seed='+seed+' entry='+entry.name);
   evidence.push({entrance:entry.name,segments:descending.length,...proof});
   assert.ok(proof.legs>=8,'Not enough true walking for an entrance');
  }
  assert.equal(JSON.stringify(old.save()),bytes,'original schema-1 save mutated');
  assert.equal(runtime.registeredInHomeScreen,false,'staging claimed published access');
  console.log('CAVE REAL FOUR ENTRANCE CONTROLLER PASS',seed,JSON.stringify(evidence));
 });
}
for(const seed of SEEDS){
 test('real stepPlayer goes into ALL FOUR unique historical deep-vault corridors and returns: '+seed,()=>{
  const old=new VoxelWorld(seed),bytes=JSON.stringify(old.save());
  const runtime=createStagedCaveRuntime(seed,null,{approved:true});
  const source=auditCaveSourceCells(seed);
  assert.equal(source.ok,true,JSON.stringify(source.reasons));
  const links=planDeepVaultConnections({sourceCells:source.cells,seed});
  assert.equal(links.ok,true,JSON.stringify(links.failures));
  assert.deepEqual(links.bridges.map(b=>b.floor),VAULT_LEVELS);
  const evidence=[];
  for(const bridge of links.bridges){
   const proof=walkRoundTrip(runtime.world,bridge.route,'seed='+seed+' vault='+bridge.floor);
   evidence.push({vaultFloor:bridge.floor,segments:bridge.route.length,...proof});
  }
  assert.equal(evidence.length,4,'A historical four-vault room was skipped');
  assert.equal(JSON.stringify(old.save()),bytes);
  console.log('CAVE REAL FOUR VAULT CONTROLLER PASS',seed,JSON.stringify(evidence));
 });
}
for(const seed of SEEDS){
 test('real stepPlayer visits preserved original East Gallery via South connection and returns: '+seed,()=>{
  const baseline=new VoxelWorld(seed),bytes=JSON.stringify(baseline.save());
  const runtime=createStagedCaveRuntime(seed,null,{approved:true});
  const original=planHistoricalEastGallery({seed,baseWorld:baseline,approved:true});
  assert.equal(original.ok,true,JSON.stringify(original.rejected??[]));
  assert.equal(original.roomCells,35);
  const path=original.sourceRoute.map(p=>({...p,floor:p.feet-1}));
  const result=walkRoundTrip(runtime.world,path,
   'seed='+seed+' original East+South source');
  assert.ok(result.legs>=8);
  assert.equal(JSON.stringify(baseline.save()),bytes);
  console.log('CAVE HISTORIC EAST SOUTH ACTUAL CONTROLLER PASS',seed,
   JSON.stringify({...result,relocated:original.relocated}));
 });
}
