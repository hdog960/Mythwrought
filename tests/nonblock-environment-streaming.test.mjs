import assert from 'node:assert/strict';
import test from 'node:test';
import {BLOCK} from '../src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M6_BALANCED_GENERATOR,M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {planEnvironmentalScenery} from '../src/nonblock/staged-habitats.mjs';
import {describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';

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
