import assert from 'node:assert/strict';
import test from 'node:test';
import {BLOCK} from '../src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M6_BALANCED_GENERATOR,M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {planEnvironmentalScenery} from '../src/nonblock/staged-habitats.mjs';
import {createCandidateScene,describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';

test('environment scenery is deterministic, bounded, and agrees across overlapping chunks',()=>{
  const seed=179,profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const world=new FourRegionWorld(seed,profile);
  const repeated=new FourRegionWorld(seed,profile);
  for(const [cx,cz] of [[0,0],[32,0],[0,32],[-32,0],[0,-32]]){
    const layout=planEnvironmentalScenery(world,cx,cz);
    const adjacent=planEnvironmentalScenery(world,cx+1,cz);
    assert.ok(layout.length>0&&layout.length<=27);
    assert.deepEqual(layout,planEnvironmentalScenery(repeated,cx,cz));
    const key=o=>describeCandidateObject(seed,o).instanceKey;
    assert.equal(new Set(layout.map(key)).size,layout.length);
    const inOverlap=({anchor:[x]})=>Math.floor(x/16)>=cx&&Math.floor(x/16)<=cx+1;
    assert.deepEqual(layout.filter(inOverlap).map(key).sort(),adjacent.filter(inOverlap).map(key).sort());
    for(const item of layout)assert.ok(describeCandidateObject(seed,item).supports.every(cell=>world.get(...cell)!==BLOCK.AIR));
  }
  assert.deepEqual(world.save(),{schema:1,seed,edits:[]});
  assert.deepEqual(planEnvironmentalScenery(new FourRegionWorld(seed,fourRegionProfile(seed,M6_BALANCED_GENERATOR)),0,0),[]);
});

test('live physical occupants and excavated supports exclude streamed placement',()=>{
  const seed=179,world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  const [plant]=planEnvironmentalScenery(world,0,0);
  const [x,y,z]=plant.anchor;
  const same=({anchor})=>anchor.join(',')===plant.anchor.join(',');
  assert.ok(!planEnvironmentalScenery(world,0,0,{occupied:(a,b,c)=>a===x&&b===y&&c===z}).find(same));
  assert.ok(world.set(x,y-1,z,BLOCK.AIR));
  assert.ok(!planEnvironmentalScenery(world,0,0).find(same));
});

test('streamed cave specimens use existing rock and do not relocate after a mount is mined',()=>{
  const seed=179,world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  const first=planEnvironmentalScenery(world,0,0,{caveSection:0});
  assert.ok(first.length>=2);
  const shard=first.find(item=>item.sceneId==='nonblock:e:crystal-shard');
  assert.ok(shard);
  const specimen=describeCandidateObject(seed,shard);
  const [x,y,z]=shard.anchor;
  assert.equal(world.get(x,y,z),BLOCK.AIR);
  assert.ok(specimen.supports.every(cell=>world.get(...cell)===BLOCK.STONE));
  const adjacent=planEnvironmentalScenery(world,1,0,{caveSection:0});
  assert.ok(adjacent.some(item=>describeCandidateObject(seed,item).instanceKey===specimen.instanceKey));
  assert.ok(world.set(...specimen.supports[0],BLOCK.AIR));
  const cut=planEnvironmentalScenery(world,0,0,{caveSection:0});
  assert.ok(!cut.some(({anchor})=>anchor[0]===x&&anchor[2]===z));
});

test('landmark props use the real district and wait for resident mounts before colliding',()=>{
  const seed=179,world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  const plan=planEnvironmentalScenery(world,-30,2);
  const prop=plan.find(({sceneId,anchor})=>sceneId==='scene36:brazier'&&anchor.join(',')==='-475,10,43');
  assert.ok(prop);
  const geometry=describeCandidateObject(seed,prop);
  const [mount]=geometry.supports;
  assert.notEqual(world.get(...mount),BLOCK.AIR);
  let ready=false;
  const scene=createCandidateScene(seed,M7_ENVIRONMENT_GENERATOR,[prop],{
    storage:{getItem:()=>null},blockAt:(...p)=>world.get(...p)!==BLOCK.AIR,
    voxelPick:()=>null,residentAt:()=>ready
  });
  assert.deepEqual(scene.visible(),[]);
  assert.equal(scene.bodyIntersects(geometry.colliders[0]),false);
  ready=true;
  assert.equal(scene.visible()[0].instanceKey,geometry.instanceKey);
  assert.equal(scene.bodyIntersects(geometry.colliders[0]),true);
  assert.ok(world.set(...mount,BLOCK.AIR));
  assert.ok(!planEnvironmentalScenery(world,-30,2).some(item=>item.anchor.join(',')===prop.anchor.join(',')));
});

test('native wall vines, snow icicles and cave columns find their actual support faces',()=>{
  const seed=179,world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  for(const [cx,cz,caveSection,sceneId,supportCount] of [
    [-12,-44,undefined,'scene48:glowing-vine',2],
    [-9,23,undefined,'nonblock:d:icicle-spear',1],
    [4,11,-1,'nonblock:e:limestone-cave-column',2]
  ]){
    const layout=planEnvironmentalScenery(world,cx,cz,{caveSection});
    const fixture=layout.find(item=>item.sceneId===sceneId);
    assert.ok(fixture,'Expected naturally generated '+sceneId);
    const geometry=describeCandidateObject(seed,fixture);
    assert.equal(geometry.supports.length,supportCount);
    assert.ok(geometry.supports.every(cell=>world.get(...cell)!==BLOCK.AIR));
    const [support]=geometry.supports;
    assert.ok(world.set(...support,BLOCK.AIR));
    const remaining=planEnvironmentalScenery(world,cx,cz,{caveSection});
    assert.ok(!remaining.some(item=>describeCandidateObject(seed,item).instanceKey===geometry.instanceKey));
  }
});
