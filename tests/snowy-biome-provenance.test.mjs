// Genuine M7 legacy-provenance protections: read the production world
// rather than replacing the old snow/landmark/cave baseline with fake fixtures.
// These regressions are prerequisites for S2 and DO NOT implement S2 itself.
import assert from 'node:assert/strict';
import test from 'node:test';
import {BLOCK,terrainHeight} from '../src/voxel.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {FourRegionWorld,fourRegionProfile,restoreFourRegionWorld,
  M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';

const worldFor=seed=>new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const examples=[
  // Actual SHA-verified S0 seed-179/2026 material provenance artifact 14726211985.
  {seed:179,x:-160,z:456,y:5,id:BLOCK.AIR,location:'below'},
  {seed:2026,x:-160,z:456,y:4,id:BLOCK.AIR,location:'below'},
  {seed:179,x:-152,z:368,y:8,id:BLOCK.WOOD,location:'above'},
  {seed:179,x:-104,z:456,y:15,id:BLOCK.LEAVES,location:'above'},
  {seed:2026,x:-104,z:360,y:10,id:BLOCK.STONE,location:'above'}
];

test('S2 source witnesses are genuine high-weight snowy-interior columns',()=>{
  for(const e of examples){
    const world=worldFor(e.seed),climate=v6BiomeAt(e.x,e.z,e.seed);
    assert.equal(climate?.name,'snow',JSON.stringify(e));
    assert.ok(climate.weight>=.8,JSON.stringify(e));
    assert.equal(world._columnPlan(e.x,e.z).size,0,
      'Current generator protects a real legacy cell, not a mock column');
    const old=terrainHeight(e.x,e.z,e.seed);
    assert.ok(e.location==='below'?e.y<old:e.y>old);
    assert.equal(world._environmentBaseline(e.x,e.y,e.z),e.id,
      'Provenance witness changed unexpectedly '+JSON.stringify(e));
    assert.equal(world.get(e.x,e.y,e.z),e.id,
      'Protected cave/landmark cell must remain physically unchanged');
    assert.deepEqual(world.save().edits,[]);
  }
});
test('S2 must not fill legacy air below a grass cap or erase protected tree/stone',()=>{
  for(const e of examples){
    const world=worldFor(e.seed);
    const original=world._environmentBaseline(e.x,e.y,e.z);
    assert.equal(world.get(e.x,e.y,e.z),original);
    // World survives independent cold construction with unchanged physical
    // material: not just shader-side cosmetic state.
    assert.equal(worldFor(e.seed).get(e.x,e.y,e.z),original);
  }
});
test('S2 protected obstruction is still player-editable and restores as schema-1',()=>{
  const e=examples.find(x=>x.location==='above'&&x.id===BLOCK.WOOD);
  const world=worldFor(e.seed),profile=world.generationProfile;
  assert.equal(world.get(e.x,e.y,e.z),BLOCK.WOOD);
  assert.ok(world.set(e.x,e.y,e.z,BLOCK.AIR));
  const saved=world.save();
  assert.equal(saved.schema,1);
  assert.equal(saved.edits.length,1);
  const restored=restoreFourRegionWorld(saved,profile);
  assert.equal(restored.get(e.x,e.y,e.z),BLOCK.AIR);
  assert.deepEqual(restored.save(),saved);
  assert.equal(worldFor(e.seed).get(e.x,e.y,e.z),BLOCK.WOOD);
});
