// V7 mountain Phase 0/P1 guarded-surface repair regression coverage.
// This test runs the real production sampler. No mock terrain heights,
// no mutation of saves, and no change to cave/landmark ownership.
import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,terrainHeight} from '../src/voxel.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {planEnvironmentalColumn} from '../src/manual-biomes/environment-v7.mjs';
import {ENVIRONMENT_GROUND as G} from '../src/environment-ground.mjs';

const seed=179;
const mountain={x:-580,z:-72};
const ordinary=(x,y,z)=>{
  const top=terrainHeight(x,z,seed);
  return y>top?BLOCK.AIR:y===top?BLOCK.GRASS:
    y>=top-2?BLOCK.DIRT:BLOCK.STONE;
};
const obstruct=(x,z,y,id)=>((a,b,c)=>
  a===x&&b===y&&c===z?id:ordinary(a,b,c));

test('V7 mountain retains raised geometry and only supported stone, snow or lower alpine caps',()=>{
  const {x,z}=mountain,biome=v6BiomeAt(x,z,seed);
  assert.equal(biome.name,'mountain');
  const plan=planEnvironmentalColumn(x,z,seed,ordinary,biome);
  assert.ok(plan.size>1);
  const old=terrainHeight(x,z,seed);
  const top=Math.max(...plan.keys());
  assert.ok(top>old);
  const cap=plan.get(top);
  assert.ok([G.slate,G.scree,G.gneiss,272,BLOCK.GRASS].includes(cap),
    'Unregistered or unsupported mountain surface material');
  // The legitimate new alpine cap is never a free-floating green ribbon:
  // it has a limited lower elevation and two actual supported dirt layers.
  if(cap===BLOCK.GRASS){
    assert.ok(top>=5&&top<=11,'Alpine grass crossed the rocky peak envelope');
    assert.ok(biome.weight>=.92,'Alpine grass crossed the mountain shoulder');
    assert.equal(plan.get(top-1),BLOCK.DIRT,'Meadow grass lost supported topsoil');
    assert.equal(plan.get(top-2),BLOCK.DIRT,'Meadow grass lost supported subsoil');
  }
});

test('protected aboveground cell leaves mountain column geometry and foreign blocks unchanged',()=>{
  const {x,z}=mountain,biome=v6BiomeAt(x,z,seed);
  const old=terrainHeight(x,z,seed);
  const baseline=obstruct(x,z,old+1,BLOCK.WOOD);
  const plan=planEnvironmentalColumn(x,z,seed,baseline,biome);
  // Original V7 abort produced an empty overlay and exposed vivid legacy grass.
  // Replacement may only alter the original single grass cap.
  assert.deepEqual([...plan.keys()],[old]);
  assert.ok([G.slate,G.scree,G.gneiss].includes(plan.get(old)));
  assert.equal(baseline(x,old+1,z),BLOCK.WOOD);
  assert.equal(baseline(x,old-1,z),BLOCK.DIRT);
  assert.equal(plan.has(old+1),false);
  assert.equal(plan.has(old-1),false);
});

test('protected cave/landmark inside the old supporting ground is fail-closed',()=>{
  const {x,z}=mountain,biome=v6BiomeAt(x,z,seed);
  const old=terrainHeight(x,z,seed);
  // The mountain rescue cannot replace a surface with an exposed cave floor,
  // an authored supporting block, or a non-legacy cap.
  for(const layer of [old-2,old-1]){
    const cave=obstruct(x,z,layer,BLOCK.AIR);
    assert.equal(planEnvironmentalColumn(x,z,seed,cave,biome).size,0);
  }
  const anchored=obstruct(x,z,old,BLOCK.WOOD);
  assert.equal(planEnvironmentalColumn(x,z,seed,anchored,biome).size,0);
});

test('foreign aboveground structure survives while underground remains untouched',()=>{
  const {x,z}=mountain,biome=v6BiomeAt(x,z,seed);
  const old=terrainHeight(x,z,seed);
  for(const foreignId of [BLOCK.WOOD,BLOCK.LEAVES]){
    const baseline=obstruct(x,z,old+1,foreignId);
    const overlay=planEnvironmentalColumn(x,z,seed,baseline,biome);
    assert.deepEqual([...overlay.keys()],[old]);
    assert.equal(baseline(x,old+1,z),foreignId);
  }
});

test('non-mountain biome vetoes remain exactly unchanged by rescue',()=>{
  const anchors=[[512,0,'desert'],[0,512,'snow'],[0,-512,'enchanted']];
  for(const [x,z,name] of anchors){
    const biome=v6BiomeAt(x,z,seed);
    assert.equal(biome?.name,name);
    const old=terrainHeight(x,z,seed);
    const blocked=planEnvironmentalColumn(x,z,seed,obstruct(x,z,old+1,BLOCK.WOOD),biome);
    assert.equal(blocked.size,0,name+' protected baseline must not be recolored');
  }
  assert.equal(v6BiomeAt(0,0,seed),null); // original Plains generator stays untouched
});

test('mountain guard fallback is deterministic across repeated seed/column samples',()=>{
  const entries=[];
  for(let dz=-32;dz<=32;dz+=8)for(let dx=-32;dx<=32;dx+=8){
    const x=-512+dx,z=dz,biome=v6BiomeAt(x,z,seed);
    if(biome?.name!=='mountain')continue;
    const old=terrainHeight(x,z,seed);
    const baseline=obstruct(x,z,old+1,BLOCK.WOOD);
    const once=[...planEnvironmentalColumn(x,z,seed,baseline,biome)];
    const again=[...planEnvironmentalColumn(x,z,seed,baseline,biome)];
    assert.deepEqual(once,again);
    assert.ok(once.length<=1);
    entries.push(once);
  }
  assert.ok(entries.length>=10);
});
