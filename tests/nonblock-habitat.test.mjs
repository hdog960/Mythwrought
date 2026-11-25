import assert from 'node:assert/strict';
import test from 'node:test';
import {BLOCK, VoxelWorld} from '../src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M6_BALANCED_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {planStagedHabitat} from '../src/nonblock/staged-habitats.mjs';

const seed=179;
const sites=[
  {habitat:'meadow',column:[10,7],sceneId:'scene48:single-wildflower'},
  {habitat:'desert',column:[512,0],sceneId:'nonblock:d:agave-rosette',variant:2},
  {habitat:'snow',column:[0,512],sceneId:'nonblock:d:frost-fern',variant:1},
  {habitat:'mountain',column:[-512,0],sceneId:'nonblock:d:alpine-wildflower'},
  {habitat:'enchanted',column:[0,-512],sceneId:'scene48:enchanted-flower',variant:2}
];

test('read-only plans use the actual physical caps for the four profiled habitats',()=>{
  const world=new FourRegionWorld(seed);
  const plans=planStagedHabitat(world,sites);
  assert.deepEqual(plans.map(row=>row.sceneId),sites.map(row=>row.sceneId));
  assert.deepEqual(plans.map(({anchor:[x,y,z]})=>world.get(x,y-1,z)),[BLOCK.GRASS,256,272,302,286]);
  assert.deepEqual(plans.map(row=>row.variant),[0,2,1,0,2]);
  assert.deepEqual(planStagedHabitat(world,sites),plans);
  assert.equal(world.edits.size,0);
  assert.equal(world.rotations.size,0);
});

test('a legacy save and a mismatched species cannot be treated as a profiled surface',()=>{
  assert.deepEqual(planStagedHabitat(new VoxelWorld(seed),sites).map(row=>row.sceneId),[sites[0].sceneId]);
  const world=new FourRegionWorld(seed);
  assert.deepEqual(planStagedHabitat(world,[{...sites[1],sceneId:sites[2].sceneId}]),[]);
  assert.deepEqual(planStagedHabitat(world,[{...sites[1],column:sites[2].column}]),[]);
});

test('the separately profiled balanced generator uses its own biome sampler',()=>{
  const world=new FourRegionWorld(seed,fourRegionProfile(seed,M6_BALANCED_GENERATOR));
  assert.deepEqual(planStagedHabitat(world,sites).map(row=>row.sceneId),sites.map(row=>row.sceneId));
  assert.equal(world.edits.size,0);
});

test('edited or occupied plants and mounts are excluded without changing saved edits',()=>{
  const world=new FourRegionWorld(seed);
  const [site]=planStagedHabitat(world,[sites[1]]);
  const [x,y,z]=site.anchor;
  assert.equal(world.set(x,y,z,BLOCK.WOOD),true);
  const original=new Map(world.edits);
  assert.deepEqual(planStagedHabitat(world,[sites[1]]),[]);
  assert.deepEqual(new Map(world.edits),original);
  assert.deepEqual(planStagedHabitat(new FourRegionWorld(seed),[sites[1]],{
    occupied:(a,b,c)=>a===x&&b===y&&c===z
  }),[]);
});

test('the legacy cave adapter uses actual rock mounts and rejects exposed or edited cells',()=>{
  const world=new VoxelWorld(seed);
  const requests=[];
  for(let x=14;x<=42;x++)for(let z=-15;z<=22;z++)for(let y=-1;y<=5;y++){
    if(world.get(x,y,z)===BLOCK.AIR&&world.get(x,y+1,z)===BLOCK.STONE)
      requests.push({habitat:'cave',anchor:[x,y,z],sceneId:'nonblock:e:clustered-dripstone',variant:7});
  }
  let cave;
  for(const candidate of requests){
    if(planStagedHabitat(world,[candidate]).length){cave=candidate;break;}
  }
  assert.ok(cave,'Expected one real cave roof');
  const [valid]=planStagedHabitat(world,[cave]);
  assert.deepEqual(valid.anchor,cave.anchor);
  assert.equal(valid.variant,7);
  assert.deepEqual(planStagedHabitat(world,[{...cave,anchor:[10,9,7]}]),[]);
  const [x,y,z]=cave.anchor;
  assert.equal(world.set(x,y+1,z,BLOCK.AIR),true);
  assert.deepEqual(planStagedHabitat(world,[cave]),[]);
});
