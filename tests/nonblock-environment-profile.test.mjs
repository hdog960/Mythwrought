import assert from 'node:assert/strict';
import test from 'node:test';
import {BLOCK,VoxelWorld,raycast,terrainHeight} from '../src/voxel.mjs';
import {biome130Block,isBiome130BlockId} from '../src/biome130-registry.mjs';
import {FourRegionWorld,fourRegionProfile,M6_BALANCED_GENERATOR,M7_ENVIRONMENT_GENERATOR,
  restoreFourRegionWorld} from '../src/manual-biomes/profile-world.mjs';

const sites={desert:[512,0],snow:[0,512],mountain:[-512,0],enchanted:[0,-512]};
const capIds={desert:[256,257,259],snow:[272,276,279],mountain:[400,401,402,272],enchanted:[403,404,405]};
const surface=(world,x,z)=>{
  for(let y=19;y>=2;y--){
    const id=world.get(x,y,z);
    if(id!==BLOCK.AIR)return {id,y};
  }
  return {id:BLOCK.AIR,y:0};
};

test('the explicit environment profile uses continuous solid terrain in the four biome interiors',()=>{
  assert.equal(typeof M7_ENVIRONMENT_GENERATOR,'string');
  for(const seed of [179,2026]){
    const evolved=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
    const legacy=new VoxelWorld(seed);
    for(const [x,z] of [[0,0],[5,-7],[-7,4]])
      for(let y=-3;y<=19;y++)assert.equal(evolved.get(x,y,z),legacy.get(x,y,z),'Plains spawn changed');
    for(const [name,[cx,cz]] of Object.entries(sites)){
      let selected=0;
      for(let x=cx-10;x<=cx+10;x+=2)for(let z=cz-10;z<=cz+10;z+=2){
        const {id,y}=surface(evolved,x,z);
        if(!capIds[name].includes(id))continue;
        if(isBiome130BlockId(id))
          assert.ok(biome130Block(id).boxes.some(box=>box.join(',')==='0,0,0,1,1,1'));
        assert.notEqual(evolved.get(x,y-1,z),BLOCK.AIR,'Found unsupported natural terrain');
        selected++;
      }
      assert.ok(selected>=72,seed+' '+name+' has too little coherent terrain');
    }
  }
});

test('new materials and removals round-trip as schema-1 edits without changing older profiles',()=>{
  const seed=179;
  const profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const world=new FourRegionWorld(seed,profile);
  const olderBefore=new FourRegionWorld(seed,fourRegionProfile(seed,M6_BALANCED_GENERATOR));
  const [x,z]=sites.enchanted;
  const before=surface(olderBefore,x,z);
  assert.ok(world.set(50,18,50,404));
  const {y}=surface(world,x,z);
  assert.deepEqual(raycast(world,[x+.5,y+2.5,z+.5],[0,-1,0],6)?.hit,[x,y,z]);
  assert.ok(world.set(x,y,z,BLOCK.AIR));
  const saved=world.save();
  assert.equal(saved.schema,1);
  const reopened=restoreFourRegionWorld(saved,profile);
  assert.equal(reopened.get(50,18,50),404);
  assert.equal(reopened.get(x,y,z),BLOCK.AIR);
  assert.deepEqual(reopened.save(),saved);
  assert.deepEqual(surface(new FourRegionWorld(seed,olderBefore.generationProfile),x,z),before);
});

test('new biome terrain keeps actual cave air and existing protected mouths',()=>{
  for(const seed of [179,2026]){
    const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
    const legacy=new VoxelWorld(seed);
    let air=0;
    for(const [cx,cz] of Object.values(sites))for(let x=cx-5;x<=cx+5;x++)for(let z=cz-5;z<=cz+5;z++){
      const limit=terrainHeight(x,z,seed)-2;
      for(let y=-3;y<=limit;y++)if(legacy.get(x,y,z)===BLOCK.AIR){
        assert.equal(world.get(x,y,z),BLOCK.AIR);
        air++;
      }
    }
    assert.ok(air>0,'The sample must include real cave air');
  }
});
