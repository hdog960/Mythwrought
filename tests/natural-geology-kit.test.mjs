import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,VoxelWorld,WORLD_MIN_Y,WORLD_MAX_Y} from '../src/voxel.mjs';
import {GEOLOGY_MATERIALS,caveMineralSeam,planUneditedMineralSeam} from '../src/natural-geology-kit.mjs';

test('geology palette reuses physical IDs without allocating or renumbering blocks',()=>{
  assert.deepEqual([BLOCK.AIR,BLOCK.GRASS,BLOCK.DIRT,BLOCK.STONE,BLOCK.WOOD,BLOCK.CRYSTAL,BLOCK.ORE],[0,1,2,3,4,5,6]);
  assert.equal(GEOLOGY_MATERIALS.host,BLOCK.DEEPSTONE);
  assert.equal(GEOLOGY_MATERIALS.trunk,BLOCK.WOOD);
  assert.equal(GEOLOGY_MATERIALS.canopy,BLOCK.LEAVES);
});
test('seams are deterministic physical cells for multiple seeds and both orientations',()=>{
  for(const seed of [0,179,-77,2026]){
    for(const axis of ['x','z']){
      const a=caveMineralSeam([40,2,40],{seed,length:23,axis});
      assert.deepEqual(a,caveMineralSeam([40,2,40],{seed,length:23,axis}));
      assert.ok(Object.isFrozen(a)&&a.length>0);
      assert.ok(a.every(c=>Object.isFrozen(c)&&c.length===4&&
        c[1]>=WORLD_MIN_Y&&c[1]<=WORLD_MAX_Y&&
        [BLOCK.DEEPSTONE,BLOCK.ORE,BLOCK.CRYSTAL].includes(c[3])));
      assert.equal(new Set(a.map(c=>c.slice(0,3).join(','))).size,a.length);
      assert.ok(a.some(c=>c[3]===BLOCK.ORE));
    }
  }
});
test('planner never replaces saved edits, empty passages or existing landmarks',()=>{
  const world=new VoxelWorld(179);
  const seam=caveMineralSeam([0,0,0],{seed:179,length:15});
  const first=seam[0];
  world.set(first[0],first[1],first[2],BLOCK.WOOD);
  const saved=world.save();
  const planned=planUneditedMineralSeam(world,seam);
  assert.ok(planned.every(c=>world.get(c[0],c[1],c[2])!==BLOCK.AIR));
  assert.ok(!planned.some(c=>c.slice(0,3).join(',')===first.slice(0,3).join(',')));
  assert.deepEqual(world.save(),saved,'planning must never modify a world or save');
  assert.deepEqual(planUneditedMineralSeam(world,seam),planned);
});
test('geology rejects invalid inputs and clips out-of-world heights',()=>{
  assert.throws(()=>caveMineralSeam([1.5,0,0]),TypeError);
  assert.throws(()=>caveMineralSeam([0,0,0],{length:100}),RangeError);
  assert.throws(()=>caveMineralSeam([0,0,0],{axis:'y'}),RangeError);
  assert.deepEqual(caveMineralSeam([0,WORLD_MAX_Y+100,0]),[]);
});
