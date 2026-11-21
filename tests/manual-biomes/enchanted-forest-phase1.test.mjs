// Phase 1 source-backed regression: landmark geometry remains authoritative.
// The same five seed/coordinates were first found in real M7 Action 44947774163.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {planEnvironmentalColumn} from '../../src/manual-biomes/environment-v7.mjs';
import {ENVIRONMENT_GROUND as G} from '../../src/environment-ground.mjs';
import {VoxelWorld,terrainHeight,BLOCK} from '../../src/voxel.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';

const witnesses=[
  [-58,-568],[-57,-568],[-55,-568],[-54,-568],[-59,-567]
];
const enchantSoils=new Set([G.woodlandLoam,G.woodlandPeat,G.woodlandMoss]);

test('five genuine interior green patches get enchanted soil without touching landmark stone/ore',()=>{
  const seed=7919;
  const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  const legacy=new VoxelWorld(seed);
  for(const [x,z] of witnesses){
    assert.equal(v6BiomeAt(x,z,seed)?.name,'enchanted');
    assert.equal(v6BiomeAt(x,z,seed)?.weight,1);
    const y=terrainHeight(x,z,seed);
    assert.equal(legacy.naturalAndLandmarkBlock(x,y,z),BLOCK.GRASS,'original untouched grass footprint');
    const plan=world._columnPlan(x,z);
    assert.equal(plan.size,1,'landmark-footprint fallback must never change original land height');
    assert.equal(plan.has(y),true);
    assert.ok(enchantSoils.has(plan.get(y)),'enchanted-only cap');
    assert.equal(world.naturalAndLandmarkBlock(x,y,z),plan.get(y));
    let protectedCells=0;
    for(let a=y+1;a<=19;a++){
      const original=legacy.naturalAndLandmarkBlock(x,a,z);
      if(original!==BLOCK.AIR){
        assert.equal(world.naturalAndLandmarkBlock(x,a,z),original,'protected original geometry '+[x,a,z].join(','));
        protectedCells++;
      }
    }
    assert.ok(protectedCells>0,'actual landmark geometry must exist above the original grass');
    assert.equal(world.edits.size,0,'no artificial player edits');
  }
});
test('the cap-only fallback cannot touch other biomes, shoulders or protected ground',()=>{
  const seed=7919,x=-58,z=-568,old=terrainHeight(x,z,seed);
  function read(y){
    if(y>old)return y===old+2?BLOCK.STONE:BLOCK.AIR;
    if(y===old)return BLOCK.GRASS;
    return BLOCK.DIRT;
  }
  const normal=(a,y,c)=>read(y);
  for(const name of ['desert','snow','mountain'])
    assert.equal(planEnvironmentalColumn(x,z,seed,normal,{name,weight:1}).size,0,
      'non-enchanted '+name+' stays fail-closed');
  assert.equal(planEnvironmentalColumn(x,z,seed,normal,{name:'enchanted',weight:.55}).size,0,
    'boundary shoulders retain original behavior');
  const cap=planEnvironmentalColumn(x,z,seed,normal,{name:'enchanted',weight:1});
  assert.equal(cap.size,1);
  assert.ok(enchantSoils.has(cap.get(old)));
  const blockedCap=(a,y,c)=>y===old?BLOCK.STONE:read(y);
  assert.equal(planEnvironmentalColumn(x,z,seed,blockedCap,{name:'enchanted',weight:1}).size,0,
    'original landmark cap is not rewritten');
  const cavern=(a,y,c)=>y===old-1?BLOCK.AIR:read(y);
  assert.equal(planEnvironmentalColumn(x,z,seed,cavern,{name:'enchanted',weight:1}).size,0,
    'underground air/caves remain protected');
  const clear=(a,y,c)=>y>old?BLOCK.AIR:read(y);
  assert.ok(planEnvironmentalColumn(x,z,seed,clear,{name:'enchanted',weight:1}).size>1,
    'ordinary unoccupied enchanted terrain still generates full height/subsoil');
});
