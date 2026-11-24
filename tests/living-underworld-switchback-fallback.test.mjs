import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,worldKey,BLOCK,collides} from '../src/voxel.mjs';
import {stepPlayer} from '../src/physics.mjs';
import {CaveVoxelWorld} from '../src/manual-caves/cave-voxel-world.mjs';
import {planNewCaveEntrances,originalCaveEntranceSites} from '../src/manual-caves/entrance-preflight.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
for(const seed of [8675309,13579]){
 test('genuine original switchback fallback and constructor seed '+seed,()=>{
  const base=new CaveVoxelWorld(seed,{approved:true});
  const world=new VoxelWorld(seed);
  const old=JSON.stringify(world.save());
  const options={world,sourceCells:base.caveCellMap,
   additionalSourceMaps:[base.caveConnectorCells,base.caveEastCells],approved:true};
  const plan=planNewCaveEntrances(options);
  assert.ok(plan.ok,JSON.stringify(plan.failures));
  const entry=plan.entrances.find(x=>x.name==='switchback36');
  assert.ok(entry.fallback);
  assert.deepEqual(entry.sourceAnchor,originalCaveEntranceSites()[1]);
  assert.ok(entry.fallback.forwardFrames>0&&entry.fallback.reverseFrames>0);
  assert.equal(entry.fallback.originalControllerBothDirections,true);
  for(const [k,id] of entry.cells){
   for(const source of [base.caveCellMap,base.caveConnectorCells,base.caveEastCells])
    if(source.has(k))assert.equal(id,source.get(k),k);
  }
  const again=planNewCaveEntrances(options);
  assert.deepEqual(again.entrances.find(x=>x.name==='switchback36').route,entry.route);
  assert.equal(JSON.stringify(world.save()),old);
  const m7=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  for(const p of entry.route){
   assert.notEqual(m7.get(p.x,p.floor,p.z),BLOCK.AIR);
   assert.equal(collides(m7,p.x+.5,p.feet,p.z+.5),false);
   for(let h=1;h<=4;h++)assert.equal(m7.get(p.x,p.floor+h,p.z),BLOCK.AIR);
  }
  // The constructed isolated M7 object itself, not just the projected plan.
  // No writes, no live device or historical save is involved.
  const drive=points=>{
   const a=points[0],p={x:a.x+.5,z:a.z+.5,feet:a.feet,yaw:0,pitch:0,
    vX:0,vZ:0,vY:0,onGround:true,coyote:.09,jumpBuffer:0};
   let frames=0;
   for(const b of points.slice(1)){
    let reached=false;
    for(let n=0;n<120;n++){
     const dx=b.x+.5-p.x,dz=b.z+.5-p.z,d=Math.hypot(dx,dz);
     if(d>.085)p.yaw=Math.atan2(dx,dz);
     stepPlayer(m7,p,{forward:d>.085?1:0,strafe:0,jump:false},1/60);frames++;
     assert.equal(collides(m7,p.x,p.feet,p.z),false);
     if(Math.hypot(b.x+.5-p.x,b.z+.5-p.z)<=.12&&Math.abs(p.feet-b.feet)<=.025&&
        p.onGround&&collides(m7,p.x,p.feet-.002,p.z)){reached=true;break;}
    }
    assert.ok(reached,'Actual isolated M7 controller did not reach '+JSON.stringify(b));
   }
   return frames;
  };
  const constructedForward=drive(entry.route),constructedReverse=drive([...entry.route].reverse());
  assert.equal(m7.edits.size,0);
  console.log(JSON.stringify({seed,entry:entry.fallback,mouth:entry.mouth,routeLength:entry.route.length,cells:entry.cells.size,constructorPass:true,constructedForward,constructedReverse}));
 });
}
test('previous successful straight entrances remain on historical path',()=>{
 for(const seed of [179,2026]){
  const base=new CaveVoxelWorld(seed,{approved:true});
  const plan=planNewCaveEntrances({world:new VoxelWorld(seed),sourceCells:base.caveCellMap,approved:true});
  assert.ok(plan.ok,JSON.stringify(plan.failures));
  assert.equal(plan.entrances.some(e=>e.fallback),false);
 }
});
test('protected anchor player edit is never bypassed by alternate routes',()=>{
 const seed=8675309,base=new CaveVoxelWorld(seed,{approved:true}),world=new VoxelWorld(seed);
 const p=originalCaveEntranceSites()[1];
 world.edits.set(worldKey(p.x,p.floor,p.z),BLOCK.STONE);
 const plan=planNewCaveEntrances({world,sourceCells:base.caveCellMap,
 additionalSourceMaps:[base.caveConnectorCells,base.caveEastCells],approved:true});
 assert.equal(plan.ok,false);
 const failed=plan.failures.find(x=>x.name==='switchback36');
 assert.ok(failed);
 assert.equal(failed.alternateAttempts.length,224);
 assert.ok(failed.alternateAttempts.every(x=>x==='PLAYER_EDIT_PROTECTION'));
});
