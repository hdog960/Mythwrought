// MYTHWROUGHT Desert Phase 2: real no-grass ground requirement.
// These ten sites were obtained from the authenticated exact-source V7
// Chromium artifact #14727906444 (seeds 179, 2026).
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {BLOCK,terrainHeight} from '../src/voxel.mjs';
import {WORLD_MAX_Y} from '../src/depth.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,
  M6_BALANCED_GENERATOR,restoreFourRegionWorld}
  from '../src/manual-biomes/profile-world.mjs';

const locations=[
 [179,'interior',[512,0]],[179,'plains',[268,-24]],
 [179,'snow',[216,-228]],[179,'mountain',[312,236]],
 [179,'enchanted',[-24,-821]],[2026,'interior',[384,0]],
 [2026,'plains',[233,24]],[2026,'snow',[240,312]],
 [2026,'mountain',[764,24]],[2026,'enchanted',[1822,312]]
];
const noGrass=(world,seed,place,name)=>{
  let sampled=0;
  for(let dz=-3;dz<=3;dz++)for(let dx=-3;dx<=3;dx++){
    const x=place[0]+dx,z=place[1]+dz;
    if(v6BiomeAt(x,z,seed)?.name!=='desert')continue;
    sampled++;
    for(let y=Math.max(2,terrainHeight(x,z,seed)-2);y<=WORLD_MAX_Y;y++){
      const actual=world.naturalAndLandmarkBlock(x,y,z);
      assert.notEqual(actual,BLOCK.GRASS,
        'V7 Desert-side natural grass: '+JSON.stringify({seed,neighbor:name,x,y,z}));
    }
  }
  assert.ok(sampled>0,'Missing natural Desert columns for '+name);
  return sampled;
};

test('V7 original source-backed Desert interior and four biome shoulders contain no natural grass',()=>{
  let columns=0;
  for(const seed of [179,2026]){
    const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
    for(const [s,name,place] of locations.filter(row=>row[0]===seed))
      columns+=noGrass(world,seed,place,name);
    assert.deepEqual(world.save().edits,[],'Sampling may not persist any gameplay edits');
  }
  assert.ok(columns>=280,'Expected a meaningful original Desert-side multi-biome survey');
});

test('V7 desert shoulder recoloring does not erase naturally preserved Plains soil',()=>{
  for(const seed of [179,2026]){
    const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
    const outside=seed===179?[267,-24]:[232,24];
    assert.equal(v6BiomeAt(...outside,seed),null,'Control must be original Plains');
    let grass=0;
    for(let dx=-6;dx<=6;dx++)for(let dz=-6;dz<=6;dz++){
      const x=outside[0]+dx,z=outside[1]+dz;
      if(v6BiomeAt(x,z,seed)!==null)continue;
      if(world.naturalAndLandmarkBlock(x,terrainHeight(x,z,seed),z)===BLOCK.GRASS)
        grass++;
    }
    assert.ok(grass>0,'The non-Desert original Plains grass must remain alive');
    assert.deepEqual(world.save().edits,[]);
  }
});

test('V7 desert no-grass overlay remains compatible with player-placed blocks, schema-1 and older V6 profile',()=>{
  const seed=179,profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const world=new FourRegionWorld(seed,profile);
  const old=new FourRegionWorld(seed,fourRegionProfile(seed,M6_BALANCED_GENERATOR));
  const [x,z]=locations[1][2],y=terrainHeight(x,z,seed);
  const oldBefore=old.naturalAndLandmarkBlock(x,y,z);
  assert.equal(world.set(x,y+1,z,BLOCK.GRASS),true,
    'Player grass is explicitly permitted and not natural generation');
  assert.equal(world.get(x,y+1,z),BLOCK.GRASS);
  const saved=world.save();
  assert.equal(saved.schema,1);
  assert.deepEqual(saved.edits,[[x,y+1,z,BLOCK.GRASS]]);
  const reopened=restoreFourRegionWorld(saved,profile);
  assert.deepEqual(reopened.save(),saved);
  assert.equal(reopened.get(x,y+1,z),BLOCK.GRASS);
  assert.equal(old.naturalAndLandmarkBlock(x,y,z),oldBefore,
    'Older V6 profile must not be rewritten by V7 generation changes');
});


test('six real Desert/Enchanted protected-air columns keep their cave while only natural grass dries',()=>{
  const seed=179,profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const world=new FourRegionWorld(seed,profile);
  const exactCells=[[-25,-822],[-24,-822],[-23,-822],
    [-25,-821],[-24,-821],[-23,-821]];
  for(const [x,z] of exactCells){
    assert.equal(v6BiomeAt(x,z,seed)?.name,'desert');
    const old=terrainHeight(x,z,seed);
    assert.equal(old,6,'Source-backed original terrain height has changed');
    assert.equal(world._environmentBaseline(x,old-2,z),BLOCK.AIR,
      'The original cave/protected air must exist before applying grass repair');
    assert.equal(world._environmentBaseline(x,old,z),BLOCK.GRASS,
      'This exact test must exercise originally generated green grass');
    assert.equal(world._columnPlan(x,z).size,0,
      'Protected air must still reject the entire full-column elevation');
    for(let y=old-2;y<old;y++)
      assert.equal(world.naturalAndLandmarkBlock(x,y,z),
        world._environmentBaseline(x,y,z),
        'The under-surface protected terrain/cave was changed');
    assert.equal(world.naturalAndLandmarkBlock(x,old,z),256,
      'Only the natural exposed Desert grass gets a dry sand surface');
  }
  assert.deepEqual(world.save().edits,[]);
  const [x,z]=exactCells[0],y=terrainHeight(x,z,seed);
  assert.equal(world.set(x,y,z,BLOCK.GRASS),true,
    'Player-placed grass is still legal on the protected cave edge');
  assert.equal(world.get(x,y,z),BLOCK.GRASS,
    'Saved player grass must override natural surface dryness');
  const save=world.save();
  assert.deepEqual(restoreFourRegionWorld(save,profile).save(),save);
  assert.equal(restoreFourRegionWorld(save,profile).get(x,y,z),BLOCK.GRASS);
});
