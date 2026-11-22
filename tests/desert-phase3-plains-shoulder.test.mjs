// MYTHWROUGHT Desert Phase 3: only source-proven V7 Desert/Plains pale-salt fringe.
// Original WebGL2 artifact #14730899552: seed 179 Plains border had 8
// photographed-source salt ID 259 cells among the 7x7 Desert-side sample.
// Plains are null in v6BiomeAt; old sharedShoulder ignored that genuine neighbor.
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {BLOCK,terrainHeight,VoxelWorld} from '../src/voxel.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,
  M6_BALANCED_GENERATOR} from '../src/manual-biomes/profile-world.mjs';

const OFFSETS=[[14,0],[-14,0],[0,14],[0,-14]];
const BORDERS=[[179,268,-24],[2026,233,24]];

test('real photographed Desert/Plains feather edge uses dry sand, never pale salt crust',()=>{
  let sampled=0;
  for(const [seed,cx,cz] of BORDERS){
    const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
    let local=0;
    for(let dz=-3;dz<=3;dz++)for(let dx=-3;dx<=3;dx++){
      const x=cx+dx,z=cz+dz,biome=v6BiomeAt(x,z,seed);
      if(biome?.name!=='desert'||biome.weight>.50)continue;
      const adjacent=OFFSETS.map(([a,b])=>v6BiomeAt(x+a,z+b,seed));
      if(!adjacent.includes(null)||adjacent.some(b=>b&&b.name!=='desert'))continue;
      const plan=world._columnPlan(x,z);
      if(!plan.size)continue; // never circumvent protected cave/landmark veto
      const top=Math.max(...plan.keys());
      assert.equal(plan.get(top),256,
        'Real original Desert-to-Plains low-weight surface must be dune sand: '+
        JSON.stringify({seed,x,z,top,cap:plan.get(top)}));
      assert.notEqual(world.naturalAndLandmarkBlock(x,top,z),BLOCK.GRASS);
      local++;
    }
    assert.ok(local>=10,'Must exercise real original seeded Desert/Plains edge '+seed);
    assert.deepEqual(world.save().edits,[],'Terrain verification may not create player edits');
    sampled+=local;
  }
  assert.ok(sampled>=20);
});

test('natural Plains grass and V6 original profiles stay unchanged across both boundaries',()=>{
  for(const [seed,cx,cz] of BORDERS){
    const v7=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
    const v6=new FourRegionWorld(seed,fourRegionProfile(seed,M6_BALANCED_GENERATOR));
    const original=new VoxelWorld(seed);
    let grass=0,originalProfiles=0;
    for(let dz=-7;dz<=7;dz++)for(let dx=-7;dx<=7;dx++){
      const x=cx+dx,z=cz+dz;
      if(v6BiomeAt(x,z,seed)!==null)continue;
      const y=terrainHeight(x,z,seed);
      if(v7.naturalAndLandmarkBlock(x,y,z)===BLOCK.GRASS)grass++;
      assert.equal(v6.naturalAndLandmarkBlock(x,y,z),
        original.naturalAndLandmarkBlock(x,y,z),
        'Original V6 Plains physical baseline must remain unmodified');
      originalProfiles++;
    }
    assert.ok(grass>0,'Neighbor Plains must retain natural green grass '+seed);
    assert.ok(originalProfiles>0,'Sample must include actual Plains columns');
    assert.deepEqual(v7.save().edits,[]);
    assert.deepEqual(v6.save().edits,[]);
  }
});

test('natural interior desert salt remains allowed, preserving original patch diversity',()=>{
  const seed=179,world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  let interiorSalt=0,interiorDesert=0;
  for(let z=-60;z<=-40;z++)for(let x=490;x<=510;x++){
    const biome=v6BiomeAt(x,z,seed);
    if(biome?.name!=='desert'||biome.weight<=.60)continue;
    interiorDesert++;
    const plan=world._columnPlan(x,z);
    if(plan.size&&plan.get(Math.max(...plan.keys()))===259)interiorSalt++;
  }
  assert.ok(interiorDesert>0,'Must actually sample deep Desert');
  assert.ok(interiorSalt>0,'Salt fields safely inland must NOT be removed');
  assert.deepEqual(world.save().edits,[]);
});
