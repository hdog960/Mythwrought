// MYTHWROUGHT Desert Phase 3: actual original V6 triple-junction material priority.
// Source-backed census #45036277170: five seeds, >1000 real order-conflict
// desert columns. No synthetic biome injection or world topology changes.
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {terrainHeight} from '../src/voxel.mjs';
import {ENVIRONMENT_GROUND as G} from '../src/environment-ground.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../src/manual-biomes/profile-world.mjs';

const sites=[
  [179,-786,-1774,'enchanted'],
  [2026,-2848,-774,'snow'],
  [2201,-1330,-278,'snow'],
  [-443,-790,1250,'snow'],
  [77,-2282,-1260,'enchanted']
];
const offsets=[[14,0],[-14,0],[0,14],[0,-14]];
test('genuine five-seed Desert triple junctions prioritize Mountain scree over earlier special neighbors',()=>{
  for(const [seed,x,z,first] of sites){
    const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
    const biome=v6BiomeAt(x,z,seed);
    assert.equal(biome?.name,'desert','Authentic site must be Desert');
    assert.ok(biome.weight<=.50,'Only low-weight Desert edge may be affected');
    const neighbors=offsets.map(([dx,dz])=>
      v6BiomeAt(x+dx,z+dz,seed)?.name??'plains');
    assert.ok(neighbors.includes('mountain'),'Site must actually touch Mountain');
    const firstSpecial=neighbors.find(name=>name!=='desert'&&name!=='plains');
    assert.equal(firstSpecial,first,'The documented early-return defect must be reproduced');
    assert.notEqual(firstSpecial,'mountain','Mountain must come after another special biome');
    const plan=world._columnPlan(x,z);
    assert.ok(plan.size>0,'Genuine source candidate must pass cave/landmark veto');
    const top=Math.max(...plan.keys());
    assert.equal(plan.get(top),G.scree,
      'Desert-only actual top should preserve Mountain scree at triple junction: '+
      JSON.stringify({seed,x,z,neighbors,top}));
    assert.equal(world.naturalAndLandmarkBlock(x,top,z),G.scree,
      'True original V7 world reader must agree with the planned physical cap');
    assert.deepEqual(world.save().edits,[],'Sampling cannot create gameplay edits');
  }
});

test('real protected seed77 column still vetoes whole plan and preserves underlying baseline',()=>{
  const seed=77,x=-2280,z=-1256;
  const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  assert.equal(v6BiomeAt(x,z,seed)?.name,'desert');
  const neighbors=offsets.map(([dx,dz])=>
    v6BiomeAt(x+dx,z+dz,seed)?.name??'plains');
  assert.equal(neighbors[0],'enchanted');
  assert.equal(neighbors[2],'mountain');
  assert.equal(world._columnPlan(x,z).size,0,'Protected cell remains wholly vetoed');
  const old=terrainHeight(x,z,seed);
  for(let y=old-2;y<old;y++)
    assert.equal(world.naturalAndLandmarkBlock(x,y,z),
      world._environmentBaseline(x,y,z),
      'No under-surface protected cave/landmark cell may change');
  assert.deepEqual(world.save().edits,[]);
});
