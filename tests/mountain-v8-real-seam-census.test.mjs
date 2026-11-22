// Real read-only world source; not V8 live integration.
import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld} from '../src/voxel.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {surveyMountainV8OriginalWorld as survey}
  from '../src/manual-biomes/mountain-v8-original-world.mjs';
import {censusMountainV8Tiles as census}
  from '../src/manual-biomes/mountain-v8-tile-census.mjs';

test('original mountain source is deterministic across actual negative chunk seams',()=>{
  for(const seed of [179,2026]){
    const world=new VoxelWorld(seed),before=world.save();
    let approved=0,vetoed=0,contacts=0;
    // Read the actual cardinal mountain neighborhood; do not invent heights.
    for(const cx of [-33,-32,-31]){
      const x=cx*16;
      for(let z=-32;z<=32;z+=8){
        const left=survey(x-1,z,seed,{world});
        const right=survey(x,z,seed,{world});
        assert.deepEqual(left,survey(x-1,z,seed,{world}));
        assert.deepEqual(right,survey(x,z,seed,{world}));
        approved+=Number(!!left)+Number(!!right);
        vetoed+=Number(!left)+Number(!right);
        if(left&&right){
          contacts++;
          // Both sides compute actual V8 heights; an unaccepted extreme step
          // must remain visible as a release concern, never smoothed in V7.
          assert.ok(Number.isInteger(left.top)&&Number.isInteger(right.top));
          assert.ok(left.top>=left.legacyTop&&right.top>=right.legacyTop);
        }
      }
    }
    assert.equal(approved+vetoed,54);
    assert.equal(world.save(),before);
    console.log('MOUNTAIN V8 REAL SEAM CENSUS '+JSON.stringify({
      seed,approved,vetoed,contacts,saveUnchanged:true}));
  }
});
test('bounded tile atlas never performs full-chunk brute-force work',()=>{
  const seed=179,world=new VoxelWorld(seed),save=world.save();
  const report=census({seed,tileX:-65,tileZ:-3,width:4,height:4,world});
  assert.ok(report);
  assert.equal(report.stats.seen,16);
  assert.equal(report.stats.tiles,16);
  assert.ok(report.stats.plants<=16);
  assert.ok(report.stats.plantCells<=288);
  assert.equal(world.save(),save);
});
test('wrong biome contacts fail closed without altering original world',()=>{
  const seed=179,world=new VoxelWorld(seed);
  const before=world.save();
  for(const [x,z] of [[512,0],[0,512],[0,-512],[0,0]]){
    assert.notEqual(v6BiomeAt(x,z,seed)?.name,'mountain');
    assert.equal(survey(x,z,seed,{world}),null);
  }
  assert.equal(world.save(),before);
});
